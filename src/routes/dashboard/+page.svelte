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
	@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
	.container {
		align-items: center;
		text-align: left;
		margin: 0 auto;
	}
	.space1 {
		margin-top: 3%;
	}
	.space2 {
		margin-bottom: 3%;
	}
	.space3 {
		margin-bottom: 6%;
	}
	.a {
		width: 90%;
		height: auto;
		color: #212121;
		text-align: left;
		font-size: 24px;
		font-family: 'Inter', sans-serif;
		letter-spacing: 0.5px;
		line-height: 20px;
	}
	.table-light {
		padding: 10px;
		background-color: #f8f8f8;
		border: 1px solid #D3D3D3;
	}
	.table-light a {
  		font-weight: bold;
  		text-decoration: none;
		color: #212121;
	}
	.table-light button {
		display: inline-block;
		border: none;
		background: none;
		color: inherit;
		text-decoration: none;
		cursor: pointer;
		font-family: 'Inter', sans-serif;
		font-size: 16px;
		line-height: 20px;
		padding: 0;
	}
	.button-group {
		display: flex;
		gap: 30px; 
	}
	.button-group button {
		display: inline-flex;
		align-items: center;
	}
	.table-light {
		height: 50px;
	}
</style>

<div class="container row justify-content-center space1">
	<div class="space3">
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
			<strong><p class="a space2">{$t('ownerboards')}</p></strong>
			<table class="table">
				<tr>
					<td><strong>{$t('name')}</strong></td>
					<td><strong>{$t('lastedited')}</strong></td>
					<td><strong>{$t('owner')}</strong></td>
					<td><strong>{$t('actions')}</strong></td>
				</tr>
				<br>
				{#each data.ownerBoards as board (board.id)}
					<tr class="table-light space2">
						<td><strong><a href={`/board/${board.id}`}>{board.name}</a></strong></td>
						<td>{translateDate(board.last_edited)}</td>
						<td>{data.user.name}</td>
						<td>
							<div class="button-group">
								<button
									aria-label={$t('copylink')}
									title="{$t('copylink')}"
									on:click={() =>
										navigator.clipboard.writeText(`${window.location.origin}/board/${board.id}`)}
								>
									<div class="icon">
										<FaLink />
									</div>
								</button>
								<form use:enhance action="?/deleteboard" method="post">
									<input type="hidden" name="board" value={board.id} />
									<button type="submit" aria-label={$t('deletes')} title="{$t('deletes')}">
										<div class="icon">
											<FaTrash />
										</div>
									</button>
								</form>
							</div>
						</td>
					</tr>
					<br>
				{/each}
			</table>
		</section>
	{/if}
	
	{#if data.userBoards.length > 0}
		<section>
			<strong><p class="a space2">{$t('userboards')}</p></strong>
			<table class="table">
				<tr>
					<td><strong>{$t('name')}</strong></td>
					<td><strong>{$t('lastedited')}</strong></td>
					<td><strong>{$t('owner')}</strong></td>
					<td><strong>{$t('actions')}</strong></td>
				</tr>
				{#each data.userBoards as board (board.id)}
					<tr class="table-light space2">
						<td><a href={`/board/${board.id}`}>{board.name}</a></td>
						<td>{translateDate(board.last_edited)}</td>
						<td>{board.owner_name}</td>
						<td>
							<div class="button-group">
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
							</div>
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
</div>
