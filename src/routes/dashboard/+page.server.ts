import { redirect, type Actions, fail } from '@sveltejs/kit';
import { auth } from '$lib/server';

export const load = async ({ locals }) => {
	const { user } = await locals.auth.validateUser();
	if (!user) throw redirect(302, '/login');

	return {
		user
	};
};

export const actions: Actions = {
	// Sign out
	default: async ({ locals }) => {
		const session = await locals.auth.validate();
		if (!session) return fail(401);
		await auth.invalidateSession(session.sessionId);
		locals.auth.setSession(null);
	}
};