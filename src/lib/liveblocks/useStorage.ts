import { writable } from 'svelte/store';
import { useRoom } from './useRoom';
import type { LiveStorage } from '$types';

/**
 * No `liveblocks-react` public API equivalent, but useStorage is used internally
 */

export function useStorage() {
	const room = useRoom();
	const rootStore = writable<LiveStorage>();

	async function fetchStorage() {
		const { root } = await room.getStorage();
		rootStore.set(root);
	}

	fetchStorage();

	return rootStore;
}
