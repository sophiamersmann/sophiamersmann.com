<script lang="ts">
	import { ICON_ALT } from '$lib/const';
	import type { Project } from '$lib/load-projects';
	import SingleLineDescription from './SingleLineDescription.svelte';

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
		<SingleLineDescription
			title={project.title}
			date={project.date}
			tagLine={project.tagLine}
		/>
	</div>
</a>

<style>
	a {
		text-decoration: none;
	}

	a img {
		transition: transform 160ms var(--ease-out);
	}

	@media (hover: hover) and (pointer: fine) {
		a:hover img {
			transform: scale(1.05) translateY(-2px);
		}
	}

	.visual {
		width: 100%;
		height: 120px;
		border-radius: 4px;

		display: grid;
		place-items: center;

		transition: transform 160ms var(--ease-out);
	}

	/* press feedback: the only feedback touch gets, since the hover above is gated */
	a:active .visual {
		transform: scale(0.98);
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

	.content {
		margin-top: 0.3em;
	}

	@media (prefers-reduced-motion: reduce) {
		a:hover img {
			transform: none;
		}
	}
</style>
