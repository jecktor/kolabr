<script lang="ts">
	import { t } from '$locales';
</script>

<svelte:head>
	<title>Kolabr | {$t('footertitle')}</title>
	<meta name="description" content={$t('herotitle')} />
</svelte:head>

<header>
	<div class="header_node">
		<a href="/#">
			<img class="logo img-fluid" src="Logo.png" alt="logo" />
		</a>
	</div>
	<div class="header_node">
		<div class="buttons">
			<a class="button1 btn btn-secondary" href="/login">{$t('login')}</a>
			<a class="button2 btn btn-secondary space3" href="/signup">{$t('signup')}</a>
		</div>
	</div>
</header>
<div class="space row justify-content-center">
	<div class="col-md-8 justify-content-center">
		<h1 class="a">{$t('herotitle')}</h1>
		<br />
		<h3 class="b f">{$t('herodesc')}</h3>
		<br />
	</div>
	<div class="space col-md-8 justify-content-center">
		<a class="button3 btn btn-secondary" href="/login">{$t('getstarted')}</a>
	</div>
	<div class="space row justify-content-center text-center">
		<div class="col-md-6">
			<img class="img img-fluid img-responsive" src="Group 12.png" alt="" />
		</div>
	</div>
	<div class="space1 col-md-8">
		<h1 class="d">{$t('feat1title')}</h1>
		<br />
		<h3 class="b c">{$t('feat1desc')}</h3>
		<br />
	</div>
	<div class="space1 col-md-8">
		<h1 class="d">{$t('feat2title')}</h1>
		<br />
		<h3 class="b c">{$t('feat2desc')}</h3>
		<br />
	</div>
	<div class="space row justify-content-center text-center">
		<div class="col-md-6">
			<img class="img1 img-fluid img-responsive" src="Group 11.png" alt="" />
		</div>
	</div>
	<div class="space1 col-md-8">
		<h1 class="d">{$t('feat3title')}</h1>
		<br />
		<h3 class="b c">{$t('feat3desc')}</h3>
		<br />
	</div>
	<div class="space1 col-md-8">
		<h1 class="d">{$t('feat4title')}</h1>
		<br />
		<h3 class="b c">{$t('feat4desc')}</h3>
		<br />
	</div>
	<div class="space row justify-content-center text-center">
		<div class="col-md-6">
			<img class="img img-fluid img-responsive" src="Group 10.png" alt="" />
		</div>
	</div>
	<div class="footer col-md-10">
		<h1 class="d g space2">{$t('footertitle')}</h1>
		<br />
		<h3 class="h">{$t('footerdesc')}</h3>
		<br />
		<p class="h space2">Kolabr &copy; 2023</p>
	</div>
</div>

