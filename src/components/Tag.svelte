<script lang="ts">
	import FaTimes from 'svelte-icons/fa/FaTimes.svelte';

	export let id: string;
	export let name: string;
	export let isDeletable = false;
	export let onDelete: (id: string) => void = () => {};
</script>

<div class="tag space1">
	<span class="name">{name}</span>
	{#if isDeletable}
		<button class="delete" on:click={() => onDelete(id)}>
			<div class="icon">
				<FaTimes />
			</div>
		</button>
	{/if}
</div>

<style>
	.tag button {
		border: none;
		background: none;
		text-decoration: none;
		cursor: pointer;
		font-size: 28px;
		color: #7A7A7A;
	}
	.tag {
		display: flex;
		align-items: center;
		justify-content: center;
		background: #FFFFFF;
		border-radius: 6px;
		width: 30%;
	}
	.icon {
		line-height: 0;
	}
</style>