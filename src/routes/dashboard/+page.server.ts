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
			await db.execute('CALL create_board(?, ?, ?, ?)', [
				boardId,
				translate(get(locale), 'newboard'),
				new Date().toString(),
				user.userId
			]);
		} catch (e) {
			return fail(500, {
				message: 'unknown'
			});
		}

		throw redirect(302, `/board/${boardId}`);
	},
	deleteboard: async ({ locals, request }) => {
		const { user } = await locals.auth.validateUser();
		if (!user) throw redirect(302, '/login');

		const data = await request.formData();
		const boardId = data.get('board');

		if (!boardId || typeof boardId !== 'string') {
			return fail(400, {
				message: 'invalid'
			});
		}

		const [boardResults] = await db.execute('CALL find_board(?)', [boardId]);
		const board = (boardResults as Board[][])[0][0];

		if (!board)
			return fail(400, {
				message: 'invalid'
			});

		if (board.owner_id !== user.userId) {
			return fail(302, {
				message: 'unknown'
			});
		}

		try {
			await db.execute('CALL delete_board(?)', [board.id]);
		} catch (error) {
			return fail(500, {
				message: 'unknown'
			});
		}

		return { success: true };
	},
	removeboard: async ({ locals, request }) => {
		const { user } = await locals.auth.validateUser();
		if (!user) throw redirect(302, '/login');

		const data = await request.formData();
		const boardId = data.get('board');

		if (!boardId || typeof boardId !== 'string') {
			return fail(400, {
				message: 'invalid'
			});
		}

		const [boardResults] = await db.execute('CALL find_board(?)', [boardId]);
		const board = (boardResults as Board[][])[0][0];

		if (!board)
			return fail(400, {
				message: 'invalid'
			});

		try {
			await db.execute('CALL remove_user_access_to_board(?, ?)', [user.userId, board.id]);
		} catch (error) {
			return fail(500, {
				message: 'unknown'
			});
		}

		return { success: true };
	}
};
