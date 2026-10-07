import { readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

// Every built HTML page under dist/, as a URL path (e.g. /blog/first-post/).
export function builtPages(dir = 'dist'): string[] {
	const pages: string[] = [];
	const walk = (current: string) => {
		for (const entry of readdirSync(current)) {
			const full = join(current, entry);
			if (statSync(full).isDirectory()) walk(full);
			else if (entry === 'index.html') {
				const rel = relative(dir, current).split('\\').join('/');
				pages.push(rel ? `/${rel}/` : '/');
			}
		}
	};
	walk(dir);
	return pages.sort();
}
