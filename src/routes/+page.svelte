<script lang="ts">
	import { t } from '$locales';
</script>

<style>
	@font-face {
		font-family: 'Inter';
		src: url('/ruta/de/tu/fuente/Inter-Regular.woff2') format('woff2'),
			url('/ruta/de/tu/fuente/Inter-Regular.woff') format('woff');
		font-weight: normal;
		font-style: normal;
		font-display: swap;
	}

	.landing {
		width: 80%;
	}

	.logo {
		background-color: #ffffff;
		height: 28px;
		width: 128px;
		padding: 0;
		left: 80px;
		top: 25px;
		position: absolute;
	}

	.buttons-container {
		position: absolute;
		top: 25px;
		right: 80px;
		display: flex;
		flex-direction: row;
		gap: 8px;
	}

	.button1,
	.button2,
	.button3 {
		display: flex;
		align-items: center;
		padding: 10px 16px;
		gap: 8px;
		background: #fdf3d7;
		border-radius: 6px;
		font-family: 'Inter', sans-serif;
		font-weight: 600;
		font-size: 16px;
		line-height: 18px;
		color: #caa53d;
		text-decoration: none;
		border: none;
	}

	.button2 {
		width: 91px;
		height: 38px;
		background-color: #f4ca64;
		color: #fcfef4;
	}

	.button3 {
		position: absolute;
		width: 218px;
		height: 60px;
		left: 80px;
		top: 729px;
		font-size: 24px;
		background-color: #f4ca64;
		color: #fcfef4;
		padding-left: 24px;
		padding-right: 24px;
		padding-top: 16px;
		padding-bottom: 16px;
		display: flex;
		flex-direction: row;
		justify-content: center;
		align-items: center;
		gap: 8px;
		position: relative;
		border-style: hidden;
		outline: none;
	}

	.ellipse132 {
		position: absolute;
		width: 123px;
		height: 123px;
		left: 750px;
		top: 142px;
		background: #fb37ff;
		filter: blur(100px);
	}

	.a {
		position: absolute;
		width: 637px;
		height: 328px;
		left: 80px;
		top: 237px;
		color: #212121;
		font-family: 'Inter', sans-serif;
		font-weight: 600;
		font-size: 72px;
		line-height: 82px;
		letter-spacing: -2px;
	}

	.b {
		position: absolute;
		width: 637px;
		height: 72px;
		left: 80px;
		top: 589px;
		color: #4d4d4d;
		text-align: left;
		vertical-align: text-top;
		font-size: 24px;
		font-family: 'Inter', sans-serif;
		letter-spacing: 0.5px;
		line-height: 36px;
		border-style: hidden;
		outline: none;
		width: 637px;
	}

	.c {
		position: absolute;
		width: 468px;
		height: 427px;
		left: 750px;
		top: 245px;
		max-width: 100%;
		height: auto;
	}

	.paragraph {
		position: absolute;
		width: 820px;
		height: 190px;
		left: 80px;
		top: 989px;
	}

	.d {
		text-align:left;
		vertical-align:text-top;
		line-height:auto;
		border-style:hidden;
		outline:none;
		width:560px;
		font-family: 'Inter', sans-serif;
		font-style: normal;
		font-weight: 600;
		font-size: 48px;
		line-height: 58px;
		color: #212121;
	}

	.e {}

	@media (max-width: 768px) {
	}
</style>
<section class="landing">
	<div><img class="logo" src="/Logo.png" alt=""></div>
	<div class="buttons-container">
		<a class="button1" href="/login">{$t('login')}</a>
		<a class="button2" href="/signup">{$t('signup')}</a>
</div>
	<div class='ellipse132'></div>
	<div class="a">{$t('herotitle')}</div>
	<div class="b">{$t('herodesc')}</div>
	<div class="c"><img src="Group 12.png" alt=""></div>
	<a class="button3" href="/login">{$t('getstarted')}</a>
	<div class='paragraph'>
		<div class="d">{$t('feat1title')}</div>
		<div class="e">{$t('feat1desc')}</div>
	</div>
		
</section>