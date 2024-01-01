<script lang="ts">
	import { str2Color } from '$utils';

	import { Badge } from '$components/ui/badge';
	import { X } from 'lucide-svelte';

	export let id: string;
	export let name: string;
	export let isDeletable = false;
	export let onDelete: (id: string) => void = () => {};
</script>

<Badge class="text-white" style={`background: ${str2Color(id, 80, 40)}`}>
	<span>{name}</span>
	{#if isDeletable}
		<button class="border-none bg-transparent outline-none" on:click={() => onDelete(id)}>
			<X class="ml-2 h-3 w-3" />
		</button>
	{/if}
</Badge>
