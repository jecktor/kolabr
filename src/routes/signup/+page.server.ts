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
		const nameData = form.get('name');
		const emailData = form.get('email');
		const passData = form.get('pass');
		const passconfirmData = form.get('passconfirm');

		if (
			typeof nameData !== 'string' ||
			typeof emailData !== 'string' ||
			typeof passData !== 'string' ||
			typeof passconfirmData !== 'string'
		) {
			return fail(400, {
				message: 'invalid'
			});
		}

		const name = nameData.trim();
		const email = emailData.toLowerCase().trim();
		const pass = passData.trim();
		const passconfirm = passconfirmData.trim();

		if (
			!name ||
			!email ||
			!pass ||
			!passconfirm ||
			!/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)
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
