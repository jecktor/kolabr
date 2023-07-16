import { json } from '@sveltejs/kit';
import { db } from '$lib/server';
import type { RequestHandler } from './$types';

export const POST = (async ({ request }) => {
	const { id, name, limit, board } = await request.json();

	if (
		!id ||
		typeof id !== 'string' ||
		!name ||
		typeof name !== 'string' ||
		!board ||
		typeof board !== 'string' ||
		typeof limit !== 'number'
	) {
		return new Response('Bad request', { status: 400 });
	}

	try {
		await db.execute('CALL create_lane(?, ?, ?, ?)', [id, name, limit, board]);
	} catch (e) {
		return new Response('Internal Server Error', { status: 500 });
	}

	return json('OK', { status: 200 });
}) satisfies RequestHandler;

export const PATCH = (async ({ request }) => {
	const { lane, tickets } = await request.json();

	if (!lane || typeof lane !== 'string' || typeof tickets !== 'object') {
		return new Response('Bad request', { status: 400 });
	}

	try {
		tickets.forEach((id: string) => {
			db.execute('CALL update_ticket_lane(?, ?)', [id, lane]);
		});
	} catch (e) {
		return new Response('Internal Server Error', { status: 500 });
	}

	return json('OK', { status: 200 });
}) satisfies RequestHandler;

export const PUT = (async ({ request }) => {
	const { id, name, limit } = await request.json();

	if (
		!id ||
		typeof id !== 'string' ||
		!name ||
		typeof name !== 'string' ||
		typeof limit !== 'number'
	) {
		return new Response('Bad request', { status: 400 });
	}

	try {
		await db.execute('CALL update_lane(?, ?, ?)', [id, name, limit]);
	} catch (e) {
		return new Response('Internal Server Error', { status: 500 });
	}

	return json('OK', { status: 200 });
}) satisfies RequestHandler;

export const DELETE = (async ({ request }) => {
	const { id } = await request.json();

	if (!id || typeof id !== 'string') {
		return new Response('Bad request', { status: 400 });
	}

	try {
		await db.execute('CALL delete_lane(?)', [id]);
	} catch (e) {
		return new Response('Internal Server Error', { status: 500 });
	}

	return json('OK', { status: 200 });
}) satisfies RequestHandler;
