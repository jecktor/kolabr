<script lang="ts">
	import { page } from '$app/stores';
	import { useList, useObject } from '$lib/liveblocks';
	import { t } from '$locales';
	import type { ILane, IOwner, IMember } from '$types';

	import * as Popover from '$components/ui/popover';
	import { Button } from '$components/ui/button';
	import { Plus } from 'lucide-svelte';
	import Assignee from './Assignee.svelte';

	export let ticketAssignees: IMember[];
	export let laneIdx: number;
	export let ticketId: string;

	const lanes = useList<ILane>('lanes');
	const members = useList<IMember>('members');
	const owner = useObject<IOwner>('owner');

	const boardId = $page.url.href.split('/').pop();

	let timeout = true;

	$: assignees = $lanes
		? $lanes.get(laneIdx)?.tickets.find((ticket) => ticket._id === ticketId)?.assignees ?? []
		: ticketAssignees;

	function addAssignee(member: IMember) {
		if (!timeout || assignees.find((m: IMember) => m.email === member.email)) return;

		timeout = false;
		setTimeout(() => (timeout = true), 500);

		const lane = $lanes.get(laneIdx)!;

		const opts = {
			method: 'PATCH',
			body: JSON.stringify({
				assignees: [...assignees, member],
				ticketId,
				laneId: lane._id.split('-')[0],
				boardId
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		};

		fetch('/api/board/assignee', opts)
			.then(() => {
				$lanes.set(laneIdx, {
					...lane,
					tickets: lane.tickets.map((ticket) =>
						ticket._id === ticketId ? { ...ticket, assignees: [...assignees, member] } : ticket
					)
				});
				assignees = [...assignees, member];
			})
			.catch((err) => console.error(err));
	}

	function removeAssignee(email: string) {
		const lane = $lanes.get(laneIdx)!;

		const opts = {
			method: 'DELETE',
			body: JSON.stringify({
				assignee: email,
				ticketId,
				laneId: lane._id.split('-')[0],
				boardId
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		};

		fetch('/api/board/assignee', opts)
			.then(() => {
				$lanes.set(laneIdx, {
					...lane,
					tickets: lane.tickets.map((ticket) =>
						ticket._id === ticketId
							? { ...ticket, assignees: assignees.filter((a: IMember) => a.email !== email) }
							: ticket
					)
				});
				assignees = assignees.filter((a: IMember) => a.email !== email);
			})
			.catch((err) => console.error(err));
	}
</script>

<div class="mt-3 flex flex-wrap gap-4">
	<Popover.Root>
		<Popover.Trigger>
			<Button
				class="min-w-10"
				aria-label={$t('addassignee')}
				title={$t('addassignee')}
				variant="secondary"
				size="icon"
			>
				<Plus class="h-4 w-4" />
			</Button>
		</Popover.Trigger>
		{#if $owner && $members && assignees.length < $members.length + 1}
			<Popover.Content>
				<div class="flex flex-col gap-6">
					{#if !assignees.find((m) => m.email === $owner.get('email'))}
						<div class="flex items-center justify-between">
							<Assignee member={$owner.toObject()} />
							<div class="flex gap-1">
								<Button
									variant="outline"
									size="icon"
									class="h-10 w-10"
									aria-label={$t('addassignee')}
									title={$t('addassignee')}
									on:click={() => addAssignee($owner.toObject())}
								>
									<Plus class="h-4 w-4" />
								</Button>
							</div>
						</div>
					{/if}
					{#each [...$members] as member (member.email)}
						{#if !assignees.find((m) => m.email === member.email)}
							<div class="flex items-center justify-between">
								<Assignee {member} />
								<div class="flex gap-1">
									<Button
										variant="outline"
										size="icon"
										class="h-10 w-10"
										aria-label={$t('addassignee')}
										title={$t('addassignee')}
										on:click={() => addAssignee(member)}
									>
										<Plus class="h-4 w-4" />
									</Button>
								</div>
							</div>
						{/if}
					{/each}
				</div>
			</Popover.Content>
		{/if}
	</Popover.Root>
	{#each assignees as member (member.email)}
		<Assignee {member} removable onRemove={() => removeAssignee(member.email)} />
	{/each}
</div>
