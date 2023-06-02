<script lang="ts">
	import { onMount } from 'svelte';
	import { type Client, createClient } from '@liveblocks/client';
	import { createRoomId } from '../utils/createRoomId';

	import LiveblocksProvider from '../components/LiveblocksProvider.svelte';
	import RoomProvider from '../components/RoomProvider.svelte';
	import App from '../components/App.svelte';

	let id: string;
	let client: Client;
	let loaded = false;

	onMount(() => {
		// Add random id to room param if not set, and return the id string
		// e.g. /?room=758df70b5e94c13289df6
		id = createRoomId();

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
		<RoomProvider id={'kolabr-room-' + id}>
			<!-- Main app component -->
			<App />
		</RoomProvider>
	</LiveblocksProvider>
{/if}
