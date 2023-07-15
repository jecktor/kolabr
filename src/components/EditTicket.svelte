<script lang="ts">
	import { useList } from '$lib/liveblocks';
	import { randomId } from '$utils';
	import { t, translateDate } from '$locales';
	import type { Lane, Ticket } from '$types';

	import FaPlus from 'svelte-icons/fa/FaPlus.svelte';
	import FaTrash from 'svelte-icons/fa/FaTrash.svelte';
	import Modal from './Modal.svelte';

	export let ticket: Ticket;
	export let laneIdx: number;
	export let isNew = false;

	const lanes = useList<Lane>('lanes');

	let nameInput: HTMLInputElement;
	let descInput: HTMLInputElement;
	let dueInput: HTMLInputElement;
	let show = false;

	function createTicket() {
		const lane = $lanes.get(laneIdx)!;
		const newTicket: Ticket = {
			id: randomId(),
			name: nameInput.value.trim(),
			description: descInput.value.trim(),
			deadline: dueInput.value,
			tags: []
		};

		if (!newTicket.name) return;

		const opts = {
			method: 'POST',
			body: JSON.stringify({
				id: newTicket.id,
				name: newTicket.name,
				description: newTicket.description,
				deadline: newTicket.deadline,
				lane: lane.id.split('-')[0]
			}),
			headers: {
				'content-type': 'application/json'
			}
		};

		fetch('/api/board/ticket/create', opts)
			.then(() => $lanes.set(laneIdx, { ...lane, tickets: [...lane.tickets, newTicket] }))
			.catch(console.error);

		show = false;
	}

	function updateTicket() {
		const lane = $lanes.get(laneIdx)!;
		const newTicket: Ticket = {
			id: ticket.id,
			name: nameInput.value.trim(),
			description: descInput.value.trim(),
			deadline: dueInput.value,
			tags: []
		};

		if (!newTicket.name) return;

		const opts = {
			method: 'POST',
			body: JSON.stringify({
				id: newTicket.id,
				name: newTicket.name,
				description: newTicket.description,
				deadline: newTicket.deadline,
				lane: lane.id.split('-')[0]
			}),
			headers: {
				'content-type': 'application/json'
			}
		};

		fetch('/api/board/ticket/update', opts)
			.then(() =>
				$lanes.set(laneIdx, {
					...lane,
					tickets: lane.tickets.map((t) => (t.id === ticket.id ? newTicket : t))
				})
			)
			.catch(console.error);

		show = false;
	}

	function deleteTicket() {
		const lane = $lanes.get(laneIdx)!;
		const opts = {
			method: 'POST',
			body: JSON.stringify({ id: ticket.id }),
			headers: {
				'content-type': 'application/json'
			}
		};

		fetch('/api/board/ticket/delete', opts)
			.then(() =>
				$lanes.set(laneIdx, { ...lane, tickets: lane.tickets.filter((t) => t.id !== ticket.id) })
			)
			.catch(console.error);

		show = false;
	}
</script>

{#if isNew}
	<button on:click={() => (show = true)} class="editTicket">
		<div class="icon">
			<FaPlus />
		</div>
	</button>
{:else}
	<button on:click={() => (show = true)} class="ticket_btn">
		<p>{ticket.name}</p>
		{#if ticket.description}
			<p>{ticket.description}</p>
		{/if}
		<div>
			{#if ticket.deadline}
				<span>{translateDate(ticket.deadline)}</span>
			{/if}
			{#each ticket.tags as { id, name } (id)}
				<span>{name}</span>
			{/each}
		</div>
	</button>
{/if}

<Modal bind:show>
	<div class="header">
		<input bind:this={nameInput} type="text" value={ticket.name} />
		{#if !isNew}
			<button on:click={deleteTicket}>
				<div class="icon">
					<FaTrash />
				</div>
			</button>
		{/if}
	</div>
	<div>
		<span>{$t('desc')}</span>
		<input bind:this={descInput} type="text" value={ticket.description} />
	</div>
	<div>
		<span>{$t('due')}</span>
		<input bind:this={dueInput} type="datetime-local" value={ticket.deadline} />
	</div>
	<button on:click={isNew ? createTicket : updateTicket} class="btn btn-primary">
		{$t('done')}
	</button>
</Modal>

<style>
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.ticket_btn {
		display: flex;
		width: 100%;
		height: 100%;
		padding: 0;
		margin: 0;
		border: none;
		outline: none;
		background: none;
	}

	.editTicket {
		background: none;
	}
</style>
