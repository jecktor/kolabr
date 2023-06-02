<script>
	import { spring } from 'svelte/motion';

	export let color = '';
	export let name = '';
	export let x = 0;
	export let y = 0;

	// Spring animation for cursor
	const coords = spring(
		{ x, y },
		{
			stiffness: 0.07,
			damping: 0.35
		}
	);

	// Update spring when x and y change
	$: coords.set({ x, y });
</script>

<div class="cursor" style={`transform: translateX(${$coords.x}px) translateY(${$coords.y}px)`}>
	<svg width="32" height="44" viewBox="0 0 24 36" fill="none">
		<path
			fill={color}
			d="M0.928548 2.18278C0.619075 1.37094 1.42087 0.577818 2.2293 0.896107L14.3863 5.68247C15.2271 6.0135 15.2325 7.20148 14.3947 7.54008L9.85984 9.373C9.61167 9.47331 9.41408 9.66891 9.31127 9.91604L7.43907 14.4165C7.09186 15.2511 5.90335 15.2333 5.58136 14.3886L0.928548 2.18278Z"
		/>
	</svg>
	<div class="pill" style={`background-color: ${color};`}>
		<div class="name">{name}</div>
	</div>
</div>

<style>
	.cursor {
		position: absolute;
		top: 0;
		left: 0;
		pointer-events: none;
		user-select: none;
	}

	.pill {
		position: absolute;
		overflow: hidden;
		top: 15px;
		left: 15px;
		padding-block: 3px;
		padding-inline: 10px;
		font-size: 14px;
		line-height: 20px;
		font-weight: 500;
		white-space: nowrap;
		border-radius: 90px;
	}

	.name {
		position: relative;
		z-index: 10;
	}
</style>
