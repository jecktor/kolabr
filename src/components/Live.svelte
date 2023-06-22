<script lang="ts">
	import { useMyPresence, useOthers, useSelf, useObject, useList } from '$utils';
	import type { BoardInfo, Lane, InputEvent } from '$types';

	import Cursor from './Cursor.svelte';
	import Avatar from './Avatar.svelte';
	import Selection from './Selection.svelte';

	/**
	 * Liveblocks allows each user to have "presence", essentially a set of
	 * properties specific to that users. An example would be the colour they've
	 * selected, or their cursor's location in coordinates. We can then use
	 * "others", a list of every other user's "presence", to build an app. We
	 * can use our custom hooks to watch and edit these.
	 *
	 */

	const myPresence = useMyPresence();
	const self = useSelf();
	const others = useOthers();

	// Set a default value for presence
	myPresence.update({
		cursor: null,
		focusedId: null
	});

	const lanes = useList<Lane>('lanes', [
	]);

	const boardInfo = useObject<BoardInfo>('infoStorage', {
		name: 'New board'
	});

	function changeBoardName(newName: string) {
		$boardInfo.update({ name: newName });
	}

	// Update cursor presence to current pointer location
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

	// When the pointer leaves the page, set cursor presence to null
	function handlePointerLeave() {
		myPresence.update({
			...$myPresence,
			cursor: null
		});
	}

	function handleSelectionFocus(event: InputEvent) {
		myPresence.update({ cursor: null, focusedId: event.currentTarget.id });
	}

	function handleSelectionBlur() {
		myPresence.update({ cursor: null, focusedId: null });
	}

	$: hasMoreUsers = $others ? [...$others].length > 3 : false;
	$: boardReady = $boardInfo ? Object.keys($boardInfo.toImmutable()).length > 0 : false;
</script>

<!-- Live cursors -->
<main on:pointerleave={handlePointerLeave} on:pointermove={handlePointerMove}>
	{#if $others}
		{#each [...$others] as { connectionId, presence, info } (connectionId)}
			{#if presence.cursor}
				<Cursor name={info.name} color={info.color} x={presence.cursor.x} y={presence.cursor.y} />
			{/if}
		{/each}
	{/if}

	<!-- Avatars -->
	<div class="avatars">
		<!-- Show the first 3 users' avatars -->
		{#if $others}
			{#each [...$others].slice(0, 3) as { connectionId, info } (connectionId)}
				<Avatar picture={info.picture} name={info.name} color={info.color} />
			{/each}
		{/if}

		<!-- Show the amount of people online past the third user -->
		{#if hasMoreUsers}
			<div class="more">+ {[...$others].length - 3}</div>
		{/if}

		<!-- Show the current user's avatar-->
		{#if $self && $myPresence}
			<div class="current_user_container">
				<Avatar picture={$self.info.picture} name={$self.info.name} color={$self.info.color} />
			</div>
		{/if}

		{#if boardReady}
			<h1>{$boardInfo.get('name')}</h1>
			<Selection id="input-test" {others}>
				<input
					id="input-test"
					type="text"
					value={$boardInfo.get('name')}
					on:focus={handleSelectionFocus}
					on:blur={handleSelectionBlur}
					on:input={(e) => changeBoardName(e.currentTarget.value)}
				/>
			</Selection>
			<div class="lanes">
				{#each [...$lanes] as { id: laneId, name: laneName, tickets } (laneId)}
					<div class="lane">
						<h2>{laneName}</h2>
						{#each tickets as { id: ticketId, name: ticketName, description, tags } (ticketId)}
							<div class="ticket">
								<strong>{ticketName}</strong>
								<p>{description}</p>
								{#each tags as { id: tagId, name: tagName } (tagId)}
									<span>{tagName}</span>
								{/each}
							</div>
						{/each}
					</div>
				{/each}
			</div>
		{/if}
	</div>
</main>

<style>
	main {
		position: absolute;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		display: flex;
		place-content: center;
		place-items: center;
		touch-action: none;
	}

	.avatars {
		display: flex;
		flex-direction: row;
		padding-left: 0.75rem;
	}

	.current_user_container {
		position: relative;
	}

	.current_user_container:not(:first-child) {
		margin-left: 2rem;
	}

	.more {
		display: flex;
		place-content: center;
		place-items: center;
		position: relative;
		border: 4px solid #fff;
		border-radius: 9999px;
		width: 56px;
		height: 56px;
		background-color: #9ca3af;
		margin-left: -0.75rem;
		color: #fff;
	}
</style>
