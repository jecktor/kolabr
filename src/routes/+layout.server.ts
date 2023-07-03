import { parseLang } from '$utils';

export const load = async ({ locals, request }) => {
	const { user } = await locals.auth.validateUser();

	if (user) return { lang: user.lang };

	const langHeader = request.headers.get('accept-language');
	const lang = parseLang(langHeader);

	return {
		lang
	};
};
