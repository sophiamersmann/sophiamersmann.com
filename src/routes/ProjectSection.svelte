<script lang="ts">
	import { groups } from 'd3-array';

	import ProjectGrid from './ProjectGrid.svelte';
	import SingleLineDescription from './SingleLineDescription.svelte';

	import type { Project } from '$lib/load-projects';

	export let title: string;
	export let projects: Project[];

	export let groupByYear = true;

	// get projects that are featured on top
	$: featuredProjects = projects.filter(
		(project) => !project.featured && project.icon
	);

	// group projects by year
	$: projectsByYear = groupByYear
		? groups(projects, (project) => project.date.getFullYear())
		: ([[null, projects]] as [number | null, Project[]][]);
</script>

<section>
	<h2>
		{title}
	</h2>

	{#if featuredProjects.length > 0}
		<ProjectGrid projects={featuredProjects} type="secondary" />
	{/if}

	{#each projectsByYear as [year, projects]}
		{#if year}
			<h3>
				{year}
			</h3>
		{/if}
		<ul>
			{#each projects as project}
				<li>
					<SingleLineDescription
						title={project.title}
						date={project.date}
						url={project.url}
						tagLine={project.tagLine}
						nomination={project.nomination}
					/>
				</li>
			{/each}
		</ul>
	{/each}
</section>
