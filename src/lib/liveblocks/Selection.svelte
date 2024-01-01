<script lang="ts">
	import type { Writable } from 'svelte/store';
	import type { User } from '@liveblocks/client';
	import type { Presence, UserMeta } from '$types';

	export let id: string;
	export let others: Writable<readonly User<Presence, UserMeta>[]>;
</script>

<div class="relative h-fit w-fit">
	{#each [...$others] as { connectionId, info, presence } (connectionId)}
		{#if presence.focusedId === id}
			<div
				class="absolute -bottom-1 -left-1 -right-1 -top-1 rounded-md border"
				style={`border-color: ${info.color};`}
			/>
			<div
				class="absolute -bottom-7 right-0 h-5 rounded px-2 text-xs leading-5 text-white"
				style={`background-color: ${info.color};`}
			>
				{info.name}
			</div>
		{/if}
	{/each}
	<slot />
</div>
