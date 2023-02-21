import type { PageServerLoad } from './$types';

import projects from '$lib/load-projects';

export const prerender = true;

export const load = (() => {
	return {
		projects,
	};
}) satisfies PageServerLoad;
