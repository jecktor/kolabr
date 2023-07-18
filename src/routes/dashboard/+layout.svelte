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
			<a class="settings" href="/dashboard/settings">
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
						<a class="space2" href="/dashboard/settings">
							<button type="submit" class="button-text c">{$t('settings')}</button>
						</a>
						<form use:enhance method="post" action="?/signout">
							<button type="submit" class="button-text c">{$t('signout')}</button>
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
		background-color: #ffffff;
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
		background-color: #ffffff;
		padding: 20px;
		border: 1px solid #d3d3d3;
		border-radius: 9px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
		width: 800%;
		height: 600%;
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
		border-top: 1px solid #d3d3d3;
		display: flex;
		flex-direction: column;
		gap: 10px;
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
	.space {
		margin-bottom: 5%;
	}
	.space2 {
		margin-top: 5%;;
	}
	.space3 {
		margin-top: 5%;;
	}
	.a {
		color: #212121;
		font-family: 'Inter', sans-serif;
		font-size: 20px;
		line-height: 20px;
		margin-left: 2px;
	}
	.b {
		color: #4d4d4d;
		font-family: 'Inter', sans-serif;
		font-size: 16px;
		line-height: 20px;
		margin-left: 2px;
	}
	.c {
		font-family: 'Inter', sans-serif;
		font-size: 16px;
		line-height: 20px;
		font-weight: normal;
	}
</style>
