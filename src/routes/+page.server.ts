import type { PageServerLoad } from './$types';

import projects from '$lib/load-projects';

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

export const load = (async () => {
	const fetchedTILs = await fetchJsonFileFromGit({
		owner: 'sophiamersmann',
		repo: 'til',
		filename: 'data.json',
	});

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
		tils,
	};
}) satisfies PageServerLoad;
