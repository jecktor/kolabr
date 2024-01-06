<script lang="ts">
	import { page } from '$app/stores';
	import { useList } from '$lib/liveblocks';
	import { randomId } from '$utils';
	import { t, translateDate } from '$locales';
	import type { ILane, ITicket } from '$types';

	import * as Avatar from '$components/ui/avatar';
	import * as Dialog from '$components/ui/dialog';
	import { Button } from '$components/ui/button';
	import { Badge } from '$components/ui/badge';
	import { Plus, Trash, Clock } from 'lucide-svelte';
	import ManageAssignees from './ManageAssignees.svelte';
	import ManageTags from './ManageTags.svelte';
	import Tag from './Tag.svelte';

	export let laneIdx: number;
	export let isNew = false;
	export let isLaneFull = false;
	export let boardticket: ITicket = {
		_id: '',
		name: $t('newticket'),
		description: '',
		deadline: '',
		tags: [],
		assignees: []
	};

	const lanes = useList<ILane>('lanes');

	const boardId = $page.url.href.split('/').pop();

	let nameInput: HTMLInputElement;
	let descInput: HTMLTextAreaElement;
	let dueInput: HTMLInputElement;
	let newTicketId: string;
	let show = false;

	let timeout = true;

	$: ticket = $lanes
		? $lanes.get(laneIdx)?.tickets.find((t) => t._id === boardticket._id) ?? boardticket
		: boardticket;
	$: isDue = ticket.deadline && new Date(ticket.deadline) < new Date();
	$: validTicket = $lanes && $lanes.get(laneIdx)?.tickets.find((t) => t._id === boardticket._id);

	function createTicket() {
		if (isLaneFull || !timeout) return;

		timeout = false;
		setTimeout(() => (timeout = true), 500);

		const lane = $lanes.get(laneIdx)!;
		newTicketId = randomId();

		const opts = {
			method: 'POST',
			body: JSON.stringify({
				_id: newTicketId,
				name: ticket.name,
				description: ticket.description,
				deadline: ticket.deadline,
				boardId,
				lane: lane._id.split('-')[0]
			}),
			headers: {
				'content-type': 'application/json'
			}
		};

		fetch('/api/board/ticket', opts)
			.then(() =>
				$lanes.set(laneIdx, {
					...lane,
					tickets: [...lane.tickets, { ...ticket, _id: newTicketId }]
				})
			)
			.catch(console.error);
	}

	function updateTicket() {
		if (!nameInput.value.trim() || nameInput.value.length > 30 || descInput.value.length > 255)
			return;

		const lane = $lanes.get(laneIdx)!;
		const _id = newTicketId ?? ticket._id;

		const newTicket: ITicket = {
			_id,
			name: nameInput.value.trim(),
			description: descInput.value.trim(),
			deadline: dueInput.value,
			tags: lane.tickets.find((t) => t._id === _id)?.tags ?? [],
			assignees: lane.tickets.find((t) => t._id === _id)?.assignees ?? []
		};

		const opts = {
			method: 'PUT',
			body: JSON.stringify({
				...newTicket,
				boardId,
				lane: lane._id.split('-')[0]
			}),
			headers: {
				'content-type': 'application/json'
			}
		};

		fetch('/api/board/ticket', opts)
			.then(() =>
				$lanes.set(laneIdx, {
					...lane,
					tickets: lane.tickets.map((t) => (t._id === _id ? newTicket : t))
				})
			)
			.catch(console.error);

		show = false;
	}

	function deleteTicket() {
		const lane = $lanes.get(laneIdx)!;
		const _id = newTicketId ?? ticket._id;

		const opts = {
			method: 'DELETE',
			body: JSON.stringify({ _id, boardId, lane: lane._id.split('-')[0] }),
			headers: {
				'content-type': 'application/json'
			}
		};

		fetch('/api/board/ticket', opts)
			.then(() =>
				$lanes.set(laneIdx, { ...lane, tickets: lane.tickets.filter((t) => t._id !== _id) })
			)
			.catch(console.error);

		show = false;
	}
