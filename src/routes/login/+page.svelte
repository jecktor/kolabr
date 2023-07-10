<script lang="ts">
	import { enhance } from '$app/forms';
	import { t, type TranslationKeys } from '$locales';

	export let form: { message?: TranslationKeys };
</script>


<style>
	@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');

	.login-wrapper {
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

	.btn-primary {
		width: 100%;
	}

	.a {
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

<div class="container">
	<div class="row justify-content-center">
		<div class="col-md-6">
			<div class="login-wrapper">
				<h2 class="a">{$t('login')}</h2>
				<form method="post" use:enhance>
					<div class="form-group mb-4">
						<label class="b" for="email">{$t("email")}</label>
						<input type="email" id="email" name="email" class="form-control" required>
					</div>
					<div class="form-group mb-4">
						<label class="b" for="password">{$t("pass")}</label>
						<input type="password" id="password" name="password" class="form-control" required>
					</div>
					<button type="submit" class="btn btn-primary btn-lg btn-block">{$t("continues")}</button>
				</form>
				{#if form?.message}
				<p>{$t(form.message)}</p>
				{/if}
				<a class="text-center" href="/signup">Create an account</a>
			</div>
		</div>
	</div>
</div>
