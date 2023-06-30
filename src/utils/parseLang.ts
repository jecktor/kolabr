import { locales } from '$locales';

/**
 * Helper function that parses a language header and
 * extracts the browser languages in order of preference.
 * If there's no available languages, it defaults to english.
 */

export function parseLang(langHeader: string | null) {
	if (!langHeader) return 'en';

	const lang = langHeader
		.split(',')
		.map((lang) => lang.split(';')[0])
		.map((lang) => lang.trim())[0]
		.split('-')[0];

	if (!locales.includes(lang)) return 'en';

	return lang;
}
