import { onDestroy } from 'svelte';
import { writable } from 'svelte/store';
import { useRoom } from './useRoom';
import type { User } from '@liveblocks/client';
import type { Presence, UserMeta } from '../types';

/**
 * Works similarly to `liveblocks-react` useSelf
 *
 * The main difference is that it returns a Svelte store:
 * const self = useSelf()
 * console.log($self.info.id)
 * <div>{$self.info.name}</div>
 */

export function useSelf() {
	const room = useRoom();
	const self = writable<User<Presence, UserMeta> | null>();

	const unsubscribeConnection = room.subscribe('connection', () => self.set(room.getSelf()));
	const unsubscribe = room.subscribe('my-presence', () => self.set(room.getSelf()));

	onDestroy(() => {
		unsubscribeConnection();
		unsubscribe();
	});

	return self;
}
