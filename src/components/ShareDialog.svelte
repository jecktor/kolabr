<script lang="ts">
	import { page } from '$app/stores';
	import { t, type TranslationKeys } from '$locales';

	import FaShareAlt from 'svelte-icons/fa/FaShareAlt.svelte';
	import Modal from './Modal.svelte';

	export let ownerId: string;
	export let userId: string;
	export let access: string[];

	let message: TranslationKeys | undefined;
	let accessInput: HTMLInputElement;

	let show = false;

	function copyUrl() {
		navigator.clipboard.writeText($page.url.href).then(() => (message = 'linkcopied'));
	}

	function updateAccess() {
		const boardId = $page.url.href.split('/').pop();
		const access = accessInput.value;

		const opts = {
			method: 'POST',
			body: JSON.stringify({ access, boardId }),
			headers: {
				'content-type': 'application/json'
			}
		};

		fetch('/api/board/access', opts)
			.then((res) => res.json())
			.then((status) => (message = status))
			.catch(() => (message = 'unknown'));
	}
</script>

<button on:click={() => (show = true)} class="btn btn-primary d-flex gap-2 align-items-center">
	<span>{$t('share')}</span>
	<div class="icon">
		<FaShareAlt />
	</div>
</button>

<Modal bind:show>
	<h2>{$t('shareboard')}</h2>
	{#if userId === ownerId}
		<div>
			<label for="access">{$t('shareaccess')}</label>
			<input
				bind:this={accessInput}
				type="text"
				name="access"
				id="access"
				value={access.join(', ')}
				placeholder={$t('shareemail')}
			/>
			<button on:click={updateAccess}>{$t('updateaccess')}</button>
		</div>
	{/if}
	<label for="access">{$t('sharelink')}</label>
	<button on:click={copyUrl}>{$t('copylink')}</button>
	{#if message}
		<p>{$t(message)}</p>
	{/if}
</Modal>
