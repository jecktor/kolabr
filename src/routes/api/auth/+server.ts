import { Liveblocks } from '@liveblocks/node';
import { str2Color } from '$utils';
import { VITE_LIVEBLOCKS_SECRET_KEY } from '$env/static/private';

const liveblocks = new Liveblocks({ secret: VITE_LIVEBLOCKS_SECRET_KEY });

export async function POST(req) {
	const { room } = await req.request.json();
	const userSession = await req.locals.auth.validate();

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
}
