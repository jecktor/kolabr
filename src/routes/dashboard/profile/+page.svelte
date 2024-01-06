<script lang="ts">
	import { enhance } from '$app/forms';
	import { t, type TranslationKeys } from '$locales';

	import * as Alert from '$components/ui/alert';
	import * as Avatar from '$components/ui/avatar';
	import { Button } from '$components/ui/button';
	import { Input } from '$components/ui/input';
	import { Label } from '$components/ui/label';
	import { CheckCircle, AlertCircle } from 'lucide-svelte';

	export let data;
	export let form: { message?: TranslationKeys; success: boolean };

	let avatarForm: HTMLFormElement;
</script>

<svelte:head>
	<title>{$t('profile')} – Kolabr</title>
	<meta name="description" content={$t('herotitle')} />
</svelte:head>

<h1 class="text-2xl font-semibold leading-none">{$t('profile')}</h1>
<p class="mt-2 text-sm text-muted-foreground">{$t('profiledetails')}</p>

<div class="mt-8 flex flex-col gap-8">
	<form
		use:enhance
		bind:this={avatarForm}
		action="?/avatar"
		method="post"
		enctype="multipart/form-data"
	>
		<div class="flex flex-wrap items-center gap-6">
			<div>
				<label for="avatar">
					<Avatar.Root
						class="h-20 w-20 cursor-pointer outline-2 hover:outline hover:outline-primary"
					>
						<Avatar.Image src={data.user.image} alt="avatar" />
						<Avatar.Fallback>{data.user.name[0]}</Avatar.Fallback>
					</Avatar.Root>
				</label>
				<input
					class="hidden"
					type="file"
					name="avatar"
					id="avatar"
					accept="image/png, image/jpeg"
					required
					on:change={() => avatarForm.requestSubmit()}
				/>
			</div>
			<div>
				<div class="text-xl font-semibold">{data.user.name}</div>
				<div class="text-sm text-muted-foreground">{data.user.email}</div>
			</div>
		</div>
	</form>

	<div>
		<form
			class="flex w-full max-w-sm items-end space-x-2"
			use:enhance
			action="?/name"
			method="post"
		>
			<div class="flex w-full max-w-sm flex-col gap-3">
				<Label for="name">{$t('name')}</Label>
				<Input type="text" id="name" name="name" placeholder={data.user.name} required />
			</div>
			<Button type="submit">{$t('change')}</Button>
		</form>
		<p class="mt-2 text-sm text-muted-foreground">{$t('namedesc')}</p>
	</div>
</div>

{#if form?.success}
	<Alert.Root
		class="absolute bottom-0 left-0 w-full bg-background lg:bottom-5 lg:left-auto lg:right-5 lg:max-w-sm"
	>
		<CheckCircle class="h-4 w-4" />
		<Alert.Title>{$t('profileupdated')}</Alert.Title>
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
