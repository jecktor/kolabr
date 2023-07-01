<script lang="ts">
	import { enhance } from '$app/forms';
	import { t, locale, locales, translate } from '$locales';

	export let data;
</script>

<pre class="code">
{JSON.stringify(data.user, null, 2)}
</pre>
<a href="/live">{$t('continues')}</a>

<select bind:value={$locale}>
	{#each locales as l}
		<option value={l}>{translate(l, 'locale')}</option>
	{/each}
</select>

<form use:enhance method="post">
	<input type="submit" class="button" value={$t('signout')} />
</form>
