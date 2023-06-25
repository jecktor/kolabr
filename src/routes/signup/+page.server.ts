import { fail, redirect, type Actions } from '@sveltejs/kit';
import { auth } from '$lib/server/lucia';
import type { PageServerLoad } from './$types';

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await request.formData();
		const name = form.get('name');
		const email = form.get('email');
		const password = form.get('password');

		if (
			!name ||
			!password ||
			!email ||
			typeof name !== 'string' ||
			typeof email !== 'string' ||
			typeof password !== 'string'
		) {
			return fail(400, {
				message: 'Invalid input'
			});
		}

		try {
			const user = await auth.createUser({
				primaryKey: {
					providerId: 'email',
					providerUserId: email,
					password
				},
				attributes: {
					name,
					email,
					image: `https://liveblocks.io/avatars/avatar-${Math.floor(Math.random() * 30)}.png`
				}
			});

			const session = await auth.createSession(user.userId);
			locals.auth.setSession(session);
		} catch (error) {
			if (error.code === 'ER_DUP_ENTRY') {
				return fail(400, {
					message: 'Email already in use'
				});
			}

			return fail(500, {
				message: 'Unknown error occurred'
			});
		}
	}
};

export const load: PageServerLoad = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (session) throw redirect(302, '/');
	return {};
};
