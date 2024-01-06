<script lang="ts">
	import { enhance } from '$app/forms';
	import { t, translateDate, type TranslationKeys } from '$locales';
	import type { IBoard } from '$types';

	import NewBoard from './NewBoard.svelte';

	import * as Avatar from '$components/ui/avatar';
	import * as Card from '$components/ui/card';
	import * as AlertDialog from '$components/ui/alert-dialog';
	import * as DropdownMenu from '$components/ui/dropdown-menu';
	import { Button } from '$components/ui/button';
	import { MoreHorizontal, Link } from 'lucide-svelte';

	export let title: TranslationKeys;

	export let boards: (IBoard &
		Required<{
			_id: string;
		}>)[];

	export let action: string;
	export let actionName: TranslationKeys;
	export let actionDescription: TranslationKeys;

	export let allowNewBoard = false;
	export let showOwner = false;
	export let padding = false;

	let actionForm: HTMLFormElement;
	let actionDialog = false;
</script>

{#if boards.length > 0}
	<section class={padding ? 'mt-8' : ''}>
		{#if allowNewBoard}
			<div class="flex flex-wrap items-center justify-between gap-4">
				<header class="text-2xl font-semibold leading-none">{$t(title)}</header>
				<NewBoard />
			</div>
		{:else}
			<header class="text-2xl font-semibold leading-none">{$t(title)}</header>
		{/if}

		<div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{#each boards as board (board._id)}
				<div class="relative">
					<a class="h-full" href={`/board/${board._id}`}>
						<Card.Root class="h-full hover:border-primary">
							<Card.Header class="text-left">
								<Card.Title class="mr-6 overflow-hidden overflow-ellipsis whitespace-nowrap"
									>{board.name}</Card.Title
								>
								<Card.Description>{translateDate(board.last_edited, true)}</Card.Description>
							</Card.Header>
							{#if board.shared_with.length > 0 || showOwner}
								<Card.Footer>
									{#if showOwner}
										<Avatar.Root class="mr-4 h-6 w-6">
											<Avatar.Image src={board.owner.image} alt="avatar" />
											<Avatar.Fallback>{board.owner.name[0]}</Avatar.Fallback>
										</Avatar.Root>
									{/if}
									{#if board.shared_with.length > 0}
										<div class="flex -space-x-1">
											{#each board.shared_with.slice(0, 3) as user (user.email)}
												<Avatar.Root
													class="inline-block h-6 w-6 bg-background ring-1 ring-background"
												>
													<Avatar.Image src={user.image} alt="avatar" />
													<Avatar.Fallback>{user.name[0]}</Avatar.Fallback>
												</Avatar.Root>
											{/each}
											{#if board.shared_with.length > 3}
												<div
													class="z-10 flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground ring-1 ring-background"
												>
													+{board.shared_with.length - 3}
												</div>
											{/if}
										</div>
									{/if}
								</Card.Footer>
							{/if}
						</Card.Root>
					</a>
					<div class="absolute right-4 top-4">
						<DropdownMenu.Root>
							<DropdownMenu.Trigger>
								<Button
									size="icon"
									variant="ghost"
									title={$t('actions')}
									aria-label={$t('actions')}
								>
									<MoreHorizontal class="h-5 w-5" />
								</Button>
							</DropdownMenu.Trigger>
							<DropdownMenu.Content>
								<DropdownMenu.Group>
									<button
										class="block w-full"
										on:click={() =>
											navigator.clipboard.writeText(`${window.location.origin}/board/${board._id}`)}
									>
										<DropdownMenu.Item class="cursor-pointer">
											<Link class="mr-2 h-4 w-4" />
											{$t('copylink')}
										</DropdownMenu.Item>
									</button>
									<button class="block w-full" on:click={() => (actionDialog = true)}>
										<DropdownMenu.Item class="cursor-pointer">
											<slot name="actionIcon" />
											{$t(actionName)}
										</DropdownMenu.Item>
									</button>
								</DropdownMenu.Group>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</div>

					<form
						class="hidden"
						bind:this={actionForm}
						use:enhance
						action={`?/${action}`}
						method="post"
					>
						<input type="hidden" name="board" value={board._id} />
					</form>
				</div>
			{/each}
		</div>
	</section>
{:else if allowNewBoard}
	<NewBoard />
{/if}

<AlertDialog.Root bind:open={actionDialog}>
	<AlertDialog.Trigger />
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>{$t('sure')}</AlertDialog.Title>
			<AlertDialog.Description>
				{$t(actionDescription)}
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel>{$t('cancel')}</AlertDialog.Cancel>
			<AlertDialog.Action on:click={() => actionForm.requestSubmit()}
				>{$t(actionName)}</AlertDialog.Action
			>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
