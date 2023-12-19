import { json } from '@sveltejs/kit';
import { Board } from '$lib/server';
import type { RequestHandler } from './$types';

export const POST = (async ({ request }) => {
	const { _id, name, description, deadline, board, lane } = await request.json();

	if (
		!_id ||
		typeof _id !== 'string' ||
		!name ||
		typeof name !== 'string' ||
		typeof description !== 'string' ||
		typeof deadline !== 'string' ||
		!board ||
		typeof board !== 'string' ||
		!lane ||
		typeof lane !== 'string'
	) {
		return new Response('Bad request', { status: 400 });
	}

	try {
		await Board.findByIdAndUpdate(
			board,
			{ $push: { 'lanes.$[lane].tickets': { _id, name, description, deadline } } },
			{ arrayFilters: [{ 'lane._id': lane }] }
		);
	} catch (e) {
		return new Response('Internal Server Error', { status: 500 });
	}

	return json('OK', { status: 200 });
}) satisfies RequestHandler;

export const PUT = (async ({ request }) => {
	const { _id, name, description, deadline, tags, board, lane } = await request.json();

	if (
		!_id ||
		typeof _id !== 'string' ||
		!name ||
		typeof name !== 'string' ||
		typeof description !== 'string' ||
		typeof deadline !== 'string' ||
		!board ||
		typeof board !== 'string' ||
		!lane ||
		typeof lane !== 'string' ||
		typeof tags !== 'object'
	) {
		return new Response('Bad request', { status: 400 });
	}

	try {
		await Board.findByIdAndUpdate(
			board,
			{ $set: { 'lanes.$[lane].tickets.$[ticket]': { _id, name, description, deadline, tags } } },
			{ arrayFilters: [{ 'lane._id': lane }, { 'ticket._id': _id }] }
		);
	} catch (e) {
		return new Response('Internal Server Error', { status: 500 });
	}

	return json('OK', { status: 200 });
}) satisfies RequestHandler;

export const DELETE = (async ({ request }) => {
	const { _id, board, lane } = await request.json();

	if (!_id || typeof _id !== 'string') {
		return new Response('Bad request', { status: 400 });
	}

	try {
		await Board.findByIdAndUpdate(
			board,
			{ $pull: { 'lanes.$[lane].tickets': { _id } } },
			{ arrayFilters: [{ 'lane._id': lane }] }
		);
	} catch (e) {
		return new Response('Internal Server Error', { status: 500 });
	}

	return json('OK', { status: 200 });
}) satisfies RequestHandler;
