import { json } from '@sveltejs/kit';
import { db } from '$lib/server';
import type { RequestHandler } from './$types';

export const POST = (async ({ request }) => {
	const { id, name, ticketId } = await request.json();

	if (
		!id ||
		typeof id !== 'string' ||
		!name ||
		typeof name !== 'string' ||
		!ticketId ||
		typeof ticketId !== 'string'
	) {
		return new Response('Bad request', { status: 400 });
	}

	try {
		await db.execute('CALL create_tag(?, ?, ?)', [id, name, ticketId]);
	} catch (e) {
		return new Response('Internal Server Error', { status: 500 });
	}

	return json('OK', { status: 200 });
}) satisfies RequestHandler;

export const PATCH = (async ({ request }) => {
	const { id, ticketId } = await request.json();

	if (!id || typeof id !== 'string' || !ticketId || typeof ticketId !== 'string') {
		return new Response('Bad request', { status: 400 });
	}

	try {
		await db.execute('CALL add_tag(?, ?)', [id, ticketId]);
	} catch (e) {
		return new Response('Internal Server Error', { status: 500 });
	}

	return json('OK', { status: 200 });
}) satisfies RequestHandler;

export const PUT = (async ({ request }) => {
	const { id, ticketId } = await request.json();

	if (!id || typeof id !== 'string' || !ticketId || typeof ticketId !== 'string') {
		return new Response('Bad request', { status: 400 });
	}

	try {
		await db.execute('CALL remove_tag(?, ?)', [id, ticketId]);
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
		await db.execute('CALL delete_tag(?)', [id]);
	} catch (e) {
		return new Response('Internal Server Error', { status: 500 });
	}

	return json('OK', { status: 200 });
}) satisfies RequestHandler;
