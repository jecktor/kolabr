import { redirect, type Actions, fail } from '@sveltejs/kit';
import { get } from 'svelte/store';
import { auth } from '$lib/server';
import { db } from '$lib/server';
import { randomId } from '$utils';
import { locale, translate } from '$locales';

export const load = async ({ locals }) => {
	const { user } = await locals.auth.validateUser();
	if (!user) throw redirect(302, '/login');

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
	newboard: async ({ locals }) => {
		const { user } = await locals.auth.validateUser();
		if (!user) throw redirect(302, '/login');

		try {
			await db.execute('CALL create_board(?,?,?,?)', [
				randomId(),
				translate(get(locale), 'newboard'),
				new Date(),
				user.userId
			]);
		} catch (error) {
			console.error(error);
			return fail(500);
		}
	}
};
