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

	export let lane: Lane;
	export let idx = -1;
	export let isNew = false;

	const lanes = useList<Lane>('lanes');

	let nameInput: HTMLInputElement;
	let show = false;

	$: limit = lane.limit;

	function createLane() {
		const newLane: Lane = {
			id: randomId(),
			tickets: lane.tickets,
			name: nameInput.value,
			limit
		};

		const opts = {
			method: 'POST',
			body: JSON.stringify({
				id: newLane.id,
				name: newLane.name,
				limit: newLane.limit,
				board: $page.url.href.split('/').pop()
			}),
			headers: {
				'content-type': 'application/json'
			}
		};

		fetch('/api/board/lane/create', opts)
			.then(() => $lanes.push(newLane))
			.catch(console.error);

		show = false;
	}

	function updateLane() {
		const newLane: Lane = {
			id: lane.id.split('-')[0],
			tickets: lane.tickets,
			name: nameInput.value,
			limit
		};

		const opts = {
			method: 'POST',
			body: JSON.stringify({ id: newLane.id, name: newLane.name, limit: newLane.limit }),
			headers: {
				'content-type': 'application/json'
			}
		};

		fetch('/api/board/lane/update', opts)
			.then(() => $lanes.set(idx, newLane))
			.catch(console.error);

		show = false;
	}

	function deleteLane() {
		const opts = {
			method: 'POST',
			body: JSON.stringify({ id: lane.id.split('-')[0] }),
			headers: {
				'content-type': 'application/json'
			}
		};

		fetch('/api/board/lane/delete', opts)
			.then(() => $lanes.delete(idx))
			.catch(console.error);

		show = false;
	}
</script>

<button on:click={() => (show = true)} class={isNew ? 'newLane' : 'editLane'}>
	<div class="icon">
		{#if isNew}
			<FaPlus />
		{:else}
			<FaEllipsisH />
		{/if}
	</div>
</button>

<Modal bind:show>
	<div class="header">
		<input bind:this={nameInput} type="text" value={lane.name} />
		{#if !isNew}
			<button on:click={deleteLane}>
				<div class="icon">
					<FaTrash />
				</div>
			</button>
		{/if}
	</div>
	<div>
		<span>{$t('ticketlimit')}</span>
		<div class="counter">
			<button on:click={() => (limit = limit >= 1 ? --limit : limit)}>-</button>
			<span>{limit}</span>
			<button on:click={() => (limit = limit <= 9 ? ++limit : limit)}>+</button>
		</div>
	</div>
	<button on:click={isNew ? createLane : updateLane} class="btn btn-primary">{$t('done')}</button>
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

	.newLane {
		position: absolute;
		top: 70px;
		float: left;
		margin: 10px;
	}
</style>
