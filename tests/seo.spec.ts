import { readFileSync } from 'node:fs';
import { expect, test } from '@playwright/test';
import { builtPages } from './pages';

const pages = builtPages();

for (const path of pages) {
	test(`${path} has complete metadata`, async ({ page }) => {
		await page.goto(path);

		const title = await page.title();
		expect(title.trim(), 'title').not.toBe('');

		const description = await page.locator('meta[name="description"]').getAttribute('content');
		expect(description?.trim(), 'meta description').toBeTruthy();

		await expect(page.locator('h1'), 'exactly one h1').toHaveCount(1);
		await expect(page.locator('html')).toHaveAttribute('lang', /.+/);

		const canonical = await page.locator('link[rel="canonical"]').getAttribute('href');
		expect(canonical, 'canonical URL').toBeTruthy();
		expect(new URL(canonical!).pathname, 'canonical path matches the page').toBe(path);

		for (const property of ['og:title', 'og:description', 'og:image', 'og:url']) {
			const content = await page.locator(`meta[property="${property}"]`).getAttribute('content');
			expect(content?.trim(), property).toBeTruthy();
		}
	});
}

test('page titles are unique', async ({ page }) => {
	const titles = new Map<string, string[]>();
	for (const path of pages) {
		await page.goto(path);
		const title = await page.title();
		titles.set(title, [...(titles.get(title) ?? []), path]);
	}
	const duplicates = [...titles].filter(([, paths]) => paths.length > 1);
	expect(duplicates, 'pages sharing a title').toEqual([]);
});

test('sitemap lists every page', () => {
	const sitemap = readFileSync('dist/sitemap-0.xml', 'utf8');
	const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
	expect(urls.sort()).toEqual(pages);
});

test('rss feed is well formed and has items', () => {
	const rss = readFileSync('dist/rss.xml', 'utf8');
	expect(rss).toMatch(/^<\?xml/);
	expect(rss).toContain('<channel>');
	expect(rss.match(/<item>/g)?.length ?? 0).toBeGreaterThan(0);
});
