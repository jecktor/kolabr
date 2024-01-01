<script lang="ts">
	import { t } from '$locales';

	import { Button } from '$components/ui/button';
	import { Radio, MousePointerSquare, Workflow, LayoutList } from 'lucide-svelte';
</script>

<svelte:head>
	<title>Kolabr – {$t('footertitle')}</title>
	<meta name="description" content={$t('herotitle')} />
</svelte:head>

<header class="sticky top-0 z-50 w-full border-b bg-background/90 backdrop-blur-lg">
	<div class="container flex h-[60px] items-center justify-between gap-4 px-8">
		<a class="flex items-center gap-2" href="/">
			<img class="h-5 w-5" src="/logo.svg" alt="" aria-hidden="true" />
			<span class="text-xl font-bold">Kolabr</span>
		</a>
		<div class="flex gap-2">
			<Button variant="outline" href="/login">{$t('login')}</Button>
			<Button variant="secondary" href="/signup">{$t('signup')}</Button>
		</div>
	</div>
</header>

<main>
	<section class="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
		<div class="container flex max-w-[72rem] flex-col items-center gap-4 text-center">
			<a
				href="http://github.com/jecktor/kolabr"
				target="_blank"
				rel="noopener noreferrer"
				class="rounded-2xl bg-muted px-4 py-1.5 text-sm font-medium">{$t('opensource')}</a
			>
			<h1 class="text-3xl font-bold sm:text-5xl md:text-6xl lg:text-7xl">{$t('herotitle')}</h1>
			<p class="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
				{$t('herodesc')}
			</p>
			<Button class="px-8" href="/login">{$t('getstarted')}</Button>
		</div>
	</section>

	<section class="container space-y-6 bg-muted/50 py-8 md:py-12 lg:py-24 dark:bg-transparent">
		<div class="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
			<h2 class="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-6xl">{$t('feattitle')}</h2>
			<p class="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
				{$t('featdesc')}
			</p>
		</div>
		<div class="mx-auto grid justify-center gap-4 md:max-w-[64rem] md:grid-cols-2">
			<div class="relative overflow-hidden rounded-lg border bg-background p-2">
				<div class="flex flex-col justify-between gap-2 rounded-md p-6">
					<Radio class="h-12 w-12" />
					<div class="space-y-2">
						<h3 class="font-bold">{$t('feat1title')}</h3>
						<p class="text-sm text-muted-foreground">{$t('feat1desc')}</p>
					</div>
				</div>
			</div>

			<div class="relative overflow-hidden rounded-lg border bg-background p-2">
				<div class="flex flex-col justify-between gap-2 rounded-md p-6">
					<MousePointerSquare class="h-12 w-12" />
					<div class="space-y-2">
						<h3 class="font-bold">{$t('feat2title')}</h3>
						<p class="text-sm text-muted-foreground">{$t('feat2desc')}</p>
					</div>
				</div>
			</div>

			<div class="relative overflow-hidden rounded-lg border bg-background p-2">
				<div class="flex flex-col justify-between gap-2 rounded-md p-6">
					<Workflow class="h-12 w-12" />
					<div class="space-y-2">
						<h3 class="font-bold">{$t('feat3title')}</h3>
						<p class="text-sm text-muted-foreground">{$t('feat3desc')}</p>
					</div>
				</div>
			</div>

			<div class="relative overflow-hidden rounded-lg border bg-background p-2">
				<div class="flex flex-col justify-between gap-2 rounded-md p-6">
					<LayoutList class="h-12 w-12" />
					<div class="space-y-2">
						<h3 class="font-bold">{$t('feat4title')}</h3>
						<p class="text-sm text-muted-foreground">{$t('feat4desc')}</p>
					</div>
				</div>
			</div>
		</div>
	</section>

	<section class="container py-8 md:py-12 lg:py-24">
		<div class="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
			<h4 class="text-3xl font-bold leading-[1.1] sm:text-3xl md:text-6xl">{$t('footertitle')}</h4>
			<p class="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
				{$t('footerdesc')}
			</p>
		</div>
	</section>
</main>

<footer>
	<div class="container flex justify-center py-10 md:h-24 md:flex-row md:py-0">
		<div class="flex items-center gap-2 px-8">
			<img class="h-5 w-5" src="/logo.svg" alt="" aria-hidden="true" />
			<p class="text-center text-sm leading-loose md:text-left">{new Date().getFullYear()}</p>
		</div>
	</div>
</footer>
