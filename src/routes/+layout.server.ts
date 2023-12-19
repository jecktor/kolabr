import { parseLang } from '$utils';

export const load = async ({ locals, request }) => {
	const session = await locals.auth.validate();

	if (session) return { lang: session.user.lang };

	const langHeader = request.headers.get('accept-language');
	const lang = parseLang(langHeader);

	return {
		lang
	};
};
