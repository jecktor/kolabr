<script lang="ts">
	import { enhance } from '$app/forms';
	import { t, type TranslationKeys } from '$locales';

	export let form: { message?: TranslationKeys };
</script>

<h2>{$t('signup')}</h2>
<form method="post" use:enhance>
	<label for="name">{$t('name')}</label><br />
	<input id="name" name="name" required /><br />
	<label for="email">{$t('email')}</label><br />
	<input type="email" id="email" name="email" required /><br />
	<label for="pass">{$t('pass')}</label><br />
	<input type="password" id="pass" name="pass" required /><br />
	<label for="passconfirm">{$t('passconfirm')}</label><br />
	<input type="password" id="passconfirm" name="passconfirm" required /><br />
	<input type="submit" value={$t('continues')} />
</form>
{#if form?.message}
	<p>{$t(form.message)}</p>
{/if}
<a href="/login">{$t('login')}</a>
