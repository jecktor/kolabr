<script lang="ts">
	import { useList } from '$lib/liveblocks';
	import { randomId } from '$utils';
	import { t, translateDate } from '$locales';
	import type { Lane, Ticket } from '$types';

	import FaAlignLeft from 'svelte-icons/fa/FaAlignLeft.svelte';
	import FaClock from 'svelte-icons/fa/FaClock.svelte';
	import FaTrash from 'svelte-icons/fa/FaTrash.svelte';
	import FaPlus from 'svelte-icons/fa/FaPlus.svelte';
	import FaTags from 'svelte-icons/fa/FaTags.svelte';
	import ManageTags from './ManageTags.svelte';
	import Modal from './Modal.svelte';
	import Tag from './Tag.svelte';

	export let laneIdx: number;
	export let isNew = false;
	export let isLaneFull = false;
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
		if (isLaneFull) return;

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
	{#if !isLaneFull}
		<button
			on:click={createTicket}
			class="new_ticket"
			aria-label={$t('newticket')}
			title={$t('newticket')}
		>
			<div class="icon">
				<FaPlus />
			</div>
		</button>
	{/if}
{:else}
	<button on:click={() => (show = true)} class="ticket_btn">
		<p class="d">{ticket.name}</p>
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
		<input bind:this={nameInput} type="text" value={ticket.name} class="form-control a" />
		<button on:click={deleteTicket}>
			<div class="icon">
				<FaTrash />
			</div>
		</button>
	</div>
	<div class="d-flex align-items-center gap-5 space1">
		<div class="d-flex gap-3">
			<div class="icon">
				<FaAlignLeft />
			</div>
			<span class="b">{$t('desc')}</span>
		</div>
		<input bind:this={descInput} type="text" value={ticket.description} class="c form-control" />
	</div>

	<div class="d-flex align-items-center gap-5 space1">
		<div class="d-flex gap-3">
			<div class="icon">
				<FaClock />
			</div>
			<span class="b">{$t('due')}</span>
		</div>
		<input
			bind:this={dueInput}
			type="datetime-local"
			value={ticket.deadline}
			class="c form-control"
		/>
	</div>
	<div class="d-flex align-items-center gap-5 space1">
		<div class="d-flex gap-3">
			<div class="icon">
				<FaTags />
			</div>
			<span class="b">{$t('labels')}</span>
		</div>
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
		background: #ffffff;
		border: none;
		box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.08);
		border-radius: 8px;
	}
	.icon {
		color: var(--base-500);
	}
	.new_ticket {
		background-color: var(--base-200);
		outline: none;
		border: none;
		background: none;
	}
	.space1 {
		margin-bottom: 5%;
	}
	.a {
		font-family: 'Inter';
		font-style: normal;
		font-weight: 700;
		font-size: 32px;
		line-height: 39px;
		color: var(--base-400);
		border: none;
		box-shadow: none;
	}
	.b {
		font-family: 'Inter';
		font-style: normal;
		font-weight: 400;
		font-size: 16px;
		line-height: 19px;
		letter-spacing: -0.2px;
		color: var(--base-600);
		white-space: nowrap;
	}
	.c.form-control {
		height: 30px;
		width: 100%;
		font-size: 1.6rem;
	}
	.c.form-control:focus {
		color: var(--base-600);
	}
	.d {
		font-family: 'Inter';
		font-style: normal;
		font-weight: 600;
		font-size: 16px;
		line-height: 19px;
		letter-spacing: -0.2px;
		color: #212121;
	}
	.form-control {
		padding: 0;
	}
	.header button {
		border: none;
		background: none;
		text-decoration: none;
		cursor: pointer;
	}
	.form-control {
		color: var(--base-600);
	}
	@media (max-width: 768px) {
		.a {
			font-size: 12px;
		}
		.ticket_btn {
			padding: 8px;
		}
		.d {
			font-size: 12px;
		}
	}
	.form-control:focus {
		color: var(--base-400);
	}
</style>
