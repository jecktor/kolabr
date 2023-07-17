<script lang="ts">
	import { page } from '$app/stores';
	import { useList } from '$lib/liveblocks';
	import { randomId } from '$utils';
	import { t } from '$locales';
	import type { Lane } from '$types';

	import FaEllipsisH from 'svelte-icons/fa/FaEllipsisH.svelte';
	import FaPlus from 'svelte-icons/fa/FaPlus.svelte';
	import FaTrash from 'svelte-icons/fa/FaTrash.svelte';
	import Modal from './Modal.svelte';

	export let idx: number;
	export let isNew = false;
	export let lane: Lane = {
		id: '',
		name: $t('newlane'),
		limit: 0,
		tickets: []
	};

	const lanes = useList<Lane>('lanes');

	let nameInput: HTMLInputElement;
	let show = false;

	$: limit = lane.limit;

	function createLane() {
		lane.id = randomId();

		const opts = {
			method: 'POST',
			body: JSON.stringify({
				id: lane.id,
				name: lane.name,
				limit: lane.limit,
				board: $page.url.href.split('/').pop()
			}),
			headers: {
				'content-type': 'application/json'
			}
		};

		fetch('/api/board/lane', opts)
			.then(() => {
				$lanes.push(lane);
				show = true;
			})
			.catch(console.error);
	}

	function updateLane() {
		const newLane: Lane = {
			id: lane.id.split('-')[0],
			tickets: lane.tickets,
			name: nameInput.value.trim(),
			limit
		};

		if (!newLane.name) return;

		const opts = {
			method: 'PUT',
			body: JSON.stringify({ id: newLane.id, name: newLane.name, limit: newLane.limit }),
			headers: {
				'content-type': 'application/json'
			}
		};

		fetch('/api/board/lane', opts)
			.then(() => $lanes.set(idx, newLane))
			.catch(console.error);

		show = false;
	}

	function deleteLane() {
		const opts = {
			method: 'DELETE',
			body: JSON.stringify({ id: lane.id.split('-')[0] }),
			headers: {
				'content-type': 'application/json'
			}
		};

		fetch('/api/board/lane', opts)
			.then(() => $lanes.delete(idx))
			.catch(console.error);

		show = false;
	}
</script>

{#if isNew}
	<button on:click={createLane} class="new_lane">
		<div class="icon">
			<FaPlus />
		</div>
	</button>
{:else}
	<button on:click={() => (show = true)} class="edit_lane">
		<div class="icon">
			<FaEllipsisH />
		</div>
	</button>
{/if}

<Modal bind:show>
	<div class="header">
		<input bind:this={nameInput} type="text" value={lane.name} />
		<button on:click={deleteLane}>
			<div class="icon">
				<FaTrash />
			</div>
		</button>
	</div>
	<div>
		<span>{$t('ticketlimit')}</span>
		<div class="counter">
			<button on:click={() => (limit = limit >= 1 ? --limit : limit)}>-</button>
			<span>{limit}</span>
			<button on:click={() => (limit = limit <= 9 ? ++limit : limit)}>+</button>
		</div>
	</div>
	<button on:click={updateLane} class="btn btn-primary">{$t('done')}</button>
</Modal>

<style>
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.counter {
		user-select: none;
	}

	.new_lane {
		position: absolute;
		top: 70px;
		float: left;
		margin: 10px;
	}
</style>
