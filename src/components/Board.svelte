<script lang="ts">
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import { t } from '$locales';
	import type { Lane as TLane, Ticket } from '$types';

	import Lane from './Lane.svelte';
	import EditLane from './EditLane.svelte';

	export let lanes: TLane[];
	export let onFinalUpdate: (newLanes: TLane[]) => void;

	const flipDurationMs = 300;
	const laneTemplate: TLane = {
		id: '',
		name: $t('newlane'),
		limit: 0,
		tickets: []
	};

	function handleDndConsiderLanes(e: CustomEvent<DndEvent<TLane>>) {
		lanes = e.detail.items;
	}

	function handleDndFinalizeLanes(e: CustomEvent<DndEvent<TLane>>) {
		onFinalUpdate(e.detail.items);
	}

	function handleTicketFinalize(laneIdx: number, newTickets: Ticket[]) {
		lanes[laneIdx].tickets = newTickets;
		onFinalUpdate(lanes);
	}
</script>

<section
	class="board"
	use:dndzone={{ items: lanes, flipDurationMs, type: 'column' }}
	on:consider={handleDndConsiderLanes}
	on:finalize={handleDndFinalizeLanes}
>
	{#each lanes as lane, idx (lane.id)}
		<div class="lane" animate:flip={{ duration: flipDurationMs }}>
			<Lane {lane} {idx} onDrop={(newTickets) => handleTicketFinalize(idx, newTickets)} />
		</div>
	{/each}
</section>
<EditLane lane={laneTemplate} isNew />

<style>
	.board {
		height: 90vh;
		width: 100%;
		padding: 0.5em;
	}

	.lane {
		height: 100%;
		width: 25%;
		padding: 0.5em;
		margin: 0.5em;
		float: left;
		border: 1px solid #333333;
	}
</style>
