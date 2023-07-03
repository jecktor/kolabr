<script lang="ts">
	import { enhance } from '$app/forms';
	import { t, locale, locales, translate, type TranslationKeys } from '$locales';

	export let data;
	export let form: { message?: TranslationKeys; success: boolean };

	let avatarForm: HTMLFormElement;
	let selectForm: HTMLFormElement;
	let confirmDelete = '';
</script>

<form use:enhance bind:this={avatarForm} action="?/avatar" method="post">
	<img src={data.user.image} alt="avatar" width="50" height="50" />
	<input
		type="file"
		name="avatar"
		id="avatar"
		accept="image/png, image/jpeg"
		required
		on:change={() => avatarForm.requestSubmit()}
	/>
</form>

<form use:enhance action="?/name" method="post">
	<label for="name">{$t('name')}</label>
	<input type="text" name="name" id="name" placeholder={data.user.name} required />
	<input type="submit" value={$t('change')} />
</form>

<form use:enhance bind:this={selectForm} action="?/lang" method="post">
	<label for="lang">{$t('lang')}</label>
	<select name="lang" id="lang" bind:value={$locale} on:change={() => selectForm.requestSubmit()}>
		{#each locales as l}
			{#if data.user.lang === l}
				<option value={l} selected>{translate(l, 'locale')}</option>
			{:else}
				<option value={l}>{translate(l, 'locale')}</option>
			{/if}
		{/each}
	</select>
</form>

<form use:enhance action="?/pass" method="post">
	<label for="pass">{$t('pass')}</label>
	<input type="password" name="pass" id="pass" placeholder={$t('currentpass')} required />
	<input type="password" name="newpass" id="newpass" placeholder={$t('newpass')} required />
	<input type="submit" value={$t('change')} />
</form>

<p>{$t('danger')}</p>
<form use:enhance action="?/delete" method="post">
	<label for="confirm">{$t('confirmdelete')}</label>
	<input bind:value={confirmDelete} type="text" name="confirm" id="confirm" required />
	<input type="submit" value={$t('deletes')} disabled={confirmDelete !== $t('deletes')} />
</form>

{#if form?.success}
	<p>{$t('settingsupdated')}</p>
{/if}
{#if form?.message}
	<p>{$t(form.message)}</p>
{/if}

<a href="/">index</a>
