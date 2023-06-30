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
	<label for="password">{$t('pass')}</label><br />
	<input type="password" id="password" name="password" /><br />
	<input type="submit" value={$t('continues')} class="button" />
</form>
{#if form?.message}
	<p class="error">{$t(form.message) || ''}</p>
{/if}
<a href="/login" class="link">{$t('login')}</a>
