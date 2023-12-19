<script lang="ts">
	import { onMount } from 'svelte';
	import { t } from '$locales';
	import { type Client, createClient } from '@liveblocks/client';
	import type { IBoard } from '$types';

	import { LiveblocksProvider, RoomProvider } from '$lib/liveblocks';
	import { Live } from '$components';

	export let data: { board: IBoard };

	let client: Client;
	let loaded = false;

	onMount(() => {
		// Connect to the authentication API for Liveblocks
		client = createClient({
			authEndpoint: '/api/auth'
		});

		loaded = true;
	});
</script>

<svelte:head>
	<title>{data.board.name} | Kolabr</title>
	<meta name="description" content={$t('herotitle')} />
</svelte:head>

{#if loaded}
	<!-- Provides Liveblocks hooks to children -->
	<LiveblocksProvider {client}>
		<!-- Create a room from id e.g. `kolabr-room-657f8fed396b6aa615707d0c` -->
		<RoomProvider id={'kolabr-room-' + data.board._id}>
			<Live board={data.board} />
		</RoomProvider>
	</LiveblocksProvider>
{/if}
