<script lang="ts">
	import { locale } from '$locales';

	export let data;

	$locale = data.lang;
</script>

<slot />
