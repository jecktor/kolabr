import { redirect, type Actions, fail } from '@sveltejs/kit';
import { auth, liveblocks, Board } from '$lib/server';
import { randomId, tagColors } from '$utils';
import mongoose from 'mongoose';

export const load = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) throw redirect(302, '/login');

	const { user } = session;

	const ownerBoards = await Board.find(
		{ 'owner._id': user.userId },
		'_id name last_edited shared_with'
	);
	const userBoards = await Board.find(
		{ 'shared_with.email': user.email },
		'_id name last_edited shared_with owner'
	);

	return {
		user,
		ownerBoards: ownerBoards.map((board) => board.toObject()),
		userBoards: userBoards.map((board) => board.toObject())
	};
};

export const actions: Actions = {
	signout: async ({ locals }) => {
		const session = await locals.auth.validate();
		if (!session) return fail(401);
		await auth.invalidateSession(session.sessionId);
		locals.auth.setSession(null);
	},
	newboard: async ({ locals, request }) => {
		const session = await locals.auth.validate();
		if (!session) throw redirect(302, '/login');

		const { user } = session;

		const data = await request.formData();
		const template = data.get('template');

		if (!template || typeof template !== 'string') {
			return fail(400, {
				message: 'invalid'
			});
		}

		const boardId = new mongoose.Types.ObjectId();

		try {
			const board = JSON.parse(template);

			const tags = board.tags.map((tag: string) => ({
				_id: randomId(),
				name: tag,
				color: tagColors[Math.floor(Math.random() * tagColors.length)]
			}));
			const lanes = board.lanes.map((lane: string) => ({
				_id: randomId(),
				name: lane,
				limit: 0,
				tickets: []
			}));

			const newBoard = new Board({
				_id: boardId,
				name: board.title,
				last_edited: new Date().toString(),
				owner: {
					_id: user.userId,
					name: user.name,
					email: user.email,
					image: user.image
				},
				shared_with: [],
				tags,
				lanes
			});

			await newBoard.save();
		} catch (e) {
			return fail(500, {
				message: 'unknown'
			});
		}

		throw redirect(302, `/board/${boardId.toString()}`);
	},
	deleteboard: async ({ locals, request }) => {
		const session = await locals.auth.validate();
		if (!session) throw redirect(302, '/login');

		const { user } = session;

		const data = await request.formData();
		const boardId = data.get('board');

		if (!boardId || typeof boardId !== 'string') {
			return fail(400, {
				message: 'invalid'
			});
		}

		const board = await Board.findById(boardId, '_id owner');

		if (!board)
			return fail(400, {
				message: 'invalid'
			});

		if (board.owner._id !== user.userId) {
			return fail(302, {
				message: 'unknown'
			});
		}

		try {
			await liveblocks.deleteRoom(`kolabr-room-${board._id}`);
			await board.deleteOne({ _id: boardId });
		} catch (error) {
			return fail(500, {
				message: 'unknown'
			});
		}

		return { success: true };
	},
	removeboard: async ({ locals, request }) => {
		const session = await locals.auth.validate();
		if (!session) throw redirect(302, '/login');

		const { user } = session;

		const data = await request.formData();
		const boardId = data.get('board');

		if (!boardId || typeof boardId !== 'string') {
			return fail(400, {
				message: 'invalid'
			});
		}

		const board = await Board.findById(boardId, '_id owner');

		if (!board)
			return fail(400, {
				message: 'invalid'
			});

		if (board.owner._id === user.userId) {
			return fail(302, {
				message: 'unknown'
			});
		}

		try {
			await board.updateOne({
				$pull: {
					shared_with: { email: user.email },
					'lanes.$[].tickets.$[].assignees': { email: user.email }
				}
			});

			await liveblocks.broadcastEvent(`kolabr-room-${board._id}`, {
				type: 'reset'
			});
			await liveblocks.deleteRoom(`kolabr-room-${board._id}`);
			await liveblocks.createRoom(`kolabr-room-${board._id}`, {
				defaultAccesses: ['room:write']
			});
		} catch (error) {
			return fail(500, {
				message: 'unknown'
			});
		}

		return { success: true };
	}
};
