<script lang="ts">
	import { useList } from '$lib/liveblocks';
	import { randomId } from '$utils';
	import { t } from '$locales';

	import FaPlus from 'svelte-icons/fa/FaPlus.svelte';
	import FaTrash from 'svelte-icons/fa/FaTrash.svelte';
	import Tag from './Tag.svelte';
	import type { Lane, Tag as TTag } from '$types';

	export let ticketTags: TTag[];
	export let laneIdx: number;
	export let ticketId: string;

	const lanes = useList<Lane>('lanes');
	const boardTags = useList<TTag>('tags');

	let tagInput: HTMLInputElement;
	let isFocused = false;

	$: tags = $lanes
		? $lanes.get(laneIdx)?.tickets.find((ticket) => ticket.id === ticketId)?.tags ?? []
		: ticketTags;

	function createTag() {
		const newTag: TTag = {
			id: randomId(),
			name: tagInput.value.trim()
		};

		if (!newTag.name) return;
		tagInput.value = '';

		const lane = $lanes.get(laneIdx)!;
		const opts = {
			method: 'POST',
			body: JSON.stringify({ ...newTag, ticketId }),
			headers: {
				'content-type': 'application/json'
			}
		};

		fetch('/api/board/tag', opts)
			.then(() => {
				$boardTags.push(newTag);
				$lanes.set(laneIdx, {
					...lane,
					tickets: lane.tickets.map((ticket) =>
						ticket.id === ticketId ? { ...ticket, tags: [...ticket.tags, newTag] } : ticket
					)
				});
				tags = [...tags, newTag];
			})
			.catch(console.error);
	}

	function addTag(id: string, name: string) {
		const newTag: TTag = { id, name };

		if (!newTag.name) return;

		const lane = $lanes.get(laneIdx)!;
		const opts = {
			method: 'PATCH',
			body: JSON.stringify({ id, ticketId }),
			headers: {
				'content-type': 'application/json'
			}
		};

		fetch('/api/board/tag', opts)
			.then(() => {
				$lanes.set(laneIdx, {
					...lane,
					tickets: lane.tickets.map((ticket) =>
						ticket.id === ticketId ? { ...ticket, tags: [...ticket.tags, newTag] } : ticket
					)
				});
				tags = [...tags, newTag];
			})
			.catch(console.error);
	}

	function removeTag(id: string) {
		const lane = $lanes.get(laneIdx)!;
		const opts = {
			method: 'PUT',
			body: JSON.stringify({ id, ticketId }),
			headers: {
				'content-type': 'application/json'
			}
		};

		fetch('/api/board/tag', opts)
			.then(() => {
				$lanes.set(laneIdx, {
					...lane,
					tickets: lane.tickets.map((ticket) =>
						ticket.id === ticketId
							? { ...ticket, tags: ticket.tags.filter((tag) => tag.id !== id) }
							: ticket
					)
				});
				tags = tags.filter((tag) => tag.id !== id);

				if (
					!$lanes.find((lane) =>
						lane.tickets.find((ticket) => ticket.tags.find((tag) => tag.id === id))
					)
				)
					$boardTags.delete($boardTags.findIndex((tag) => tag.id === id));
			})
			.catch(console.error);
	}

	function deleteTag(id: string) {
		const opts = {
			method: 'DELETE',
			body: JSON.stringify({ id }),
			headers: {
				'content-type': 'application/json'
			}
		};

		fetch('/api/board/tag', opts)
			.then(() => {
				$boardTags.delete($boardTags.findIndex((tag) => tag.id === id));
				$lanes.forEach((lane, idx) => {
					$lanes.set(idx, {
						...lane,
						tickets: lane.tickets.map((ticket) => ({
							...ticket,
							tags: ticket.tags.filter((tag) => tag.id !== id)
						}))
					});
				});
				tags = tags.filter((tag) => tag.id !== id);
			})
			.catch(console.error);
	}
</script>

<div class="manage_tasks a">
	<div class="add_tag">
		<input
			class="i"
			type="text"
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
		{#each tags as { id, name } (id)}
			<Tag {id} {name} isDeletable onDelete={() => removeTag(id)} />
		{/each}
	</div>
	{#if isFocused && $boardTags && tags.length < $boardTags.length}
		<div class="board_tags a">
			{#each [...$boardTags] as { id, name } (id)}
				{#if !tags.find((tag) => tag.id === id)}
					<div class="tag-container">
						<div class="tag-name">
							<Tag {id} {name} />
						</div>
						<div class="buttons">
							<button class="add" on:click={() => addTag(id, name)}>
								<div class="icon">
									<FaPlus />
								</div>
							</button>
							<button class="delete" on:click={() => deleteTag(id)}>
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
		color: #7a7a7a;
	}
	.tag-container {
		display: flex;
		gap: 20px;
		background: #ffffff;
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
		color: #4d4d4d;
	}
	.icon {
		color: #7a7a7a;
	}
	.add_tag button {
		border: none;
		background: none;
		text-decoration: none;
		cursor: pointer;
		font-size: 28px;
		color: #7a7a7a;
	}
	.i {
		width: 200px;
		height: 30px;
		background: #ffffff;
		border: 1px solid #d3d3d3;
		border-radius: 0.375rem;
	}
</style>
