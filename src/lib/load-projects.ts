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
	featured: z.union([z.literal('TRUE'), z.literal('FALSE')]).optional(),
	icon: z
		.union([
			z.literal('help-circle'),
			z.literal('book-open'),
			z.literal('phone-call'),
			z.literal('dollar-sign'),
			z.literal('trending-up'),
			z.literal('shopping-cart'),
			z.literal('home'),
			z.literal('code'),
			z.literal('pie-chart'),
			z.literal('clipboard'),
		]) // TODO: should be generated from ICONS
		.optional(),
});

export type Project = Omit<z.infer<typeof ZProject>, 'date' | 'featured'> & {
	date: Date;
	featured: boolean;
};

export default projects.map((p: Record<string, any>) => {
	// replace empty strings with undefined
	Object.keys(p).forEach((key) => {
		p[key] = p[key] === '' ? undefined : p[key];
	});

	const project = ZProject.parse(p);

	return {
		...project,
		featured: project.featured === 'TRUE',
		date: new Date(project.date),
	};
}) as Project[];
