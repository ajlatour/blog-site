import { expect, test } from '@playwright/test';
import { builtPages } from './pages';

const viewports = [
	{ name: 'mobile', width: 375, height: 667 },
	{ name: 'tablet', width: 768, height: 1024 },
	{ name: 'desktop', width: 1440, height: 900 },
];

for (const viewport of viewports) {
	test.describe(`${viewport.name} (${viewport.width}px)`, () => {
		test.use({ viewport: { width: viewport.width, height: viewport.height } });

		for (const path of builtPages()) {
			test(`${path} fits the viewport`, async ({ page }) => {
				await page.goto(path);

				await expect(page.locator('header nav')).toBeVisible();
				await expect(page.locator('main')).toBeVisible();
				await expect(page.locator('footer')).toBeVisible();

				const overflow = await page.evaluate(
					() => document.documentElement.scrollWidth - document.documentElement.clientWidth,
				);
				expect(overflow, 'page scrolls horizontally').toBeLessThanOrEqual(0);

				const brokenImages = await page.evaluate(() =>
					[...document.images]
						.filter((img) => img.complete && img.naturalWidth === 0)
						.map((img) => img.src),
				);
				expect(brokenImages, 'images failed to load').toEqual([]);
			});
		}
	});
}
