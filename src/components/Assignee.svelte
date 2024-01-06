<script lang="ts">
	import { t } from '$locales';
	import type { IMember } from '$types';

	import * as Avatar from '$components/ui/avatar';
	import { X } from 'lucide-svelte';

	export let member: IMember;

	export let removable = false;
	export let onRemove: (email: string) => void = () => {};
</script>

<div class="flex items-center justify-between space-x-4">
	<div class="flex items-center space-x-4">
		<div class="relative">
			<Avatar.Root>
				<Avatar.Image src={member.image} />
				<Avatar.Fallback>{member.name[0]}</Avatar.Fallback>
			</Avatar.Root>
			{#if removable}
				<button
					class="hover-child absolute inset-0 grid h-full place-items-center rounded-full p-1 hover:bg-background/50"
					aria-label={`${$t('remove')} ${member.name}`}
					title={`${$t('remove')} ${member.name}`}
					on:click={() => onRemove(member.email)}
				>
					<X class="hidden h-4 w-4" />
				</button>
			{/if}
		</div>
		{#if !removable}
			<div>
				<p class="text-sm font-medium leading-none">
					{member.name}
				</p>
				<p class="text-sm text-muted-foreground">
					{member.email}
				</p>
			</div>
		{/if}
	</div>
</div>
