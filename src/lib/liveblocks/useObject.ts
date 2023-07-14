import { onDestroy } from 'svelte';
import { writable } from 'svelte/store';
import { useRoom } from './useRoom';
import { useStorage } from './useStorage';
import { LiveObject, type LsonObject } from '@liveblocks/client';

/**
 * Works similarly to `liveblocks-react` useObject
 * https://liveblocks.io/docs/api-reference/liveblocks-react#useObject
 *
 * The main difference is that it returns a Svelte store:
 * const obj = useObject()
 * $obj.set('name', 'Chris')
 * console.log($obj.get('name'))
 */

export function useObject<T extends LsonObject>(key: string, initialValue?: T) {
	const room = useRoom();
	const rootStore = useStorage();
	const newStore = writable<LiveObject<T>>();
	let unsubscribe: () => void;

	const unsubscribeRoot = rootStore.subscribe((root) => {
		if (!root) return;

		if (!root.get(key)) root.set(key, new LiveObject(initialValue));

		newStore.set(root.get(key));

		unsubscribe = room.subscribe(root.get(key), (newObject) => newStore.set(newObject));
	});

	onDestroy(() => {
		unsubscribe();
		unsubscribeRoot();
	});

	return newStore;
}
