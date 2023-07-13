<script lang="ts">
	import { enhance } from '$app/forms';
	import { t } from '$locales';

	export let data;
</script>

<div>
	<h1>{data.user.name}</h1>
	<img src={data.user.image} alt="avatar" width="50" height="50" />
</div>

<form use:enhance method="post" action="?/signout">
	<input type="submit" value={$t('signout')} />
</form>

<div>
	<form action="?/newboard" method="post">
		<button class="btn btn-primary" type="submit">+ {$t('createboard')}</button>
	</form>
</div>

{#if data.boards.length > 0}
	<div>
		<h2>{$t('recent')}</h2>
		<table>
			<tr>
				<td>{$t('name')}</td>
				<td>{$t('lastedited')}</td>
				<td>{$t('owner')}</td>
			</tr>
			{#each data.boards as board (board.id)}
				<a href={`/board/${board.id}`}>
					<tr>
						<td>{board.name}</td>
						<td>{board.last_edited}</td>
						<td>{board.owner_name}</td>
					</tr>
				</a>
			{/each}
		</table>
	</div>
{/if}
