# Astro Starter Kit: Blog

```sh
npm create astro@latest -- --template blog
```

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

Features:

- ✅ Minimal styling (make it your own!)
- ✅ 100/100 Lighthouse performance
- ✅ SEO-friendly with canonical URLs and Open Graph data
- ✅ Sitemap support
- ✅ RSS Feed support
- ✅ Markdown & MDX support

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── content/
│   ├── layouts/
│   └── pages/
├── astro.config.mjs
├── README.md
├── package.json
└── tsconfig.json
```

Astro looks for `.astro` or `.md` files in the `src/pages/` directory. Each page is exposed as a route based on its file name.

There's nothing special about `src/components/`, but that's where we like to put any Astro/React/Vue/Svelte/Preact components.

The `src/content/` directory contains "collections" of related Markdown and MDX documents. Use `getCollection()` to retrieve posts from `src/content/blog/`, and type-check your frontmatter using an optional schema. See [Astro's Content Collections docs](https://docs.astro.build/en/guides/content-collections/) to learn more.

Any static assets, like images, can be placed in the `public/` directory.

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Check out [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

## Credit

This theme is based off of the lovely [Bear Blog](https://github.com/HermanMartinus/bearblog/).

## Checks

```
npm run check         # astro check: types and content frontmatter
npm run lint          # ESLint
npm run format        # Prettier (use format:check to verify only)
npm run audit:prod    # npm audit, production dependencies, high severity and up
```

CI runs all of these plus the tests below on every PR. Dependabot opens weekly update PRs.

## Tests

```
npm test                    # responsive tests + internal link check
npm run test:e2e            # Playwright, on every built page:
                            #   responsive at mobile, tablet and desktop widths
                            #   axe accessibility (fails on serious or critical violations)
                            #   SEO metadata (title, description, canonical, Open Graph, sitemap, RSS)
npm run test:lighthouse     # Lighthouse CI: performance 0.9, accessibility 0.95, best practices 0.9, SEO 0.9
npm run test:links          # fail on broken links within the site
npm run test:links:external # also check links to other sites (weekly in CI, not on PRs)
```

`test:links` and `test:links:external` crawl `dist/`, so run `npm run build` first. The external check
also follows links to the live site, so a page not yet deployed will show up as broken there.

`npm run test:smoke` requests every page in the live sitemap plus the RSS feed and expects 200. In CI
it runs after each push to `main` (retrying while Cloudflare deploys) and once a day.

## Deploying (Cloudflare Pages)

Live at https://blog-site.ajlatour.workers.dev, hosted through Cloudflare's GitHub integration: production deploys from `main`, and every PR gets a preview URL.

- Build command: `npm run build`
- Build output directory: `dist`
- Node version: read from `.node-version`
