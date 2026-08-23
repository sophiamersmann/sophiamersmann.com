import type { PageServerLoad } from './$types';
import { GITHUB_PAT } from '$env/static/private';

import projects from '$lib/load-projects';

export type Commit = {
	// GitHub's commit SHA
	sha: string;
	shaShort: string;
	// GitHub's commit URL
	githubUrl: string;
	// commit message
	message: string;
	date: Date;
};

type TIL = {
	date: Date;
	topic: string;
	heading: string;
	url: string;
};

const BLACKLISTED_COMMITS = ['a6fd77d'];
const IGNORED_COMMIT_TAGS = ['chore', 'fix', 'style', 'content'];

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

export const load = (async () => {
	// fetch commits from GitHub API
	const promisedCommits = fetchGitCommits({
		owner: 'sophiamersmann',
		repo: 'sophiamersmann.com',
	});

	const promisedTILs = fetchJsonFileFromGit({
		owner: 'sophiamersmann',
		repo: 'til',
		filename: 'data.json',
	});

	const [fetchedCommits, fetchedTILs] = await Promise.all([
		promisedCommits,
		promisedTILs,
	]);

	const commits: Commit[] = [];
	if (fetchedCommits != null) {
		for (const c of fetchedCommits) {
			let message = c.commit.message.split('\n')[0];
			const shaShort = c.sha.slice(0, 7);

			if (
				!BLACKLISTED_COMMITS.includes(shaShort) &&
				!IGNORED_COMMIT_TAGS.some((tag) => message.startsWith(`${tag}:`))
			) {
				// remove PR number from commit message
				message = message.replace(/(\(#\d+\))/, '').trim();

				commits.push({
					sha: c.sha,
					shaShort,
					githubUrl: c.html_url,
					message,
					date: new Date(c.commit.author.date),
				});
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
			}),
		);
	}

	return {
		projects,
		commits,
		tils,
	};
}) satisfies PageServerLoad;
