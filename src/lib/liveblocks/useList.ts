import { onDestroy } from 'svelte';
import { writable } from 'svelte/store';
import { useRoom } from './useRoom';
import { useStorage } from './useStorage';
import { LiveList, type Lson } from '@liveblocks/client';

/**
 * Works similarly to `liveblocks-react` useList
 * https://liveblocks.io/docs/api-reference/liveblocks-react#useList
 *
 * The main difference is that it returns a Svelte store:
 * const list = useList()
 * $list.push([{ item: 1 }])
 * console.log([...$list])
 */

export function useList<T extends Lson>(key: string, initialValue?: T[]) {
	const room = useRoom();
	const rootStore = useStorage();
	const newStore = writable<LiveList<T>>();
	let unsubscribe: () => void;

	const unsubscribeRoot = rootStore.subscribe((root) => {
		if (!root) return;

		if (!root.get(key)) root.set(key, new LiveList(initialValue));

		newStore.set(root.get(key));

		unsubscribe = room.subscribe(root.get(key), (newList) => newStore.set(newList));
	});

	onDestroy(() => {
		unsubscribe();
		unsubscribeRoot();
	});

	return newStore;
}
