import { derived, writable } from 'svelte/store';
import * as en from './en.json';
import * as es from './es.json';

interface Translations {
	[locale: string]: {
		[key: string]: string;
	};
}

type TranslationKeys = keyof typeof en;

const translations: Translations = { en, es };

export const locale = writable('en');
export const locales = Object.keys(translations);

function translate(locale: string, key: TranslationKeys) {
	// Grab the translation from the translations object.
	const text: string = translations[locale][key];

	if (!text) throw new Error(`No translation found for ${locale}.${key}`);

	return text;
}

export const t = derived(locale, ($locale) => (key: TranslationKeys) => translate($locale, key));
