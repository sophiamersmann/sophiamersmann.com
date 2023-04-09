<script lang="ts">
	import { groups } from 'd3-array';

	import Heading from './Heading.svelte';
	import DateComp from './Date.svelte';
	import ProjectGrid from './ProjectGrid.svelte';

	import type { Project } from '$lib/load-projects';

	export let title: string;
	export let projects: Project[];

	export let groupByYear: boolean = true;

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
	<Heading>
		{title}
	</Heading>

	{#if featuredProjects.length > 0}
		<ProjectGrid projects={featuredProjects} type="secondary" />
	{/if}

	{#each projectsByYear as [year, projects]}
		{#if year}
			<h3 style:margin-top={featuredProjects.length > 0 ? '2em' : 0}>
				{year}
			</h3>
		{/if}
		<ul>
			{#each projects as project}
				<li>
					<span style:margin-right="var(--space-200)">
						<a href={project.url} target="_blank" rel="noreferrer">
							{project.title}
						</a>
						{#if project.tagLine}
							— {project.tagLine}
						{/if}
					</span>
					<DateComp date={project.date} />
				</li>
			{/each}
		</ul>
	{/each}
</section>
