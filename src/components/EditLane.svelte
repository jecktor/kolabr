<script lang="ts">
	import { page } from '$app/stores';
	import { useList } from '$lib/liveblocks';
	import { randomId } from '$utils';
	import { t } from '$locales';
	import type { Lane } from '$types';

	import FaRegListAlt from 'svelte-icons/fa/FaRegListAlt.svelte';
	import FaEllipsisH from 'svelte-icons/fa/FaEllipsisH.svelte';
	import FaPlus from 'svelte-icons/fa/FaPlus.svelte';
	import FaTrash from 'svelte-icons/fa/FaTrash.svelte';
	import Modal from './Modal.svelte';

	export let idx: number;
	export let isNew = false;
	export let lane: Lane = {
		id: '',
		name: $t('newlane'),
		limit: 0,
		tickets: []
	};

	const lanes = useList<Lane>('lanes');

	let nameInput: HTMLInputElement;
	let show = false;

	$: name = $lanes ? $lanes.get(idx)?.name ?? lane.name : lane.name;
	$: limit = $lanes ? $lanes.get(idx)?.limit ?? lane.limit : lane.limit;

	function createLane() {
		lane.id = randomId();

		const opts = {
			method: 'POST',
			body: JSON.stringify({
				id: lane.id,
				name: lane.name,
				limit: lane.limit,
				board: $page.url.href.split('/').pop()
			}),
			headers: {
				'content-type': 'application/json'
			}
		};

		fetch('/api/board/lane', opts)
			.then(() => {
				$lanes.push({ ...lane, id: `${lane.id}-${$lanes.length}` });
				show = true;
			})
			.catch(console.error);
	}

	function updateLane() {
		const newLane: Lane = {
			id: lane.id.split('-')[0],
			tickets: lane.tickets,
			name: nameInput.value.trim(),
			limit
		};

		if (!newLane.name) return;

		const opts = {
			method: 'PUT',
			body: JSON.stringify({ id: newLane.id, name: newLane.name, limit: newLane.limit }),
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
			body: JSON.stringify({ id: lane.id.split('-')[0] }),
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
	<button on:click={createLane} class="new_lane" aria-label={$t('newlane')} title={$t('newlane')}>
		<div class="icon">
			<FaPlus />
		</div>
	</button>
{:else}
	<button
		on:click={() => (show = true)}
		class="edit_lane"
		aria-label={$t('change')}
		title={$t('change')}
	>
		<div class="icon">
			<FaEllipsisH />
		</div>
	</button>
{/if}

<Modal bind:show>
	<div class="header space1">
		<input bind:this={nameInput} type="text" value={name} class="form-control a" />
		<button on:click={deleteLane}>
			<div class="icon">
				<FaTrash />
			</div>
		</button>
	</div>
	<div class="counter-container space1">
		<div class="icon space2">
			<FaRegListAlt />
		</div>
		<span class="b">{$t('ticketlimit')}</span>
		<div class="counter">
			<button on:click={() => (limit = limit >= 1 ? --limit : limit)}>-</button>
			<span>{limit}</span>
			<button on:click={() => (limit = limit <= 9 ? ++limit : limit)}>+</button>
		</div>
	</div>
	<button on:click={updateLane} class="btn btn-primary">{$t('done')}</button>
</Modal>

<style>
	.header {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.new_lane {
		position: absolute;
		top: 70px;
		margin: 10px;
		background-color: var(--base-200);
		border-radius: 12px;
		outline: none;
		border: none;
		height: 30px;
	}
	.icon {
		color: var(--base-500);
	}
	.edit_lane {
		background-color: var(--base-200);
		border: none;
		outline: none;
		border: none;
		background: none;
	}
	.space1 {
		margin-bottom: 5%;
	}
	.space2 {
		margin-right: 2%;
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
	.form-control {
		padding: 0;
	}

	.counter-container {
		display: flex;
		align-items: center;
	}
	.counter {
		display: flex;
		align-items: center;
		margin-left: 8%;
		box-sizing: border-box;
		flex-direction: row;
		padding: 2px 10px;
		gap: 10px;
		background: var(--base-100);
		border: 1px solid var(--base-300);
		border-radius: 6px;
		height: 40px;
		user-select: none;
	}
	.counter button {
		border: none;
		background: none;
		text-decoration: none;
		cursor: pointer;
		font-size: 28px;
		color: var(--base-500);
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
	.form-control:focus {
		color: var(--base-400);
	}
	@media (max-width: 768px) {
		.new_lane {
			left: 135%;
			height: 25px;
		}
		.icon {
			width: 12px;
			height: 12px;
		}
		button {
			font-size: revert;
		}
		.edit_lane {
			margin-left: 15px;
		}
	}
</style>
