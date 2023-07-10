<script lang="ts">
	import type { Writable } from 'svelte/store';
	import type { Others } from '@liveblocks/client';
	import type { Presence, UserMeta } from '$types';

	export let id: string;
	export let others: Writable<Others<Presence, UserMeta>>;
</script>

<div class="selection">
	{#each [...$others] as { connectionId, info, presence } (connectionId)}
		{#if presence.focusedId === id}
			<div class="selection_border" style={`border-color: ${info.color};`} />
			<div class="selection_name" style={`background-color: ${info.color};`}>{info.name}</div>
		{/if}
	{/each}
	<slot />
</div>

<style>
	.selection {
		position: relative;
		width: fit-content;
		height: fit-content;
	}

	.selection_border {
		position: absolute;
		top: -5px;
		right: -5px;
		bottom: -5px;
		left: -5px;
		border-radius: 11px;
		opacity: 0.2;
		border-width: 5px;
		border-style: solid;
	}

	.selection_name {
		position: absolute;
		bottom: -29px;
		padding: 0 6px;
		border-radius: 3px;
		font-size: 1.2rem;
		line-height: 20px;
		height: 20px;
		color: white;
		right: 0;
	}
</style>
