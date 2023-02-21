import type { PageServerLoad } from './$types';
import { GITHUB_PAT } from '$env/static/private';

import projects from '$lib/load-projects';

export type Commit = {
	sha: string;
	shaShort: string;
	url: string;
	message: string;
	date: Date;
};

async function fetchGitCommits({
	owner,
	repo,
}: {
	owner: string;
	repo: string;
}): Promise<Record<string, any>[] | null> {
	const base = 'https://api.github.com';
	const url = `${base}/repos/${owner}/${repo}/commits`;

	try {
		const response = await fetch(url, {
			headers: {
				Accept: 'application/vnd.github+json',
				Authorization: `Bearer ${GITHUB_PAT}`,
				'X-GitHub-Api-Version': '2022-11-28',
			},
		});

		if (response.ok) {
			return await response.json();
		} else {
			return null;
		}
	} catch {
		return null;
	}
}

export const load = (async () => {
	const commits: Commit[] = [];

	// fetch commits from GitHub API
	const fetchedCommits = await fetchGitCommits({
		owner: 'sophiamersmann',
		repo: 'sophiamersmann.com',
	});

	if (fetchedCommits != null) {
		for (const c of fetchedCommits) {
			let message = c.commit.message.split('\n')[0];

			if (!message.startsWith('chore:') && !message.startsWith('fix:')) {
				// remove PR number from commit message
				message = message.replace(/(\(#\d+\))/, '').trim();

				commits.push({
					sha: c.sha,
					shaShort: c.sha.slice(0, 7),
					url: c.html_url,
					message,
					date: new Date(c.commit.author.date),
				});
			}
		}
	}

	return {
		projects,
		commits,
	};
}) satisfies PageServerLoad;
