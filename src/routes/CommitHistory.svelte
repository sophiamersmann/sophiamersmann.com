<script lang="ts">
	import type { Commit } from './+page.server';

	export let commits: Commit[];
</script>

<details>
	<summary> See what has happened so far </summary>
	{#if commits.length > 0}
		<ol reversed>
			{#each commits as commit}
				<li>
					{commit.message}
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
		margin-top: 2em;
	}
</style>