<style>
	.a {
		width: 100%;
		height: auto;
		color: #212121;
		font-family: 'Inter', sans-serif;
		font-weight: 600;
		font-size: 68px;
		line-height: 82px;
		letter-spacing: -2px;
		text-align: left;
	}

	.b {
		width: 100%;
		height: auto;
		color: #4d4d4d;
		text-align: left;
		font-size: 24px;
		font-family: 'Inter', sans-serif;
		letter-spacing: 0.5px;
		line-height: 36px;
	}

	.img {
		width: 100%;
		max-width: 468px;
		height: auto;
		max-height: 427px;
	}

	.img1 {
		width: 100%;
		max-width: 632px;
		height: auto;
		max-height: 708px;
	}

	.d {
		text-align: left;
		font-family: 'Inter', sans-serif;
		font-weight: 600;
		font-size: 48px;
		line-height: 58px;
		color: #212121;
	}

	.g {
		text-align: center;
	}

	.footer {
		border-top: 1px solid #d3d3d3;
	}

	.h {
		width: 100%;
		height: auto;
		color: #4d4d4d;
		text-align: left;
		font-size: 24px;
		font-family: 'Inter', sans-serif;
		letter-spacing: 0.5px;
		line-height: 36px;
		text-align: center;
		color: #7a7a7a;
	}

	header {
		height: 20%;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-inline: 40px;
		padding-block: 22px;
		margin-bottom: 10%;
		width: 100%;
	}

	.header_node {
		display: flex;
		align-items: center;
		gap: 25px;
	}

	.header_node {
		color: var(--base-600);
	}

	.logo {
		background-color: #ffffff;
		height: 28px;
		align-items: center;
	}

	.buttons {
		width: auto;
		height: 40px auto;
		border-radius: 90px;
	}

	.button1,
	.button2,
	.button3 {
		background: #fdf3d7;
		font-family: 'Inter', sans-serif;
		font-size: 16px;
		color: #caa53d;
		border-style: none;
		justify-content: center;
		align-items: center;
		gap: 8px;
		outline: none;
	}

	.button2 {
		background-color: #f4ca64;
		color: #fcfef4;
	}

	.button3 {
		width: 218px;
		height: 60px;
		font-size: 24px;
		background-color: #f4ca64;
		color: #fcfef4;
		padding: 16px 24px;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 8px;
		border-style: hidden;
		outline: none;
	}

	.space {
		margin-bottom: 5%;
	}

	.space1 {
		margin-bottom: 5%;
	}

	.space2 {
		margin-top: 5%;
	}

	.space3 {
		margin-left: 20px;
	}

	.img-responsive:hover {
		transform: scale(1.1);
		transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
		cursor: pointer;
	}

	@media (max-width: 768px) {
		header {
			padding-inline: 15px;
			padding-block: 12px;
			margin-bottom: 10%;
			width: 100%;
		}

		.a {
			width: 90%;
			height: auto;
			color: #212121;
			font-family: 'Inter', sans-serif;
			font-weight: 600;
			font-size: 38px;
			line-height: 50px;
			letter-spacing: -2px;
			text-align: left;
			margin-left: 10px;
		}

		.b {
			width: 90%;
			height: auto;
			color: #4d4d4d;
			text-align: left;
			font-size: 14px;
			font-family: 'Inter', sans-serif;
			letter-spacing: 0.5px;
			line-height: 18px;
			margin-left: 10px;
		}

		.img {
			width: 90%;
			max-width: 327px;
			height: auto;
			max-height: 299px;
		}

		.img1 {
			width: 90%;
			max-width: 355px;
			height: auto;
			max-height: 398px;
		}

		.c {
			width: auto;
		}

		.d {
			text-align: left;
			font-family: 'Inter', sans-serif;
			font-weight: 600;
			font-size: 18px;
			line-height: auto;
			color: #212121;
			margin-left: 10px;
			margin-bottom: 2px;
			height: 30px;
		}

		.buttons {
			width: auto;
			height: 40px auto;
			border-radius: 90px;
		}

		.button1,
		.button2,
		.button3 {
			background: #fdf3d7;
			font-family: 'Inter', sans-serif;
			font-size: 14px;
			color: #caa53d;
			border-style: none;
			justify-content: center;
			align-items: center;
			gap: 8px;
			outline: none;
		}

		.button2 {
			background-color: #f4ca64;
			color: #fcfef4;
		}

		.button3 {
			width: 135px;
			height: 40px;
			background-color: #f4ca64;
			color: #fcfef4;
			padding: 10px 20px;
			display: flex;
			justify-content: center;
			align-items: center;
			gap: 8px;
			border-style: hidden;
			outline: none;
			margin-left: 10px;
		}

		.space {
			margin-bottom: 10%;
		}

		.space1 {
			margin-bottom: 1px;
		}

		.space2 {
			margin-top: 5%;
		}

		.space3 {
			margin-left: 3vh;
		}

		.img-responsive:hover {
			transform: scale(1.1);
			transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
			cursor: pointer;
		}

		.g {
			text-align: center;
		}

		.footer {
			border-top: 1px solid #d3d3d3;
		}

		.h {
			width: 90%;
			height: auto;
			color: #4d4d4d;
			font-size: 14px;
			font-family: 'Inter', sans-serif;
			letter-spacing: 0.5px;
			line-height: 18px;
			text-align: center;
			color: #7a7a7a;
			margin-left: auto;
			margin-right: auto;
		}

		.f {
			width: 65%;
		}
	}
</style>
