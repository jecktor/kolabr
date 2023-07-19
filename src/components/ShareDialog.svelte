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
	<h2 class="a space1">{$t('shareboard')}</h2>
	{#if userId === ownerId}
		<div class="space1">
			<label class="b space2" for="access">{$t('shareaccess')}</label>
			<div class="space2">
				<input
				bind:this={accessInput}
				type="text"
				name="access"
				id="access"
				value={access.join(', ')}
				placeholder={$t('shareemail')}
				class="form-control"
				/>
			</div>
			<button on:click={updateAccess} class="btn btn-primary button">{$t('updateaccess')}</button>
		</div>
	{/if}
	<div class="space2">
		<label class="b" for="access">{$t('sharelink')}</label>
	</div>
	<div class="space2">
		<button on:click={copyUrl} class="btn btn-primary button">{$t('copylink')}</button>
	</div>
	{#if message}
		<p>{$t(message)}</p>
	{/if}
</Modal>

<style>
	
	.a {
		font-family: 'Inter';
		font-style: normal;
		font-weight: 700;
		font-size: 32px;
		line-height: 39px;
		color: var(--base-600);
		border: none;
		box-shadow: none;
	}
	.space1 {
		margin-bottom: 5%;
	}
	.space2 {
		margin-bottom: 3%;
	}
	.b {
		font-family: 'Inter';
		font-style: normal;
		font-weight: 400;
		font-size: 16px;
		line-height: 19px;
		letter-spacing: -0.2px;
		color: var(--base-600);
		white-space: nowrap;
	}
	.form-control {
		font-family: 'Inter';
		font-style: normal;
		font-weight: 400;
		font-size: 16px;
		line-height: 19px;
		letter-spacing: -0.2px;
		color: var(--base-400);
		white-space: nowrap;
	}
	.button {
		width: 100%;
	}
</style>