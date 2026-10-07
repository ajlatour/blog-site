// Post-deploy smoke test: every page in the live sitemap (and the RSS feed) must return 200.
// Retries for a few minutes so it can run right after a push while Cloudflare is still deploying.
//   node scripts/smoke-test.mjs [base-url]
const base = (process.argv[2] ?? 'https://blog-site.ajlatour.workers.dev').replace(/\/$/, '');
const attempts = 10;
const delayMs = 30_000;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function check() {
	const failures = [];
	const sitemap = await fetch(`${base}/sitemap-0.xml`);
	if (!sitemap.ok) return [`${sitemap.status} ${base}/sitemap-0.xml`];

	const urls = [...(await sitemap.text()).matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
	if (urls.length === 0) return ['sitemap lists no pages'];

	// Sitemap URLs use the configured `site`; request the same paths on the base URL under test.
	const paths = [...urls.map((url) => new URL(url).pathname), '/rss.xml'];
	for (const path of paths) {
		const response = await fetch(`${base}${path}`);
		if (response.status !== 200) failures.push(`${response.status} ${base}${path}`);
	}
	console.log(`Checked ${paths.length} URLs on ${base}`);
	return failures;
}

for (let attempt = 1; attempt <= attempts; attempt++) {
	let failures;
	try {
		failures = await check();
	} catch (error) {
		failures = [String(error)];
	}
	if (failures.length === 0) {
		console.log('Smoke test passed');
		process.exit(0);
	}
	console.error(`Attempt ${attempt}/${attempts} failed:\n  ${failures.join('\n  ')}`);
	if (attempt < attempts) await sleep(delayMs);
}
process.exit(1);
