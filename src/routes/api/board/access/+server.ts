import { json } from '@sveltejs/kit';
import { db } from '$lib/server';
import type { RequestHandler } from './$types';
import type { Board } from '$types';

export const POST = (async ({ request }) => {
	const { access, boardId } = await request.json();

	if (!boardId || typeof access !== 'string' || typeof boardId !== 'string') {
		return new Response('Bad request', { status: 400 });
	}

	const emails = access.split(',').map((email) => email.trim());

	if (emails[0]) {
		const emailsAreValid = emails.every((email) =>
			/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)
		);

		if (!emailsAreValid) {
			return new Response('Bad request', { status: 400 });
		}
	}

	const [boardResults] = await db.execute('CALL find_board(?)', [boardId]);
	const board = (boardResults as Board[][])[0][0];

	if (!board) {
		return new Response('Not found', { status: 404 });
	}

	await db.execute('CALL remove_all_user_access_to_board(?)', [boardId]);

	if (emails.length > 0) {
		emails.forEach(async (email) => {
			const [results] = await db.query('CALL get_user_id(?)', [email]);
			const user = (results as [[{ id: string }]])[0][0];

			if (user && user.id !== board.owner_id) {
				await db.execute('CALL add_user_access_to_board(?, ?)', [user.id, boardId]);
			}
		});
	}

	return json('accessupdate', { status: 200 });
}) satisfies RequestHandler;
