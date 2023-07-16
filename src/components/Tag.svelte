<script lang="ts">
	import FaTimes from 'svelte-icons/fa/FaTimes.svelte';

	export let id: string;
	export let name: string;
	export let isDeletable = false;
	export let onDelete: (id: string) => void = () => {};
</script>

<div class="tag">
	<span class="name">{name}</span>
	{#if isDeletable}
		<button class="delete" on:click={() => onDelete(id)}>
			<div class="icon">
				<FaTimes />
			</div>
		</button>
	{/if}
</div>
