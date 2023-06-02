<script lang="ts">
	import { getContext, onDestroy, setContext } from 'svelte';
	import { clientSymbol, roomSymbol } from '../symbols';
	import type { Client } from '@liveblocks/client';
	import type { Presence, Storage, UserMeta, LiveRoom } from '../types';

	export let id: string;

	if (!id) {
		throw new Error('RoomProvider requires an id');
	}

	const client = getContext<Client>(clientSymbol);

	if (client) {
		const room = client.enter<Presence, Storage, UserMeta>(id, {
			initialPresence: { cursor: null },
			initialStorage: {}
		});

		setContext<LiveRoom>(roomSymbol, room);

		onDestroy(() => {
			if (client && room) {
				client.leave(id);
			}
		});
	}
</script>

<slot />
