<script lang="ts">
	import { descending, rollups } from 'd3-array';

	import type { PageServerData } from './$types';

	import CommitHistory from './CommitHistory.svelte';
	import Heading from './Heading.svelte';

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
	<hgroup>
		<Heading level={1}>Sophia Mersmann</Heading>
		<p>
			<a href="https://github.com/sophiamersmann">
				<img src="github.svg" alt="GitHUb" />
			</a>
			<a href="https://twitter.com/sophiamersmann">
				<img src="twitter.svg" alt="Twitter" />
			</a>
		</p>
	</hgroup>

	<p>
		This website is a living document. It started out with the <a
			href="https://sophiamersmann-5e2xw7eby-sophiamersmann.vercel.app"
			rel="noreferrer">bare minimum</a
		> and I add to it whenever I feel like doing so — just for the joy of it and
		without an end product in mind.
	</p>

	{#if data.commits.length > 0}
		<CommitHistory commits={data.commits} />
	{/if}

	<section>
		<Heading>Previous Work</Heading>

		<!-- list of projects, grouped by category -->
		{#each projectsByCategory as [category, projects] (category)}
			<div class="section">
				<h3>
					{#if category}
						{category}
					{:else}
						Everything else
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
	hgroup {
		position: relative;
		display: flex;
		justify-content: space-between;
		margin-top: 3em;
		margin-bottom: 2em;
	}

	hgroup::before {
		content: '';
		position: absolute;
		top: 50%;
		left: 0;
		transform: translateY(-50%);
		width: 100%;
		height: 1px;
		background-color: var(--c-gray-200);
		z-index: -1;
	}

	hgroup > :global(*) {
		font-size: var(--fluid-step-0);
		font-family: var(--display-font);
		line-height: 1.15;
		margin: 0;
		background-color: #ffffff;
	}

	hgroup p {
		padding-left: var(--space-300);
		white-space: nowrap;
	}

	hgroup p a {
		display: inline-block;
	}

	hgroup p a + a {
		margin-left: var(--space-100);
	}

	hgroup p a img {
		width: auto;
		height: 0.9em;
	}

	hgroup + p {
		color: var(--c-gray-800);
		margin-bottom: 1.5em;
	}

	.section {
		color: var(--c-gray-800);
		font-size: var(--fluid-step--2);
		margin-top: 2em;
	}
</style>
