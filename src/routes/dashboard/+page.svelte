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
			<strong><p class="a space4">{$t('ownerboards')}</p></strong>
			<div class="table-responsive">
				<table class="table space2">
					<thead class="t">
						<tr>
							<th scope="col">{$t('name')}</th>
							<th scope="col">{$t('lastedited')}</th>
							<th scope="col">{$t('owner')}</th>
							<th scope="col">{$t('actions')}</th>
						</tr>
					</thead>
					<tbody>
						{#each data.ownerBoards as board (board.id)}
							<tr class="table-light space2">
								<td class="col_1"
									><strong><a href={`/board/${board.id}`}>{board.name}</a></strong></td
								>
								<td class="col_2">{translateDate(board.last_edited)}</td>
								<td class="col_3">{data.user.name}</td>
								<td class="col_4">
									<div class="button-group">
										<button
											aria-label={$t('copylink')}
											title={$t('copylink')}
											on:click={() =>
												navigator.clipboard.writeText(
													`${window.location.origin}/board/${board.id}`
												)}
										>
											<div class="icon">
												<FaLink />
											</div>
										</button>
										<form use:enhance action="?/deleteboard" method="post">
											<input type="hidden" name="board" value={board.id} />
											<button type="submit" aria-label={$t('deletes')} title={$t('deletes')}>
												<div class="icon">
													<FaTrash />
												</div>
											</button>
										</form>
									</div>
								</td>
							</tr>
							<br />
						{/each}
					</tbody>
				</table>
			</div>
		</section>
	{/if}

	{#if data.userBoards.length > 0}
		<section>
			<strong><p class="a space4">{$t('userboards')}</p></strong>
			<div class="table-responsive">
				<table class="table space2">
					<thead class="t">
						<tr>
							<th scope="col">{$t('name')}</th>
							<th scope="col">{$t('lastedited')}</th>
							<th scope="col">{$t('owner')}</th>
							<th scope="col">{$t('actions')}</th>
						</tr>
					</thead>
					<tbody>
						{#each data.userBoards as board (board.id)}
							<tr class="table-light space2">
								<td class="col_1"><a href={`/board/${board.id}`}>{board.name}</a></td>
								<td class="col_2">{translateDate(board.last_edited)}</td>
								<td class="col_3">{board.owner_name}</td>
								<td class="col_4">
									<div class="button-group">
										<button
											aria-label={$t('copylink')}
											title={$t('copylink')}
											on:click={() =>
												navigator.clipboard.writeText(
													`${window.location.origin}/board/${board.id}`
												)}
										>
											<div class="icon">
												<FaLink />
											</div>
										</button>
										<form action="?/removeboard" method="post">
											<input type="hidden" name="board" value={board.id} />
											<button type="submit" aria-label={$t('remove')} title={$t('remove')}>
												<div class="icon">
													<FaTimes />
												</div>
											</button>
										</form>
									</div>
								</td>
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</section>
	{/if}

	{#if form?.success}
		<p class="alert alert-success">{$t('boardupdate')}</p>
	{/if}
	{#if form?.message}
		<p class="alert alert-danger">{$t(form.message)}</p>
	{/if}
</div>

<style>
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

	.space4 {
		margin-bottom: 4.5%;
	}

	.col_1,
	.col_2,
	.col_3 {
		width: 30%;
	}

	.col_4 {
		width: 10%;
	}

	.a {
		width: 90%;
		height: auto;
		color: var(--base-700);
		text-align: left;
		font-size: 24px;
		font-family: 'Inter', sans-serif;
		letter-spacing: 0.5px;
		line-height: 20px;
	}

	a:hover {
		text-decoration: underline !important;
	}

	.table-light {
		padding: 10px;
		background-color: var(--base-200);
		border: 1px solid var(--base-300);
		vertical-align: middle;
	}

	.table-light a {
		font-weight: bold;
		text-decoration: none;
		color: var(--base-700);
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

	.t {
		height: 50px;
		vertical-align: middle;
	}

	@media (max-width: 760px) {
		.space2 {
			margin-bottom: 7%;
		}
		.space3 {
			margin-bottom: 12%;
		}
		.space4 {
			margin-bottom: 8%;
		}
	}
</style>
