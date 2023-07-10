<script lang="ts">
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import { translateDate } from '$locales';
	import type { Ticket } from '$types';

	export let name: string;
	export let tickets: Ticket[];
	export let onDrop: (newTickets: Ticket[]) => void;

	const flipDurationMs = 150;

	function handleDndConsiderTickets(e: CustomEvent<DndEvent<Ticket>>) {
		tickets = e.detail.items;
	}
	function handleDndFinalizeTickets(e: CustomEvent<DndEvent<Ticket>>) {
		onDrop(e.detail.items);
	}
</script>

<div class="wrapper">
	<div class="lane-title">
		{name}
	</div>
	<div
		class="lane-content"
		use:dndzone={{ items: tickets, flipDurationMs, zoneTabIndex: -1 }}
		on:consider={handleDndConsiderTickets}
		on:finalize={handleDndFinalizeTickets}
	>
		{#each tickets as { id, name, description, deadline, tags } (id)}
			<div class="ticket" animate:flip={{ duration: flipDurationMs }}>
				<p>{name}</p>
				{#if description}
					<p>{description}</p>
				{/if}
				<div>
					{#if deadline}
						<span>{translateDate(deadline)}</span>
					{/if}
					{#each tags as { id, name } (id)}
						<span>{name}</span>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</div>

<style>
	.wrapper {
		height: 100%;
		width: 100%;
		overflow-y: hidden;
	}

	.lane-content {
		height: calc(100% - 2.5em);
		overflow-y: scroll;
	}

	.lane-title {
		height: 2.5em;
		font-weight: bold;
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.ticket {
		height: 4em;
		width: 100%;
		margin: 0.4em 0;
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #dddddd;
		border: 1px solid #333333;
	}
</style>
