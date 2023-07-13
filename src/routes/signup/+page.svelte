<script lang="ts">
	import { enhance } from '$app/forms';
	import { t, type TranslationKeys } from '$locales';

	export let form: { message?: TranslationKeys };
</script>


<style>
	@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');

	.container {
		display: flex;
		justify-content: center;
		align-items: center;
		height: 100vh;
	}
	.signup-wrapper {
		box-sizing: border-box;
		display: flex;
		flex-direction: column;
		padding: 40px;
		gap: 25px;
		width: 100%;
		max-width: 498px;
		background: #FFFFFF;
		border: 1px solid #D3D3D3;
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
</style>

<div class="container">
	<div class="row justify-content-center">
		<div class="col-md-6">
			<div class="signup-wrapper">
				<h2 class="a">{$t('signup')}</h2>
				<form method="post" use:enhance>
					<div class="form-group mb-4">
						<label class="b" for="name">{$t('name')}</label>
						<input id="name" name="name" class="form-control c" required />
					</div>
					<div class="form-group mb-4">
						<label class="b" for="email">{$t('email')}</label>
						<input type="email" id="email" name="email" class="form-control c" required />
					</div>
					<div class="form-group mb-4">
						<label class="b" for="pass">{$t('pass')}</label>
						<input type="password" id="pass" name="pass" class="form-control c" required />
					</div>
					<div class="form-group mb-4">
						<label class="b" for="passconfirm">{$t('passconfirm')}</label>
						<input type="password" id="passconfirm" name="passconfirm" class="form-control c" required />
					</div>
					<button type="submit" class="button btn btn-secondary btn-lg btn-block">{$t('continues')}</button>
				</form>
				{#if form?.message}
					<p class="b alert alert-danger">{$t(form.message)}</p>
				{/if}
				<a href="/login" class="b text-center link-secondary link-offset-2 link-underline-opacity-25 link-underline-opacity-100-hover">{$t('login')}</a>
			</div>
		</div>
	</div>
</div>
