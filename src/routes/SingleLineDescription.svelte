<script lang="ts">
	import DateComp from './Date.svelte';

	import { ICON_ALT } from '$lib/const';

	export let title: string;
	export let date: Date;
	export let tagLine: string | undefined = undefined;
	export let url: string | undefined = undefined;
	export let nomination: string | undefined = undefined;
</script>

<span class="space-right">
	{#if url}
		<a href={url} target="_blank" rel="noreferrer">{title}</a>
	{:else}
		<span class="underline">{title}</span>
	{/if}
	{#if tagLine}
		— {tagLine}
	{/if}
</span>
<span class="space-right-xl">
	<DateComp {date} />
</span>
{#if nomination}
	<mark>
		<img src="icons/award.svg" alt={ICON_ALT.award} />
		{nomination}
	</mark>
{/if}

<style>
	.space-right {
		margin-right: var(--space-200);
	}

	.space-right-xl {
		margin-right: var(--space-300);
	}

	mark img {
		display: inline-block;
		width: auto;
		height: 1em;
		vertical-align: middle;
		position: relative;
		bottom: 1px;
	}
</style>
