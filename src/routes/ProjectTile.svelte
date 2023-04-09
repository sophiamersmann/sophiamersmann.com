<script lang="ts">
	import { ICON_ALT } from '$lib/const';
	import type { Project } from '$lib/load-projects';
	import Date from './Date.svelte';

	export let project: Project;
	export let type: 'primary' | 'secondary' = 'primary';

	$: icon = project.icon || 'help-circle';
</script>

<a href={project.url} target="_blank" rel="noreferrer">
	<div class="visual {type}">
		<img
			src="icons/{icon}{type === 'primary' ? '-white' : ''}.svg"
			alt={ICON_ALT[icon]}
		/>
	</div>
	<div class="content">
		<span style:margin-right="var(--space-200)">
			<span class="underline">{project.title}</span>
			{#if project.tagLine}
				— {project.tagLine}
			{/if}
		</span>
		<Date date={project.date} />
	</div>
</a>

<style>
	a {
		text-decoration: none;
	}

	a img {
		transition: transform 0.15s ease-in-out;
	}

	a:hover img {
		transform: scale(1.05) translateY(-2px);
	}

	.visual {
		width: 100%;
		height: 120px;
		border-radius: 4px;

		display: grid;
		place-items: center;
	}

	.visual.primary {
		background-color: var(--c-blue);
	}

	.visual.secondary {
		background-color: var(--c-salmon-light);
	}

	.visual img {
		width: 1.2em;
		height: 1.2em;
	}

	.underline {
		text-decoration: underline;
		text-decoration-color: var(--c-gray-600);
		text-decoration-thickness: 1px;
		text-underline-offset: 3px;
	}

	.content {
		margin-top: 0.3em;
	}
</style>
