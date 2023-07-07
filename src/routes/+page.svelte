<script lang="ts">
	import { t } from '$locales';
</script>

<style>
	.logo { background-color: #ffffff; height: 28px; width: 128px; padding: 0px; left: 80px; top: 25px; position: absolute; }
	.buttons-container { position: absolute; top: 25px; right: 80px; display: flex; flex-direction: row; gap: 8px; }
	.button1, .button2 { background-color: #fdf3d7; height: 38px; width: 79px; border-radius: 6px; padding: 0; display: flex; justify-content: center; align-items: center; border-style: hidden; outline: none; text-decoration: none; font-weight: bold; }
	.button2 { width: 91px; background-color: #f4ca64; }
	.hero-content { margin-top: 70px; margin-left: 220px; }


	@media (max-width: 576px) {
		.logo { left: 20px; top: 15px; width: 100px; }
		.buttons-container { top: 15px; right: 20px; }
		.button, .button2 { width: 100px; }
		.hero-content { margin-top: 40px; margin-left: 20px; }
	}
</style>

<section class="landing">
	<div><img class="logo" src="/Logo.png" alt=""></div>
	<div class="buttons-container">
		<a class="button1 btn btn-primary" href="/login">{$t('login')}</a>
		<a class="button2 btn btn-primary" href="/signup">{$t('signup')}</a>
	</div>
	<div class="hero-content">
		<h1>{$t('herotitle')}</h1>
		<p>{$t('herodesc')}</p>
		<a href="/login">{$t('login')}</a>
		<a href="/signup">{$t('signup')}</a>
	</div>
</section>