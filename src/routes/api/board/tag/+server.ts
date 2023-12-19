import { json } from '@sveltejs/kit';
import { Board } from '$lib/server';
import type { RequestHandler } from './$types';

export const POST = (async ({ request }) => {
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

	try {
		await Board.findByIdAndUpdate(
			boardId,
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
	} catch (e) {
		return new Response('Internal Server Error', { status: 500 });
	}

	return json('OK', { status: 200 });
}) satisfies RequestHandler;

export const PATCH = (async ({ request }) => {
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

	try {
		await Board.findByIdAndUpdate(
			boardId,
			{
				$push: { 'lanes.$[lane].tickets.$[ticket].tags': { _id, name, color } },
				$set: { 'tags.$[tag].tickets': tickets }
			},
			{ arrayFilters: [{ 'lane._id': laneId }, { 'ticket._id': ticketId }, { 'tag._id': _id }] }
		);
	} catch (e) {
		return new Response('Internal Server Error', { status: 500 });
	}

	return json('OK', { status: 200 });
}) satisfies RequestHandler;

export const PUT = (async ({ request }) => {
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

	try {
		await Board.findByIdAndUpdate(
			boardId,
			{
				$pull: {
					'lanes.$[lane].tickets.$[ticket].tags': { _id },
					'tags.$[tag].tickets': ticketId
				}
			},
			{ arrayFilters: [{ 'lane._id': laneId }, { 'ticket._id': ticketId }, { 'tag._id': _id }] }
		);
	} catch (e) {
		return new Response('Internal Server Error', { status: 500 });
	}

	return json('OK', { status: 200 });
}) satisfies RequestHandler;

export const DELETE = (async ({ request }) => {
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

	try {
		await Board.findByIdAndUpdate(
			boardId,
			{
				$pull: {
					'lanes.$[].tickets.$[ticket].tags': { _id },
					tags: { _id }
				}
			},
			{ arrayFilters: [{ 'ticket._id': { $in: tickets } }] }
		);
	} catch (e) {
		return new Response('Internal Server Error', { status: 500 });
	}

	return json('OK', { status: 200 });
}) satisfies RequestHandler;
