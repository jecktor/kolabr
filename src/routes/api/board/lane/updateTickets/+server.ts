import { json } from '@sveltejs/kit';
import { db } from '$lib/server';
import type { RequestHandler } from './$types';

export const POST = (async ({ request }) => {
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
