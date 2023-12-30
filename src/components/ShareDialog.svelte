<script lang="ts">
	import { page } from '$app/stores';
	import { t, type TranslationKeys } from '$locales';

	import { Button, buttonVariants } from '$components/ui/button';
	import { Input } from '$components/ui/input';
	import { Separator } from '$components/ui/separator';
	import * as Alert from '$components/ui/alert';
	import * as Avatar from '$components/ui/avatar';
	import * as Dialog from '$components/ui/dialog';
	import * as Tooltip from '$components/ui/tooltip';
	import { X, Crown, CheckCircle, AlertCircle } from 'lucide-svelte';

	export let userId: string;
	export let owner: { _id: string; name: string; email: string; image: string };
	export let access: { name: string; email: string; image: string }[];

	let message: TranslationKeys | undefined;
	let success: boolean;

	let accessPeople = '';

	const boardId = $page.url.href.split('/').pop();

	function copyUrl() {
		navigator.clipboard.writeText($page.url.href).then(() => {
			success = true;
			message = 'linkcopied';

			setTimeout(() => (message = undefined), 3000);
		});
	}

	function addPeople() {
		if (!accessPeople) return;

		const opts = {
			method: 'POST',
			body: JSON.stringify({ access: accessPeople, boardId }),
			headers: {
				'content-type': 'application/json'
			}
		};

		fetch('/api/board/access', opts)
			.then((res) => res.json())
			.then((info) => {
				success = true;
				message = info.status;
				access = [...access, ...info.users];

				accessPeople = '';

				setTimeout(() => (message = undefined), 3000);
			})
			.catch(() => {
				success = false;
				message = 'unknown';

				setTimeout(() => (message = undefined), 3000);
			});
	}

	function removePerson(email: string) {
		const opts = {
			method: 'DELETE',
			body: JSON.stringify({ email, boardId }),
			headers: {
				'content-type': 'application/json'
			}
		};

		fetch('/api/board/access', opts)
			.then((res) => res.json())
			.then((info) => {
				success = true;
				message = info.status;
				access = access.filter((user) => user.email !== email);
				setTimeout(() => (message = undefined), 3000);
			})
			.catch(() => {
				success = false;
				message = 'unknown';
				setTimeout(() => (message = undefined), 3000);
			});
	}
</script>

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: 'default' })}>{$t('share')}</Dialog.Trigger>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>{$t('shareboard')}</Dialog.Title>
			<Dialog.Description>{$t('shareboarddesc')}</Dialog.Description>
		</Dialog.Header>
		{#if owner._id === userId}
			<div class="flex space-x-2">
				<Input bind:value={accessPeople} placeholder={$t('shareemail')} />
				<Button on:click={addPeople} class="shrink-0">{$t('addpeople')}</Button>
			</div>
		{/if}
		<Button on:click={copyUrl} variant="secondary" class="shrink-0">{$t('copylink')}</Button>
		<Separator class="my-4" />
		<div class="space-y-4">
			<h4 class="text-sm font-medium">{$t('shareaccess')}</h4>
			<div class="grid gap-6">
				<div class="flex items-center justify-between space-x-4">
					<div class="flex items-center space-x-4">
						<Avatar.Root>
							<Avatar.Image src={owner.image} />
							<Avatar.Fallback>{owner.name}</Avatar.Fallback>
						</Avatar.Root>
						<div>
							<p class="text-sm font-medium leading-none">
								{owner.name}
							</p>
							<p class="text-sm text-muted-foreground">
								{owner.email}
							</p>
						</div>
					</div>
					<Tooltip.Root>
						<Tooltip.Trigger class="grid h-10 w-10 cursor-auto place-items-center">
							<Crown class="h-4 w-4" />
						</Tooltip.Trigger>
						<Tooltip.Content>
							<p>{$t('owner')}</p>
						</Tooltip.Content>
					</Tooltip.Root>
				</div>
				{#each access as user (user.email)}
					<div class="flex items-center justify-between space-x-4">
						<div class="flex items-center space-x-4">
							<Avatar.Root>
								<Avatar.Image src={user.image} />
								<Avatar.Fallback>{user.name}</Avatar.Fallback>
							</Avatar.Root>
							<div>
								<p class="text-sm font-medium leading-none">
									{user.name}
								</p>
								<p class="text-sm text-muted-foreground">
									{user.email}
								</p>
							</div>
						</div>
						{#if owner._id === userId}
							<Button
								on:click={() => removePerson(user.email)}
								variant="outline"
								size="icon"
								aria-label={$t('remove')}
							>
								<X class="h-4 w-4" />
							</Button>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	</Dialog.Content>
</Dialog.Root>

{#if success && message}
	<Alert.Root
		class="absolute bottom-0 left-0 z-[999] w-full bg-background lg:bottom-5 lg:left-auto lg:right-5 lg:max-w-sm"
	>
		<CheckCircle class="h-4 w-4" />
		<Alert.Title>{$t(message)}</Alert.Title>
	</Alert.Root>
{/if}

{#if !success && message}
	<Alert.Root
		variant="destructive"
		class="absolute bottom-0 left-0 z-[999] w-full bg-background lg:bottom-5 lg:left-auto lg:right-5 lg:max-w-sm"
	>
		<AlertCircle class="h-4 w-4" />
		<Alert.Title>{$t('error')}</Alert.Title>
		<Alert.Description>{$t(message)}</Alert.Description>
	</Alert.Root>
{/if}
