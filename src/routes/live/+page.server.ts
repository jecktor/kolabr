import { redirect } from '@sveltejs/kit';

export async function load({ locals }) {
	const session = await locals.getSession();

	if (!session?.user) {
		throw redirect(307, '/auth/signin');
	}
}
