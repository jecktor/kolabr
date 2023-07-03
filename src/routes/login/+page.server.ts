import { fail, type Actions } from '@sveltejs/kit';
import { auth } from '$lib/server';
import { redirect } from '@sveltejs/kit';
import { LuciaError } from 'lucia-auth';

export const load = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (session) throw redirect(302, '/dashboard');
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await request.formData();
		const email = form.get('email');
		const password = form.get('password');

		if (!email || !password || typeof email !== 'string' || typeof password !== 'string') {
			return fail(400, {
				message: 'invalid'
			});
		}

		try {
			const key = await auth.useKey('email', email, password);
			const session = await auth.createSession(key.userId);
			locals.auth.setSession(session);
		} catch (e) {
			if (
				e instanceof LuciaError &&
				(e.message === 'AUTH_INVALID_KEY_ID' || e.message === 'AUTH_INVALID_PASSWORD')
			) {
				return fail(400, {
					message: 'creds'
				});
			}

			// Database connection error
			return fail(500, {
				message: 'unknown'
			});
		}
	}
};
