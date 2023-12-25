<script lang="ts">
	import { t, locale } from '$locales';
	import { boardTemplates } from '$utils';
</script>

<section>
	<h1 class="mb-4 text-2xl font-bold">{$t('createboard')}</h1>
	<div class="flex flex-wrap justify-between gap-4">
		{#each boardTemplates as template (template[$locale].name)}
			<form class="flex w-full flex-col items-center md:w-60" action="?/newboard" method="post">
				<input type="hidden" name="template" value={JSON.stringify(template[$locale].board)} />
				<button
					type="submit"
					class="h-40 cursor-pointer overflow-hidden rounded border hover:border-primary"
				>
					<img class="max-w-full" src={template[$locale].image} alt="" aria-hidden="true" />
				</button>
				<span class="mt-2 inline-block">{template[$locale].name}</span>
			</form>
		{/each}
	</div>
</section>
