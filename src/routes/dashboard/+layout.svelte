<script lang="ts">
	import FaCog from 'svelte-icons/fa/FaCog.svelte';
	import { enhance } from '$app/forms';
	import { t } from '$locales';

	export let data;
</script>

<header>
	<div class="header_node">
		<a href="/dashboard">
			<img class="logo img-fluid" src="../Logo.png" alt="logo" />
		</a>
	</div>
	<div class="header_node">
		<div class="icon">
			<a class="settings" href="/dashboard/settings" aria-label={$t('settings')}>
				<FaCog />
			</a>
		</div>
		<div class="user">
			<div class="user-wrapper">
				<img class="img1" src={data.user.image} alt="avatar" />
				<div class="hover-content">
					<div class="user-info space">
						<img src={data.user.image} alt="avatar" width="64" height="64" />
						<div class="user-details space space3">
							<h1 class="a">{data.user.name}</h1>
							<h1 class="b">{data.user.email}</h1>
						</div>
					</div>
					<div class="user-actions">
						<a class="space2 c" href="/dashboard/settings">
							<button type="submit" class="c">{$t('settings')}</button>
						</a>
						<form use:enhance method="post" action="?/signout" class="signout">
							<button type="submit" class="c">{$t('signout')}</button>
						</form>
					</div>
				</div>
			</div>
		</div>
	</div>
</header>

<main>
	<slot />
</main>

<style>
	header {
		height: 64px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-inline: 40px;
		padding-block: 12px;
		border-bottom: 1px solid var(--base-300);
	}

	.header_node {
		display: flex;
		align-items: center;
		gap: 25px;
	}

	.header_node .settings {
		color: var(--base-600);
	}

	.logo {
		background-color: var(--base-100);
		height: 28px;
		width: 128px;
	}

	.user-wrapper {
		position: relative;
	}

	.user img {
		width: 40px;
		height: 40px;
		border-radius: 90px;
	}

	.img1:hover + .hover-content,
	.hover-content:hover {
		display: block;
	}

	.hover-content {
		display: none;
		position: absolute;
		top: 100%;
		right: 800%;
		transform: translateX(100%);
		background-color: var(--base-100);
		padding: 20px;
		border: 1px solid var(--base-300);
		border-radius: 9px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		width: 800%;
		z-index: 1;
	}

	.hover-content .user-info {
		display: flex;
		align-items: center;
		gap: 10px;
	}

	.hover-content .user-info img {
		width: 64px;
		height: 64px;
		border-radius: 90px;
	}

	.hover-content .user-details {
		display: flex;
		flex-direction: column;
		gap: 5px;
	}

	.hover-content .user-actions {
		border-top: 1px solid var(--base-300);
		display: flex;
		flex-direction: column;
		gap: 15px;
	}

	.hover-content .user-actions form {
		display: inline;
		background: none;
		border: none;
		color: inherit;
		cursor: pointer;
	}

	.hover-content .user-actions button {
		display: inline-block;
		border: none;
		background: none;
		text-decoration: none;
		cursor: pointer;
		font-family: 'Inter', sans-serif;
		font-size: 16px;
		line-height: 20px;
		padding: 0;
	}

	.signout {
		width: fit-content;
	}

	.space {
		margin-bottom: 5%;
	}

	.space2 {
		margin-top: 20px;
	}

	.space3 {
		margin-top: 5%;
	}

	.a {
		color: var(--base-700);
		font-family: 'Inter', sans-serif;
		font-size: 20px;
		line-height: 20px;
		margin-left: 2px;
	}

	.b {
		color: var(--base-600);
		font-family: 'Inter', sans-serif;
		font-size: 16px;
		line-height: 20px;
		margin-left: 2px;
	}

	.c {
		color: var(--base-700);
		font-family: 'Inter', sans-serif;
		font-size: 16px;
		line-height: 20px;
		width: fit-content;
	}

	.c:hover {
		text-decoration: underline !important;
	}
</style>
