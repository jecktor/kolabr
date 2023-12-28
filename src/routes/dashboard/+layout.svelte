<script lang="ts">
	import { page } from '$app/stores';
	import { enhance } from '$app/forms';
	import { t } from '$locales';
	import type { IBoard } from '$types';

	import { SidebarLink } from '$components';
	import * as Avatar from '$components/ui/avatar';
	import * as DropdownMenu from '$components/ui/dropdown-menu';
	import { Input } from '$components/ui/input';
	import { SearchIcon, KanbanIcon, UserIcon, UsersIcon, Settings, LogOut } from 'lucide-svelte';

	type Boards = (IBoard &
		Required<{
			_id: string;
		}>)[];

	export let data;

	let sidebar: HTMLElement;

	let searchbarFocus = false;
	let filteredBoards: Boards = [];

	function searchBoards(query: string) {
		if (!query) return (filteredBoards = []);

		filteredBoards = boards.filter((board) =>
			board.name.toLowerCase().includes(query.toLowerCase())
		);
	}

	function toggleSidebar() {
		sidebar.classList.toggle('hidden');
	}

	$: location = $page.url.href.split('/').pop()?.split('?')[0];
	$: boards = location === 'dashboard' ? [...$page.data.ownerBoards, ...$page.data.userBoards] : [];
</script>

<aside
	bind:this={sidebar}
	class="fixed hidden h-screen w-screen border-r bg-background lg:block lg:w-72"
>
	<div class="container flex h-[61px] items-center justify-between border-b">
		<a class="flex items-center gap-2" href="/dashboard">
			<img class="h-5 w-5" src="/logo.svg" alt="" aria-hidden="true" />
			<span class="text-xl font-bold">Kolabr</span>
		</a>
	</div>

	<nav class="flex flex-col gap-2 px-4 pt-8 font-medium">
		<SidebarLink to="/dashboard" active={location === 'dashboard'}>
			<KanbanIcon class="h-4 w-4" />
			{$t('boards')}
		</SidebarLink>
		<SidebarLink to="/dashboard/teams" active={location === 'teams'}>
			<UsersIcon class="h-4 w-4" />
			{$t('teams')}
		</SidebarLink>
		<SidebarLink to="/dashboard/settings" active={location === 'settings'}>
			<Settings class="h-4 w-4" />
			{$t('settings')}
		</SidebarLink>
	</nav>
</aside>

<div class="h-screen lg:ml-72">
	<header class="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur-lg">
		<div class="flex h-[60px] items-center justify-between gap-4 px-8">
			<button on:click={toggleSidebar} aria-label="toggle sidebar" class="block lg:hidden">
				<img class="h-5 w-5" src="/logo.svg" alt="" aria-hidden="true" />
			</button>

			<div class="flex-1">
				{#if location === 'dashboard'}
					<div class="relative">
						<SearchIcon class="absolute left-2.5 top-[11px] h-4 w-4 text-muted-foreground" />
						<Input
							on:input={(e) => searchBoards(e.currentTarget.value)}
							on:focus={() => (searchbarFocus = true)}
							on:blur={() => (searchbarFocus = false)}
							class="max-w-xl pl-8 md:w-2/3 lg:w-1/3"
							placeholder={$t('searchboards')}
						/>
						{#if searchbarFocus && filteredBoards.length > 0}
							<div
								class="absolute top-[50px] flex w-full max-w-xl flex-col rounded-b-md border bg-background p-1 text-sm md:w-2/3 lg:w-1/3"
							>
								{#each filteredBoards as board (board._id)}
									<a href={`/board/${board._id}`}>
										<div
											class="flex items-center gap-2 rounded-md p-2 hover:bg-muted dark:hover:bg-muted/50"
										>
											<KanbanIcon class="h-4 min-h-4 w-4 min-w-4" />
											<span>{board.name}</span>
										</div>
									</a>
								{/each}
							</div>
						{/if}
					</div>
				{/if}
			</div>

			<DropdownMenu.Root>
				<DropdownMenu.Trigger>
					<Avatar.Root class="h-8 w-8">
						<Avatar.Image src={data.user.image} alt="avatar" />
						<Avatar.Fallback>{data.user.name}</Avatar.Fallback>
					</Avatar.Root>
				</DropdownMenu.Trigger>
				<DropdownMenu.Content>
					<DropdownMenu.Label>{$t('myaccount')}</DropdownMenu.Label>
					<DropdownMenu.Separator />
					<DropdownMenu.Group>
						<a href="/dashboard/profile">
							<DropdownMenu.Item class="cursor-pointer">
								<UserIcon class="mr-2 h-4 w-4" />
								{$t('profile')}
							</DropdownMenu.Item>
						</a>
						<form use:enhance method="post" action="?/signout">
							<button class="w-full" type="submit">
								<DropdownMenu.Item class="cursor-pointer">
									<LogOut class="mr-2 h-4 w-4" />
									{$t('signout')}
								</DropdownMenu.Item>
							</button>
						</form>
					</DropdownMenu.Group>
				</DropdownMenu.Content>
			</DropdownMenu.Root>
		</div>
	</header>

	<main class="h-full px-8 pt-8">
		<slot />
	</main>
</div>
