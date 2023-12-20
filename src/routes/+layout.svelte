<script lang="ts">
	import '../app.pcss';

	import { locale } from '$locales';
	import '$scss/styles.scss';

	export let data;

	$locale = data.lang;
</script>

<slot />
