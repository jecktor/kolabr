<script lang="ts">
	import { enhance } from '$app/forms';
	import { t, locale, locales, translate, type TranslationKeys } from '$locales';

	export let data;
	export let form: { message?: TranslationKeys; success: boolean };

	let avatarForm: HTMLFormElement;
	let selectForm: HTMLFormElement;
	let confirmDelete = '';
</script>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
	.container {
		align-items: center;
		text-align: left;
		margin: 0 auto;
	}
	.space1 {
		margin-top: 3%;
	}
	.space2 {
		margin-bottom: 2%;
	}
	.a {
		width: 90%;
		height: auto;
		color: #212121;
		text-align: left;
		font-size: 24px;
		font-family: 'Inter', sans-serif;
		letter-spacing: 0.5px;
		line-height: 20px;
	}
	img {
		border-radius: 90px;
	}
	.file {
		color: #212121;
		text-align: left;
		font-size: 16px;
		font-family: 'Inter', sans-serif;
	}
	.b {
		font-family: 'Inter';
		font-style: normal;
		font-weight: 400;
		font-size: 16px;
		line-height: 20px;
		margin-bottom: 1%;
	}
	.c {
		width: 60%;
		font-size: 16px;
		padding-block: 8px;
	}
	.d {
		padding: 0.8rem 0.75rem;
		color: var(--bs-body-color);
		background-color: var(--bs-body-bg);
		background-clip: padding-box;
		border: var(--bs-border-width) solid var(--bs-border-color);
		appearance: none;
		border-radius: var(--bs-border-radius);
		transition: border-color 0.15s ease-in-out, box-shadow 0.15s
	}
	.e {
		width: auto;
	}
</style>

<div class="container row justify-content-center">
<form use:enhance bind:this={avatarForm} action="?/avatar" method="post">
	<strong><p class="a space1">{$t('settings')}</p></strong>
	<img class="space1 space2" src={data.user.image} alt="avatar" width="125" height="125"/>
	<br>
	<input
		class="form-control form-control-lg file"
		type="file"
		name="avatar"
		id="avatar"
		accept="image/png, image/jpeg"
		required
		on:change={() => avatarForm.requestSubmit()}
	/>
</form>

<form use:enhance action="?/name" method="post" class="space1">
	<label class="b" for="name">{$t('name')}</label>
	<br>
	<input class="c d space2" type="text" name="name" id="name" placeholder={data.user.name} required />
	<input class="btn btn-primary" type="submit" value={$t('change')}/>
</form>


<form use:enhance bind:this={selectForm} action="?/lang" method="post">
	<label class="b" for="lang">{$t('lang')}</label>
	<select class="form-select c e space2" name="lang" id="lang" bind:value={$locale} on:change={() => selectForm.requestSubmit()}>
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
	<label class="b" for="pass">{$t('pass')}</label>
	<br>
	<input class="d c e" type="password" name="pass" id="pass" placeholder={$t('currentpass')} required />
	<input class="d c e space2" type="password" name="newpass" id="newpass" placeholder={$t('newpass')} required />
	<input class="btn btn-primary" type="submit" value={$t('change')}/>
</form>

<p>{$t('danger')}</p>
<form use:enhance action="?/delete" method="post">
	<label for="confirm">{$t('confirmdelete')}</label>
	<input bind:value={confirmDelete} type="text" name="confirm" id="confirm" required />
	<input class="btn btn-primary" type="submit" value={$t('deletes')} disabled={confirmDelete !== $t('deletes')} />
</form>

{#if form?.success}
	<p>{$t('settingsupdated')}</p>
{/if}
{#if form?.message}
	<p>{$t(form.message)}</p>
{/if}
</div>