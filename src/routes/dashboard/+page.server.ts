import { redirect, type Actions, fail } from '@sveltejs/kit';
import { get } from 'svelte/store';
import { auth } from '$lib/server';
import { db } from '$lib/server';
import { randomId } from '$utils';
import { locale, translate } from '$locales';
import type { Board } from '$types';

export const load = async ({ locals }) => {
	const { user } = await locals.auth.validateUser();
	if (!user) throw redirect(302, '/login');

	const [ownerResults] = await db.execute('CALL get_owner_boards(?)', [user.userId]);
	const ownerBoards = (ownerResults as Board[][])[0];

	const [userResults] = await db.execute('CALL get_user_boards(?)', [user.userId]);
	const userBoards = (userResults as Board[][])[0];

	return {
		user,
		ownerBoards,
		userBoards
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

		const boardId = randomId();

		try {
			await db.execute('CALL create_board(?,?,?)', [
				boardId,
				translate(get(locale), 'newboard'),
				user.userId
			]);
		} catch (e) {
			return fail(500);
		}

		throw redirect(302, `/board/${boardId}`);
	}
};
