# SEO Phase 5: visual feature pages + Features menu

Repo: `Vyavasth-landing-page`. Read `AGENTS.md` first (this Next.js differs from what you know; check `node_modules/next/dist/docs` when unsure).

The 5 pages at `/features/[slug]` read like documents: they render inside `LegalPageShell` as long text. Studio owners do not read them. Search engines and AI engines need the text, people need visuals. Goal: **one page per feature, visual first, detail below, everything server-rendered.** Do not create a second set of pages.

## Working rules (keep token use low)

- Do NOT run the dev server, open a browser, or take screenshots.
- Read only: `app/features/[slug]/page.tsx`, `lib/feature-pages.ts` (types and the first entry only), `components/Nav.tsx`, `components/Nav.module.css`, `components/home/Features.module.css` (lines 1 to 30 and the `.ft` rule, for look and tokens), `app/globals.css` (the `:root` tokens), `components/CtaSection.tsx`. Nothing else unless a build error requires it.
- No new dependencies. No client JavaScript on the feature page (it stays a server component). No em dashes ("—") in visible text.
- No decorative short coloured lines or dashes before headings or labels, no "eyebrow" labels above headings, no gradient pills or badge clutter. Typography first: big confident headings, generous white space, terracotta used sparingly.
- Keep `export const dynamic = "force-dynamic"` (prerendered dynamic segments 404 on Cloudflare here).
- Do not change any copy in `lib/feature-pages.ts`. Content is filled in separately.
- Do not commit, push or deploy.

## 1. Data model (`lib/feature-pages.ts`, types only)

Add optional fields to `FeaturePage` (do not fill them for any page, leave content to us):

```ts
/** One short line under the h1, max ~110 chars. Falls back to the first sentence of `summary`. */
lede?: string;
/** Main visual for the hero. Falls back to the first section figure, else no image. */
hero?: Figure;
/** 3 or 4 short benefit cards. Section hidden when absent. */
benefits?: { title: string; text: string }[];
```
And on `Step` add `image?: Figure`.

## 2. New page layout (`app/features/[slug]/page.tsx`)

Stop using `LegalPageShell` for this route. Keep the site `Nav` and `Footer` the way other marketing pages include them (check how `LegalPageShell` does it and reuse the same components). Create `app/features/feature.module.css` for styles (or Tailwind, matching the repo's habit; one approach, not both). Order:

1. **Hero** (two columns on desktop, stacked on mobile): small breadcrumb text link "Features" to `/features`; `h1` (large, `--font-jakarta`, color `--brown`); `lede`; two actions: primary "Chat on WhatsApp" (existing `whatsappUrl(p.whatsappText)`, terracotta) and secondary "See pricing" (`/pricing`). Right column: the hero image in a white rounded frame with soft shadow (`--sh`-like), phone-sized when `figure.mobile`.
2. **Steps**: `p.stepsHeading` as h2; steps as numbered cards in a row (4 across on desktop, 2 on tablet, 1 on mobile). Number in a terracotta circle. If a step has `image`, show it at the top of its card.
3. **Benefits** (only if `benefits`): 2x2 grid of cards on a `--peach` or `--cream` band, title bold, one line of text.
4. **Quote** (if `p.quote`): one large pull quote card, studio and city under it. Keep the Hinglish text as is.
5. **Details**: h2 "The details". Render the existing `sections` exactly as today (h2, paragraphs, bullets, figure, table), in a narrower reading column (max ~720px). Keep all h2 texts.
6. **Questions**: h2 "Questions". Each FAQ as `<details>` with the question in `<summary>` (styled as an h3-weight line with a plus/minus indicator via CSS) and the answer inside. The answer text must be in the server HTML (it is, inside `<details>`). Keep the FAQPage JSON-LD exactly as today.
7. **Related features**: cards (navLabel + first sentence of summary), linking to each page, plus "All features" link.
8. **Final CTA band**: "See it on your next wedding." with the WhatsApp button. Reuse `CtaSection` if it fits; otherwise a simple band.

Keep the existing JSON-LD (FAQPage, BreadcrumbList, WebPage) and `generateMetadata` unchanged.

Layout must not scroll sideways at 360px. Tables stay in their overflow wrapper. Images use `next/image` with `unoptimized` as today.

## 3. Features menu in the top nav (`components/Nav.tsx`)

- Replace the plain "Features" link with a dropdown button. Items, in this order, from `FEATURE_PAGES` (import `navLabel` and `slug`): Album selection, Face search, Live delivery, Locate originals, Google reviews (use each page's `navLabel`), then "All features" (`/features`).
- Accessible: a `<button aria-expanded aria-controls>` toggles a panel; Escape and outside click close it; opens on hover on desktop too. The links must be **in the HTML at all times** (hidden with CSS when closed, not conditionally rendered), so crawlers find them.
- Mobile drawer: show the same 5 links as a sub-list under "Features".
- Keep "Pricing" and "How it works" as they are. Match existing `Nav.module.css` styles.

## Verification (in order, short output)

1. `npx tsc --noEmit 2>&1 | tail -20`
2. `npm run lint 2>&1 | tail -20`
3. `npm test 2>&1 | tail -6`
4. `npm run build 2>&1 | tail -30`
5. `grep -rn "LegalPageShell" "app/features/[slug]/page.tsx"` prints nothing.
6. `grep -n "features/" components/Nav.tsx | head` shows the dropdown links come from `FEATURE_PAGES`.
7. `grep -rn "—" app/features components/Nav.tsx | head` prints nothing.

Reply with the changed file list and the outputs of steps 4 (the /features routes only), 5 and 6.
