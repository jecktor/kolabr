<script lang="ts">
	import { enhance } from '$app/forms';
	import { t } from '$locales';

	export let data;
</script>

<div>
	<h1>{data.user.name}</h1>
	<img src={data.user.image} alt="avatar" width="50" height="50" />
</div>
<a href="/live">{$t('continues')}</a>
<a href="/dashboard/settings">{$t('settings')}</a>

<form use:enhance method="post">
	<input type="submit" value={$t('signout')} />
</form>
