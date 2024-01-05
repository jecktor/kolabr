<script lang="ts">
	import { Badge } from '$components/ui/badge';
	import { X } from 'lucide-svelte';

	export let tag: { _id: string; name: string; color: string };
	export let deletable = false;
	export let onDelete: (_id: string) => void = () => {};
</script>

<Badge class="flex items-center gap-2 text-white" style={`background: ${tag.color}`}>
	<span>{tag.name}</span>
	<slot />
	{#if deletable}
		<button class="border-none bg-transparent outline-none" on:click={() => onDelete(tag._id)}>
			<X class="h-4 w-4" />
		</button>
	{/if}
</Badge>
