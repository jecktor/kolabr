/**
 * Generates a random 21 character string that can
 * be used as an identifier.
 */

export function randomId() {
	return 'xxxxxxxxxxxxxxxxxxxxx'.replace(/[x]/g, () => ((Math.random() * 16) | 0).toString(16));
}
