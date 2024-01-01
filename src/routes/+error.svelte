<script lang="ts">
	import { page } from '$app/stores';
	import { t } from '$locales';

	import { Button } from '$components/ui/button';
</script>

<svelte:head>
	<title>{$t('error')} – Kolabr</title>
	<meta name="description" content={$t('herotitle')} />
</svelte:head>

<div class="absolute inset-0 grid h-screen w-screen place-items-center">
	<div>
		<h1 class="text-2xl font-semibold leading-none">{$t('error')}</h1>
		<p class="mt-2 text-sm text-muted-foreground">{$page.status}: {$page.error?.message}</p>
		<Button class="mt-6" href="/dashboard">{$t('backtodashboard')}</Button>
	</div>
</div>
