<script lang="ts">
	import { page } from '$app/stores';
	import { useList } from '$lib/liveblocks';
	import { randomId } from '$utils';
	import { t } from '$locales';
	import type { ILane } from '$types';

	import * as Dialog from '$components/ui/dialog';
	import { Button } from '$components/ui/button';
	import { Plus, MoreHorizontal, Trash } from 'lucide-svelte';

	export let idx: number;
	export let isNew = false;
	export let lane: ILane = {
		_id: '',
		name: $t('newlane'),
		limit: 0,
		tickets: []
	};

	const lanes = useList<ILane>('lanes');

	const boardId = $page.url.href.split('/').pop();

	let nameInput: HTMLInputElement;
	let show = false;

	let timeout = true;

	$: name = $lanes ? $lanes.get(idx)?.name ?? lane.name : lane.name;
	$: limit = $lanes ? $lanes.get(idx)?.limit ?? lane.limit : lane.limit;
	$: validLane = !isNew && $lanes && $lanes.get(idx);

	function createLane() {
		if (!timeout) return;

		timeout = false;
		setTimeout(() => (timeout = true), 500);

		lane._id = randomId();

		const opts = {
			method: 'POST',
			body: JSON.stringify({
				_id: lane._id,
				name: lane.name,
				limit: lane.limit,
				boardId
			}),
			headers: {
				'content-type': 'application/json'
			}
		};

		fetch('/api/board/lane', opts)
			.then(() => $lanes.push({ ...lane, _id: `${lane._id}-${$lanes.length}` }))
			.catch(console.error);
	}

	function updateLane() {
		if (!nameInput.value.trim() || nameInput.value.length > 15) return;

		const newLane: ILane = {
			_id: lane._id.split('-')[0],
			tickets: lane.tickets,
			name: nameInput.value.trim(),
			limit
		};

		const opts = {
			method: 'PUT',
			body: JSON.stringify({
				_id: newLane._id,
				boardId,
				name: newLane.name,
				limit: newLane.limit
			}),
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
			body: JSON.stringify({ _id: lane._id.split('-')[0], boardId }),
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
	<Button
		size="icon"
		variant="outline"
		on:click={createLane}
		class="mx-2 mt-[1.5rem]"
		aria-label={$t('newlane')}
		title={$t('newlane')}
	>
		<Plus />
	</Button>
{:else}
	<Button
		size="icon"
		variant="ghost"
		on:click={() => (show = true)}
		aria-label={$t('change')}
		title={$t('change')}
	>
		<MoreHorizontal />
	</Button>
{/if}

{#if validLane}
	<Dialog.Root bind:open={show}>
		<Dialog.Trigger />
		<Dialog.Content class="no-close max-w-sm text-left">
			<Dialog.Header>
				<Dialog.Title class="flex items-center justify-between">
					<input
						class="mr-4 w-full whitespace-nowrap border-none bg-transparent p-0 text-lg font-semibold leading-[0] outline-none selection:bg-muted"
						bind:this={nameInput}
						maxlength="15"
						type="text"
						value={name}
					/>
					<Button
						class="min-w-10"
						on:click={deleteLane}
						variant="ghost"
						size="icon"
						aria-label={$t('deletes')}
					>
						<Trash class="h-5 w-5" />
					</Button>
				</Dialog.Title>
				<div class="!my-4 flex items-center gap-4 whitespace-nowrap">
					<span class="text-sm leading-none">{$t('ticketlimit')}</span>
					<div
						class="flex h-10 w-32 items-center justify-between whitespace-nowrap rounded-md border"
					>
						<Button
							class="text-xl"
							variant="ghost"
							on:click={() => (limit = limit >= 1 ? --limit : limit)}>-</Button
						>
						<span>{limit}</span>
						<Button
							class="text-xl"
							variant="ghost"
							on:click={() => (limit = limit <= 9 ? ++limit : limit)}>+</Button
						>
					</div>
				</div>
				<Dialog.Footer>
					<Button on:click={updateLane}>{$t('done')}</Button>
				</Dialog.Footer>
			</Dialog.Header>
		</Dialog.Content>
	</Dialog.Root>
{/if}
