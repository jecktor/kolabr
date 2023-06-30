import { parseLang } from '$utils';

export const load = async ({ request }) => {
	const langHeader = request.headers.get('accept-language');
	const lang = parseLang(langHeader);

	return {
		lang
	};
};
