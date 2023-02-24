<script lang="ts">
	import type { Commit } from './+page.server';

	export let commits: Commit[];

	function formatDate(date: Date) {
		return [
			date.getFullYear(),
			(date.getMonth() + 1).toString().padStart(2, '0'),
		].join('-');
	}
</script>

<details>
	<summary> See what has happened so far </summary>
	{#if commits.length > 0}
		<ol reversed>
			{#each commits as commit, i}
				<li>
					[{formatDate(commit.date)}]
					{#if commit.url}
						<a href={commit.url} target="_blank" rel="noreferrer"
							>{commit.message}</a
						>
					{:else}
						{commit.message}
					{/if}
					(<a href={commit.githubUrl} target="_blank" rel="noreferrer"
						>{commit.shaShort}</a
					>)

					{#if i === 0}
						<span class="annotation">← you're here</span>
					{/if}
				</li>
			{/each}
		</ol>
	{:else}
		No commits yet.
	{/if}
</details>

<style>
	summary {
		font-weight: var(--font-weight-semibold);
	}

	details {
		margin-top: 0.5em;
	}

	ol {
		list-style: none;
	}

	.annotation {
		margin-left: 0.5em;
		font-style: italic;
	}
</style>
