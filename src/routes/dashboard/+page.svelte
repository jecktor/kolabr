<script lang="ts">
	import { t, type TranslationKeys } from '$locales';

	import { BoardList } from '$components';
	import * as Alert from '$components/ui/alert';
	import { X, Trash, CheckCircle, AlertCircle } from 'lucide-svelte';

	export let data;
	export let form: { message?: TranslationKeys; success: boolean };
</script>

<svelte:head>
	<title>{$t('dashboard')} – Kolabr</title>
	<meta name="description" content={$t('herotitle')} />
</svelte:head>

<BoardList
	title="ownerboards"
	boards={data.ownerBoards}
	action="deleteboard"
	actionName="deletes"
	actionDescription="deleteboarddesc"
	allowNewBoard
>
	<Trash slot="actionIcon" class="mr-2.5 h-4 w-4" />
</BoardList>

<BoardList
	title="userboards"
	boards={data.userBoards}
	action="removeboard"
	actionName="remove"
	actionDescription="removeboarddesc"
	showOwner
	padding
>
	<X slot="actionIcon" class="mr-1.5 h-5 w-5" />
</BoardList>

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
