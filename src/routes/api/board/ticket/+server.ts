import { Board } from '$lib/server';
import type { RequestHandler } from './$types';

export const POST = (async ({ locals, request }) => {
	const session = await locals.auth.validate();
	if (!session) return new Response('Unauthorized', { status: 401 });

	const { user } = session;
	const { _id, name, description, deadline, boardId, lane } = await request.json();

	if (
		!_id ||
		typeof _id !== 'string' ||
		!name ||
		typeof name !== 'string' ||
		typeof description !== 'string' ||
		typeof deadline !== 'string' ||
		!boardId ||
		typeof boardId !== 'string' ||
		!lane ||
		typeof lane !== 'string'
	) {
		return new Response('Bad request', { status: 400 });
	}

	if (name.length > 30 || description.length > 255) {
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
			{ $push: { 'lanes.$[lane].tickets': { _id, name, description, deadline } } },
			{ arrayFilters: [{ 'lane._id': lane }] }
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
	const { _id, name, description, deadline, tags, assignees, boardId, lane } = await request.json();

	if (
		!_id ||
		typeof _id !== 'string' ||
		!name ||
		typeof name !== 'string' ||
		typeof description !== 'string' ||
		typeof deadline !== 'string' ||
		!boardId ||
		typeof boardId !== 'string' ||
		!lane ||
		typeof lane !== 'string' ||
		typeof tags !== 'object' ||
		typeof assignees !== 'object'
	) {
		return new Response('Bad request', { status: 400 });
	}

	if (name.length > 30 || description.length > 255) {
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
				$set: {
					'lanes.$[lane].tickets.$[ticket]': { _id, name, description, deadline, tags, assignees }
				}
			},
			{ arrayFilters: [{ 'lane._id': lane }, { 'ticket._id': _id }] }
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
	const { _id, boardId, lane } = await request.json();

	if (!_id || typeof _id !== 'string') {
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
			{ $pull: { 'lanes.$[lane].tickets': { _id } } },
			{ arrayFilters: [{ 'lane._id': lane }] }
		);

		return new Response('OK', { status: 200 });
	} catch (e) {
		return new Response('Internal Server Error', { status: 500 });
	}
}) satisfies RequestHandler;
