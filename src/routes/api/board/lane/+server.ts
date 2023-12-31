import { Board } from '$lib/server';
import type { RequestHandler } from './$types';

export const POST = (async ({ locals, request }) => {
	const session = await locals.auth.validate();
	if (!session) return new Response('Unauthorized', { status: 401 });

	const { user } = session;
	const { _id, name, limit, boardId } = await request.json();

	if (
		!_id ||
		typeof _id !== 'string' ||
		!name ||
		typeof name !== 'string' ||
		!boardId ||
		typeof boardId !== 'string' ||
		typeof limit !== 'number'
	) {
		return new Response('Bad request', { status: 400 });
	}

	if (limit < 0 || name.length > 15) {
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
		await board.updateOne({
			$push: { lanes: { _id, name, limit, tickets: [] } }
		});

		return new Response('OK', { status: 200 });
	} catch (e) {
		return new Response('Internal Server Error', { status: 500 });
	}
}) satisfies RequestHandler;

export const PATCH = (async ({ locals, request }) => {
	const session = await locals.auth.validate();
	if (!session) return new Response('Unauthorized', { status: 401 });

	const { user } = session;
	const { _id, tickets, boardId } = await request.json();

	if (
		!_id ||
		typeof _id !== 'string' ||
		!boardId ||
		typeof boardId !== 'string' ||
		typeof tickets !== 'object'
	) {
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
		await board.updateOne(
			{
				$set: { 'lanes.$[lane].tickets': tickets }
			},
			{
				arrayFilters: [{ 'lane._id': _id }]
			}
		);

		return new Response('OK', { status: 200 });
	} catch (e) {
		return new Response('Internal Server Error', { status: 500 });
	}
}) satisfies RequestHandler;

export const PUT = (async ({ locals, request }) => {
	const session = await locals.auth.validate();
	if (!session) return new Response('Unauthorized', { status: 401 });

	const { user } = session;
	const { _id, name, limit, boardId } = await request.json();

	if (
		!_id ||
		typeof _id !== 'string' ||
		!boardId ||
		typeof boardId !== 'string' ||
		!name ||
		typeof name !== 'string' ||
		typeof limit !== 'number'
	) {
		return new Response('Bad request', { status: 400 });
	}

	if (limit < 0 || name.length > 15) {
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
		await board.updateOne(
			{ $set: { 'lanes.$[lane].name': name, 'lanes.$[lane].limit': limit } },
			{ arrayFilters: [{ 'lane._id': _id }] }
		);

		return new Response('OK', { status: 200 });
	} catch (e) {
		return new Response('Internal Server Error', { status: 500 });
	}
}) satisfies RequestHandler;

export const DELETE = (async ({ locals, request }) => {
	const session = await locals.auth.validate();
	if (!session) return new Response('Unauthorized', { status: 401 });

	const { user } = session;
	const { _id, boardId } = await request.json();

	if (!_id || typeof _id !== 'string' || !boardId || typeof boardId !== 'string') {
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
		await board.updateOne({ $pull: { lanes: { _id } } });

		return new Response('OK', { status: 200 });
	} catch (e) {
		return new Response('Internal Server Error', { status: 500 });
	}
}) satisfies RequestHandler;
