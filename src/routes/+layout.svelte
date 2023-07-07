<script lang="ts">
	import { locale } from '$locales';
	import '$scss/styles.scss';

	export let data;

	$locale = data.lang;
</script>

<slot />
