<script lang="ts">
	import { str2Color } from '$utils';

	import FaTimes from 'svelte-icons/fa/FaTimes.svelte';

	export let id: string;
	export let name: string;
	export let isDeletable = false;
	export let onDelete: (id: string) => void = () => {};
</script>

<div class="tag" style={`background: ${str2Color(id, 50, 90)}; color: ${str2Color(id, 50, 30)}`}>
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
	.tag {
		display: flex;
		align-items: center;
		justify-content: center;
		background: var(--base-100);
		border-radius: 90px;
		width: fit-content;
		padding: 4px 10px;
		font-size: 1.4rem;
		font-weight: 600;
	}

	.tag button {
		border: none;
		background: none;
		text-decoration: none;
		cursor: pointer;
		font-size: 28px;
		color: inherit;
	}

	.icon {
		line-height: 0;
	}
</style>
