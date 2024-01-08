import { Board } from '$lib/server';
import type { RequestHandler } from './$types';

export const PATCH = (async ({ locals, request }) => {
	const session = await locals.auth.validate();
	if (!session) return new Response('Unauthorized', { status: 401 });

	const { user } = session;
	const { assignees, ticketId, laneId, boardId } = await request.json();

	if (
		typeof assignees !== 'object' ||
		!ticketId ||
		typeof ticketId !== 'string' ||
		!laneId ||
		typeof laneId !== 'string' ||
		!boardId ||
		typeof boardId !== 'string'
	) {
		return new Response('Bad request', { status: 400 });
	}

	const board = await Board.findById(boardId, 'owner shared_with');

	if (!board) {
		return new Response('Not found', { status: 404 });
	}

	if (board.owner._id !== user.userId && !board.shared_with.some((u) => u.email === user.email)) {
		return new Response('Unauthorized', { status: 401 });
	}

	try {
		await board.updateOne(
			{
				$set: { 'lanes.$[lane].tickets.$[ticket].assignees': assignees }
			},
			{ arrayFilters: [{ 'lane._id': laneId }, { 'ticket._id': ticketId }] }
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
	const { assignee, ticketId, laneId, boardId } = await request.json();

	if (
		!assignee ||
		typeof assignee !== 'string' ||
		!ticketId ||
		typeof ticketId !== 'string' ||
		!laneId ||
		typeof laneId !== 'string' ||
		!boardId ||
		typeof boardId !== 'string'
	) {
		return new Response('Bad request', { status: 400 });
	}

	const board = await Board.findById(boardId, 'owner shared_with');

	if (!board) {
		return new Response('Not found', { status: 404 });
	}

	if (board.owner._id !== user.userId && !board.shared_with.some((u) => u.email === user.email)) {
		return new Response('Unauthorized', { status: 401 });
	}

	try {
		await board.updateOne(
			{
				$pull: { 'lanes.$[lane].tickets.$[ticket].assignees': { email: assignee } }
			},
			{ arrayFilters: [{ 'lane._id': laneId }, { 'ticket._id': ticketId }] }
		);
		return new Response('OK', { status: 200 });
	} catch (e) {
		return new Response('Internal Server Error', { status: 500 });
	}
}) satisfies RequestHandler;
