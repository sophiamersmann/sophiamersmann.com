import type { PageServerLoad } from './$types';
import { GITHUB_PAT, VERCEL_TOKEN } from '$env/static/private';

import projects from '$lib/load-projects';

export type Commit = {
	// GitHub's commit SHA
	sha: string;
	shaShort: string;
	// GitHub's commit URL
	githubUrl: string;
	// Vercel's deployment URL
	url: string | null;
	// commit message
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

async function fetchVercelDeployments({
	projectId,
	state,
	target,
}: {
	projectId: string;
	state: string;
	target: string;
}): Promise<{ deployments: Record<string, any>[] } | null> {
	const base = 'https://api.vercel.com';
	const url = `${base}/v6/deployments?projectId=${projectId}&state=${state}&target=${target}`;

	try {
		const response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${VERCEL_TOKEN}`,
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
	// fetch commits from GitHub API
	const promisedCommits = fetchGitCommits({
		owner: 'sophiamersmann',
		repo: 'sophiamersmann.com',
	});

	// fetch previous deployment URLs from Vercel API
	const promisedDeployments = fetchVercelDeployments({
		projectId: 'prj_mY89CUR6QfCPQOQuDhyxL0oHlj2C',
		state: 'READY',
		target: 'production',
	});

	const [fetchedCommits, fetchedDeployments] = await Promise.all([
		promisedCommits,
		promisedDeployments,
	]);

	const commits: Commit[] = [];
	if (fetchedCommits != null) {
		let deploymentUrlMap = new Map<string, string>();

		// map from a GitHub commit SHA to a Vercel deployment URL
		if (fetchedDeployments != null) {
			const deployments = fetchedDeployments.deployments.map(
				(deployment: Record<string, any>) => ({
					url: deployment.url,
					githubCommitSha: deployment.meta.githubCommitSha,
				})
			);
			deploymentUrlMap = new Map(
				deployments.map((d) => [d.githubCommitSha, d.url])
			);
		}

		const ignoreTags = ['chore', 'fix', 'style'];
		for (const c of fetchedCommits) {
			let message = c.commit.message.split('\n')[0];

			if (!ignoreTags.some((tag) => message.startsWith(`${tag}:`))) {
				// remove PR number from commit message
				message = message.replace(/(\(#\d+\))/, '').trim();

				commits.push({
					sha: c.sha,
					shaShort: c.sha.slice(0, 7),
					githubUrl: c.html_url,
					message,
					date: new Date(c.commit.author.date),
					url: deploymentUrlMap.has(c.sha)
						? 'https://' + deploymentUrlMap.get(c.sha)
						: null,
				});
			}
		}
	}

	return {
		projects,
		commits,
	};
}) satisfies PageServerLoad;
