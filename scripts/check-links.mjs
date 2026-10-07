// Crawls the built site (dist/) with linkinator.
//   node scripts/check-links.mjs internal   fail on any broken link within the site
//   node scripts/check-links.mjs external   also check links to other sites
import { LinkChecker } from 'linkinator';

const mode = process.argv[2];
if (mode !== 'internal' && mode !== 'external') {
	console.error('usage: check-links.mjs <internal|external>');
	process.exit(2);
}

const checker = new LinkChecker();
const broken = [];
checker.on('link', (result) => {
	if (result.state === 'BROKEN') broken.push(result);
});

const result = await checker.check({
	path: 'dist',
	recurse: true,
	// The local server picks a port, so only skip anything that is not that server.
	linksToSkip: mode === 'internal' ? ['^https?://(?!localhost|127\\.0\\.0\\.1)'] : [],
	timeout: 15_000,
	retry: true,
	retryErrors: true,
	retryErrorsCount: 2,
	retryErrorsJitter: 2000,
});

console.log(`Checked ${result.links.length} links (${mode})`);
for (const link of broken) {
	console.error(`BROKEN ${link.status ?? 'ERR'} ${link.url}\n   found on ${link.parent}`);
}
process.exit(broken.length ? 1 : 0);
