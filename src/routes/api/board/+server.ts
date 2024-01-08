import { Board } from '$lib/server';
import type { RequestHandler } from './$types';

export const PATCH = (async ({ locals, request }) => {
	const session = await locals.auth.validate();
	if (!session) return new Response('Unauthorized', { status: 401 });

	const { user } = session;
	const { id, last_edited } = await request.json();

	if (!id || typeof id !== 'string' || !last_edited || typeof last_edited !== 'string') {
		return new Response('Bad request', { status: 400 });
	}

	const board = await Board.findById(id, 'owner shared_with');

	if (!board) {
		return new Response('Not found', { status: 404 });
	}

	if (board.owner._id !== user.userId && !board.shared_with.some((u) => u.email === user.email)) {
		return new Response('Unauthorized', { status: 401 });
	}

	try {
		await board.updateOne({ last_edited });

		return new Response('OK', { status: 200 });
	} catch (e) {
		return new Response('Internal Server Error', { status: 500 });
	}
}) satisfies RequestHandler;

export const PUT = (async ({ locals, request }) => {
	const session = await locals.auth.validate();
	if (!session) return new Response('Unauthorized', { status: 401 });

	const { user } = session;
	const { id, name, last_edited } = await request.json();

	if (
		!id ||
		typeof id !== 'string' ||
		!name ||
		typeof name !== 'string' ||
		!last_edited ||
		typeof last_edited !== 'string'
	) {
		return new Response('Bad request', { status: 400 });
	}

	const board = await Board.findById(id, 'owner shared_with');

	if (!board) {
		return new Response('Not found', { status: 404 });
	}

	if (board.owner._id !== user.userId && !board.shared_with.some((u) => u.email === user.email)) {
		return new Response('Unauthorized', { status: 401 });
	}

	try {
		await board.updateOne({ name, last_edited });

		return new Response('OK', { status: 200 });
	} catch (e) {
		return new Response('Internal Server Error', { status: 500 });
	}
}) satisfies RequestHandler;
