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
		const emailData = form.get('email');
		const passwordData = form.get('password');

		if (typeof emailData !== 'string' || typeof passwordData !== 'string') {
			return fail(400, {
				message: 'invalid'
			});
		}

		const email = emailData.toLowerCase().trim();
		const password = passwordData.trim();

		if (
			!email ||
			!password ||
			!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)
		) {
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
