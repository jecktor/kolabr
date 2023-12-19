import { error, redirect } from '@sveltejs/kit';
import { Board } from '$lib/server';

export const load = async ({ locals, params }) => {
	const session = await locals.auth.validate();
	if (!session) throw redirect(302, '/login');

	const { user } = session;

	const board = await Board.findById(params.slug);

	if (!board) throw error(404, 'Not found');

	if (board.owner._id !== user.userId && !board.shared_with.includes(user.email)) {
		throw redirect(302, '/dashboard');
	}

	return {
		board: board.toObject()
	};
};
