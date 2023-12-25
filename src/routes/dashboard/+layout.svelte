<script lang="ts">
	import { enhance } from '$app/forms';
	import { t } from '$locales';

	import * as Avatar from '$components/ui/avatar';
	import * as DropdownMenu from '$components/ui/dropdown-menu';
	import { Settings, LogOut } from 'lucide-svelte';

	export let data;
</script>

<header
	class="sticky top-0 z-50 w-full border-b bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/60"
>
	<div class="container flex h-14 items-center justify-between">
		<a class="flex items-center gap-2" href="/dashboard">
			<img class="h-5 w-5" src="logo.svg" alt="" aria-hidden="true" />
			<span class="text-xl font-bold">Kolabr</span>
		</a>
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<Avatar.Root class="h-8 w-8">
					<Avatar.Image src={data.user.image} alt="avatar" />
					<Avatar.Fallback>{data.user.name}</Avatar.Fallback>
				</Avatar.Root>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				<a href="/dashboard/settings">
					<DropdownMenu.Item class="cursor-pointer">
						<Settings class="mr-2 h-4 w-4" />
						{$t('settings')}
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
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</header>

<main class="pt-8">
	<slot />
</main>
