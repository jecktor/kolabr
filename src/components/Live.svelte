<script lang="ts">
	import { onDestroy } from 'svelte';
	import { goto } from '$app/navigation';
	import { overrideItemIdKeyNameBeforeInitialisingDndZones } from 'svelte-dnd-action';
	import { useMyPresence, useOthers, useSelf, useObject, useList, useRoom } from '$lib/liveblocks';
	import { t, translateDate } from '$locales';
	import type { IBoard, ILane, ITag, IMember, IOwner, IBoardInfo, InputEvent } from '$types';

	import { Cursor, Avatar, Selection } from '$lib/liveblocks';

	import Board from './Board.svelte';
	import { Loading } from '$components';

	import ShareDialog from './ShareDialog.svelte';
	import * as Tooltip from '$components/ui/tooltip';
	import { Button } from '$components/ui/button';
	import { ChevronLeft } from 'lucide-svelte';

	export let board: IBoard;

	const myPresence = useMyPresence();
	const self = useSelf();
	const others = useOthers();

	const room = useRoom();

	myPresence.update({
		cursor: null,
		focusedId: null
	});

	const boardInfo = useObject<IBoardInfo>('info', {
		name: board.name,
		last_edited: board.last_edited
	});

	const lanes = useList<ILane>('lanes', board.lanes);
	const owner = useObject<IOwner>('owner', board.owner);
	const members = useList<IMember>('members', board.shared_with);

	useList<ITag>('tags', board.tags);

	let timeout: NodeJS.Timeout;
	let boardDeleted = false;

	function changeBoardName(newName: string) {
		if (!newName) return;

		const last_edited = new Date().toString();
		const opts = {
			method: 'PUT',
			body: JSON.stringify({
				id: board._id,
				name: newName,
				last_edited
			}),
			headers: {
				'content-type': 'application/json'
			}
		};

		fetch('/api/board', opts)
			.then((res) => {
				if (res.status === 404) {
					boardDeleted = true;
					return;
				}

				$boardInfo.update({
					name: newName,
					last_edited
				});
			})
			.catch(console.error);
	}

	function debounceChangeBoardName(newName: string) {
		clearTimeout(timeout);
		timeout = setTimeout(() => changeBoardName(newName), 500);
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

	function handleBoardUpdate(newLanes: ILane[]) {
		newLanes.forEach((lane, idx) =>
			$lanes.set(idx, { ...lane, _id: `${lane._id.split('-')[0]}-${idx}` })
		);
	}

	$: hasMoreUsers = $others ? [...$others].length > 3 : false;
	$: boardReady =
		!boardDeleted && ($boardInfo ? Object.keys($boardInfo.toImmutable()).length > 0 : false);
	$: lastEdit = translateDate(boardReady ? $boardInfo.get('last_edited') : '');

	const unsubscribe = lanes.subscribe(() => {
		if (
			$self &&
			$owner &&
			$self.id !== $owner.get('_id') &&
			$members &&
			!$members.find((member) => member.email === $self!.info.email)
		) {
			goto('/dashboard');
		}

		const last_edited = new Date().toString();
		const opts = {
			method: 'PATCH',
			body: JSON.stringify({
				id: board._id,
				last_edited
			}),
			headers: {
				'content-type': 'application/json'
			}
		};

		fetch('/api/board', opts)
			.then((res) => {
				if (res.status === 404) {
					boardDeleted = true;
					return;
				}

				$boardInfo && $boardInfo.update({ last_edited });
			})
			.catch(console.error);
	});

	onDestroy(() => {
		unsubscribe();
	});

	room.subscribe('event', () => {
		window.location.reload();
	});

	overrideItemIdKeyNameBeforeInitialisingDndZones('_id');
</script>

{#if boardReady && !boardDeleted}
	<div
		class="absolute inset-0 h-screen w-screen touch-none overflow-hidden"
		on:pointerleave={handlePointerLeave}
		on:pointermove={handlePointerMove}
	>
		<!-- Live cursors -->
		{#if $others}
			{#each [...$others] as { connectionId, presence, info } (connectionId)}
				{#if presence.cursor}
					<Cursor name={info.name} color={info.color} x={presence.cursor.x} y={presence.cursor.y} />
				{/if}
			{/each}
		{/if}

		<header
			class="flex h-[60px] w-full items-center justify-between gap-4 border-b bg-background px-8"
		>
			<div class="flex items-center gap-6">
				<Button variant="outline" size="icon" href="/dashboard" aria-label={$t('backtodashboard')}>
					<ChevronLeft />
				</Button>
				<div class="whitespace-nowrap leading-[0]">
					<Selection id="board-name" {others}>
						<input
							class="overflow-ellipsis border-none bg-transparent p-0 text-lg font-semibold leading-[0] outline-none"
							id="board-name"
							type="text"
							value={$boardInfo.get('name')}
							on:focus={handleSelectionFocus}
							on:blur={handleSelectionBlur}
							on:input={(e) => debounceChangeBoardName(e.currentTarget.value)}
						/>
					</Selection>
					<time class="text-sm text-muted-foreground" datetime={$boardInfo.get('last_edited')}>
						{lastEdit}
					</time>
				</div>
			</div>
			<div class="flex gap-6">
				<!-- Avatars -->
				<div class="flex -space-x-1">
					<!-- Show the first 3 users' avatars -->
					{#if $others && $self}
						{#each [...$others].slice(0, 3) as { connectionId, info, id } (connectionId)}
							{#if $self.id !== id}
								<Avatar image={info.image} name={info.name} color={info.color} />
							{/if}
						{/each}
					{/if}

					<!-- Show the amount of people online past the third user -->
					{#if hasMoreUsers && $self}
						<Tooltip.Root>
							<Tooltip.Trigger>
								<div
									class="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground ring-2 ring-muted-foreground"
								>
									+{[...$others].length - 3}
								</div>
							</Tooltip.Trigger>
							<Tooltip.Content>
								{#each [...$others].slice(3) as { connectionId, info, id } (connectionId)}
									{#if $self.id !== id}
										<div class="flex flex-col gap-1">
											<p>{info.name}</p>
											<p>{info.name}</p>
											<p>{info.name}</p>
										</div>
									{/if}
								{/each}
							</Tooltip.Content>
						</Tooltip.Root>
					{/if}
				</div>

				<!-- Show the current user's avatar-->
				{#if $self && $myPresence}
					<Avatar image={$self.info.image} name={$self.info.name} color="transparent" />
				{/if}

				{#if board.owner._id && $self?.id}
					<ShareDialog userId={$self?.id} />
				{/if}
			</div>
		</header>

		<main>
			<Board lanes={[...$lanes]} onFinalUpdate={handleBoardUpdate} />
		</main>
	</div>
{:else if !boardReady}
	<div class="absolute inset-0 grid h-screen w-screen place-items-center">
		<Loading />
	</div>
{/if}

{#if boardDeleted}
	<div class="absolute inset-0 grid h-screen w-screen place-items-center bg-background">
		<div>
			<h1 class="text-2xl font-semibold leading-none">{$t('boardnotfound')}</h1>
			<p class="mt-2 text-sm text-muted-foreground">{$t('boardnotfoundmsg')}</p>
			<Button class="mt-6" href="/dashboard">{$t('backtodashboard')}</Button>
		</div>
	</div>
{/if}
