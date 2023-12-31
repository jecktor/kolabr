import { json } from '@sveltejs/kit';
import { Board, User } from '$lib/server';
import type { RequestHandler } from './$types';

export const POST = (async ({ locals, request }) => {
	const session = await locals.auth.validate();
	if (!session) return new Response('Unauthorized', { status: 401 });

	const { user } = session;
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

	if (board.owner._id !== user.userId && !board.shared_with.some((u) => u.email === user.email)) {
		return new Response('Unauthorized', { status: 401 });
	}

	try {
		let usersToShareWith: { name: string; email: string; image: string }[] = [];

		if (emails.length > 0) {
			const users = await User.find({ email: { $in: emails } });
			usersToShareWith = users.filter((user) => user._id !== board.owner._id);

			const usersAlreadySharedWith = board.shared_with.map((user) => user.email);
			usersToShareWith = usersToShareWith.filter(
				(user) => !usersAlreadySharedWith.includes(user.email)
			);

			if (users.length > 0) {
				await board.updateOne({
					$push: {
						shared_with: {
							$each: usersToShareWith.map((u) => ({ name: u.name, email: u.email, image: u.image }))
						}
					}
				});
			}
		}

		return json({ status: 'accessupdate', users: usersToShareWith }, { status: 200 });
	} catch (e) {
		return json('unknown', { status: 500 });
	}
}) satisfies RequestHandler;

export const DELETE = (async ({ locals, request }) => {
	const session = await locals.auth.validate();
	if (!session) return new Response('Unauthorized', { status: 401 });

	const { user } = session;
	const { email, boardId } = await request.json();

	if (!boardId || !email || typeof email !== 'string' || typeof boardId !== 'string') {
		return new Response('Bad request', { status: 400 });
	}

	const board = await Board.findById(boardId);

	if (!board) {
		return new Response('Not found', { status: 404 });
	}

	if (board.owner._id !== user.userId && !board.shared_with.some((u) => u.email === user.email)) {
		return new Response('Unauthorized', { status: 401 });
	}

	try {
		await board.updateOne({ $pull: { shared_with: { email } } });

		return json({ status: 'accessupdate' }, { status: 200 });
	} catch (e) {
		return json('unknown', { status: 500 });
	}
}) satisfies RequestHandler;
