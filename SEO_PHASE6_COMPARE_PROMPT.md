# SEO Phase 6: comparison hub + 5 "Vyavasth vs X" pages (/compare)

Repo: `Vyavasth-landing-page`. Read `AGENTS.md` first. All copy is in `lib/compare-data.ts` (already in the repo, competitor facts checked on 28 Oct 2026). Your job: routes, rendering, structured data, sitemap, footer link and tests. Do not change copy in `lib/compare-data.ts` except to fix a TypeScript error.

Goal: rank for "AI face search photo sharing app India", "Kwikpic alternative", "Vyavasth vs FotoOwl" and get cited by ChatGPT and Google AI Mode for "which app should my studio use" questions.

## Working rules (keep token use low)

- Do NOT run the dev server, open a browser or take screenshots.
- Read only: `lib/compare-data.ts`, `app/features/[slug]/page.tsx` and `app/features/feature.module.css` (reuse the visual language and the Nav/Footer setup from the redesigned feature page), `app/pricing/page.tsx` (how plans are fetched and how API failure is handled), `lib/plans.ts` and `lib/pricing-display.ts` (exported helpers only), `app/sitemap.ts`, `components/Footer.tsx`, and the first 20 lines of an existing `*.test.ts` for the test pattern. Nothing else unless a build error requires it.
- **Render per request:** every `/compare` route must `export const dynamic = "force-dynamic"`. Do NOT use `generateStaticParams` or `dynamicParams = false`: prerendered pages under a dynamic segment 404 on our Cloudflare (OpenNext) hosting. Unknown slugs 404 through `notFound()`.
- No new dependencies. No em dashes ("—") in visible text. No decorative coloured dashes or eyebrow labels before headings.
- Do not commit, push or deploy.

## Vyavasth's prices

From the plans API, never hard-coded: fetch exactly like `app/pricing/page.tsx` (`getPlans()`), and use the existing helpers (`eventPlanOf`, `buildStorageTiers`, `planForTier(tier, "yearly")`, `chargedPrice`, `gstInclusiveOf`, `formatInr`, `formatStorage`, `photoCapTermsOf`, and `EVENT_VALIDITY_MONTHS`). If `getPlans()` fails, every page still renders; where a Vyavasth price would be, show "See current prices on the pricing page" linking to `/pricing`. Never throw because the API is down.

## 1. Hub: `app/compare/page.tsx`

- Metadata: title "AI face search photo sharing apps in India: 2026 price comparison | Vyavasth"; description "Kwikpic, FotoOwl, Samaro, PicPapaya, FaceSnap, Photomall, Kamero and Vyavasth compared for Indian studios: how each is priced, entry price, GST and album selection. Checked {CHECKED_ON_LABEL}." (build the string from the constant); canonical `/compare`.
- h1: "AI face search photo sharing apps in India, compared"
- Lede: "How the photo delivery tools Indian studios ask about are priced, what the cheapest paid plan costs, whether GST is extra, and whether album selection is included. Every price is from the tool's own website on {CHECKED_ON_LABEL}. We make Vyavasth, so we also say where the others are better."
- **Main table** (`<table>` with caption "Photo delivery tools for Indian studios, compared"), columns: Tool | How it is priced | Entry price | GST | Album selection | Details.
  - First row Vyavasth: pricedBy "Pay per event, or yearly storage"; entry from the API: "{per-event charged price} per event, or {smallest yearly storage plan charged price} a year ({its storage})"; GST "Included in storage plan prices" (use `gstInclusiveOf` to decide the wording; if not inclusive, say "Extra"); album selection "Collections, side filters and Locate Originals, on every plan"; Details: link to `/pricing`.
  - Then one row per `COMPETITORS` entry (from `hub`), Details = link "Vyavasth vs {name}" to its page.
  - Then one row per `HUB_ONLY` entry, Details = its `note` plus an external source link.
- Below the table, h2 "Which one should you choose?" with one short paragraph per competitor: the first sentence of its `verdict` plus a link to its page.
- h2 "Sources": a list of every source URL (competitors and hub-only), external links `rel="noopener nofollow" target="_blank"`, and the line "Checked on {CHECKED_ON_LABEL}. If something has changed, tell us on WhatsApp and we will update this page." (link `whatsappUrl()`).
- JSON-LD: `BreadcrumbList` (Home > Compare), `ItemList` of the 5 comparison pages, and `WebPage` with `dateModified: CHECKED_ON`.

