<script lang="ts">
	import { descending, rollups } from 'd3-array';

	import type { PageServerData } from './$types';

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
	<h1>Hi!</h1>
	<p>This is my corner of the internet.</p>

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

<style>
	h2 {
		font-size: var(--size-rem-500);
	}

	li {
		line-height: 1.35;
	}

	li + li {
		margin-top: 0.25em;
	}
</style>
