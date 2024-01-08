import { liveblocks } from '$lib/server';
import { str2Color } from '$utils';
import type { RequestHandler } from './$types';

export const POST = (async ({ locals, request }) => {
	const userSession = await locals.auth.validate();
	const { room } = await request.json();

	if (!room || !userSession) {
		return new Response(undefined, { status: 403 });
	}

	const { user } = userSession;

	const session = liveblocks.prepareSession(user.userId, {
		userInfo: {
			name: user.name,
			email: user.email,
			image: user.image,
			color: str2Color(user.userId)
		}
	});

	session.allow(room, session.FULL_ACCESS);

	const { status, body } = await session.authorize();

	return new Response(body, { status });
}) satisfies RequestHandler;
