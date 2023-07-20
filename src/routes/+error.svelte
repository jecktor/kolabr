<script lang="ts">
	import { page } from '$app/stores';
	import { t } from '$locales';
</script>

<div class="wrapper">
	<div>
		<h1>{$t('error')}</h1>
		<p>{$page.status}: {$page.error?.message}</p>
		<a href="/dashboard">{$t('backtodashboard')}</a>
	</div>
</div>

<style>
	.wrapper {
		display: grid;
		place-items: center;
		width: 100vw;
		height: 100vh;
	}
</style>
