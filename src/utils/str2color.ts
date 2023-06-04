/**
 * Generates an hsl color from a string consistently.
 */

export function str2Color(string: string, saturation = 100, lightness = 75) {
	let hash = 0;

	for (let i = 0; i < string.length; i++) {
		hash = string.charCodeAt(i) + ((hash << 5) - hash);
		hash = hash & hash;
	}

	return `hsl(${hash % 360}, ${saturation}%, ${lightness}%)`;
}
