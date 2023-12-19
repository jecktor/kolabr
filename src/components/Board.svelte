<script lang="ts">
	import { page } from '$app/stores';
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import type { ILane, ITicket } from '$types';

	import Lane from './Lane.svelte';
	import EditLane from './EditLane.svelte';

	export let lanes: ILane[];
	export let onFinalUpdate: (newLanes: ILane[]) => void;

	const flipDurationMs = 300;

	function handleDndConsiderLanes(e: CustomEvent<DndEvent<ILane>>) {
		lanes = e.detail.items;
	}

	function handleDndFinalizeLanes(e: CustomEvent<DndEvent<ILane>>) {
		onFinalUpdate(e.detail.items);
	}

	function handleTicketFinalize(laneIdx: number, newTickets: ITicket[]) {
		const opts = {
			method: 'PATCH',
			body: JSON.stringify({
				_id: lanes[laneIdx]._id.split('-')[0],
				board: $page.url.href.split('/').pop(),
				tickets: newTickets
			}),
			headers: {
				'content-type': 'application/json'
			}
		};

		fetch('/api/board/lane', opts).catch(console.error);

		lanes[laneIdx].tickets = newTickets;
		onFinalUpdate(lanes);
	}
</script>

<div class="wrapper">
	<section
		class="board"
		use:dndzone={{ items: lanes, flipDurationMs, type: 'column' }}
		on:consider={handleDndConsiderLanes}
		on:finalize={handleDndFinalizeLanes}
	>
		{#each lanes as lane, idx (lane._id)}
			<div class="lane" animate:flip={{ duration: flipDurationMs }}>
				<Lane {lane} {idx} onDrop={(newTickets) => handleTicketFinalize(idx, newTickets)} />
			</div>
		{/each}
	</section>
	<EditLane idx={lanes.length - 1} isNew />
</div>

<style>
	.wrapper {
		display: flex;
	}

	.board {
		display: flex;
		flex-wrap: wrap;
		height: 90vh;
		width: fit-content;
		padding: 0.5em;
	}

	.lane {
		height: 100%;
		width: 300px;
		padding: 0.5em;
		margin: 0.5em;
		float: left;
		background-color: var(--base-200);
		border-radius: 12px;
	}

	@media (max-width: 768px) {
		.lane {
			width: 38%;
		}

		.board {
			width: 170%;
		}
	}
</style>
