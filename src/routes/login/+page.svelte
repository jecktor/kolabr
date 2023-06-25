<script lang="ts">
	import { enhance } from '$app/forms';

	export let form: { message?: string };
</script>

<h2>Sign in</h2>
<form method="post" use:enhance>
	<label for="email">email</label><br />
	<input type="email" id="email" name="email" required /><br />
	<label for="password">password</label><br />
	<input type="password" id="password" name="password" required /><br />
	<input type="submit" value="Continue" class="button" />
</form>
{#if form?.message}
	<p class="error">{form.message || ''}</p>
{/if}
<a href="/signup" class="link">Create a new account</a>
