<script lang="ts">
	import FaCog from 'svelte-icons/fa/FaCog.svelte';

	export let data;
</script>

<header>
	<div class="header_node">
		<a href="/dashboard">
			<img class="logo img-fluid" src="Logo.png" alt="logo" />
		</a>
	</div>
	<div class="header_node">
		<div class="icon">
			<a class="settings" href="/dashboard/settings">
				<FaCog />
			</a>
		</div>
		<div class="user">
			<img src={data.user.image} alt="avatar" />
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

	.user img {
		width: 40px;
		height: 40px;
		border-radius: 90px;
	}
</style>
