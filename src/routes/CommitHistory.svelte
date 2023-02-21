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
			{#each commits as commit}
				<li>
					[{formatDate(commit.date)}] {commit.message}
					(<a href={commit.url} target="_blank" rel="noreferrer"
						>{commit.shaShort}</a
					>)
				</li>
			{/each}
		</ol>
	{:else}
		No commits yet.
	{/if}
</details>

<style>
	details {
		margin-top: 0.5em;
	}

	ol {
		list-style: none;
	}
</style>
