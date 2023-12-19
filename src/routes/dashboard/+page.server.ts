import { redirect, type Actions, fail } from '@sveltejs/kit';
import { get } from 'svelte/store';
import { auth } from '$lib/server';
import { Board } from '$lib/server';
import { locale, translate } from '$locales';
import mongoose from 'mongoose';

export const load = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) throw redirect(302, '/login');

	const { user } = session;

	const ownerBoards = await Board.find(
		{ 'owner._id': user.userId },
		'_id name last_edited owner.name'
	);
	const userBoards = await Board.find(
		{ shared_with: user.email },
		'_id name last_edited owner.name'
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
	newboard: async ({ locals }) => {
		const session = await locals.auth.validate();
		if (!session) throw redirect(302, '/login');

		const { user } = session;

		const boardId = new mongoose.Types.ObjectId();

		try {
			const newBoard = new Board({
				_id: boardId,
				name: translate(get(locale), 'newboard'),
				last_edited: new Date().toString(),
				owner: {
					_id: user.userId,
					name: user.name
				},
				shared_with: [],
				tags: [],
				lanes: []
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

		const board = await Board.findById(boardId);

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

		const board = await Board.findById(boardId);

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
				shared_with: board.shared_with.filter((email) => email !== user.email)
			});
		} catch (error) {
			return fail(500, {
				message: 'unknown'
			});
		}

		return { success: true };
	}
};
