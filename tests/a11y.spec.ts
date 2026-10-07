import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';
import { builtPages } from './pages';

// Only serious and critical violations fail the build; minor and moderate ones are noise early on.
for (const path of builtPages()) {
	test(`${path} has no serious accessibility violations`, async ({ page }) => {
		await page.goto(path);
		const { violations } = await new AxeBuilder({ page })
			.withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
			.analyze();
		const blocking = violations.filter((v) => v.impact === 'serious' || v.impact === 'critical');
		expect(
			blocking.map((v) => `${v.id}: ${v.help} (${v.nodes.length} nodes)`),
			'serious or critical accessibility violations',
		).toEqual([]);
	});
}
