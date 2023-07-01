import type { Handle } from '@sveltejs/kit';
import { auth } from '$lib/server';

export const handle = (async ({ event, resolve }) => {
	event.locals.auth = auth.handleRequest(event);
	return await resolve(event);
}) satisfies Handle;
