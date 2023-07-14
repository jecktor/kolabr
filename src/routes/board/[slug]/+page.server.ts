import { error, redirect } from '@sveltejs/kit';
import { db } from '$lib/server';
import type { Board, Lane, LaneResults, Tag, Ticket } from '$types';

export const load = async ({ locals, params }) => {
	const { user } = await locals.auth.validateUser();
	if (!user) throw redirect(302, '/login');

	const [boardResults] = await db.execute('CALL find_board(?)', [params.slug]);
	const board = (boardResults as Board[][])[0][0];

	if (!board) throw error(404, 'Not found');

	if (board.owner_id !== user.userId) {
		const [accessResults] = await db.execute('CALL user_has_access_to_board(?, ?)', [
			user.userId,
			board.id
		]);
		const { has_access } = (accessResults as [[{ has_access: number }]])[0][0];

		if (has_access !== 1) throw redirect(302, '/dashboard');
	}

	const [rowsResults] = await db.execute('CALL get_board_lanes(?)', [board.id]);
	const rows = (rowsResults as LaneResults[][])[0];

	const lanes: Lane[] = [];
	let currentLane: Lane;

	rows.forEach((row) => {
		if (!currentLane || currentLane.id !== row.lane_id) {
			// Create a new lane object
			currentLane = {
				id: row.lane_id,
				name: row.lane_name,
				limit: row.lane_limit,
				tickets: [] as Ticket[]
			};
			lanes.push(currentLane);
		}

		if (row.ticket_id) {
			// Create a new ticket object
			const ticket = {
				id: row.ticket_id,
				name: row.ticket_name,
				description: row.ticket_description,
				deadline: row.ticket_deadline,
				tags: [] as Tag[]
			};

			if (row.tag_id) {
				// Create a new tag object
				const tag = {
					id: row.tag_id,
					name: row.tag_name
				};
				ticket.tags.push(tag);
			}

			currentLane.tickets.push(ticket);
		}
	});

	return {
		board,
		lanes
	};
};
