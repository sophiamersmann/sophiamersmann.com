<script lang="ts">
	import type { Commit } from './+page.server';

	export let commits: Commit[];

	function formatDate(date: Date) {
		return date.toLocaleDateString('en-UK', {
			month: 'short',
			year: '2-digit',
		});
	}
</script>

<h3>This is what's happened so far.</h3>

{#if commits.length > 0}
	<ol reversed>
		{#each commits as commit, i}
			{@const showDate =
				i === commits.length - 1 ||
				commit.date.getMonth() !== commits[i + 1].date.getMonth()}

			<li>
				{#if showDate}
					<div class="date">
						{formatDate(commit.date)}
					</div>
				{/if}

				<span class="commit">
					<a href={commit.url} rel="noreferrer">{commit.message}</a>
				</span>
				<a
					class="commit-sha"
					href={commit.githubUrl}
					target="_blank"
					rel="noreferrer"
				>
					<img src="git-commit.svg" alt="Git Commit" />
					{commit.shaShort}
				</a>
			</li>
		{/each}
	</ol>
{:else}
	No commits yet.
{/if}

<style>
	ol {
		position: relative;
		margin-left: var(--space-700);
	}

	ol::before {
		content: '';
		position: absolute;
		top: 0;
		left: 4px;
		width: 1px;
		height: 100%;
		background-color: var(--c-gray-500);
	}

	.date {
		position: absolute;
		top: 3px;
		left: 0;
		transform: translateX(calc(-1 * var(--space-400) - 100% - 6px));
		font-size: var(--fluid-step--2);
		color: var(--c-gray-500);
	}

	.commit {
		margin-right: var(--space-400);
	}

	.commit-sha {
		text-decoration: none;
		font-size: var(--fluid-step--2);
		white-space: nowrap;
	}

	.commit-sha:hover {
		color: var(--c-black);
	}

	.commit-sha img {
		display: inline;
		height: 1.15em;
		width: auto;
		vertical-align: middle;
	}
</style>
