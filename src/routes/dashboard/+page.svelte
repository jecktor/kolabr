<script lang="ts">
	import { enhance } from '$app/forms';
	import { t, translateDate, type TranslationKeys } from '$locales';

	import { NewBoard } from '$components';
	import * as Avatar from '$components/ui/avatar';
	import * as Alert from '$components/ui/alert';
	import * as Card from '$components/ui/card';
	import * as DropdownMenu from '$components/ui/dropdown-menu';
	import { X, MoreHorizontal, Trash, Link, CheckCircle, AlertCircle } from 'lucide-svelte';

	export let data;
	export let form: { message?: TranslationKeys; success: boolean };
</script>

<svelte:head>
	<title>{$t('dashboard')} | Kolabr</title>
	<meta name="description" content={$t('herotitle')} />
</svelte:head>

{#if data.ownerBoards.length > 0}
	<section>
		<div class="flex flex-wrap items-center justify-between gap-4">
			<header class="text-2xl font-semibold leading-none">{$t('ownerboards')}</header>
			<NewBoard />
		</div>

		<div class="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{#each data.ownerBoards as board (board._id)}
				<div class="relative">
					<a class="h-full" href={`/board/${board._id}`}>
						<Card.Root class="h-full">
							<Card.Header class="text-left">
								<Card.Title class="mr-6 overflow-hidden overflow-ellipsis whitespace-nowrap"
									>{board.name}</Card.Title
								>
								<Card.Description>{translateDate(board.last_edited, true)}</Card.Description>
							</Card.Header>
							{#if board.shared_with.length > 0}
								<Card.Footer>
									<div class="flex -space-x-1">
										{#each board.shared_with.slice(0, 3) as user (user.email)}
											<Avatar.Root
												class="inline-block h-6 w-6 bg-background ring-1 ring-background"
											>
												<Avatar.Image src={user.image} alt="avatar" />
												<Avatar.Fallback>{user.name}</Avatar.Fallback>
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
								</Card.Footer>
							{/if}
						</Card.Root>
					</a>
					<div class="absolute right-4 top-4">
						<DropdownMenu.Root>
							<DropdownMenu.Trigger>
								<button
									class="flex h-8 w-8 items-center justify-center"
									title={$t('actions')}
									aria-label={$t('actions')}
								>
									<MoreHorizontal class="h-5 w-5" />
								</button>
							</DropdownMenu.Trigger>
							<DropdownMenu.Content>
								<DropdownMenu.Group>
									<button
										class="w-full"
										on:click={() =>
											navigator.clipboard.writeText(`${window.location.origin}/board/${board._id}`)}
									>
										<DropdownMenu.Item class="cursor-pointer">
											<Link class="mr-2 h-4 w-4" />
											{$t('copylink')}
										</DropdownMenu.Item>
									</button>
									<form class="w-full" use:enhance action="?/deleteboard" method="post">
										<input type="hidden" name="board" value={board._id} />
										<button class="w-full" type="submit">
											<DropdownMenu.Item class="cursor-pointer">
												<Trash class="mr-2.5 h-4 w-4" />
												{$t('deletes')}
											</DropdownMenu.Item>
										</button>
									</form>
								</DropdownMenu.Group>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</div>
				</div>
			{/each}
		</div>
	</section>
{:else}
	<NewBoard />
{/if}

{#if data.userBoards.length > 0}
	<section class="mt-12">
		<header class="text-2xl font-semibold leading-none">{$t('userboards')}</header>

		<div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{#each data.userBoards as board (board._id)}
				<div class="relative">
					<a class="h-full" href={`/board/${board._id}`}>
						<Card.Root class="h-full">
							<Card.Header class="text-left">
								<Card.Title class="mr-6 overflow-hidden overflow-ellipsis whitespace-nowrap"
									>{board.name}</Card.Title
								>
								<Card.Description>{translateDate(board.last_edited, true)}</Card.Description>
							</Card.Header>
							<Card.Footer>
								<Avatar.Root class="mr-4 h-6 w-6">
									<Avatar.Image src={board.owner.image} alt="avatar" />
									<Avatar.Fallback>{board.owner.name}</Avatar.Fallback>
								</Avatar.Root>
								{#if board.shared_with.length > 0}
									<div class="flex -space-x-1">
										{#each board.shared_with.slice(0, 3) as user (user.email)}
											<Avatar.Root
												class="inline-block h-6 w-6 bg-background ring-1 ring-background"
											>
												<Avatar.Image src={user.image} alt="avatar" />
												<Avatar.Fallback>{user.name}</Avatar.Fallback>
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
						</Card.Root>
					</a>
					<div class="absolute right-4 top-4">
						<DropdownMenu.Root>
							<DropdownMenu.Trigger>
								<button
									class="flex h-8 w-8 items-center justify-center"
									title={$t('actions')}
									aria-label={$t('actions')}
								>
									<MoreHorizontal class="h-5 w-5" />
								</button>
							</DropdownMenu.Trigger>
							<DropdownMenu.Content>
								<DropdownMenu.Group>
									<button
										class="w-full"
										on:click={() =>
											navigator.clipboard.writeText(`${window.location.origin}/board/${board._id}`)}
									>
										<DropdownMenu.Item class="cursor-pointer">
											<Link class="mr-2 h-4 w-4" />
											{$t('copylink')}
										</DropdownMenu.Item>
									</button>
									<form class="w-full" use:enhance action="?/removeboard" method="post">
										<input type="hidden" name="board" value={board._id} />
										<button class="w-full" type="submit">
											<DropdownMenu.Item class="cursor-pointer">
												<X class="mr-1.5 h-5 w-5" />
												{$t('remove')}
											</DropdownMenu.Item>
										</button>
									</form>
								</DropdownMenu.Group>
							</DropdownMenu.Content>
						</DropdownMenu.Root>
					</div>
				</div>
			{/each}
		</div>
	</section>
{/if}

{#if form?.success}
	<Alert.Root
		class="absolute bottom-0 left-0 w-full bg-background lg:bottom-5 lg:left-auto lg:right-5 lg:max-w-sm"
	>
		<CheckCircle class="h-4 w-4" />
		<Alert.Title>{$t('boardupdate')}</Alert.Title>
	</Alert.Root>
{/if}

{#if form?.message}
	<Alert.Root
		variant="destructive"
		class="absolute bottom-0 left-0 w-full bg-background lg:bottom-5 lg:left-auto lg:right-5 lg:max-w-sm"
	>
		<AlertCircle class="h-4 w-4" />
		<Alert.Title>{$t('error')}</Alert.Title>
		<Alert.Description>{$t(form.message)}</Alert.Description>
	</Alert.Root>
{/if}
