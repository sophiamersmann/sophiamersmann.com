<script lang="ts">
	export let date: Date;
</script>

<span>
	{date.toLocaleDateString('en-US', {
		year: 'numeric',
		month: 'short',
	})}
</span>

<style>
	span {
		font-size: var(--fluid-step--2);
		color: var(--c-gray-500);
		white-space: nowrap;
	}
</style>
