import { redirect, type Actions, fail } from '@sveltejs/kit';
import { auth, liveblocks, deleteFile, uploadFile, Board } from '$lib/server';

export const load = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (!session) throw redirect(302, '/login');

	const { user } = session;

	return {
		user
	};
};

export const actions: Actions = {
	signout: async ({ locals }) => {
		const session = await locals.auth.validate();
		if (!session) return fail(401);
		await auth.invalidateSession(session.sessionId);
		locals.auth.setSession(null);
	},
	avatar: async ({ locals, request }) => {
		const { user } = await locals.auth.validate();
		if (!user) {
			return fail(400, {
				message: 'unknown'
			});
		}

		const data = await request.formData();
		const avatar = data.get('avatar') as File;

		if (!avatar.name || avatar.name === 'undefined') {
			return fail(400, {
				message: 'nofile'
			});
		}

		if (avatar.size > 2097152) {
			return fail(400, {
				message: 'image'
			});
		}

		try {
			if (user.image.includes('upload')) {
				await deleteFile(user.image);
			}

			const newAvatar = await uploadFile(avatar);

			await auth.updateUserAttributes(user.userId, {
				image: newAvatar
			});

			const boards = await Board.find(
				{
					$or: [{ 'owner._id': user.userId }, { 'shared_with.email': user.email }]
				},
				'_id'
			);

			await Board.updateMany(
				{ 'owner._id': user.userId },
				{
					$set: {
						'owner.image': newAvatar,
						'lanes.$[].tickets.$[].assignees.$[user].image': newAvatar
					}
				},
				{ arrayFilters: [{ 'user.email': user.email }] }
			);

			await Board.updateMany(
				{ shared_with: { $elemMatch: { email: user.email } } },
				{
					$set: {
						'shared_with.$[user].image': newAvatar,
						'lanes.$[].tickets.$[].assignees.$[user].image': newAvatar
					}
				},
				{ arrayFilters: [{ 'user.email': user.email }] }
			);

			await Promise.all(
				boards.map(async (board) => {
					await liveblocks.broadcastEvent(`kolabr-room-${board._id}`, {
						type: 'reset'
					});
					await liveblocks.deleteRoom(`kolabr-room-${board._id}`);
					await liveblocks.createRoom(`kolabr-room-${board._id}`, {
						defaultAccesses: ['room:write']
					});
				})
			);
		} catch (e) {
			return fail(400, {
				message: 'unknown'
			});
		}

		return { success: true };
	},
	name: async ({ locals, request }) => {
		const { user } = await locals.auth.validate();
		if (!user) {
			return fail(400, {
				message: 'unknown'
			});
		}

		const data = await request.formData();
		const nameData = data.get('name');

		if (typeof nameData !== 'string') {
			return fail(400, {
				message: 'invalid'
			});
		}

		const name = nameData.trim();

		if (!name) {
			return fail(400, {
				message: 'invalid'
			});
		}

		if (name.length > 32) {
			return fail(400, {
				message: 'namelong'
			});
		}

		try {
			await auth.updateUserAttributes(user.userId, {
				name
			});

			const boards = await Board.find(
				{
					$or: [{ 'owner._id': user.userId }, { 'shared_with.email': user.email }]
				},
				'_id'
			);

			await Board.updateMany(
				{ 'owner._id': user.userId },
				{
					$set: {
						'owner.name': name,
						'lanes.$[].tickets.$[].assignees.$[user].name': name
					}
				},
				{ arrayFilters: [{ 'user.email': user.email }] }
			);

			await Board.updateMany(
				{ shared_with: { $elemMatch: { email: user.email } } },
				{
					$set: {
						'shared_with.$[user].name': name,
						'lanes.$[].tickets.$[].assignees.$[user].name': name
					}
				},
				{ arrayFilters: [{ 'user.email': user.email }] }
			);

			await Promise.all(
				boards.map(async (board) => {
					await liveblocks.broadcastEvent(`kolabr-room-${board._id}`, {
						type: 'reset'
					});
					await liveblocks.deleteRoom(`kolabr-room-${board._id}`);
					await liveblocks.createRoom(`kolabr-room-${board._id}`, {
						defaultAccesses: ['room:write']
					});
				})
			);
		} catch (e) {
			return fail(400, {
				message: 'unknown'
			});
		}

		return { success: true };
	}
};
