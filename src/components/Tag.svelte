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
	}
	.icon {
		line-height: 0;
	}
	.name {
		padding: 6px 12px;
		font-size: 14px;
		font-weight: bold;
		border-radius: 12px; 
		background-color: #17a2b8; 
    	color: #fff; 
	}
	.space1 {
		margin-top: 2%;
	}
</style>