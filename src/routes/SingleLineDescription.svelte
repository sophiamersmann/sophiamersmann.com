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

	/* highlighter sweep; scroll-driven where supported, else it paints in on load */
	mark {
		background-repeat: no-repeat;
		animation: highlight 350ms var(--ease-out) both;
		animation-timeline: view();
		animation-range: cover 15% cover 40%;
	}

	@keyframes highlight {
		from {
			background-size: 0 100%;
		}
		to {
			background-size: 100% 100%;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		mark {
			animation: none;
		}
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
