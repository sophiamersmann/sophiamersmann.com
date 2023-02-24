<script lang="ts">
	import { descending, rollups } from 'd3-array';

	import type { PageServerData } from './$types';

	import CommitHistory from './CommitHistory.svelte';

	export let data: PageServerData;

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
	<h1>Sophia Mersmann</h1>

	<p>This is my corner of the internet.</p>

	<p style:margin-top="1.5em">
		This website is a living document. It started out with the <a
			href="https://sophiamersmann-5e2xw7eby-sophiamersmann.vercel.app"
			rel="noreferrer">bare minimum</a
		> and I add to it whenever I feel like doing so — just for the joy of it and
		without an end product in mind.
	</p>

	{#if data.commits.length > 0}
		<CommitHistory commits={data.commits} />
	{/if}

	<!-- list of projects, grouped by category -->
	{#each projectsByCategory as [category, projects] (category)}
		<section>
			<h2>
				{#if category}
					{category}:
				{:else}
					No category:
				{/if}
			</h2>
			<ul>
				{#each projects as project}
					<li>
						<div>
							<a href={project.url} target="_blank" rel="noreferrer"
								>{project.title}</a
							>
							{#if project.tagLine}
								— <i>{project.tagLine}</i>
							{/if}
						</div>
					</li>
				{/each}
			</ul>
		</section>
	{/each}
</main>
