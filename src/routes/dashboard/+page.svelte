<script lang="ts">
	import { enhance } from '$app/forms';
	import { t } from '$locales';

	export let data;
</script>

<div>
	<h1>{data.user.name}</h1>
	<img src={data.user.image} alt="avatar" width="50" height="50" />
</div>
<a href="/dashboard/settings">{$t('settings')}</a>

<form use:enhance method="post" action="?/signout">
	<input type="submit" value={$t('signout')} />
</form>

<div>
	<form action="?/newboard" method="post">
		<button type="submit">{$t('createboard')}</button>
	</form>
</div>
