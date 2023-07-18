<script lang="ts">
	import { useList } from '$lib/liveblocks';
	import { randomId } from '$utils';
	import { t, translateDate } from '$locales';
	import type { Lane, Ticket } from '$types';

	import FaPlus from 'svelte-icons/fa/FaPlus.svelte';
	import FaTrash from 'svelte-icons/fa/FaTrash.svelte';
	import ManageTags from './ManageTags.svelte';
	import Modal from './Modal.svelte';
	import Tag from './Tag.svelte';

	export let laneIdx: number;
	export let isNew = false;
	export let boardticket: Ticket = {
		id: '',
		name: $t('newticket'),
		description: '',
		deadline: '',
		tags: []
	};

	const lanes = useList<Lane>('lanes');

	let nameInput: HTMLInputElement;
	let descInput: HTMLInputElement;
	let dueInput: HTMLInputElement;
	let newTicketId: string;
	let show = false;

	$: ticket = $lanes
		? $lanes.get(laneIdx)?.tickets.find((t) => t.id === boardticket.id) ?? boardticket
		: boardticket;

	function createTicket() {
		const lane = $lanes.get(laneIdx)!;
		newTicketId = randomId();

		const opts = {
			method: 'POST',
			body: JSON.stringify({
				id: newTicketId,
				name: ticket.name,
				description: ticket.description,
				deadline: ticket.deadline,
				lane: lane.id.split('-')[0]
			}),
			headers: {
				'content-type': 'application/json'
			}
		};

		fetch('/api/board/ticket', opts)
			.then(() => {
				$lanes.set(laneIdx, {
					...lane,
					tickets: [...lane.tickets, { ...ticket, id: newTicketId }]
				});
				show = true;
			})
			.catch(console.error);
	}

	function updateTicket() {
		const lane = $lanes.get(laneIdx)!;
		const id = newTicketId ?? ticket.id;

		const newTicket: Ticket = {
			id,
			name: nameInput.value.trim(),
			description: descInput.value.trim(),
			deadline: dueInput.value,
			tags: lane.tickets.find((t) => t.id === id)?.tags ?? []
		};

		if (!newTicket.name) return;

		const opts = {
			method: 'PUT',
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

		fetch('/api/board/ticket', opts)
			.then(() =>
				$lanes.set(laneIdx, {
					...lane,
					tickets: lane.tickets.map((t) => (t.id === id ? newTicket : t))
				})
			)
			.catch(console.error);

		show = false;
	}

	function deleteTicket() {
		const lane = $lanes.get(laneIdx)!;
		const id = newTicketId ?? ticket.id;

		const opts = {
			method: 'DELETE',
			body: JSON.stringify({ id }),
			headers: {
				'content-type': 'application/json'
			}
		};

		fetch('/api/board/ticket', opts)
			.then(() =>
				$lanes.set(laneIdx, { ...lane, tickets: lane.tickets.filter((t) => t.id !== id) })
			)
			.catch(console.error);

		show = false;
	}
</script>

{#if isNew}
	<button on:click={createTicket} class="editTicket">
		<div class="icon">
			<FaPlus />
		</div>
	</button>
{:else}
	<button on:click={() => (show = true)} class="ticket_btn">
		<p class="a">{ticket.name}</p>
		{#if ticket.description}
			<p>{ticket.description}</p>
		{/if}
		<div>
			{#if ticket.deadline}
				<span>{translateDate(ticket.deadline)}</span>
			{/if}
			{#each ticket.tags as { id, name } (id)}
				<Tag {id} {name} />
			{/each}
		</div>
	</button>
{/if}

<Modal bind:show>
	<div class="header space1">
		<input bind:this={nameInput} type="text" value={ticket.name} class="form-control b" />
		<button on:click={deleteTicket}>
			<div class="icon">
				<FaTrash />
			</div>
		</button>
	</div>
	<div class="container1 space1">
		<span class="c space2">{$t('desc')}</span>
		<input bind:this={descInput} type="text" value={ticket.description} />
	</div>
	<div class="container1 space1">
		<span class="c space2">{$t('due')}</span>
		<input bind:this={dueInput} type="datetime-local" value={ticket.deadline} />
	</div>
	<div class="container1 space1">
		<span class="c space2">{$t('labels')}</span>
		<ManageTags ticketTags={ticket.tags} ticketId={newTicketId ?? ticket.id} {laneIdx} />
	</div>
	<button on:click={updateTicket} class="btn btn-primary">
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
		margin: 0;
		box-sizing: border-box;
		align-items: flex-start;
		padding: 16px;
		gap: 8px;
		background: #FFFFFF;
		border: none;
		box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
		border-radius: 8px;
	}
	.editTicket {
		background-color: #F8F8F8;
		border: none;
	}
	.icon {
		color: #7A7A7A;
	}
	.space1 {
		margin-bottom: 5%;
	}
	.space2 {
		margin-right: 3%;
	}
	.form-control {
		padding: 0;
	}
	.a {
		font-family: 'Inter';
		font-style: normal;
		font-weight: 600;
		font-size: 16px;
		line-height: 19px;
		letter-spacing: -0.2px;
		color: #212121;
	}
	.b {
		font-family: 'Inter';
		font-style: normal;
		font-weight: 700;
		font-size: 32px;
		line-height: 39px;
		color: #A6A6A6;
		border: none;
		box-shadow: none;
	}
	.c {
		font-family: 'Inter';
		font-style: normal;
		font-weight: 400;
		font-size: 16px;
		line-height: 19px;
		letter-spacing: -0.2px;
		color: #4D4D4D;
	}
	.container1 {
		display: flex;
		align-items: center;
	}
	.header button {
		border: none;
		background: none;
		text-decoration: none;
		cursor: pointer;
	}
	.form-control {
    	color: #4D4D4D; 
  	}
  	.form-control:focus {
    	color: #A6A6A6; 
  	}
	@media (max-width: 768px) {
		.a {
			font-size: 12px;
			align-content: center;
		}
		.ticket_btn {
			padding: 8px;
		}
	}
</style>
