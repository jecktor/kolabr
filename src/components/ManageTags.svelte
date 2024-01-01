<script lang="ts">
	import { page } from '$app/stores';
	import { useList } from '$lib/liveblocks';
	import { randomId } from '$utils';
	import { t } from '$locales';
	import type { ILane, ITag } from '$types';

	import { Button } from '$components/ui/button';
	import { Plus, Trash } from 'lucide-svelte';
	import Tag from './Tag.svelte';

	export let ticketTags: ITag[];
	export let laneIdx: number;
	export let ticketId: string;

	const lanes = useList<ILane>('lanes');
	const boardTags = useList<ITag>('tags');

	const boardId = $page.url.href.split('/').pop();

	let tagInput: HTMLInputElement;
	let isFocused = false;

	$: tags = $lanes
		? $lanes.get(laneIdx)?.tickets.find((ticket) => ticket._id === ticketId)?.tags ?? []
		: ticketTags;

	function createTag() {
		if (!tagInput.value.trim() || tagInput.value.length > 15) return;

		const newTag: ITag = {
			_id: randomId(),
			name: tagInput.value.trim(),
			color: '#000000'
		};

		tagInput.value = '';

		const lane = $lanes.get(laneIdx)!;

		const opts = {
			method: 'POST',
			body: JSON.stringify({
				...newTag,
				tickets: [ticketId],
				ticketId,
				laneId: lane._id.split('-')[0],
				boardId
			}),
			headers: {
				'content-type': 'application/json'
			}
		};

		fetch('/api/board/tag', opts)
			.then(() => {
				$boardTags.push({ ...newTag, tickets: [ticketId] });
				$lanes.set(laneIdx, {
					...lane,
					tickets: lane.tickets.map((ticket) =>
						ticket._id === ticketId ? { ...ticket, tags: [...ticket.tags, newTag] } : ticket
					)
				});
				tags = [...tags, newTag];
			})
			.catch(console.error);
	}

	function addTag(_id: string, name: string, color: string) {
		if (tags.find((tag: ITag) => tag._id === _id)) return;

		const lane = $lanes.get(laneIdx)!;

		const tickets = $boardTags.find((tag) => tag._id === _id)!.tickets!;

		const newTag: ITag = { _id, name, color };

		const opts = {
			method: 'PATCH',
			body: JSON.stringify({
				...newTag,
				tickets: [...tickets, ticketId],
				ticketId,
				laneId: lane._id.split('-')[0],
				boardId
			}),
			headers: {
				'content-type': 'application/json'
			}
		};

		fetch('/api/board/tag', opts)
			.then(() => {
				$boardTags.set(
					$boardTags.findIndex((tag) => tag._id === _id),
					{ ...newTag, tickets: [...tickets, ticketId] }
				);
				$lanes.set(laneIdx, {
					...lane,
					tickets: lane.tickets.map((ticket) =>
						ticket._id === ticketId ? { ...ticket, tags: [...ticket.tags, newTag] } : ticket
					)
				});
				tags = [...tags, newTag];
			})
			.catch(console.error);
	}

	function removeTag(_id: string) {
		const lane = $lanes.get(laneIdx)!;

		const opts = {
			method: 'PUT',
			body: JSON.stringify({
				_id,
				ticketId,
				laneId: lane._id.split('-')[0],
				boardId
			}),
			headers: {
				'content-type': 'application/json'
			}
		};

		fetch('/api/board/tag', opts)
			.then(() => {
				const tag = $boardTags.find((tag) => tag._id === _id)!;

				$boardTags.set(
					$boardTags.findIndex((tag) => tag._id === _id),
					{ ...tag, tickets: tag!.tickets!.filter((t) => t !== ticketId) }
				);
				$lanes.set(laneIdx, {
					...lane,
					tickets: lane.tickets.map((ticket) =>
						ticket._id === ticketId
							? { ...ticket, tags: ticket.tags.filter((tag: ITag) => tag._id !== _id) }
							: ticket
					)
				});

				tags = tags.filter((tag: ITag) => tag._id !== _id);
			})
			.catch(console.error);
	}

	function deleteTag(_id: string) {
		const lane = $lanes.get(laneIdx)!;

		const tickets = $boardTags.find((tag) => tag._id === _id)!.tickets;

		const opts = {
			method: 'DELETE',
			body: JSON.stringify({ _id, tickets, ticketId, laneId: lane._id.split('-')[0], boardId }),
			headers: {
				'content-type': 'application/json'
			}
		};

		fetch('/api/board/tag', opts)
			.then(() => {
				$boardTags.delete($boardTags.findIndex((tag) => tag._id === _id));
				$lanes.forEach((lane, idx) => {
					$lanes.set(idx, {
						...lane,
						tickets: lane.tickets.map((ticket) => ({
							...ticket,
							tags: ticket.tags.filter((tag: ITag) => tag._id !== _id)
						}))
					});
				});
				tags = tags.filter((tag: ITag) => tag._id !== _id);
			})
			.catch(console.error);
	}
</script>

<div class="relative">
	<div class="flex items-center justify-between gap-2">
		<input
			class="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
			maxlength="15"
			placeholder={$t('newlabel')}
			on:focus={() => (isFocused = true)}
			on:blur={() => setTimeout(() => (isFocused = false), 200)}
			bind:this={tagInput}
		/>
		<Button
			class="min-w-10"
			aria-label={$t('newlabel')}
			title={$t('newlabel')}
			variant="secondary"
			size="icon"
			on:click={createTag}
		>
			<Plus class="h-4 w-4" />
		</Button>
	</div>
	<div class="mt-3 flex flex-wrap gap-2">
		{#each tags as { _id, name } (_id)}
			<Tag id={_id} {name} isDeletable onDelete={() => removeTag(_id)} />
		{/each}
	</div>
	{#if isFocused && $boardTags && tags.length < $boardTags.length}
		<div class="absolute top-11 flex w-72 flex-col gap-2 rounded-md border bg-background px-3 py-2">
			{#each [...$boardTags] as { _id, name, color } (_id)}
				{#if !tags.find((tag) => tag._id === _id)}
					<div class="flex items-center justify-between">
						<Tag id={_id} {name} />
						<div class="flex gap-1">
							<Button
								variant="ghost"
								size="icon"
								class="h-8 w-8"
								aria-label={$t('newlabel')}
								title={$t('newlabel')}
								on:click={() => addTag(_id, name, color)}
							>
								<Plus class="h-4 w-4" />
							</Button>
							<Button
								variant="ghost"
								size="icon"
								class="h-8 w-8"
								aria-label={$t('deletes')}
								title={$t('deletes')}
								on:click={() => deleteTag(_id)}
							>
								<Trash class="h-4 w-4" />
							</Button>
						</div>
					</div>
				{/if}
			{/each}
		</div>
	{/if}
</div>
