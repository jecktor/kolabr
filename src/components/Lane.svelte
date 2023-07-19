<script lang="ts">
	import { useList } from '$lib/liveblocks';
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import type { Lane, Ticket } from '$types';

	import EditLane from './EditLane.svelte';
	import EditTicket from './EditTicket.svelte';

	export let lane: Lane;
	export let idx: number;
	export let onDrop: (newTickets: Ticket[]) => void;

	const lanes = useList<Lane>('lanes');
	const flipDurationMs = 150;

	function handleDndConsiderTickets(e: CustomEvent<DndEvent<Ticket>>) {
		lane.tickets = e.detail.items;
	}
	function handleDndFinalizeTickets(e: CustomEvent<DndEvent<Ticket>>) {
		onDrop(e.detail.items);
	}

	$: isLaneFull = $lanes
		? $lanes.get(idx)?.limit > 0 && $lanes.get(idx)?.tickets.length >= $lanes.get(idx)?.limit
		: true;
</script>

<div class="wrapper">
	<div class="lane-title">
		<span class="space1">{lane.name}</span>
		<div>
			<EditTicket laneIdx={idx} {isLaneFull} isNew />
			<EditLane {lane} {idx} />
		</div>
	</div>
	<div
		class="lane-content"
		use:dndzone={{
			items: lane.tickets,
			flipDurationMs,
			zoneTabIndex: -1,
			dropFromOthersDisabled: isLaneFull
		}}
		on:consider={handleDndConsiderTickets}
		on:finalize={handleDndFinalizeTickets}
	>
		{#each lane.tickets as ticket (ticket.id)}
			<div class="ticket" animate:flip={{ duration: flipDurationMs }}>
				<EditTicket boardticket={ticket} laneIdx={idx} />
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
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-family: 'Inter';
		font-style: normal;
		font-weight: 600;
		font-size: 16px;
		line-height: 19px;
		letter-spacing: -0.2px;
		color: var(--base-600);
	}

	.ticket {
		height: fit-content;
		width: 100%;
		margin: 0.4em 0;
		display: flex;
		justify-content: center;
		align-items: center;
		border: 1px solid var(--base-300);
		border-radius: 8px;
	}

	.space1 {
		margin-left: 3%;
	}

	@media (max-width: 768px) {
		.lane-title {
			font-size: 9px;
		}
	}
</style>
