import { descending } from 'd3-array';

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
	url: string;
	// commit message
	message: string;
	date: Date;
};

type Deployment = {
	created: number;
	url: string;
	deploymentId: string;
	githubCommitSha: string;
	valid: boolean;
};

type DeploymentsByCommit = Map<string, Deployment>;

type TIL = {
	date: Date;
	topic: string;
	heading: string;
	url: string;
};

async function fetchJsonFileFromGit({
	owner,
	repo,
	filename,
}: {
	owner: string;
	repo: string;
	filename: string;
}): Promise<any> {
	const base = 'https://raw.githubusercontent.com';
	const url = `${base}/${owner}/${repo}/main/${filename}`;

	try {
		const response = await fetch(url);

		if (response.ok) {
			return await response.json();
		} else {
			return null;
		}
	} catch {
		return null;
	}
}

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

function getDeploymentIdFromVercelURL(hostname: string) {
	const regex = /sophiamersmann-(.+)-sophiamersmann\.vercel\.app/;
	const match = hostname.match(regex);
	if (match == null) return null;
	return match[1];
}

export const load = (async ({ url }) => {
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

	const promisedTILs = fetchJsonFileFromGit({
		owner: 'sophiamersmann',
		repo: 'til',
		filename: 'data.json',
	});

	const [fetchedCommits, fetchedDeployments, fetchedTILs] = await Promise.all([
		promisedCommits,
		promisedDeployments,
		promisedTILs,
	]);

	const commits: Commit[] = [];
	if (fetchedCommits != null) {
		const currDeploymentId = getDeploymentIdFromVercelURL(url.hostname);
		let deploymentsByCommit: DeploymentsByCommit = new Map();

		if (fetchedDeployments != null) {
			let deployments = fetchedDeployments.deployments
				.map((deployment: Record<string, any>) => ({
					created: deployment.created,
					url: deployment.url,
					deploymentId: getDeploymentIdFromVercelURL(deployment.url),
					githubCommitSha: deployment.meta.githubCommitSha,
					valid: true,
				}))
				.sort((a, b) => descending(a.created, b.created));

			if (currDeploymentId != null) {
				const currDeployment = deployments.find(
					(d) => d.deploymentId === currDeploymentId
				);

				if (currDeployment) {
					deployments = deployments.map((d) => ({
						...d,
						valid: d.created <= currDeployment.created,
					}));
				}
			}

			deploymentsByCommit = new Map(
				deployments
					.filter((d) => d.deploymentId)
					.map((d) => [d.githubCommitSha, d])
			) as DeploymentsByCommit;
		}

		const ignoreTags = ['chore', 'fix', 'style'];
		for (const c of fetchedCommits) {
			let message = c.commit.message.split('\n')[0];

			if (!ignoreTags.some((tag) => message.startsWith(`${tag}:`))) {
				// remove PR number from commit message
				message = message.replace(/(\(#\d+\))/, '').trim();

				const deployment = deploymentsByCommit.get(c.sha);
				if (deployment && deployment.valid) {
					commits.push({
						sha: c.sha,
						shaShort: c.sha.slice(0, 7),
						githubUrl: c.html_url,
						message,
						date: new Date(c.commit.author.date),
						url: 'https://' + deployment.url,
					});
				}
			}
		}
	}

	let tils: TIL[] = [];
	if (fetchedTILs != null) {
		tils = fetchedTILs.map(
			(til: {
				date: string;
				topic: string;
				heading: string;
				path: string;
			}) => ({
				date: new Date(til.date),
				topic: til.topic,
				heading: til.heading,
				url: `https://github.com/sophiamersmann/til/blob/main/${til.path}`,
			})
		);
	}

	return {
		projects,
		commits,
		tils,
	};
}) satisfies PageServerLoad;
