<script lang="ts">
	import { enhance } from '$app/forms';
	import { t, locale, locales } from '$locales';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<p>{$t('herotitle')}</p>
<pre class="code">
{JSON.stringify(data.user, null, 2)}
</pre>
<a href="/live">{$t('getstarted')}</a>

<select bind:value={$locale}>
	{#each locales as l}
		<option value={l}>{l}</option>
	{/each}
</select>

<form use:enhance method="post">
	<input type="submit" class="button" value={$t('signout')} />
</form>
