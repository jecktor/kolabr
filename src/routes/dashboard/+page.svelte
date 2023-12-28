<script lang="ts">
	import { enhance } from '$app/forms';
	import { t, translateDate, type TranslationKeys } from '$locales';

	import { BoardTemplates } from '$components';
	import * as Table from '$components/ui/table';
	import * as Alert from '$components/ui/alert';
	import { X, Trash, Link, CheckCircle, AlertCircle } from 'lucide-svelte';

	export let data;
	export let form: { message?: TranslationKeys; success: boolean };
</script>

<svelte:head>
	<title>{$t('dashboard')} | Kolabr</title>
	<meta name="description" content={$t('herotitle')} />
</svelte:head>

<BoardTemplates />

{#if data.ownerBoards.length > 0}
	<section class="mt-16">
		<h2 class="mb-4 text-2xl font-bold">{$t('ownerboards')}</h2>
		<Table.Root class="whitespace-nowrap text-base">
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-96">{$t('name')}</Table.Head>
					<Table.Head>{$t('lastedited')}</Table.Head>
					<Table.Head class="w-96">{$t('owner')}</Table.Head>
					<Table.Head>{$t('actions')}</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.ownerBoards as board (board._id)}
					<Table.Row>
						<Table.Cell class="max-w-96 overflow-hidden overflow-ellipsis"
							><a class="decoration-primary hover:underline" href={`/board/${board._id}`}
								>{board.name}</a
							></Table.Cell
						>
						<Table.Cell>{translateDate(board.last_edited)}</Table.Cell>
						<Table.Cell class="max-w-96 overflow-hidden overflow-ellipsis"
							>{data.user.name}</Table.Cell
						>
						<Table.Cell>
							<div class="flex gap-5">
								<button
									aria-label={$t('copylink')}
									title={$t('copylink')}
									on:click={() =>
										navigator.clipboard.writeText(`${window.location.origin}/board/${board._id}`)}
								>
									<Link class="hover:text-primary" />
								</button>
								<form class="flex items-center" use:enhance action="?/deleteboard" method="post">
									<input type="hidden" name="board" value={board._id} />
									<button type="submit" aria-label={$t('deletes')} title={$t('deletes')}>
										<Trash class="hover:text-primary" />
									</button>
								</form>
							</div>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</section>
{/if}

{#if data.userBoards.length > 0}
	<section class="mt-16">
		<h2 class="mb-4 text-2xl font-bold">{$t('userboards')}</h2>
		<Table.Root class="whitespace-nowrap text-base">
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-96">{$t('name')}</Table.Head>
					<Table.Head>{$t('lastedited')}</Table.Head>
					<Table.Head class="w-96">{$t('owner')}</Table.Head>
					<Table.Head>{$t('actions')}</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each data.userBoards as board (board._id)}
					<Table.Row>
						<Table.Cell class="max-w-96 overflow-hidden overflow-ellipsis"
							><a class="decoration-primary hover:underline" href={`/board/${board._id}`}
								>{board.name}</a
							></Table.Cell
						>
						<Table.Cell>{translateDate(board.last_edited)}</Table.Cell>
						<Table.Cell class="max-w-96 overflow-hidden overflow-ellipsis"
							>{board.owner.name}</Table.Cell
						>
						<Table.Cell>
							<div class="flex gap-5">
								<button
									aria-label={$t('copylink')}
									title={$t('copylink')}
									on:click={() =>
										navigator.clipboard.writeText(`${window.location.origin}/board/${board._id}`)}
								>
									<Link class="hover:text-primary" />
								</button>
								<form class="flex items-center" use:enhance action="?/removeboard" method="post">
									<input type="hidden" name="board" value={board._id} />
									<button type="submit" aria-label={$t('remove')} title={$t('remove')}>
										<X class="h-7 w-7 hover:text-primary" />
									</button>
								</form>
							</div>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</section>
{/if}

{#if form?.success}
	<Alert.Root
		class="absolute bottom-0 left-0 w-full bg-background lg:bottom-5 lg:left-auto lg:right-5 lg:max-w-sm"
	>
		<CheckCircle class="h-4 w-4" />
		<Alert.Title>{$t('boardupdate')}</Alert.Title>
	</Alert.Root>
{/if}

{#if form?.message}
	<Alert.Root
		variant="destructive"
		class="absolute bottom-0 left-0 w-full bg-background lg:bottom-5 lg:left-auto lg:right-5 lg:max-w-sm"
	>
		<AlertCircle class="h-4 w-4" />
		<Alert.Title>{$t('error')}</Alert.Title>
		<Alert.Description>{$t(form.message)}</Alert.Description>
	</Alert.Root>
{/if}
