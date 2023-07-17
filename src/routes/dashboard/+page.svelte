<script lang="ts">
	import { enhance } from '$app/forms';
	import { t, translateDate, type TranslationKeys } from '$locales';

	import FaTimes from 'svelte-icons/fa/FaTimes.svelte';
	import FaTrash from 'svelte-icons/fa/FaTrash.svelte';
	import FaPlus from 'svelte-icons/fa/FaPlus.svelte';
	import FaLink from 'svelte-icons/fa/FaLink.svelte';

	export let data;
	export let form: { message?: TranslationKeys; success: boolean };
</script>

<style>
	
</style>

<div>
	<form action="?/newboard" method="post">
		<button class="btn btn-primary d-flex align-items-center gap-3" type="submit">
			<div class="icon">
				<FaPlus />
			</div>
			{$t('createboard')}
		</button>
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
				<td>{$t('actions')}</td>
			</tr>
			{#each data.ownerBoards as board (board.id)}
				<tr>
					<td><a href={`/board/${board.id}`}>{board.name}</a></td>
					<td>{translateDate(board.last_edited)}</td>
					<td>{data.user.name}</td>
					<td>
						<button
							aria-label={$t('copylink')}
							on:click={() =>
								navigator.clipboard.writeText(`${window.location.origin}/board/${board.id}`)}
						>
							<div class="icon">
								<FaLink />
							</div>
						</button>
						<form use:enhance action="?/deleteboard" method="post">
							<input type="hidden" name="board" value={board.id} />
							<button type="submit" aria-label={$t('deletes')}>
								<div class="icon">
									<FaTrash />
								</div>
							</button>
						</form>
					</td>
				</tr>
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
				<td>{$t('actions')}</td>
			</tr>
			{#each data.userBoards as board (board.id)}
				<tr>
					<td><a href={`/board/${board.id}`}>{board.name}</a></td>
					<td>{translateDate(board.last_edited)}</td>
					<td>{board.owner_name}</td>
					<td>
						<button
							aria-label={$t('copylink')}
							on:click={() =>
								navigator.clipboard.writeText(`${window.location.origin}/board/${board.id}`)}
						>
							<div class="icon">
								<FaLink />
							</div>
						</button>
						<form action="?/removeboard" method="post">
							<input type="hidden" name="board" value={board.id} />
							<button type="submit" aria-label={$t('remove')}>
								<div class="icon">
									<FaTimes />
								</div>
							</button>
						</form>
					</td>
				</tr>
			{/each}
		</table>
	</section>
{/if}

{#if form?.success}
	<p class="alert alert-success">{$t('boardupdate')}</p>
{/if}
{#if form?.message}
	<p class="alert alert-danger">{$t(form.message)}</p>
{/if}
