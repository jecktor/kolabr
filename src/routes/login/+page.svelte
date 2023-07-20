<script lang="ts">
	import { enhance } from '$app/forms';
	import { t, type TranslationKeys } from '$locales';

	export let form: { message?: TranslationKeys };
</script>

<svelte:head>
	<title>{$t('login')} | Kolabr</title>
	<meta name="description" content={$t('herotitle')} />
</svelte:head>

<div class="container">
	<div class="row justify-content-center">
		<div>
			<div class="login-wrapper">
				<h2 class="a">{$t('login')}</h2>
				<form method="post" use:enhance>
					<div class="form-group mb-4">
						<label class="b" for="email">{$t('email')}</label>
						<input type="email" id="email" name="email" class="form-control c" required />
					</div>
					<div class="form-group mb-4">
						<label class="b" for="password">{$t('pass')}</label>
						<input type="password" id="password" name="password" class="form-control c" required />
					</div>
					<button type="submit" class="button btn btn-secondary btn-lg btn-block"
						>{$t('continues')}</button
					>
				</form>
				<a
					class="b text-center link-secondary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover"
					href="/signup">{$t('create')}</a
				>
			</div>
		</div>
	</div>
	{#if form?.message}
		<p class="b alert alert-danger">{$t(form.message)}</p>
	{/if}
</div>

<style>
	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
	}

	.login-wrapper {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		padding: 40px;
		gap: 25px;
		width: 500px;
		background: var(--base-100);
		border: 1px solid var(--base-300);
		border-radius: 12px;
	}

	.a {
		margin-top: 20px;
		width: 100%;
		height: 20px;
		font-family: 'Inter';
		font-style: normal;
		font-weight: 600;
		font-size: 32px;
		line-height: 20px;
	}

	.b {
		font-family: 'Inter';
		font-style: normal;
		font-weight: 400;
		font-size: 16px;
		line-height: 20px;
		margin-bottom: 5%;
	}

	.c {
		width: 100%;
		height: 40px;
		font-size: 16px;
	}

	.button {
		align-items: center;
		padding: 10px 16px;
		gap: 8px;
		background: #f4ca64;
		border-radius: 6px;
		font-family: 'Inter', sans-serif;
		font-weight: 600;
		font-size: 16px;
		line-height: 18px;
		color: #fdf3d7;
		text-decoration: none;
		border: none;
		width: 100%;
	}

	@media (max-width: 768px) {
		.login-wrapper {
			width: 100%;
		}
	}
</style>
