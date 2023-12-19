import { json } from '@sveltejs/kit';
import { Board } from '$lib/server';
import type { RequestHandler } from './$types';

export const POST = (async ({ request }) => {
	const { _id, name, limit, board } = await request.json();

	if (
		!_id ||
		typeof _id !== 'string' ||
		!name ||
		typeof name !== 'string' ||
		!board ||
		typeof board !== 'string' ||
		typeof limit !== 'number'
	) {
		return new Response('Bad request', { status: 400 });
	}

	try {
		await Board.findByIdAndUpdate(board, {
			$push: { lanes: { _id, name, limit, tickets: [] } }
		});
	} catch (e) {
		return new Response('Internal Server Error', { status: 500 });
	}

	return json('OK', { status: 200 });
}) satisfies RequestHandler;

export const PATCH = (async ({ request }) => {
	const { _id, board, tickets } = await request.json();

	if (
		!_id ||
		typeof _id !== 'string' ||
		!board ||
		typeof board !== 'string' ||
		typeof tickets !== 'object'
	) {
		return new Response('Bad request', { status: 400 });
	}

	try {
		await Board.findByIdAndUpdate(
			board,
			{
				$set: { 'lanes.$[lane].tickets': tickets }
			},
			{
				arrayFilters: [{ 'lane._id': _id }]
			}
		);
	} catch (e) {
		return new Response('Internal Server Error', { status: 500 });
	}

	return json('OK', { status: 200 });
}) satisfies RequestHandler;

export const PUT = (async ({ request }) => {
	const { _id, board, name, limit } = await request.json();

	if (
		!_id ||
		typeof _id !== 'string' ||
		!board ||
		typeof board !== 'string' ||
		!name ||
		typeof name !== 'string' ||
		typeof limit !== 'number'
	) {
		return new Response('Bad request', { status: 400 });
	}

	try {
		await Board.findByIdAndUpdate(
			board,
			{ $set: { 'lanes.$[lane].name': name, 'lanes.$[lane].limit': limit } },
			{ arrayFilters: [{ 'lane._id': _id }] }
		);
	} catch (e) {
		return new Response('Internal Server Error', { status: 500 });
	}

	return json('OK', { status: 200 });
}) satisfies RequestHandler;

export const DELETE = (async ({ request }) => {
	const { _id, board } = await request.json();

	if (!_id || typeof _id !== 'string' || !board || typeof board !== 'string') {
		return new Response('Bad request', { status: 400 });
	}

	try {
		await Board.findByIdAndUpdate(board, { $pull: { lanes: { _id } } });
	} catch (e) {
		return new Response('Internal Server Error', { status: 500 });
	}

	return json('OK', { status: 200 });
}) satisfies RequestHandler;
