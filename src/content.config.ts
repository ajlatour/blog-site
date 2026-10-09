import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z
			.object({
				title: z.string().trim().min(1),
				// Search results truncate descriptions at roughly 160 characters.
				description: z.string().trim().min(1).max(160),
				// Transform string to Date object
				pubDate: z.coerce.date(),
				updatedDate: z.coerce.date().optional(),
				heroImage: z.optional(image()),
			})
			.refine((post) => !post.updatedDate || post.updatedDate >= post.pubDate, {
				message: 'updatedDate must not be before pubDate',
				path: ['updatedDate'],
			}),
});

export const collections = { blog };