## 2. `app/compare/[slug]/page.tsx`: one page per `COMPETITORS` entry

`generateMetadata`: `title: c.title`, `description: c.metaDescription`, canonical `/compare/{slug}`, `openGraph` with the same.

Layout (reuse the feature page's visual language: hero band, cards, white rounded tables):
1. Hero: breadcrumb link "Compare" to `/compare`; h1 `c.h1`; muted line "Prices and features checked on {CHECKED_ON_LABEL}."; `c.verdict` as the lede (larger text; this is the paragraph AI engines quote); WhatsApp CTA (`whatsappUrl("Hi, I am comparing Vyavasth with " + c.name)`) and "See Vyavasth pricing" link.
2. h2 "Price comparison": `c.pricingModel`, then two tables side by side on desktop, stacked on mobile:
   - **Vyavasth** (caption "Vyavasth"): Plan | What you get | Price you pay. Row 1 pay per event (cap from `photoCapTermsOf`, validity from `EVENT_VALIDITY_MONTHS`), then each yearly storage tier: "{size} reusable storage" and the charged yearly price "+ a year, GST included" (or "including GST" wording per `gstInclusiveOf`).
   - **{c.name}** (caption `c.name`): Plan | What you get | Listed price | With 18% GST. Listed: `null` → "Not published", `0` → "Free", else `formatInr(n) + " a year"` + (`gstIncluded === false` ? " + GST" : `gstIncluded === null` ? " (GST not stated)" : ""). GST column from `withGst(plan)`; when `gstIncluded === null` show the listed number with no GST added. `plan.note` in small muted text under the plan name.
   - `c.pricingNote` under the tables, then "Source: " + `c.sources` as external links.
3. h2 "Feature by feature": table with columns (blank) | Vyavasth | {c.name}, one row per `c.rows`, label bold.
4. Two cards side by side: h2 "Where {c.name} is better" (`theyAreBetterAt`) and h2 "Where Vyavasth is better" (`vyavasthIsBetterAt`). Give the competitor card equal visual weight.
5. h2 "Which one should you choose?": h3 "Choose {c.name} if" + list, h3 "Choose Vyavasth if" + list.
6. h2 "Questions": `<details>`/`<summary>` per FAQ like the feature pages (answers in the server HTML).
7. Closing note (small, muted): "{c.name} is a trademark of its owner. Details about {c.name} come from its public website on {CHECKED_ON_LABEL}. If something has changed, tell us on WhatsApp and we will update this page."
8. "More comparisons": links to the other 4 pages and `/compare`.

All tables: real `<table><caption><thead><tbody><th scope>`, wrapped in an `overflow-x-auto` container so the page never scrolls sideways at 360px.

JSON-LD per page: `FAQPage` from `c.faqs`; `BreadcrumbList` Home > Compare > `c.h1`; `WebPage` with `dateModified: CHECKED_ON`, `isPartOf: {"@id":"https://vyavasth.in/#website"}`, `about: {"@id":"https://vyavasth.in/#software"}`.

## 3. Sitemap, footer, menu

- `app/sitemap.ts`: add `/compare` (priority 0.8) and each `/compare/{slug}` (0.8), `lastModified` from `CHECKED_ON`. Import the data; no hard-coded slugs.
- `components/Footer.tsx`: add "Compare" linking to `/compare`, right after Pricing, same styling.
- Do not add Compare to the top nav.

## 4. Tests: `lib/compare-data.test.ts`

- unique slugs, all starting with "vyavasth-vs-"
- every competitor and hub-only tool has at least one source URL starting with "https://"
- `withGst`: null → null, 0 → 0, `gstIncluded:false` → `Math.round(x*1.18)`, `true`/`null` → listed value
- no string in `COMPETITORS` or `HUB_ONLY` contains "—" (walk via `JSON.stringify`)

## Verification (in order, short output)

1. `npx tsc --noEmit 2>&1 | tail -20`
2. `npm run lint 2>&1 | tail -20`
3. `npm test 2>&1 | grep -E "^# (pass|fail)"`
4. `npm run build 2>&1 | grep -E "compare|Error" | head -20` (routes show as dynamic, which is expected)
5. `grep -rn "generateStaticParams\|dynamicParams" app/compare` prints nothing.
6. `grep -rn "—" app/compare | head` prints nothing.

Reply with the changed/created file list and the outputs of steps 3 to 6.
