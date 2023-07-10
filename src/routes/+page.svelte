<script lang="ts">
	import { t } from '$locales';
</script>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');

	.landing {
		background-color: #ffffff;
		height: 10px;
		width: auto;
		padding: 0px;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.logo {
		background-color: #ffffff;
		height: 28px;
		width: 128px;
		padding: 0;
		position: absolute;
		top: 25px;
		left: 80px;
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
		background-color: #f4ca64;
		color: #fcfef4;
		margin-left: 20px;
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
		padding: 16px 24px;
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 8px;
		border-style: hidden;
		outline: none;
	}

	.ellipse132 {
		position: absolute;
		width: 123px;
		height: 123px;
		left: 983px;
		top: 142px;
		background: #fb37ff;
		filter: blur(100px);
	}

	.ellipse133 {
		position: absolute;
		width: 123px;
		height: 123px;
		left: 1311px;
		top: 671px;
		background: #18B2DE;
		filter: blur(100px);
	}

	.a {
		position: absolute;
		width: 807px;
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
		font-size: 24px;
		font-family: 'Inter', sans-serif;
		letter-spacing: 0.5px;
		line-height: 36px;
	}

	.img1 {
		position: absolute;
		width: 468px;
		height: 427px;
		left: 921px;
		top: 245px;
		max-width: 100%;
		height: auto;
	}

	.img2 {
		position: absolute;
		width: 98px;
		height: 62px;
		left: 780px;
		top: 1288px;
	}

	.img3 {
		position: absolute;
		width: 632px;
		height: 708px;
		left: 995px;
		top: 925px;
	}

	.img4 {
		position: absolute;
		width: 498px;
		height: 396px;
		left: 177px;
		top: 1811px;
	}

	.img-responsive:hover {
        transform: scale(1.1);
		transition: transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        cursor: pointer;
    }

	.paragraph {
		position: absolute;
		width: 820px;
		height: 190px;
		left: 80px;
		top: 989px;
	}

	.paragraph2 {
		position: absolute;
		width: 820px;
		height: 190px;
		left: 80px;
		top: 1279px;
	}

	.paragraph3 {
		position: absolute;
		width: 820px;
		height: 226px;
		left: 828px;
		top: 1783px;
	}

	.paragraph4 {
		position: absolute;
		width: 820px;
		height: 190px;
		left: 828px;
		top: 2109px;
	}

	.paragraph5 {
		position: absolute;
		width: 853px;
		height: 190px;
		left: 358px;
		top: 80px;
	}

	.d {
		text-align: left;
		font-family: 'Inter', sans-serif;
		font-weight: 600;
		font-size: 48px;
		line-height: 58px;
		color: #212121;
	}

	.e {
		width: 820px;
		height: 108px;
		left: 80px;
		top: 1076px;
		color: #4d4d4d;
		text-align: left;
		font-size: 24px;
		font-family: 'Inter', sans-serif;
		letter-spacing: 0.5px;
		line-height: 36px;
		margin-top: 20px;
	}

	.f {
		text-align: right;
	}

	.g {
		text-align: center;
	}

	.rectangle316 {
		position: absolute;
		width: 1292px;
		height: 53px;
		left: 218px;
		top: 1681px;
		background: linear-gradient(93.51deg, #9B51E0 2.84%, #3081ED 99.18%);
		filter: blur(100px);
		border-radius: 10px;
	}

	.footer {
		box-sizing: border-box;
		position: absolute;
		width: 1568px;
		height: 454px;
		left: 80px;
		top: 2499px;
		border-top: 1px solid #D3D3D3;
	}

	.h {
		position: absolute;
		width: 140px;
		height: 24px;
		left: 714px;
		top: 350px;
		font-family: 'Inter';
		font-style: normal;
		font-weight: 400;
		font-size: 20px;
		line-height: 24px;
		text-align: center;
		color: #7A7A7A;
	}

	@media (max-width: 430px) {
		.logo {
			position: absolute;
			width: 128px;
			height: 28px;
			left: 15px;
			top: 13px;
		}	
		.buttons-container {
			position: relative;
			top: 13px;
			left: 215px;
			width: 100%;
			height: 38px;
			display: flex;
			flex-direction: row;
			gap: 8px;
		}

		.button1,.button2,.button3 {
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

		.button1{
			position: absolute;
			left: 215px;
			width: 89px;
			height: 38px;
		}
		.button2{
			background-color: #f4ca64;
			color: #fcfef4;
			position: absolute;
			left: 322px;
			width: 91px;
			height: 38px;
			margin-right: 10px;
		}
	}
</style>

<section class="landing">

  <div class="container">
	<p class="ellipse132"></p>
	<p class="ellipse133"></p>
    <div class="row justify-content-center">
      <div class="col-md-6">
        <img class="logo img-fluid" src="Logo.png" alt="">
      </div>
      <div class="col-md-6 d-flex align-items-center justify-content-end">
        <div class="buttons-container">
          <a class="button1 btn btn-secondary" href="/login">{$t('login')}</a>
          <a class="button2 btn btn-secondary" href="/signup">{$t('signup')}</a>
        </div>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-md-8 ">
        <h1 class="a">{$t('herotitle')}</h1>
        <h3 class="b">{$t('herodesc')}</h3>
      </div>
    </div>
    <div class="row justify-content-center">
      <div class="col-md-8">
        <img class="img1 img-fluid img-responsive" src="Group 12.png" alt="">
      </div>
    </div>
    <div class="row justify-content-center mt-4">
      <div class="col-md-6 text-center">
        <a class="button3 btn btn-secondary" href="/login">{$t('getstarted')}</a>
      </div>
    </div>
    <div class="row justify-content-center mt-4">
      <div class="col-md-8 text-center">
        <div class="paragraph">
          <h1 class="d">{$t('feat1title')}</h1>
          <h3 class="e">{$t('feat1desc')}</h3>
        </div>
        <div class="paragraph2">
          <h1 class="d">{$t('feat2title')}</h1>
          <h3 class="e">{$t('feat2desc')}</h3>
        </div>
      </div>
    </div>
    <div class="row justify-content-center mt-4">
      <div class="col-md-8 text-center">
        <p class="rectangle316"></p>
      </div>
    </div>
    <div class="row justify-content-center mt-4">
      <div class="col-md-2 text-center">
        <img class="img2 img-fluid img-responsive" src="Group 6.png" alt="">
      </div>
      <div class="col-md-4 text-center">
        <img class="img3 img-fluid img-responsive" src="Group 11.png" alt="">
      </div>
      <div class="col-md-6 text-center">
        <div class="paragraph3">
          <h1 class="d f">{$t('feat3title')}</h1>
          <h3 class="e f">{$t('feat3desc')}</h3>
        </div>
        <div class="paragraph4">
          <h1 class="d f">{$t('feat4title')}</h1>
          <h3 class="e f">{$t('feat4desc')}</h3>
        </div>
      </div>
    </div>
    <div class="row justify-content-center mt-4">
      <div class="col-md-8 text-center">
        <img class="img4 img-fluid img-responsive" src="Group 10.png" alt="">
      </div>
    </div>
  </div>
</section>
<footer class="footer">
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-md-8 text-center">
        <div class="paragraph5">
          <h1 class="d g">{$t('footertitle')}</h1>
          <h3 class="e g">{$t('footerdesc')}</h3>
        </div>
        <p class="h">Kolabr &copy; 2023</p>
      </div>
    </div>
  </div>
</footer>
