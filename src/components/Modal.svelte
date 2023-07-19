<script lang="ts">
	export let show: boolean = true;

	let dialog: HTMLDialogElement;

	$: dialog && document.body.appendChild(dialog);
	$: if (dialog && show) dialog.showModal();
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-noninteractive-element-interactions -->
{#if show}
	<dialog
		class="dialog"
		bind:this={dialog}
		on:close={() => (show = false)}
		on:click|self={() => dialog.close()}
	>
		<!-- svelte-ignore a11y-no-static-element-interactions -->
		<div on:click|stopPropagation>
			<slot />
		</div>
	</dialog>
{/if}

<style>
	.dialog {
		padding: 40px;
		border: 1px solid var(--base-400);
		border-radius: 12px;
		background: var(--base-100);
		overflow: visible;
	}
</style>
