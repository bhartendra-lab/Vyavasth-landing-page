# SEO Phase 1b: feature pages (/features)

Repo: `Vyavasth-landing-page`. Build five feature pages and a hub page. All copy is already written in `lib/feature-pages.ts` (already in the repo). Your job is the routes, rendering, structured data, sitemap and internal links. Do not change any copy in `lib/feature-pages.ts`, except to fix a TypeScript error.

## Working rules (keep token use low)

- Do NOT run the dev server, open a browser or take screenshots.
- Read only: `lib/feature-pages.ts`, `app/about/page.tsx` (page pattern, class constants, blockquote style, WhatsApp button), `components/LegalPageShell.tsx`, `app/pricing/page.tsx` (only the lines that build the FAQPage JSON-LD), `app/sitemap.ts`, `components/Footer.tsx`. Do not explore further unless a build error requires it.
- AGENTS.md: this Next.js differs from your training data. If unsure about `generateStaticParams` / `dynamicParams` / async `params`, read only the matching file under `node_modules/next/dist/docs/` (find it with one grep).
- No new dependencies, no new CSS files. Tailwind classes and existing CSS variables only, as `app/about/page.tsx` does.
- No em dashes ("—") in any user-visible string you write.
- Ignore `ai-tasks/parked-compare/`; it is parked work and must not be imported.
- Do not commit, push or deploy.
- Reply at the end with the changed/created file list and the verification output only.

## Routes

1. `app/features/[slug]/page.tsx`: one page per entry in `FEATURE_PAGES`.
   - `generateStaticParams` from `FEATURE_PAGES`; unknown slugs 404.
   - `generateMetadata`: `title: p.title`, `description: p.metaDescription`, `alternates.canonical: "/features/" + slug`, `openGraph` with the same title, description and url.
   - Fully static: these pages fetch nothing.
2. `app/features/page.tsx`: the hub.

## Page layout: `/features/[slug]`

Use `LegalPageShell` with `title={p.h1}` (if it does not render the h1 from `title`, match what `app/about/page.tsx` does). Copy the about page's `h2`, `h2Style`, `list` and blockquote class constants into this file. Sections in order:

1. `<p className="text-lg">{p.summary}</p>`. This is the most important paragraph on the page.
2. **h2 `{p.stepsHeading}`**: an `<ol>` of `p.steps`. Each item: a small numbered circle (1, 2, 3, 4) in the brand terracotta `#C25A3A` with white text, then the step title in bold and the step text below it. Stack vertically on phones; a 2-column grid from `sm:` up is fine.
3. For each of `p.sections`: h2 `s.h2`, then each paragraph as `<p>`, then `s.bullets` as `<ul className={list}>` if present. Render paragraphs before bullets, except when a section has both and the paragraph array has exactly one item that starts with "Filters combine": render that one after the bullets. (Simplest: render bullets first when `s.paragraphs?.[0]?.startsWith("Filters combine")`.)
4. If `p.quote`: an h2 "What studios say", then a `<blockquote>` with the about page's blockquote style containing `p.quote.text`, and a `<p>` attribution "<strong>{studio}</strong>, {city}".
5. **h2 "Questions"**: each FAQ as h3 + `<p>`. Always open, no accordion.
6. CTA block, same WhatsApp button style as the about page: lead text "See it on your next wedding." and button "Chat on WhatsApp" linking to `whatsappUrl(p.whatsappText)` (`target="_blank" rel="noopener noreferrer"`), plus a secondary text link "See pricing" to `/pricing`.
7. **h2 "Related features"**: links to each slug in `p.related` (use `featureBySlug(slug).navLabel` as link text and the first sentence of its `summary` as a short line under it), then a link "All features" to `/features`.

## Structured data on `/features/[slug]`

One `<script type="application/ld+json">` with an array:
- `FAQPage` from `p.faqs` (same shape as the pricing page builds it).
- `BreadcrumbList`: Home (`https://vyavasth.in/`) > Features (`https://vyavasth.in/features`) > `p.navLabel`.
- `WebPage`: `name: p.title`, `url`, `description: p.metaDescription`, `isPartOf: { "@id": "https://vyavasth.in/#website" }`, `about: { "@id": "https://vyavasth.in/#software" }`.

## Hub page: `/features`

- Metadata: title "Vyavasth features: album selection, face search, live delivery and more", description "What Vyavasth does for wedding and event photography studios in India: album selection in hours, originals in one click, one-selfie face search, live delivery and Google reviews from every gallery.", canonical `/features`.
- `LegalPageShell` with title "Features".
- Intro `<p>`: "Everything below is included on every Vyavasth plan, including pay per event. The one exception is original-quality delivery, which needs a storage plan of 500 GB or more."
- For each page in `FEATURE_PAGES` order: an h2 linking to `/features/{slug}` with `p.navLabel` as text, then `<p>{p.summary}</p>`.
- CTA: same WhatsApp button, `whatsappUrl("Hi, I want to know more about Vyavasth")`.
- JSON-LD: `BreadcrumbList` (Home > Features) and an `ItemList` of the five pages (position, url, name = navLabel).

## Internal links

- `components/Footer.tsx`: the column with the `/#features` link: change that link's `href` to `/features` (keep its label). Do not change anything else in the footer.
- `app/about/page.tsx`: in the "What Vyavasth does" list, wrap the bold lead of these bullets in links (same link styling as the other links on that page):
  - "Live delivery." → `/features/live-photo-delivery`
  - "Face search." → `/features/face-search-photo-sharing`
  - "Album selection." → `/features/album-selection`
  - "Originals in one click." → `/features/locate-original-raw-files`
  - "Your studio's name on every screen." → `/features/google-reviews-for-photographers`
  Keep the bold styling inside the link. Change nothing else on the about page.

## Sitemap

`app/sitemap.ts`: add `/features` (monthly, 0.8) and each `/features/{slug}` (monthly, 0.8), lastModified `SITE_UPDATED`. Import `FEATURE_PAGES`; do not hard-code slugs.

## Tests

Add `lib/feature-pages.test.ts` in the same `node --test` style as `lib/features.test.ts` (read only its first 20 lines for the pattern):
- slugs are unique and match `/^[a-z0-9-]+$/`
- every slug in every `related` array exists in `FEATURE_PAGES` and is not the page's own slug
- every page has at least 3 steps and at least 2 FAQs
- `JSON.stringify(FEATURE_PAGES)` contains no "—" and no "₹" (prices belong on /pricing only)

## Verification (in order, keep output short)

1. `npx tsc --noEmit 2>&1 | tail -20`
2. `npm run lint 2>&1 | tail -20`
3. `npm test 2>&1 | tail -15`
4. `npm run build 2>&1 | tail -40`: `/features` and the five `/features/*` paths must be static (prerendered).
5. `grep -c "/features" .next/server/app/sitemap.xml.body` must print 6.
6. `f=$(find .next/server/app/features -name "album-selection.html" | head -1); echo $f; grep -o "Host picks" "$f" | head -1; grep -o '"@type":"FAQPage"' "$f" | head -1; grep -o 'href="/features/locate-original-raw-files"' "$f" | head -1`
7. `grep -o 'href="/features/album-selection"' $(find .next/server/app -name "about.html" | head -1) | head -1`
8. `grep -rn "—" app/features | head` must print nothing.

Fix failures, then reply with the file list and the outputs of steps 4 (route lines for /features only), 5, 6, 7 and 8. If `graphify` is installed, run `graphify update .` last.
