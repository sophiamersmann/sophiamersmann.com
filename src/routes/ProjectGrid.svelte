<script lang="ts">
	import type { Project } from '$lib/load-projects';
	import ProjectTile from './ProjectTile.svelte';

	export let projects: Project[];
	export let type: 'primary' | 'secondary' = 'primary';
</script>

<ul class="list-style-none">
	{#each projects as project}
		<li>
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
</style>
