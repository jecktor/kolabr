<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import { locale } from '$locales';

	import '../app.pcss';

	export let data;

	$locale = data.lang;
</script>

<ModeWatcher />
<slot />
