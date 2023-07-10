<script lang="ts">
	import { enhance } from '$app/forms';
	import { t, type TranslationKeys } from '$locales';

	export let form: { message?: TranslationKeys };
</script>

<h2>{$t('signup')}</h2>
<form method="post" use:enhance>
	<label for="name">{$t('name')}</label><br />
	<input id="name" name="name" required /><br />
	<label for="email">{$t('email')}</label><br />
	<input type="email" id="email" name="email" required /><br />
	<label for="pass">{$t('pass')}</label><br />
	<input type="password" id="pass" name="pass" required /><br />
	<label for="passconfirm">{$t('passconfirm')}</label><br />
	<input type="password" id="passconfirm" name="passconfirm" required /><br />
	<input type="submit" value={$t('continues')} />
</form>
{#if form?.message}
	<p>{$t(form.message)}</p>
{/if}
<a href="/login">{$t('login')}</a>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');

	.signup-wrapper{
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		padding: 40px;
		gap: 25px;
		width: 100%;
		max-width: 498px;
		margin: auto;
		background: #FFFFFF;
		border: 1px solid #D3D3D3;
		border-radius: 12px;
		position: relative;
		top: 50%;
	}

	.btn-primary{
		width: 100%;
	}

	.a{
		margin-top: 20px;
		width: 100px;
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
	}
</style>
