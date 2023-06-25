<script lang="ts">
	import { enhance } from '$app/forms';

	export let form: { message?: string };
</script>

<h2>Create an account</h2>
<form method="post" use:enhance>
	<label for="name">name</label><br />
	<input id="name" name="name" required /><br />
	<label for="email">email</label><br />
	<input type="email" id="email" name="email" required /><br />
	<label for="password">password</label><br />
	<input type="password" id="password" name="password" /><br />
	<input type="submit" value="Continue" class="button" required />
</form>
{#if form?.message}
	<p class="error">{form.message || ''}</p>
{/if}
<a href="/login" class="link">Sign in</a>
