<script lang="ts">
	import * as Avatar from '$components/ui/avatar';
	import * as Tooltip from '$components/ui/tooltip';

	export let image: string;
	export let name: string;
	export let color: string;
</script>

<Tooltip.Root>
	<Tooltip.Trigger>
		<Avatar.Root class="h-8 w-8 bg-background" style={`outline: 2px solid ${color};`}>
			<Avatar.Image src={image} alt="avatar" referrerpolicy="no-referrer" />
			<Avatar.Fallback>{name[0]}</Avatar.Fallback>
		</Avatar.Root>
	</Tooltip.Trigger>
	<Tooltip.Content>
		<p>{name}</p>
	</Tooltip.Content>
</Tooltip.Root>
