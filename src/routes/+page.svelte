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
	}


	.a {
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
		width: 468px;
		height: 427px;
		left: 921px;
		top: 245px;
		max-width: 100%;
		height: auto;
	}

	.img2 {
		width: 98px;
		height: 62px;
		left: 780px;
		top: 1288px;
	}

	.img3 {
		width: 632px;
		height: 708px;
		left: 995px;
		top: 925px;
	}

	.img4 {
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
		width: 820px;
		height: 190px;
		left: 80px;
		top: 989px;
	}

	.paragraph2 {
		width: 820px;
		height: 190px;
		left: 80px;
		top: 1279px;
	}

	.paragraph3 {
		width: 820px;
		height: 226px;
		left: 828px;
		top: 1783px;
	}

	.paragraph4 {
		width: 820px;
		height: 190px;
		left: 828px;
		top: 2109px;
	}

	.paragraph5 {
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

	header {
		height: 84px;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding-inline: 40px;
		padding-block: 12px;
	}
	.header_node {
		display: flex;
		align-items: center;
		gap: 25px;
	}
	.header_node  {
		color: var(--base-600);
	}
	.logo {
		background-color: #ffffff;
		height: 28px;
		align-items: center;
	}
	.user {
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
	}
	.button2 {
		background-color: #f4ca64;
		color: #fcfef4;
	}
	.button3 {
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
</style>

<header>
	<div class="header_node">
		<a href="/#">
			<img class="logo img-fluid" src="Logo.png" alt="logo" />
		</a>
	</div>
	<div class="header_node">
		<div class="user">
			<a class="button1 btn btn-secondary" href="/login">{$t('login')}</a>
          	<a class="button2 btn btn-secondary" href="/signup">{$t('signup')}</a>
		</div>
	</div>
</header>
<article class="landing">
  <div class="container">
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
</article>
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
