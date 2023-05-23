<script lang="ts">
	import { descending, rollups } from 'd3-array';

	import type { PageServerData } from './$types';

	import CommitHistory from './CommitHistory.svelte';
	import TextWithIcon from './TextWithIcon.svelte';
	import ProjectSection from './ProjectSection.svelte';
	import ProjectGrid from './ProjectGrid.svelte';
	import SingleLineDescription from './SingleLineDescription.svelte';

	export let data: PageServerData;

	// helper functions
	const byTime = (a: { date: Date }, b: { date: Date }) =>
		descending(a.date.getTime(), b.date.getTime());
	const groupSort = <Item extends { date: Date }>(
		data: Item[],
		key: (item: Item) => any
	) =>
		rollups(data, (projects) => projects.sort(byTime), key).sort(
			([, p1], [, p2]) => descending(p1[0].date.getTime(), p2[0].date.getTime())
		);

	// featured projects
	$: featuredProjects = data.projects
		.filter((p) => p.featured)
		.sort((p1, p2) => descending(p1.date.getTime(), p2.date.getTime()));

	// group projects by category and sort by date
	$: projectsByCategory = groupSort(
		data.projects,
		(project) => project.category
	);

	// treat "Archive" as a special category
	$: projectsByCategoryWithoutArchive = projectsByCategory.filter(
		([category]) => category !== 'Archive'
	);
	$: archive = projectsByCategory.find(([category]) => category === 'Archive');

	// group TILs by topic and sort by date
	$: tilsByTopic = groupSort(data.tils, (til) => til.topic);
</script>

<main>
	<h1>Sophia Mersmann</h1>

	<p class="introduction">
		I'm a <TextWithIcon icon="bar-chart"
			>Data Visualisation Engineer</TextWithIcon
		>
		currently working at
		<TextWithIcon icon="globe" href="https://ourworldindata.org/"
			>Our World in Data.</TextWithIcon
		>
		I previously worked in a newsroom as part of the data journalism team at
		<TextWithIcon icon="cast" href="https://www.rbb24.de/">rbb|24.</TextWithIcon
		>
		I live in Frankfurt, Germany. Find me on
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
		>
		and I add to it whenever I feel like doing so — just for the joy of it and without
		an end product in mind. Find the source code on
		<a
			href="https://github.com/sophiamersmann/sophiamersmann.com"
			target="_blank"
			rel="noreferrer">GitHub</a
		>.
	</p>

	{#if data.commits.length > 0}
		<div class="commit-history-wrapper">
			<CommitHistory commits={data.commits} />
		</div>
	{/if}

	{#if featuredProjects.length > 0}
		<section class="featured-projects">
			<h2>Featured Projects</h2>
			<ProjectGrid projects={featuredProjects} />
		</section>
	{/if}

	{#if projectsByCategoryWithoutArchive.length > 0}
		{#each projectsByCategoryWithoutArchive as [category, projects] (category)}
			<ProjectSection title={category} {projects} />
		{/each}
	{/if}

	{#if tilsByTopic.length > 0}
		<section>
			<h2>Today I Learned</h2>

			<!-- list of tils, grouped by topic -->
			{#each tilsByTopic as [topic, tils] (topic)}
				<h3>
					{#if topic}
						{topic}
					{:else}
						No topic
					{/if}
				</h3>
				<ul>
					{#each tils as til}
						<li>
							<SingleLineDescription
								title={til.heading}
								date={til.date}
								url={til.url}
							/>
						</li>
					{/each}
				</ul>
			{/each}
		</section>
	{/if}

	{#if archive}
		<ProjectSection
			title={archive[0]}
			projects={archive[1]}
			groupByYear={false}
		/>
	{/if}
</main>

<style>
	.commit-history-wrapper {
		margin: 1.5em 0;
	}

	.introduction {
		color: var(--c-gray-800);
	}
</style>
