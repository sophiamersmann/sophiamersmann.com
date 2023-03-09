<script lang="ts">
	import { descending, rollups } from 'd3-array';

	import type { PageServerData } from './$types';

	import CommitHistory from './CommitHistory.svelte';
	import FeaturedProject from './FeaturedProject.svelte';
	import Heading from './Heading.svelte';
	import TextWithIcon from './TextWithIcon.svelte';

	import { PATTERNS } from './const';

	export let data: PageServerData;

	// featured projects
	$: featuredProjects = data.projects
		.filter((p) => p.featured)
		.sort((p1, p2) => descending(p1.date.getTime(), p2.date.getTime()));

	// group projects by category and sort by date
	$: projectsByCategory = rollups(
		data.projects,
		(projects) =>
			projects.sort((p1, p2) =>
				descending(p1.date.getTime(), p2.date.getTime())
			),
		(project) => project.category
	).sort(([, p1], [, p2]) =>
		descending(p1[0].date.getTime(), p2[0].date.getTime())
	);
</script>

<main>
	<Heading level={1}>Sophia Mersmann</Heading>

	<p class="introduction">
		I'm a <TextWithIcon icon="bar-chart"
			>Data Visualization Engineer</TextWithIcon
		>
		currently working at
		<TextWithIcon icon="globe" href="https://ourworldindata.org/"
			>Our World in Data.</TextWithIcon
		>
		I previously worked in a newsroom as part of the data journalism team at
		<TextWithIcon icon="cast" href="https://www.rbb24.de/">rbb|24.</TextWithIcon
		>
		I live in Berlin. Find me on
		<TextWithIcon icon="github" href="https://github.com/sophiamersmann"
			>GitHub</TextWithIcon
		>
		and
		<TextWithIcon icon="twitter" href="https://twitter.com/sophiamersmann"
			>Twitter.</TextWithIcon
		>
	</p>

	<p style:margin-top="2em">
		This website is a living document. It started out with the <a
			href="https://sophiamersmann-5e2xw7eby-sophiamersmann.vercel.app"
			rel="noreferrer">bare minimum</a
		> and I add to it whenever I feel like doing so — just for the joy of it and
		without an end product in mind.
	</p>

	{#if data.commits.length > 0}
		<div class="commit-history-wrapper">
			<CommitHistory commits={data.commits} />
		</div>
	{/if}

	<section class="featured-projects">
		<Heading>Featured Projects</Heading>
		<ul class="list-style-none">
			{#each featuredProjects as project, i}
				<li>
					<FeaturedProject {project} pattern={PATTERNS[i % PATTERNS.length]} />
				</li>
			{/each}
		</ul>
	</section>

	<section>
		<Heading>Previous Work</Heading>

		<!-- list of projects, grouped by category -->
		{#each projectsByCategory as [category, projects] (category)}
			<div class="section">
				<h3>
					{#if category}
						{category}
					{:else}
						No category
					{/if}
				</h3>
				<ul>
					{#each projects as project}
						<li>
							<div>
								<a href={project.url} target="_blank" rel="noreferrer">
									{project.title}
								</a>
								{#if project.tagLine}
									— {project.tagLine}
								{/if}
							</div>
						</li>
					{/each}
				</ul>
			</div>
		{/each}
	</section>
</main>

<style>
	.commit-history-wrapper {
		margin: 1.5em 0;
	}

	.section {
		color: var(--c-gray-800);
		margin-top: 2em;
	}

	.introduction {
		color: var(--c-gray-800);
	}

	.featured-projects li {
		margin: 1.5em 0;
	}
</style>
