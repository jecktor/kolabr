/**
 * Generates an hsl color from a string consistently.
 */

export function str2Color(str: string) {
	const hash = str.split('').reduce((acc, char) => {
		acc = (acc << 5) - acc + char.charCodeAt(0);
		return acc & acc;
	}, 0);
	const hue = Math.abs(hash % 360);
	return `hsl(${hue}, 50%, 80%)`;
}
