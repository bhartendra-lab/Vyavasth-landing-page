# SEO Phase 7: feature pages, part 2 (details layout, video, honest limits, freshness)

Repo: `Vyavasth-landing-page`. Read `AGENTS.md` first. Builds on Phase 5 (`app/features/[slug]/page.tsx`, `app/features/feature.module.css`, `lib/feature-pages.ts`).

Problem: "The details" section is a 720px column pinned to the left of a 1288px page, so the right half of the screen is empty on desktop. Fix it with a two-column details layout, and add the slots that make these pages worth citing: product video, who it is for, last updated and change log.

## Working rules (keep token use low)

- Do NOT run the dev server, open a browser or take screenshots.
- Read only: `app/features/[slug]/page.tsx`, `app/features/feature.module.css`, `lib/feature-pages.ts` (types and the first entry), `lib/feature-pages.test.ts`. Nothing else unless a build error requires it.
- Keep `export const dynamic = "force-dynamic"`. The page stays a server component. The only client code allowed is one tiny component for scroll-spy in step 2 (optional; skip it if it adds complexity).
- No new dependencies. No em dashes ("—") in visible text. No decorative coloured dashes or eyebrow labels before headings. No gradient badges.
- Do not change any existing copy in `lib/feature-pages.ts`. New fields are optional; I fill them in separately.
- Do not commit, push or deploy.

## 1. New optional fields in `lib/feature-pages.ts` (types only, plus tests)

```ts
/** Short looping product recording (muted, no sound needed). */
video?: { src: string; poster: string; caption: string; width: number; height: number; youtubeId?: string };
/** Honest fit. Both lists 2 to 4 short items. */
fit?: { forYou: string[]; notForYou: string[] };
/** ISO date the page content was last reviewed, e.g. "2026-10-28". */
updated?: string;
/** Newest first. Short lines, e.g. { date: "2026-10-26", text: "Collections added" }. */
changelog?: { date: string; text: string }[];
/** Slugs of /compare pages to link from this feature, e.g. ["vyavasth-vs-kwikpic"]. */
compare?: string[];
```
Add `id` generation: each `Section` gets an anchor id from its `h2` (lowercase, non-alphanumerics to "-", trimmed). Put the helper in `lib/feature-pages.ts` as `sectionId(h2: string)` and test it.

Tests in `lib/feature-pages.test.ts`: `sectionId` output for two sample headings; every `updated` and `changelog[].date`, when present, matches `/^\d{4}-\d{2}-\d{2}$/`; every `compare` slug, when present, exists in `COMPETITORS` from `lib/compare-data.ts` (import it; it is already in the repo).

## 2. Details section: two columns on desktop

Replace the single `.reading` column with a grid inside the same `.wrap`:

- **Left (main, max ~720px):** "The details" h2, then every section exactly as today, each `<section id={sectionId(s.h2)}>`. Section figures stay inline, as today.
- **Right rail (~300px, `position: sticky; top: 96px`), desktop only (>= 1024px):**
  1. **"On this page"**: a list of anchor links to each section h2, plus "Questions". Plain text links, current-section highlight optional (the only allowed client component; skip if not trivial).
  2. **WhatsApp card**: white rounded card, one line ("See it on your next wedding."), the primary WhatsApp button (`whatsappUrl(p.whatsappText)`), and a text link "See pricing".
  3. **Compare card** (only when `p.compare` has items): "Comparing tools?" and one link per slug: "Vyavasth vs {competitor name}" to `/compare/{slug}`, plus "All comparisons" to `/compare`. Read names from `competitorBySlug`.
- **Below 1024px:** single column. The "On this page" list becomes a compact block right under "The details" heading (no sticky), the WhatsApp card moves to the end of the details, and the compare card follows it.
- The rail is in the server HTML (not rendered only on the client), so crawlers see the anchor links.

## 3. Video slot (hero)

When `p.video` exists, the hero shows it instead of the image: `<video autoPlay muted loop playsInline preload="metadata" poster={video.poster} width height>` with a `<source src>`, inside the same white frame the hero image uses, `figcaption` below. Respect `prefers-reduced-motion`: render without `autoPlay` and show the poster with native controls.
When `video.youtubeId` exists, add a text link under the caption "Watch the full demo on YouTube" to `https://www.youtube.com/watch?v={id}` (external, `rel="noopener"`), and add a `VideoObject` to the page JSON-LD: `name` = `p.h1`, `description` = `p.metaDescription`, `thumbnailUrl` = absolute poster URL, `contentUrl` = absolute video URL, `embedUrl` = `https://www.youtube.com/embed/{id}`, `uploadDate` = `p.updated` when present.

## 4. "Is it for you?" block

When `p.fit` exists, render it right after the benefits band: two cards side by side (stacked on mobile), headed "Made for you if" and "Not the right fit if", each a short list. Give both cards the same visual weight; the second card must not look like a warning.

## 5. Freshness

- When `p.updated` exists, show "Last updated {D Month YYYY}" (en-IN, e.g. "28 October 2026") as a small muted line under the lede in the hero, and add `dateModified` to the `WebPage` JSON-LD.
- When `p.changelog` has items, render a small "What's new" list at the end of the details column (date + text), newest first, max 5.

## Verification (in order, short output)

1. `npx tsc --noEmit 2>&1 | tail -20`
2. `npm run lint 2>&1 | tail -20`
3. `npm test 2>&1 | grep -E "^# (pass|fail)"`
4. `npm run build 2>&1 | grep -E "features|Error" | head -10`
5. `grep -n "max-width: 720px" app/features/feature.module.css` shows it only on the main column, not on a wrapper that holds the rail.
6. `grep -rn "—" app/features | head` prints nothing.

Reply with the changed file list and the outputs of steps 3 to 6.
