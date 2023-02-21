import { z } from 'zod';

// @ts-expect-error no types for csv data
import projects from '../data/projects.csv';

const ZProject = z.object({
	date: z.string().regex(/\d{4}-\d{2}-\d{2}/), // date must be a string that matches the format YYYY-MM-DD
	title: z.string(),
	tagLine: z.string().optional(),
	category: z.string().optional(),
	url: z.string().url(),
	sourceCodeUrl: z.string().url().optional(),
});

export type Project = Omit<z.infer<typeof ZProject>, 'date'> & { date: Date };

export default projects.map((p: Record<string, any>) => {
	// replace empty strings with undefined
	Object.keys(p).forEach((key) => {
		p[key] = p[key] === '' ? undefined : p[key];
	});

	const project = ZProject.parse(p);

	return {
		...project,
		date: new Date(project.date),
	};
}) as Project[];
