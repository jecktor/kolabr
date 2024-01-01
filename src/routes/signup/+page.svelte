<script lang="ts">
	import { enhance } from '$app/forms';
	import { t, type TranslationKeys } from '$locales';

	import * as Alert from '$components/ui/alert';
	import * as Card from '$components/ui/card';
	import { Input } from '$components/ui/input';
	import { Label } from '$components/ui/label';
	import { Button } from '$components/ui/button';
	import { AlertCircle } from 'lucide-svelte';

	export let form: { message?: TranslationKeys };
</script>

<svelte:head>
	<title>{$t('signup')} – Kolabr</title>
	<meta name="description" content={$t('herotitle')} />
</svelte:head>

<div class="grid h-screen w-screen place-items-center">
	<Card.Root class="w-full md:w-[400px]">
		<form method="post" use:enhance>
			<Card.Header class="space-y-1">
				<Card.Title class="text-2xl">{$t('signup')}</Card.Title>
			</Card.Header>
			<Card.Content class="grid gap-4">
				<div class="grid gap-2">
					<Label for="name">{$t('name')}</Label>
					<Input class="w-full" id="name" name="name" placeholder="John Smith" required />
				</div>
				<div class="grid gap-2">
					<Label for="email">{$t('email')}</Label>
					<Input type="email" id="email" name="email" placeholder="email@example.com" required />
				</div>
				<div class="grid gap-2">
					<Label for="pass">{$t('pass')}</Label>
					<Input type="password" id="pass" name="pass" required />
				</div>
				<div class="grid gap-2">
					<Label for="passconfirm">{$t('passconfirm')}</Label>
					<Input type="password" id="passconfirm" name="passconfirm" required />
				</div>
			</Card.Content>
			<Card.Footer class="flex flex-col gap-2">
				<Button class="w-full" type="submit">{$t('continues')}</Button>
				<Button class="w-full" variant="ghost" href="/login">{$t('login')}</Button>
			</Card.Footer>
		</form>
	</Card.Root>
</div>

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
