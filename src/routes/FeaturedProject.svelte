<script lang="ts">
	import type { Project } from '$lib/load-projects';
	import Date from './Date.svelte';

	export let project: Project;

	export let pattern: 'cross' | 'paper' | 'boxes' | 'diagonal' = 'cross';
</script>

<a href={project.url} target="_blank" rel="noreferrer">
	<div class="pattern {pattern}" />
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

	.pattern {
		width: 100%;
		height: 80px;
	}

	.pattern.cross {
		background-color: var(--c-blue-fade);
		opacity: 0.8;
		background: radial-gradient(
				circle,
				transparent 20%,
				var(--c-blue-fade) 20%,
				var(--c-blue-fade) 80%,
				transparent 80%,
				transparent
			),
			radial-gradient(
					circle,
					transparent 20%,
					var(--c-blue-fade) 20%,
					var(--c-blue-fade) 80%,
					transparent 80%,
					transparent
				)
				25px 25px,
			linear-gradient(var(--c-blue) 2px, transparent 2px) 0 -1px,
			linear-gradient(90deg, var(--c-blue) 2px, var(--c-blue-fade) 2px) -1px 0;
		background-size: 50px 50px, 50px 50px, 25px 25px, 25px 25px;

		animation: move-cross 60s linear infinite alternate;
		animation-play-state: paused;
	}

	.pattern.paper {
		background-color: var(--c-blue-fade);
		opacity: 0.8;
		background-image: linear-gradient(var(--c-blue) 2px, transparent 2px),
			linear-gradient(90deg, var(--c-blue) 2px, transparent 2px),
			linear-gradient(var(--c-blue) 1px, transparent 1px),
			linear-gradient(90deg, var(--c-blue) 1px, var(--c-blue-fade) 1px);
		background-size: 50px 50px, 50px 50px, 10px 10px, 10px 10px;
		background-position: -2px -2px, -2px -2px, -1px -1px, -1px -1px;

		animation: move-paper 60s linear infinite alternate;
		animation-play-state: paused;
	}

	.pattern.boxes {
		background-color: var(--c-blue-fade);
		opacity: 0.8;
		background-image: linear-gradient(var(--c-blue) 1px, transparent 1px),
			linear-gradient(to right, var(--c-blue) 1px, var(--c-blue-fade) 1px);
		background-size: 20px 20px;
		background-position: 4px 4px, 4px 4px;

		animation: move-boxes 60s linear infinite alternate;
		animation-play-state: paused;
	}

	.pattern.diagonal {
		background-color: var(--c-blue-fade);
		opacity: 0.8;
		background-size: 10px 10px;
		background-image: repeating-linear-gradient(
			45deg,
			var(--c-blue) 0,
			var(--c-blue) 1px,
			var(--c-blue-fade) 0,
			var(--c-blue-fade) 50%
		);

		animation: move-diagonal 60s linear infinite alternate;
		animation-play-state: paused;
	}

	@media (hover: hover) and (pointer: fine) {
		a:hover .pattern {
			animation-play-state: running;
		}
	}

	@media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: reduce) {
		a:hover .pattern {
			background-image: none;
			background-color: var(--c-blue);
		}
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

	a {
		margin: 1em 0;
		display: block;
	}

	@keyframes move-cross {
		0% {
			background-position: 0 0, 25px 25px, 0 -1px, -1px 0;
		}
		100% {
			background-position: calc(0px + 1000px) calc(0px + 1000px),
				calc(25px + 1000px) calc(25px + 1000px),
				calc(0px + 1000px) calc(-1px + 1000px),
				calc(-1px + 1000px) calc(0px + 1000px);
		}
	}

	@keyframes move-paper {
		0% {
			background-position: -2px -2px, -2px -2px, -1px -1px, -1px -1px;
		}
		100% {
			background-position: calc(-2px + 1000px) calc(-2px + 1000px),
				calc(-2px + 1000px) calc(-2px + 1000px),
				calc(-1px + 1000px) calc(-1px + 1000px),
				calc(-1px + 1000px) calc(-1px + 1000px);
		}
	}

	@keyframes move-boxes {
		0% {
			background-position: 4px 4px, 4px 4px;
		}
		100% {
			background-position: calc(4px + 1000px) calc(4px + 1000px),
				calc(4px + 1000px) calc(4px + 1000px);
		}
	}

	@keyframes move-diagonal {
		0% {
			background-position: 0 0;
		}
		100% {
			background-position: 1000px 0;
		}
	}
</style>
