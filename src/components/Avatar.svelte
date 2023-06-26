<script>
	export let image = '';
	export let name = '';
	export let color = '';

	const IMAGE_SIZE = 48;
</script>

<div class="avatar" data-tooltip={name} style={`border: 4px solid ${color};`}>
	<div class="avatar_image">
		<img
			alt="Avatar"
			height={IMAGE_SIZE}
			src={image}
			width={IMAGE_SIZE}
			referrerpolicy="no-referrer"
		/>
	</div>
</div>

<style>
	.avatar {
		display: flex;
		place-content: center;
		position: relative;
		border-radius: 90px;
		width: 56px;
		height: 56px;
		margin-left: -0.75rem;
		padding: 1px;
	}

	.avatar:before {
		content: attr(data-tooltip);
		position: absolute;
		bottom: 100%;
		opacity: 0;
		transition: opacity 0.15s ease;
		padding: 5px 10px;
		color: white;
		font-size: 0.75rem;
		border-radius: 8px;
		margin-bottom: 10px;
		z-index: 1;
		background: black;
		white-space: nowrap;
	}

	.avatar:hover:before {
		opacity: 1;
	}

	.avatar_image {
		border-radius: 90px;
		overflow: hidden;
	}

	.avatar_image img {
		width: 100%;
		height: 100%;
	}
</style>
