<script lang="ts">
	import { page } from '$app/stores';
	import { t, type TranslationKeys } from '$locales';

	import FaShareAlt from 'svelte-icons/fa/FaShareAlt.svelte';
	import Modal from './Modal.svelte';

	let message: TranslationKeys | undefined;

	let show = false;

	function copyUrl() {
		navigator.clipboard.writeText($page.url.href).then(() => (message = 'linkcopied'));
	}

	function changeAccess(e: SubmitEvent) {
		const form = new FormData(e.currentTarget as HTMLFormElement);
		const access = form.get('access');
		const board = $page.url.href.split('/').pop();

		const opts = {
			method: 'POST',
			body: JSON.stringify({ access, board }),
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
	<form on:submit|preventDefault={changeAccess}>
		<div>
			<label for="access">{$t('shareaccess')}</label>
			<input type="text" name="access" id="access" placeholder={$t('shareemail')} />
			<input type="submit" value={$t('updateaccess')} />
		</div>
		<label for="access">{$t('sharelink')}</label>
		<button on:click={copyUrl} type="button">{$t('copylink')}</button>
	</form>
	{#if message}
		<p>{$t(message)}</p>
	{/if}
</Modal>