</script>

{#if isNew}
	{#if !isLaneFull}
		<Button
			size="icon"
			variant="ghost"
			on:click={createTicket}
			aria-label={$t('newticket')}
			title={$t('newticket')}
		>
			<Plus />
		</Button>
	{/if}
{:else}
	<button
		on:click={() => (show = true)}
		class={`m-0 flex h-full w-full flex-col gap-2 rounded-lg border bg-background p-4 outline-none ${
			isDue
				? 'border-red-700 bg-red-100 text-red-950 hover:border-red-500 dark:bg-red-950 dark:text-red-100'
				: 'hover:border-primary'
		}`}
	>
		{#if ticket.assignees.length > 0}
			<div class="flex -space-x-1">
				{#each ticket.assignees as member (member.email)}
					<Avatar.Root class="inline-block h-5 w-5 bg-background ring-1 ring-background">
						<Avatar.Image src={member.image} alt="avatar" />
						<Avatar.Fallback>{member.name[0]}</Avatar.Fallback>
					</Avatar.Root>
				{/each}
			</div>
		{/if}
		<p class="text-left font-semibold">{ticket.name}</p>
		{#if ticket.description}
			<p
				class={`whitespace-pre-wrap break-all text-left text-sm ${
					isDue ? 'text-red-900 dark:text-red-200' : 'text-muted-foreground'
				}`}
			>
				{ticket.description}
			</p>
		{/if}
		{#if ticket.deadline || ticket.tags.length > 0}
			<div class="flex flex-wrap items-center gap-2">
				{#if ticket.deadline}
					<Badge variant="destructive">
						<Clock class="mr-2 h-3 w-3" />
						<span>{translateDate(ticket.deadline, true)}</span>
					</Badge>
				{/if}
				{#each ticket.tags as tag (tag._id)}
					<Tag {tag} />
				{/each}
			</div>
		{/if}
	</button>
{/if}

{#if validTicket}
	<Dialog.Root bind:open={show}>
		<Dialog.Trigger />
		<Dialog.Content class="no-close max-w-sm text-left">
			<Dialog.Header>
				<Dialog.Title class="flex items-center justify-between">
					<input
						class="mr-4 w-full whitespace-nowrap border-none bg-transparent p-0 text-lg font-semibold leading-[0] outline-none selection:bg-muted"
						bind:this={nameInput}
						maxlength="30"
						type="text"
						value={ticket.name}
					/>
					<Button
						class="min-w-10"
						on:click={deleteTicket}
						variant="ghost"
						size="icon"
						aria-label={$t('deletes')}
					>
						<Trash class="h-5 w-5" />
					</Button>
				</Dialog.Title>
				<div class="!my-4 flex flex-col gap-6 whitespace-nowrap">
					<div class="flex flex-col gap-3">
						<span class="text-sm leading-none">{$t('desc')}</span>
						<textarea
							class="flex h-fit min-h-36 resize-none rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
							bind:this={descInput}
							maxlength="255"
							value={ticket.description}
						/>
					</div>

					<div class="flex flex-col gap-3">
						<span class="text-sm leading-none">{$t('due')}</span>
						<input
							class="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
							bind:this={dueInput}
							type="datetime-local"
							value={ticket.deadline}
						/>
					</div>
					<div class="flex flex-col gap-3">
						<span class="text-sm leading-none">{$t('assignees')}</span>
						<ManageAssignees
							ticketAssignees={ticket.assignees}
							ticketId={newTicketId ?? ticket._id}
							{laneIdx}
						/>
					</div>
					<div class="flex flex-col gap-3">
						<span class="text-sm leading-none">{$t('labels')}</span>
						<ManageTags ticketTags={ticket.tags} ticketId={newTicketId ?? ticket._id} {laneIdx} />
					</div>
				</div>
				<Dialog.Footer>
					<Button on:click={updateTicket}>{$t('done')}</Button>
				</Dialog.Footer>
			</Dialog.Header>
		</Dialog.Content>
	</Dialog.Root>
{/if}
