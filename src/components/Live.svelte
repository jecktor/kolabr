<script lang="ts">
	import { useMyPresence, useOthers, useSelf, useObject, useList } from '$lib/liveblocks';
	import { t, translateDate } from '$locales';
	import { randomId } from '$utils';
	import type { BoardInfo, Lane, InputEvent, Board as TBoard } from '$types';

	import { Cursor, Avatar, Selection } from '$lib/liveblocks';
	import FaArrowLeft from 'svelte-icons/fa/FaArrowLeft.svelte';
	import Board from './Board.svelte';
	import ShareDialog from './ShareDialog.svelte';

	export let board: TBoard;
	export let boardLanes: Lane[];

	const myPresence = useMyPresence();
	const self = useSelf();
	const others = useOthers();

	myPresence.update({
		cursor: null,
		focusedId: null
	});

	const lanes = useList<Lane>('lanes', boardLanes);

	const boardInfo = useObject<BoardInfo>('infoStorage', {
		name: board.name,
		last_edited: board.last_edited
	});

	function changeBoardName(newName: string) {
		$boardInfo.update({
			name: newName,
			last_edited: new Date().toString()
		});
	}

	function addLane() {
		$lanes.push({
			id: randomId(),
			name: $t('newlane'),
			limit: 0,
			tickets: []
		});
	}

	function handlePointerMove(event: PointerEvent) {
		if ($myPresence.focusedId) return;

		myPresence.update({
			focusedId: null,
			cursor: {
				x: Math.round(event.clientX),
				y: Math.round(event.clientY)
			}
		});
	}

	function handlePointerLeave() {
		myPresence.update({
			...$myPresence,
			cursor: null
		});
	}

	function handleSelectionFocus(e: InputEvent) {
		myPresence.update({ cursor: null, focusedId: e.currentTarget.id });
	}

	function handleSelectionBlur() {
		myPresence.update({ cursor: null, focusedId: null });
	}

	function handleBoardUpdate(newLanes: Lane[]) {
		newLanes.forEach((lane, idx) =>
			$lanes.set(idx, { ...lane, id: `${lane.id.split('-')[0]}-${idx}` })
		);
	}

	$: hasMoreUsers = $others ? [...$others].length > 3 : false;
	$: boardReady = $boardInfo ? Object.keys($boardInfo.toImmutable()).length > 0 : false;
	$: lastEdit = translateDate(boardReady ? $boardInfo.get('last_edited') : '');
</script>

{#if boardReady}
	<div class="board" on:pointerleave={handlePointerLeave} on:pointermove={handlePointerMove}>
		<!-- Live cursors -->
		{#if $others}
			{#each [...$others] as { connectionId, presence, info } (connectionId)}
				{#if presence.cursor}
					<Cursor name={info.name} color={info.color} x={presence.cursor.x} y={presence.cursor.y} />
				{/if}
			{/each}
		{/if}

		<header>
			<div class="header_node">
				<a class="back" href="/dashboard">
					<div class="icon">
						<FaArrowLeft />
					</div>
				</a>
				<div class="board_info">
					<Selection id="board-name" {others}>
						<input
							id="board-name"
							type="text"
							value={$boardInfo.get('name')}
							on:focus={handleSelectionFocus}
							on:blur={handleSelectionBlur}
							on:input={(e) => changeBoardName(e.currentTarget.value)}
						/>
					</Selection>
					<time datetime={$boardInfo.get('last_edited')}>
						{lastEdit}
					</time>
				</div>
			</div>
			<div class="header_node">
				<!-- Avatars -->
				<div class="avatars">
					<!-- Show the first 3 users' avatars -->
					{#if $others && $self}
						{#each [...$others].slice(0, 3) as { connectionId, info, id } (connectionId)}
							{#if $self.id !== id}
								<Avatar image={info.image} name={info.name} color={info.color} />
							{/if}
						{/each}
					{/if}

					<!-- Show the amount of people online past the third user -->
					{#if hasMoreUsers}
						<div class="more">+ {[...$others].length - 3}</div>
					{/if}
				</div>

				<!-- Show the current user's avatar-->
				{#if $self && $myPresence}
					<Avatar image={$self.info.image} name={$self.info.name} color={$self.info.color} />
				{/if}

				<ShareDialog />
			</div>
		</header>

		<main>
			<Board lanes={[...$lanes]} onFinalUpdate={handleBoardUpdate} onCreateLane={addLane} />
		</main>
	</div>
{/if}

<style>
	.board {
		position: absolute;
		inset: 0;
		width: 100vw;
		height: 100vh;
		touch-action: none;
	}

	header {
		height: 64px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-inline: 40px;
		padding-block: 12px;
		border-bottom: 1px solid var(--base-300);
	}

	.back {
		padding: 10px;
		color: var(--base-700);
		background-color: var(--base-200);
		border: 1px solid var(--base-300);
		border-radius: 6px;
	}

	.header_node {
		display: flex;
		align-items: center;
		gap: 25px;
	}

	.board_info input {
		border: none;
		outline: none;
		padding: 0;
		font-size: 1.8rem;
		font-weight: 700;
	}

	.board_info time {
		font-size: 1.4rem;
		color: var(--base-600);
	}

	.avatars {
		display: flex;
	}

	.more {
		display: flex;
		place-content: center;
		place-items: center;
		position: relative;
		border: 4px solid var(--base-300);
		border-radius: 9999px;
		width: 56px;
		height: 56px;
		background-color: var(--base-200);
		margin-left: -0.75rem;
		color: var(--base-600);
	}
</style>
