export const ICON_ALT = {
	'bar-chart': 'Bar chart',
	'book-open': 'Newspaper',
	cast: 'Cast',
	globe: 'Globe',
	home: 'Home',
	github: 'GitHub',
	twitter: 'Twitter',
	heart: 'Heart',
	'dollar-sign': 'Dollar sign',
	'help-circle': 'Help',
	'phone-call': 'Phone call',
	'trending-up': 'Trending up',
	'shopping-cart': 'Shopping cart',
	code: 'Code',
	'pie-chart': 'Pie chart',
	clipboard: 'Clipboard',
	award: 'award',
} as const;

export type Icon = keyof typeof ICON_ALT;
export const ICONS = Object.keys(ICON_ALT) as Array<Icon>;
