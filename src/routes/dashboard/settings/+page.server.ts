import { redirect, type Actions, fail } from '@sveltejs/kit';
import { auth, deleteFile, uploadFile, Board } from '$lib/server';
import { LuciaError } from 'lucia';

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
		} catch (e) {
			return fail(400, {
				message: 'unknown'
			});
		}

		return { success: true };
	},
	lang: async ({ locals, request }) => {
		const { user } = await locals.auth.validate();
		if (!user) {
			return fail(400, {
				message: 'unknown'
			});
		}

		const data = await request.formData();
		const lang = data.get('lang');

		if (!lang || typeof lang !== 'string') {
			return fail(400, {
				message: 'invalid'
			});
		}

		try {
			await auth.updateUserAttributes(user.userId, {
				lang
			});
		} catch (e) {
			return fail(400, {
				message: 'unknown'
			});
		}

		return { success: true };
	},
	pass: async ({ locals, request }) => {
		const { user } = await locals.auth.validate();
		if (!user) {
			return fail(400, {
				message: 'unknown'
			});
		}

		const data = await request.formData();
		const passData = data.get('pass');
		const newpassData = data.get('newpass');

		if (typeof passData !== 'string' || typeof newpassData !== 'string') {
			return fail(400, {
				message: 'invalid'
			});
		}

		const pass = passData.trim();
		const newpass = newpassData.trim();

		if (!pass || !newpass) {
			return fail(400, {
				message: 'invalid'
			});
		}

		if (newpass.length < 8) {
			return fail(400, {
				message: 'passshort'
			});
		}

		if (newpass.length > 64) {
			return fail(400, {
				message: 'passlong'
			});
		}

		if (pass === newpass) {
			return fail(400, {
				message: 'samepass'
			});
		}

		try {
			await auth.useKey('email', user.email, pass);

			await auth.updateKeyPassword('email', user.email, newpass);
			await auth.invalidateAllUserSessions(user.userId);

			const session = await auth.createSession({
				userId: user.userId,
				attributes: {}
			});
			locals.auth.setSession(session);
		} catch (e) {
			if (e instanceof LuciaError && e.message === 'AUTH_INVALID_PASSWORD') {
				return fail(400, {
					message: 'invalidpass'
				});
			}

			return fail(400, {
				message: 'unknown'
			});
		}

		return { success: true };
	},
	delete: async ({ locals }) => {
		const { user } = await locals.auth.validate();
		if (!user) {
			return fail(400, {
				message: 'unknown'
			});
		}

		try {
			if (user.image.includes('upload')) {
				await deleteFile(user.image);
			}

			await Board.deleteMany({ 'owner._id': user.userId });
			await auth.deleteUser(user.userId);
		} catch (e) {
			return fail(400, {
				message: 'unknown'
			});
		}
	}
};
