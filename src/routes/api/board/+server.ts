import { json } from '@sveltejs/kit';
import { db } from '$lib/server';
import type { RequestHandler } from './$types';

export const PATCH = (async ({ request }) => {
	const { id, last_edited } = await request.json();

	if (!id || typeof id !== 'string' || !last_edited || typeof last_edited !== 'string') {
		return new Response('Bad request', { status: 400 });
	}

	try {
		await db.execute('CALL update_board_date(?, ?)', [id, last_edited]);
	} catch (e) {
		return new Response('Internal Server Error', { status: 500 });
	}

	return json('OK', { status: 200 });
}) satisfies RequestHandler;

export const PUT = (async ({ request }) => {
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

	try {
		await db.execute('CALL update_board(?, ?, ?)', [id, name, last_edited]);
	} catch (e) {
		return new Response('Internal Server Error', { status: 500 });
	}

	return json('OK', { status: 200 });
}) satisfies RequestHandler;
