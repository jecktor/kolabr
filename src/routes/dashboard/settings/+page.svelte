<script lang="ts">
	import { enhance } from '$app/forms';
	import { toggleMode } from 'mode-watcher';
	import { t, locale, locales, translate, type TranslationKeys } from '$locales';

	import * as Alert from '$components/ui/alert';
	import * as AlertDialog from '$components/ui/alert-dialog';
	import { Button, buttonVariants } from '$components/ui/button';
	import { Input } from '$components/ui/input';
	import { Label } from '$components/ui/label';
	import { Sun, Moon, CheckCircle, AlertCircle } from 'lucide-svelte';

	export let data;
	export let form: { message?: TranslationKeys; success: boolean };

	let langForm: HTMLFormElement;
	let deleteForm: HTMLFormElement;

	let confirmDelete = '';
</script>

<svelte:head>
	<title>{$t('settings')} – Kolabr</title>
	<meta name="description" content={$t('herotitle')} />
</svelte:head>

<h1 class="text-2xl font-semibold leading-none">{$t('settings')}</h1>
<p class="mt-2 text-sm text-muted-foreground">{$t('settingsdesc')}</p>

<div class="mt-8 flex flex-col gap-8">
	<div class="flex w-full max-w-sm flex-col gap-3">
		<span
			class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
			>{$t('theme')}</span
		>
		<Button on:click={toggleMode} variant="outline" size="icon">
			<Sun
				class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
			/>
			<Moon
				class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
			/>
			<span class="sr-only">Toggle theme</span>
		</Button>
	</div>

	<form
		class="flex w-full max-w-sm flex-col gap-3"
		use:enhance
		bind:this={langForm}
		action="?/lang"
		method="post"
	>
		<Label for="lang">{$t('lang')}</Label>
		<select
			class="w-44 rounded-md border bg-background p-2 outline-none"
			name="lang"
			id="lang"
			bind:value={$locale}
			on:change={() => langForm.requestSubmit()}
		>
			{#each locales as l}
				{#if data.user.lang === l}
					<option value={l} selected>{translate(l, 'locale')}</option>
				{:else}
					<option value={l}>{translate(l, 'locale')}</option>
				{/if}
			{/each}
		</select>
	</form>

	<form class="flex w-full max-w-sm flex-col gap-3" use:enhance action="?/pass" method="post">
		<Label for="pass">{$t('pass')}</Label>
		<div class="flex flex-wrap items-center gap-3">
			<Input type="password" name="pass" id="pass" placeholder={$t('currentpass')} required />
			<Input type="password" name="newpass" id="newpass" placeholder={$t('newpass')} required />
			<Button type="submit">{$t('change')}</Button>
		</div>
	</form>

	<div>
		<p class="mb-4 text-red-700">{$t('deleteaccount')}</p>
		<form
			class="flex w-full max-w-sm flex-col gap-3"
			bind:this={deleteForm}
			use:enhance
			action="?/delete"
			method="post"
		>
			<Label for="confirm">{$t('confirmdelete')}</Label>
			<div class="flex items-center gap-2">
				<Input bind:value={confirmDelete} type="text" name="confirm" id="confirm" required />

				<AlertDialog.Root>
					<AlertDialog.Trigger
						class={buttonVariants({ variant: 'destructive' })}
						type="button"
						disabled={confirmDelete !== $t('deleteaccount')}
					>
						{$t('deleteaccount')}
					</AlertDialog.Trigger>
					<AlertDialog.Content>
						<AlertDialog.Header>
							<AlertDialog.Title>{$t('sure')}</AlertDialog.Title>
							<AlertDialog.Description>
								{$t('deleteaccountdesc')}
							</AlertDialog.Description>
						</AlertDialog.Header>
						<AlertDialog.Footer>
							<AlertDialog.Cancel>{$t('cancel')}</AlertDialog.Cancel>
							<AlertDialog.Action on:click={() => deleteForm.requestSubmit()}
								>{$t('deleteaccount')}</AlertDialog.Action
							>
						</AlertDialog.Footer>
					</AlertDialog.Content>
				</AlertDialog.Root>
			</div>
		</form>
	</div>
</div>

{#if form?.success}
	<Alert.Root
		class="absolute bottom-0 left-0 w-full bg-background lg:bottom-5 lg:left-auto lg:right-5 lg:max-w-sm"
	>
		<CheckCircle class="h-4 w-4" />
		<Alert.Title>{$t('settingsupdated')}</Alert.Title>
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
