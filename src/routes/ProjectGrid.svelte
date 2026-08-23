<script lang="ts">
	import type { Project } from '$lib/load-projects';
	import ProjectTile from './ProjectTile.svelte';

	export let projects: Project[];
	export let type: 'primary' | 'secondary' = 'primary';
</script>

<!-- only the featured grid (primary) gets the entrance; the per-section
	secondary grids would all fire off-screen on load -->
<ul class="list-style-none" class:stagger={type === 'primary'}>
	{#each projects as project, i}
		<li style:--i={i}>
			<ProjectTile {project} {type} />
		</li>
	{/each}
</ul>

<style>
	ul {
		display: grid;
		grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
		gap: var(--space-600);
	}

	.stagger li {
		animation: enter 300ms var(--ease-out) both;
		animation-delay: calc(var(--i, 0) * 40ms);
	}

	@keyframes enter {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.stagger li {
			animation: none;
		}
	}
</style>
