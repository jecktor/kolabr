<script lang="ts">
	import { page } from '$app/stores';
	import { useList } from '$lib/liveblocks';
	import { randomId } from '$utils';
	import { t } from '$locales';

	import FaPlus from 'svelte-icons/fa/FaPlus.svelte';
	import FaTrash from 'svelte-icons/fa/FaTrash.svelte';
	import Tag from './Tag.svelte';
	import type { ILane, ITag } from '$types';

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

<div class="manage_tasks a">
	<div class="add_tag">
		<input
			class="i"
			type="text"
			maxlength="15"
			placeholder={$t('newlabel')}
			on:focus={() => (isFocused = true)}
			on:blur={() => setTimeout(() => (isFocused = false), 200)}
			bind:this={tagInput}
		/>
		<button class="add" on:click={createTag}>
			<div class="icon">
				<FaPlus />
			</div>
		</button>
	</div>
	<div class="tags">
		{#each tags as { _id, name } (_id)}
			<Tag id={_id} {name} isDeletable onDelete={() => removeTag(_id)} />
		{/each}
	</div>
	{#if isFocused && $boardTags && tags.length < $boardTags.length}
		<div class="board_tags a">
			{#each [...$boardTags] as { _id, name, color } (_id)}
				{#if !tags.find((tag) => tag._id === _id)}
					<div class="tag-container">
						<div class="tag-name">
							<Tag id={_id} {name} />
						</div>
						<div class="buttons">
							<button class="add" on:click={() => addTag(_id, name, color)}>
								<div class="icon">
									<FaPlus />
								</div>
							</button>
							<button class="delete" on:click={() => deleteTag(_id)}>
								<div class="icon">
									<FaTrash />
								</div>
							</button>
						</div>
					</div>
				{/if}
			{/each}
		</div>
	{/if}
</div>

<style>
	.manage_tasks {
		position: relative;
	}

	.board_tags {
		position: absolute;
		top: 35px;
		display: flex;
		flex-direction: column;
		gap: 10px;
		width: 250px;
		border-radius: 6px;
		border: 1px solid var(--base-300);
		padding: 10px;
		background: var(--base-100);
	}

	.buttons {
		display: flex;
		align-items: center;
	}

	.tags {
		display: flex;
		flex-wrap: wrap;
		width: 300px;
		gap: 5px;
		margin-top: 10px;
	}

	.tag-name {
		flex: 1;
		display: flex;
		align-items: center;
		justify-content: left;
	}

	.tag-container button {
		border: none;
		background: none;
		text-decoration: none;
		cursor: pointer;
		font-size: 28px;
		color: var(--base-500);
	}

	.tag-container {
		display: flex;
		gap: 20px;
		background: var(--base-100);
		border-radius: 6px;
	}

	.icon {
		line-height: 0;
	}

	.a {
		font-family: 'Inter';
		font-style: normal;
		font-weight: 400;
		font-size: 16px;
		line-height: 19px;
		letter-spacing: -0.2px;
		color: var(--base-600);
	}

	.icon {
		color: var(--base-500);
	}

	.add_tag button {
		border: none;
		background: none;
		text-decoration: none;
		cursor: pointer;
		font-size: 28px;
		color: var(--base-500);
	}

	.i {
		width: 200px;
		height: 30px;
		background: var(--base-100);
		border: 1px solid var(--base-300);
		border-radius: 0.375rem;
	}
</style>
