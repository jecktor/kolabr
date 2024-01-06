<script lang="ts">
	import { page } from '$app/stores';
	import { useList } from '$lib/liveblocks';
	import { randomId, tagColors } from '$utils';
	import { t } from '$locales';
	import type { ILane, ITag } from '$types';

	import * as Popover from '$components/ui/popover';
	import { Button } from '$components/ui/button';
	import { Plus, Trash, Pencil, Check } from 'lucide-svelte';
	import Tag from './Tag.svelte';

	export let ticketTags: ITag[];
	export let laneIdx: number;
	export let ticketId: string;

	const lanes = useList<ILane>('lanes');
	const boardTags = useList<ITag>('tags');

	const boardId = $page.url.href.split('/').pop();

	let tagInput: HTMLInputElement;
	let editTagInput: HTMLInputElement;

	let editTagColor: string;

	let inputFocused = false;
	let tagPopupFocused = false;

	let timeout = true;

	$: tags = $lanes
		? $lanes.get(laneIdx)?.tickets.find((ticket) => ticket._id === ticketId)?.tags ?? []
		: ticketTags;

	function createTag() {
		if (!timeout || !tagInput.value.trim() || tagInput.value.length > 15) return;

		timeout = false;
		setTimeout(() => (timeout = true), 500);

		const newTag: ITag = {
			_id: randomId(),
			name: tagInput.value.trim(),
			color: tagColors[Math.floor(Math.random() * tagColors.length)]
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
		if (!timeout || tags.find((tag: ITag) => tag._id === _id)) return;

		timeout = false;
		setTimeout(() => (timeout = true), 500);

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

	function updateTag(_id: string) {
		if (!editTagInput.value.trim() || editTagInput.value.length > 15) return;

		const updatedTag = {
			...$boardTags.find((tag) => tag._id === _id)!,
			name: editTagInput.value.trim(),
			color: editTagColor
		};

		const opts = {
			method: 'PUT',
			body: JSON.stringify({
				...updatedTag,
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
					updatedTag
				);
				$lanes.forEach((lane, idx) => {
					$lanes.set(idx, {
						...lane,
						tickets: lane.tickets.map((ticket) => ({
							...ticket,
							tags: ticket.tags.map((tag: ITag) => (tag._id === _id ? updatedTag : tag))
						}))
					});
				});
				tags = tags.map((tag: ITag) => (tag._id === _id ? updatedTag : tag));
			})
			.catch(console.error);
	}

	function removeTag(_id: string) {
		const lane = $lanes.get(laneIdx)!;

		const opts = {
			method: 'DELETE',
			body: JSON.stringify({
				_id,
				ticketId,
				laneId: lane._id.split('-')[0],
				boardId,
				remove: true
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
		const tickets = $boardTags.find((tag) => tag._id === _id)!.tickets;

		const opts = {
			method: 'DELETE',
			body: JSON.stringify({
				_id,
				tickets,
				boardId,
				remove: false
			}),
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
			on:focus={() => (inputFocused = true)}
			on:blur={() => setTimeout(() => (inputFocused = false), 200)}
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
		{#each tags as tag (tag._id)}
			<Tag {tag} deletable onDelete={() => removeTag(tag._id)}>
				<Popover.Root>
					<Popover.Trigger>
						<button
							class="flex items-center border-none bg-transparent outline-none"
							on:click={() => (editTagColor = tag.color)}
						>
							<Pencil class="h-3 w-3" />
						</button>
					</Popover.Trigger>
					<Popover.Content class="flex w-48 flex-col gap-4">
						<input
							class="mr-4 w-full whitespace-nowrap border-none bg-transparent p-0 text-center font-semibold leading-[0] outline-none selection:bg-muted"
							maxlength="15"
							type="text"
							value={tag.name}
							bind:this={editTagInput}
						/>
						<div class="grid grid-cols-3 place-items-center gap-y-4">
							{#each tagColors as tagColor (tagColor)}
								<button
									style={`background-color: ${tagColor}; outline-color: ${tagColor};`}
									class={`grid h-8 w-8 place-items-center rounded-full ${
										tagColor === editTagColor ? 'border-2 border-background outline' : ''
									}`}
									on:click={() => (editTagColor = tagColor)}
								>
									{#if tagColor === editTagColor}
										<Check class="h-4 w-4" />
									{/if}
								</button>
							{/each}
						</div>
						<Button on:click={() => updateTag(tag._id)}>{$t('done')}</Button>
					</Popover.Content>
				</Popover.Root>
			</Tag>
		{/each}
	</div>
	{#if (inputFocused || tagPopupFocused) && $boardTags && tags.length < $boardTags.length}
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div
			on:mouseenter={() => (tagPopupFocused = true)}
			on:mouseleave={() => (tagPopupFocused = false)}
			class="absolute top-11 flex w-72 flex-col gap-2 rounded-md border bg-background px-3 py-2"
		>
			{#each [...$boardTags] as boardTag (boardTag._id)}
				{#if !tags.find((t) => t._id === boardTag._id)}
					<div class="flex items-center justify-between">
						<Tag tag={boardTag} />
						<div class="flex gap-1">
							<Button
								variant="ghost"
								size="icon"
								class="h-8 w-8"
								aria-label={$t('newlabel')}
								title={$t('newlabel')}
								on:click={() => addTag(boardTag._id, boardTag.name, boardTag.color)}
							>
								<Plus class="h-4 w-4" />
							</Button>

							<Popover.Root>
								<Popover.Trigger>
									<Button
										variant="ghost"
										size="icon"
										class="h-8 w-8"
										aria-label={$t('edit')}
										title={$t('edit')}
										on:click={() => (editTagColor = boardTag.color)}
									>
										<Pencil class="h-4 w-4" />
									</Button>
								</Popover.Trigger>
								<Popover.Content class="flex w-48 flex-col gap-4">
									<input
										class="mr-4 w-full whitespace-nowrap border-none bg-transparent p-0 text-center font-semibold leading-[0] outline-none selection:bg-muted"
										maxlength="15"
										type="text"
										value={boardTag.name}
										bind:this={editTagInput}
									/>
									<div class="grid grid-cols-3 place-items-center gap-y-4">
										{#each tagColors as tagColor (tagColor)}
											<button
												style={`background-color: ${tagColor}; outline-color: ${tagColor};`}
												class={`grid h-8 w-8 place-items-center rounded-full ${
													tagColor === editTagColor ? 'border-2 border-background outline' : ''
												}`}
												on:click={() => (editTagColor = tagColor)}
											>
												{#if tagColor === editTagColor}
													<Check class="h-4 w-4" />
												{/if}
											</button>
										{/each}
									</div>
									<Button on:click={() => updateTag(boardTag._id)}>{$t('done')}</Button>
								</Popover.Content>
							</Popover.Root>

							<Button
								variant="ghost"
								size="icon"
								class="h-8 w-8"
								aria-label={$t('deletes')}
								title={$t('deletes')}
								on:click={() => deleteTag(boardTag._id)}
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
