import { onDestroy } from 'svelte';
import { writable } from 'svelte/store';
import { useRoom } from './useRoom';
import type { User } from '@liveblocks/client';
import type { Presence, UserMeta } from '$types';

/**
 * Works similarly to `liveblocks-react` useOthers
 *
 * The main difference is that it returns a Svelte store:
 * const others = useOthers()
 * console.log($others.value)
 * {#each [...$others] as other}
 *    ...
 */

export function useOthers() {
	const room = useRoom();
	const others = writable<readonly User<Presence, UserMeta>[]>();

	const unsubscribe = room.subscribe('others', (newOthers) => others.set(newOthers));

	onDestroy(unsubscribe);

	return others;
}
