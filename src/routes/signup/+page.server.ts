import { fail, redirect, type Actions } from '@sveltejs/kit';
import { get } from 'svelte/store';
import { auth } from '$lib/server';
import { locale } from '$locales';

export const load = async ({ locals }) => {
	const session = await locals.auth.validate();
	if (session) throw redirect(302, '/dashboard');
};

export const actions: Actions = {
	default: async ({ request, locals }) => {
		const form = await request.formData();
		const name = form.get('name');
		const email = form.get('email');
		const pass = form.get('pass');
		const passconfirm = form.get('passconfirm');

		if (
			!name ||
			!email ||
			!pass ||
			!passconfirm ||
			typeof name !== 'string' ||
			typeof email !== 'string' ||
			typeof pass !== 'string' ||
			typeof passconfirm !== 'string'
		) {
			return fail(400, {
				message: 'invalid'
			});
		}

		if (pass.length < 8) {
			return fail(400, {
				message: 'passshort'
			});
		}

		if (pass.length > 64) {
			return fail(400, {
				message: 'passlong'
			});
		}

		if (pass !== passconfirm) {
			return fail(400, {
				message: 'notsamepass'
			});
		}

		if (name.length > 32) {
			return fail(400, {
				message: 'namelong'
			});
		}

		try {
			const user = await auth.createUser({
				primaryKey: {
					providerId: 'email',
					providerUserId: email,
					password: pass
				},
				attributes: {
					name,
					email,
					lang: get(locale),
					image: `https://storage.googleapis.com/kolabr-avatars/default/${Math.floor(
						Math.random() * 30
					)}.png`
				}
			});

			const session = await auth.createSession(user.userId);
			locals.auth.setSession(session);
		} catch (e) {
			if ((e as { code: string }).code === 'ER_DUP_ENTRY') {
				return fail(400, {
					message: 'emailinuse'
				});
			}

			return fail(500, {
				message: 'unknown'
			});
		}
	}
};
