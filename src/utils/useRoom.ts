import { getContext } from 'svelte';
import { roomSymbol } from '../symbols';
import type { LiveRoom } from '../types';

/**
 * Works similarly to `liveblocks-react` useRoom
 *
 * This does NOT return a Svelte store, just the plain room object
 * const room = useRoom()
 * room.history.undo()
 */

export function useRoom() {
	const room = getContext<LiveRoom>(roomSymbol);

	if (!room) {
		throw new Error('Use RoomProvider as parent with id prop');
	}

	return room;
}
