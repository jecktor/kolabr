<script lang="ts">
	import { enhance } from '$app/forms';
	import { t, locale } from '$locales';
	import { boardTemplates } from '$utils';

	import { buttonVariants } from '$components/ui/button';
	import * as Dialog from '$components/ui/dialog';
	import * as Card from '$components/ui/card';
</script>

<Dialog.Root>
	<Dialog.Trigger class={buttonVariants({ variant: 'default' })}>
		{$t('createboard')}
	</Dialog.Trigger>
	<Dialog.Content class="max-w-[425px] lg:max-w-fit">
		<Dialog.Header>
			<Dialog.Title>
				{$t('createboard')}
			</Dialog.Title>
			<Dialog.Description>
				{$t('createboarddesc')}
			</Dialog.Description>
		</Dialog.Header>
		<div
			class="grid max-h-[50vh] grid-cols-1 place-items-center gap-6 overflow-scroll lg:grid-cols-2"
		>
			{#each boardTemplates as template (template[$locale].name)}
				<form class="h-full w-60 cursor-pointer" use:enhance action="?/newboard" method="post">
					<input type="hidden" name="template" value={JSON.stringify(template[$locale].board)} />
					<button class="h-full" type="submit">
						<Card.Root class="h-full hover:border-primary">
							<Card.Header class="text-left">
								<Card.Title>{template[$locale].name}</Card.Title>
								<Card.Description>{template[$locale].description}</Card.Description>
							</Card.Header>
						</Card.Root>
					</button>
				</form>
			{/each}
		</div>
	</Dialog.Content>
</Dialog.Root>
