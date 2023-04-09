#!/usr/bin/env node

/**
 * Fetches Google Sheets and stores the content as csv files.
 * Configurations are loaded from google-sheets.config.js
 */

import fs from 'fs';
import path from 'path';

import cfg from '../google-sheets.config.js';

const cwd = process.cwd();

async function fetchGoogleSheet({ id, gid }) {
	console.info(`fetching... ${id} (${gid})`);

	// construct URL to download Google sheet content as csv
	const base = 'https://docs.google.com';
	const url = new URL(`${base}/spreadsheets/u/1/d/${id}/export`);
	url.searchParams.append('format', 'csv');
	url.searchParams.append('id', id);
	url.searchParams.append('gid', gid);

	// fetch Google sheet
	try {
		const response = await fetch(url);
		const text = await response.text();
		return text;
	} catch (err) {
		throw new Error(err);
	}
}

async function main() {
	for (let c of cfg) {
		try {
			const content = await fetchGoogleSheet(c);
			const file = `${cwd}/${c.filepath}`;

			// create folder if it doesn't exist
			fs.mkdirSync(path.dirname(file), { recursive: true });

			fs.writeFileSync(file, content);
		} catch (err) {
			console.log(err);
		}
	}
}

main();
