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
