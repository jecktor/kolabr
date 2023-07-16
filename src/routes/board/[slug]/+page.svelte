<script lang="ts">
	import { onMount } from 'svelte';
	import { type Client, createClient } from '@liveblocks/client';

	import { LiveblocksProvider, RoomProvider } from '$lib/liveblocks';
	import { Live } from '$components';

	export let data;

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

{#if loaded}
	<!-- Provides Liveblocks hooks to children -->
	<LiveblocksProvider {client}>
		<!-- Create a room from id e.g. `kolabr-room-758df70b5e94c13289df6` -->
		<RoomProvider id={'kolabr-room-' + data.board.id}>
			<Live board={data.board} boardLanes={data.lanes} boardTags={data.tags} access={data.access} />
		</RoomProvider>
	</LiveblocksProvider>
{/if}
