<script lang="ts">
	export let to: string;
	export let active: boolean;
</script>

{#if active}
	<a class="flex items-center gap-3 rounded-lg bg-muted px-3 py-2 dark:bg-muted/50" href={to}>
		<slot />
	</a>
{:else}
	<a
		class="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground hover:text-foreground"
		href={to}
	>
		<slot />
	</a>
{/if}
