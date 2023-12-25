<script lang="ts">
	import '../app.pcss';

	import { locale } from '$locales';

	export let data;

	$locale = data.lang;
</script>

<slot />
