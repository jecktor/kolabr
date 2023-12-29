import { json } from '@sveltejs/kit';
import { Board, User } from '$lib/server';
import type { RequestHandler } from './$types';

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

	const board = await Board.findById(boardId);

	if (!board) {
		return new Response('Not found', { status: 404 });
	}

	await board.updateOne({ shared_with: [] });

	try {
		if (emails.length > 0) {
			const users = await User.find({ email: { $in: emails } });
			const usersToShareWith = users.filter((user) => user._id !== board.owner._id);

			if (users.length > 0) {
				await board.updateOne({
					shared_with: usersToShareWith.map((u) => ({
						name: u.name,
						email: u.email,
						image: u.image
					}))
				});
			}
		}
	} catch (e) {
		return json('unknown', { status: 500 });
	}

	return json('accessupdate', { status: 200 });
}) satisfies RequestHandler;
