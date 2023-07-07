<script lang="ts">
	import FaCog from 'svelte-icons/fa/FaCog.svelte';
</script>

<header>
	<div class="icon">
		<a href="/dashboard/settings">
			<FaCog />
		</a>
	</div>
</header>
<main>
	<slot />
</main>
