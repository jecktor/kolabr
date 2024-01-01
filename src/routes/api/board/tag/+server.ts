import { Board } from '$lib/server';
import type { RequestHandler } from './$types';

export const POST = (async ({ locals, request }) => {
	const session = await locals.auth.validate();
	if (!session) return new Response('Unauthorized', { status: 401 });

	const { user } = session;
	const { _id, name, color, tickets, ticketId, laneId, boardId } = await request.json();

	if (
		!_id ||
		typeof _id !== 'string' ||
		!name ||
		typeof name !== 'string' ||
		!color ||
		typeof color !== 'string' ||
		typeof tickets !== 'object' ||
		!ticketId ||
		typeof ticketId !== 'string' ||
		!laneId ||
		typeof laneId !== 'string' ||
		!boardId ||
		typeof boardId !== 'string'
	) {
		return new Response('Bad request', { status: 400 });
	}

	if (name.length > 15) {
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
				$push: {
					'lanes.$[lane].tickets.$[ticket].tags': { _id, name, color },
					tags: { _id, name, color, tickets }
				}
			},
			{
				arrayFilters: [{ 'lane._id': laneId }, { 'ticket._id': ticketId }]
			}
		);

		return new Response('OK', { status: 200 });
	} catch (e) {
		return new Response('Internal Server Error', { status: 500 });
	}
}) satisfies RequestHandler;

export const PATCH = (async ({ locals, request }) => {
	const session = await locals.auth.validate();
	if (!session) return new Response('Unauthorized', { status: 401 });

	const { user } = session;
	const { _id, name, color, tickets, ticketId, laneId, boardId } = await request.json();

	if (
		!_id ||
		typeof _id !== 'string' ||
		!name ||
		typeof name !== 'string' ||
		!color ||
		typeof color !== 'string' ||
		typeof tickets !== 'object' ||
		!ticketId ||
		typeof ticketId !== 'string' ||
		!laneId ||
		typeof laneId !== 'string' ||
		!boardId ||
		typeof boardId !== 'string'
	) {
		return new Response('Bad request', { status: 400 });
	}

	if (name.length > 15) {
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
				$push: { 'lanes.$[lane].tickets.$[ticket].tags': { _id, name, color } },
				$set: { 'tags.$[tag].tickets': tickets }
			},
			{ arrayFilters: [{ 'lane._id': laneId }, { 'ticket._id': ticketId }, { 'tag._id': _id }] }
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
	const { _id, ticketId, laneId, boardId } = await request.json();

	if (
		!_id ||
		typeof _id !== 'string' ||
		!ticketId ||
		typeof ticketId !== 'string' ||
		!laneId ||
		typeof laneId !== 'string' ||
		!boardId ||
		typeof boardId !== 'string'
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
				$pull: {
					'lanes.$[lane].tickets.$[ticket].tags': { _id },
					'tags.$[tag].tickets': ticketId
				}
			},
			{ arrayFilters: [{ 'lane._id': laneId }, { 'ticket._id': ticketId }, { 'tag._id': _id }] }
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
	const { _id, tickets, ticketId, laneId, boardId } = await request.json();

	if (
		!_id ||
		typeof _id !== 'string' ||
		!tickets ||
		typeof tickets !== 'object' ||
		!ticketId ||
		typeof ticketId !== 'string' ||
		!laneId ||
		typeof laneId !== 'string' ||
		!boardId ||
		typeof boardId !== 'string'
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
				$pull: {
					'lanes.$[].tickets.$[ticket].tags': { _id },
					tags: { _id }
				}
			},
			{ arrayFilters: [{ 'ticket._id': { $in: tickets } }] }
		);

		return new Response('OK', { status: 200 });
	} catch (e) {
		return new Response('Internal Server Error', { status: 500 });
	}
}) satisfies RequestHandler;
