import { json } from '@sveltejs/kit';
import { authorize } from '@liveblocks/node';

const API_KEY = import.meta.env.VITE_LIVEBLOCKS_SECRET_KEY as string;

export async function POST({ request }) {
	const { room } = await request.json();

	if (!API_KEY) {
		return json(
			{ message: 'No api key was provided.' },
			{
				status: 403
			}
		);
	}

	if (!room) {
		return new Response(undefined, { status: 403 });
	}

	// For now, this generates random users
	// and sets their info from the authentication endpoint

	const response = await authorize({
		room: room,
		secret: API_KEY,
		userId: `user-${Math.floor(Math.random() * 100)}`,
		userInfo: {
			name: 'Guest',
			picture: `https://liveblocks.io/avatars/avatar-${Math.floor(Math.random() * 30)}.png`,
			color: '#ffaa00'
		}
	});

	return new Response(response.body, { status: response.status });
}
