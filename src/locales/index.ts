import { derived, writable, get } from 'svelte/store';
import * as en from './en.json';
import * as es from './es.json';

interface Translations {
	[locale: string]: {
		[key: string]: string;
	};
}

const translations: Translations = { en, es };

export type TranslationKeys = keyof typeof en;

export const locale = writable('en');
export const locales = Object.keys(translations);

export function translate(locale: string, key: TranslationKeys) {
	// Grab the translation from the translations object.
	const text: string = translations[locale][key];

	if (!text) throw new Error(`No translation found for ${locale}.${key}`);

	return text;
}

export function translateDate(date: Date | string, short = false) {
	return new Date(date).toLocaleDateString(get(locale), {
		year: 'numeric',
		month: short ? 'short' : 'long',
		day: 'numeric',
		hour: short ? undefined : '2-digit',
		minute: short ? undefined : '2-digit'
	});
}

export const t = derived(locale, ($locale) => (key: TranslationKeys) => translate($locale, key));
