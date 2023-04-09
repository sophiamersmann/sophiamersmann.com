<script lang="ts">
	import { ICON_ALT, type Icon } from '$lib/const';

	export let icon: Icon;
	export let href: string | undefined = undefined;
</script>

{#if href}
	<a class="text-with-icon" {href} target="_blank" rel="noreferrer">
		<img src="icons/{icon}.svg" alt={ICON_ALT[icon]} />
		<slot />
	</a>
{:else}
	<span class="text-with-icon">
		<img src="icons/{icon}.svg" alt={ICON_ALT[icon]} />
		<slot />
	</span>
{/if}

<style>
	.text-with-icon {
		font-weight: var(--font-weight-medium);
		margin: 0 var(--space-100);
		white-space: nowrap;
		color: var(--c-black);
	}

	.text-with-icon img {
		display: inline-block;
		width: auto;
		height: 1em;
		vertical-align: middle;
		position: relative;
		bottom: 1px;
	}
</style>
