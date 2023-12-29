import { redirect, type Actions, fail } from '@sveltejs/kit';
import { auth, deleteFile, uploadFile, Board } from '$lib/server';

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

			await Board.updateMany({ 'owner._id': user.userId }, { $set: { 'owner.image': newAvatar } });

			await Board.updateMany(
				{ shared_with: { $elemMatch: { email: user.email } } },
				{ $set: { 'shared_with.$.image': newAvatar } }
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

			await Board.updateMany({ 'owner._id': user.userId }, { $set: { 'owner.name': name } });

			await Board.updateMany(
				{ shared_with: { $elemMatch: { email: user.email } } },
				{ $set: { 'shared_with.$.name': name } }
			);
		} catch (e) {
			return fail(400, {
				message: 'unknown'
			});
		}

		return { success: true };
	}
};
