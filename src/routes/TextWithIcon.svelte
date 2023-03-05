<script lang="ts">
	type Icon =
		| 'bar-chart'
		| 'book-open'
		| 'cast'
		| 'globe'
		| 'home'
		| 'github'
		| 'twitter'
		| 'heart';

	export let icon: Icon;
	export let href: string | undefined = undefined;

	const iconAlt = {
		'bar-chart': 'Bar chart',
		'book-open': 'Newspaper',
		cast: 'Cast',
		globe: 'Globe',
		home: 'Home',
		github: 'GitHub',
		twitter: 'Twitter',
		heart: 'Heart',
	};
</script>

{#if href}
	<a class="text-with-icon" {href} target="_blank" rel="noreferrer">
		<img src="{icon}.svg" alt={iconAlt[icon]} />
		<slot />
	</a>
{:else}
	<span class="text-with-icon">
		<img src="{icon}.svg" alt={iconAlt[icon]} />
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
