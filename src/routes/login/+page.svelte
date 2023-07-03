<script lang="ts">
	import { enhance } from '$app/forms';
	import { t, type TranslationKeys } from '$locales';

	export let form: { message?: TranslationKeys };
</script>

<h2>{$t('login')}</h2>
<form method="post" use:enhance>
	<label for="email">{$t('email')}</label><br />
	<input type="email" id="email" name="email" required /><br />
	<label for="password">{$t('pass')}</label><br />
	<input type="password" id="password" name="password" required /><br />
	<input type="submit" value={$t('continues')} />
</form>
{#if form?.message}
	<p>{$t(form.message)}</p>
{/if}
<a href="/signup">{$t('create')}</a>
