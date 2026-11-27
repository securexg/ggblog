# Inklog — Agent Instructions

This workspace is **Inklog**, a personal blog for dictated, visual-first stories (comparison tables, photography, clean typography).

## Project & Deployment Info
- **Local Path:** `/Users/gaurav/Documents/Webs/blog`
- **Live URL:** `https://inklog.pages.dev/`
- **GitHub Repo:** `https://github.com/securexg/ggblog` (`main` branch)
- **Cloudflare Account ID (`Simply Plugged`):** `7eb4c77c0d1e33504035e2c2403a0682`
- **Cloudflare Pages Project:** `inklog`

### Publish Workflow (Run After Every Edit)
```bash
cd /Users/gaurav/Documents/Webs/blog
git add -A
git commit -m "Publish: <short summary>"
git push origin main
CLOUDFLARE_ACCOUNT_ID=7eb4c77c0d1e33504035e2c2403a0682 wrangler pages deploy . --project-name=inklog --branch=main
```
After deploying, verify both `https://inklog.pages.dev/` and the new `/posts/<slug>` URL return `HTTP/2 200` with `curl -sI`.

## File Structure
- `index.html` — Blog home page with topic filters (`#filterGroup`), live client-side search (`#searchInput`), and post grid (`#postGrid`).
- `posts/<slug>.html` — Individual story pages (use `posts/why-dictate-stories.html` as the structural template).
- `style.css` — Shared design system and responsive layout.
- `brand.html` — SVG logo showcase and download page (`/brand`).
- `assets/` — Brand SVGs (`logo-primary.svg`, `logo-monogram.svg`, `logo-wordmark.svg`) and `favicon.svg` at root.

## Adding a New Dictated Article
When the user dictates or shares rough notes for a new story:
1. Create `posts/<slug>.html` matching `posts/why-dictate-stories.html` (includes reading progress bar, `.article-header` with `.author-row`, `.article-hero-img`, `.prose` body, `.wide-block` / `.table-wrap` for tables, `.inline-figure` for visuals, and `.share-bar`).
2. Add a new `<article class="post-card">` at the **top** of `#postGrid` in `index.html` with accurate `data-tag`, `data-title`, and `data-desc` attributes (lowercase) so search and filtering work.
3. If introducing a new category tag, add a matching `<button class="filter-btn" data-filter="<tag>">` inside `#filterGroup` in `index.html`.
4. Update the `"Latest"` nav link in `index.html` and `brand.html` to point to the newest post.
5. Verify any external stock image URLs (e.g. Unsplash) return `HTTP 200` before deploying.

## Typography & Design Standards (Mandatory)
- **Fonts:**
  - Headings & UI: `DM Sans` (with `-apple-system, BlinkMacSystemFont, sans-serif`)
  - Article Body & Pull Quotes (`.prose`, `.pull-quote`): `Charter` (native macOS/iOS) with `Source Serif 4` webfont fallback, `1.22rem`, `line-height: 1.62`
  - Metadata / Dates / Tags: `JetBrains Mono`
- **Palette:** Canvas `#FAF9F6`, Surface `#FFFFFF`, Subtle `#F3F2EE`, Ink `#141413`, Muted `#4A4A48`, Border `#E5E4DF`, Accent `#0F766E`.
- **Copy Rules:**
  - Zero em-dashes (`—`) or en-dashes (`–`) in user-facing copy; use commas, periods, or colons.
  - No AI cliché words (*elevate, unlock, seamless, next-gen, revolutionize, empower, streamline, supercharge, cutting-edge, game-changer, delve, tapestry, foster, leverage, robust, holistic*).
- **Layout Rules:**
  - Keep `45-75ch` prose width (`--max-prose: 68ch`) and `>= 44px` touch targets on buttons/links.
  - No decorative eyebrow pills above headings, no `border-left` callout stripes, and no emoji icons (use inline SVGs).
