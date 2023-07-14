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

{#if data.ownerBoards.length > 0}
	<section>
		<h2>{$t('ownerboards')}</h2>
		<table>
			<tr>
				<td>{$t('name')}</td>
				<td>{$t('lastedited')}</td>
				<td>{$t('owner')}</td>
			</tr>
			{#each data.ownerBoards as board (board.id)}
				<a href={`/board/${board.id}`}>
					<tr>
						<td>{board.name}</td>
						<td>{board.last_edited}</td>
						<td>{data.user.name}</td>
					</tr>
				</a>
			{/each}
		</table>
	</section>
{/if}

{#if data.userBoards.length > 0}
	<section>
		<h2>{$t('userboards')}</h2>
		<table>
			<tr>
				<td>{$t('name')}</td>
				<td>{$t('lastedited')}</td>
				<td>{$t('owner')}</td>
			</tr>
			{#each data.userBoards as board (board.id)}
				<a href={`/board/${board.id}`}>
					<tr>
						<td>{board.name}</td>
						<td>{board.last_edited}</td>
						<td>{board.owner_name}</td>
					</tr>
				</a>
			{/each}
		</table>
	</section>
{/if}
