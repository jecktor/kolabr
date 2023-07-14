import { json } from '@sveltejs/kit';
import { db } from '$lib/server';
import type { RequestHandler } from './$types';

export const POST = (async ({ request }) => {
	const { access, board } = await request.json();

	if (!board || typeof access !== 'string' || typeof board !== 'string') {
		return new Response('invalid', { status: 400 });
	}

	const emails = access.split(',').map((email) => email.trim());

	if (emails[0]) {
		const emailsAreValid = emails.every((email) =>
			/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email)
		);

		if (!emailsAreValid) {
			return new Response('invalid', { status: 400 });
		}
	}

	try {
		await db.execute('CALL remove_all_user_access_to_board(?)', [board]);
	} catch (e) {
		return new Response('unknown', { status: 404 });
	}

	if (emails.length > 0) {
		emails.forEach(async (email) => {
			const [results] = await db.query('CALL get_user_id(?)', [email]);
			const user = (results as [[{ id: string }]])[0][0];

			if (user) {
				await db.execute('CALL add_user_access_to_board(?, ?)', [user.id, board]);
			}
		});
	}

	return json('accessupdate', { status: 200 });
}) satisfies RequestHandler;
