import { json } from '@sveltejs/kit';
import { db } from '$lib/server';
import type { RequestHandler } from './$types';

export const POST = (async ({ request }) => {
	const { id, name, description, deadline, lane } = await request.json();

	if (
		!id ||
		typeof id !== 'string' ||
		!name ||
		typeof name !== 'string' ||
		typeof description !== 'string' ||
		typeof deadline !== 'string' ||
		!lane ||
		typeof lane !== 'string'
	) {
		return new Response('Bad request', { status: 400 });
	}

	try {
		await db.execute('CALL create_ticket(?, ?, ?, ?, ?)', [id, name, description, deadline, lane]);
	} catch (e) {
		return new Response('Internal Server Error', { status: 500 });
	}

	return json('OK', { status: 200 });
}) satisfies RequestHandler;
