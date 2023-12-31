<script lang="ts">
	import { useList } from '$lib/liveblocks';
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import type { ILane, ITicket } from '$types';

	import EditLane from './EditLane.svelte';
	import EditTicket from './EditTicket.svelte';

	export let lane: ILane;
	export let idx: number;
	export let onDrop: (newTickets: ITicket[]) => void;

	const lanes = useList<ILane>('lanes');
	const flipDurationMs = 150;

	function handleDndConsiderTickets(e: CustomEvent<DndEvent<ITicket>>) {
		lane.tickets = e.detail.items;
	}

	function handleDndFinalizeTickets(e: CustomEvent<DndEvent<ITicket>>) {
		onDrop(e.detail.items);
	}

	$: isLaneFull = $lanes
		? $lanes.get(idx)?.limit > 0 && $lanes.get(idx)?.tickets.length >= $lanes.get(idx)?.limit
		: true;
</script>

<div
	class="h-full w-full overflow-y-hidden rounded-lg border bg-card text-card-foreground shadow-sm"
>
	<div class="flex items-center justify-between px-4 pt-3">
		<div class="d-flex gap-2 text-nowrap">
			<span class="font-semibold">{lane.name}</span>
			{#if lane.limit > 0}
				<span class="ml-2 tracking-widest text-muted-foreground"
					>{lane.tickets.length}/{lane.limit}</span
				>
			{/if}
		</div>
		<div>
			<EditTicket laneIdx={idx} {isLaneFull} isNew />
			<EditLane {lane} {idx} />
		</div>
	</div>
	<div
		class="no-scrollbar h-[calc(100%-2.5rem)] overflow-y-scroll px-4"
		use:dndzone={{
			items: lane.tickets,
			flipDurationMs,
			zoneTabIndex: -1,
			dropFromOthersDisabled: isLaneFull
		}}
		on:consider={handleDndConsiderTickets}
		on:finalize={handleDndFinalizeTickets}
	>
		{#each lane.tickets as ticket (ticket._id)}
			<div
				class="my-2 flex h-fit w-full items-center justify-center rounded-lg border bg-card text-card-foreground shadow-sm"
				animate:flip={{ duration: flipDurationMs }}
			>
				<EditTicket boardticket={ticket} laneIdx={idx} />
			</div>
		{/each}
	</div>
</div>
