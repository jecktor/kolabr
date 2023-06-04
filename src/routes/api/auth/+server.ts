import { json } from '@sveltejs/kit';
import { authorize } from '@liveblocks/node';
import { str2Color } from '$utils';

const API_KEY = import.meta.env.VITE_LIVEBLOCKS_SECRET_KEY as string;

export async function POST(req) {
	const { room } = await req.request.json();
	const session = await req.locals.getSession();
	const user = session?.user;

	if (!API_KEY) {
		return json(
			{ message: 'No api key was provided.' },
			{
				status: 403
			}
		);
	}

	if (!room || !user) {
		return new Response(undefined, { status: 403 });
	}

	const response = await authorize({
		room: room,
		secret: API_KEY,
		userId: crypto.randomUUID(),
		userInfo: {
			name: user?.name,
			picture: user?.image,
			color: str2Color(user?.email || 'Guest')
		}
	});

	return new Response(response.body, { status: response.status });
}
