<script lang="ts">
	import { page } from '$app/stores';
	import { t, type TranslationKeys } from '$locales';

	import FaShareAlt from 'svelte-icons/fa/FaShareAlt.svelte';
	import FaUsers from 'svelte-icons/fa/FaUsers.svelte';
	import FaLink from 'svelte-icons/fa/FaLink.svelte';
	import Modal from './Modal.svelte';

	export let ownerId: string;
	export let userId: string;
	export let access: string[];

	let message: TranslationKeys | undefined;
	let success: boolean;
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
			.then((status) => {
				success = true;
				message = status;
			})
			.catch(() => {
				success = false;
				message = 'unknown';
			});
	}
</script>

<button on:click={() => (show = true)} class="btn btn-primary d-flex gap-2 align-items-center">
	<span>{$t('share')}</span>
	<div class="icon">
		<FaShareAlt />
	</div>
</button>

<Modal bind:show>
	<h2 class="a">{$t('shareboard')}</h2>
	{#if userId === ownerId}
		<div>
			<div class="d-flex align-items-center gap-5 space1 space2">
				<div class="d-flex gap-3">
					<div class="icon i">
						<FaUsers />
					</div>
					<label class="b" for="access">{$t('shareaccess')}</label>
				</div>
			</div>
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
	<div class="space1 space2">
		<div class="d-flex align-items-center gap-5 space2 space1">
			<div class="d-flex gap-3">
				<div class="icon i">
					<FaLink />
				</div>
				<label class="b" for="access">{$t('sharelink')}</label>
			</div>
		</div>
		<div class="space2">
			<button on:click={copyUrl} class="btn btn-primary button">{$t('copylink')}</button>
		</div>
	</div>
	{#if success && message}
		<p class="alert alert-success">{$t(message)}</p>
	{/if}
	{#if !success && message}
		<p class="alert alert-danger">{$t(message)}</p>
	{/if}
</Modal>

<style>
	.alert {
		position: inherit;
		width: 100%;
	}

	.i {
		color: var(--base-500);
	}

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
		margin-top: 7%;
	}

	.space2 {
		margin-bottom: 4%;
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

	.form-control:focus {
		color: var(--base-600);
	}

	.button {
		width: 100%;
	}
</style>
