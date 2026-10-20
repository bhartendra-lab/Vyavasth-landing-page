# SEO Phase 4: make every price readable without clicking (/pricing)

Repo: `Vyavasth-landing-page`. AI crawlers and search engines read the HTML the server sends; they do not click. Today `/pricing` server-renders only the default storage tier (200 GB). The 75 GB, 500 GB, 1 TB and 4 TB prices exist only after a visitor moves the size selector, so to ChatGPT they do not exist. The hero also says "₹625 a month" without saying which plan that is.

Add a plain, server-rendered table of every plan, and make the hero teaser name its plan. Do not change the interactive pricing UI.

## Working rules (keep token use low)

- Do NOT run the dev server, open a browser or take screenshots.
- Read only: `app/pricing/page.tsx`, `components/pricing/PricingClient.tsx` (only to find where the "a month" teaser text is built), `lib/plans.ts` and `lib/pricing-display.ts` (exports only), and `app/blog/blog.module.css` (to copy table styling). Nothing else unless a build error requires it.
- No new dependencies. No em dashes ("—") in visible text.
- Every number comes from the plans API through the existing helpers. Nothing hard-coded.
- Do not commit, push or deploy. Reply with the changed file list and the verification output only.

## 1. "All plans at a glance" table on `/pricing`

In `app/pricing/page.tsx` (a server component), render a new section after the interactive pricing block and before `IncludedBox`, only when the plans API succeeded:

- `h2`: "All plans at a glance"
- One sentence above the table: "Every plan includes face search, album selection with Smart Selects, Locate Originals, your branding and watermark, and the Google review prompt. Original-quality delivery needs 500 GB or more."
- A real `<table>` (with `<caption>` "Vyavasth plans and prices in rupees", `<thead>`, `<th scope>`), wrapped in a horizontally scrollable `<div>` so the page never scrolls sideways on a 360 px phone:
  - Columns: `Plan` | `What you get` | `Monthly` | `Yearly`
  - Row 1, from `eventPlanOf`: "Pay per event" | "One event, up to {cap} photos at a time, live for {base months} months" | "{charged per-event price} per event" (state GST the same way the page does elsewhere) | "No subscription"
  - One row per storage tier from `buildStorageTiers`, smallest first: "{formatStorage(gb)}" | "{formatStorage(gb)} reusable storage{gb >= 500 ? ', original-quality delivery' : ''}" | monthly charged price from `planForTier(tier, "monthly")` + " a month", or "Not offered" | yearly charged price from `planForTier(tier, "yearly")` + " a year", or "Not offered"
  - Mark GST clearly: if the storage plans are GST-inclusive (`gstInclusiveOf`), add a line under the table: "Storage plan prices include GST." Use whatever the existing helpers say, never a guess.
- Style it like the blog tables: `text-sm`, thin row borders `rgba(26,18,8,0.08)`, bold header, cell padding. Use Tailwind classes or the page's existing CSS module; no new CSS file.

## 2. Name the plan behind the "a month" teaser

Find where the hero's "₹{x} a month" storage teaser is built (likely `PricingClient.tsx` or `lib/pricing-display.ts`). Change the visible text so it names the plan and billing, for example "from ₹625 a month (75 GB, billed yearly)". Compute the storage size and billing from the same plan object the number already comes from. If the number is a yearly price divided by 12, say "billed yearly"; if it is a true monthly plan, say "billed monthly".

## 3. Offers in structured data

In the existing pricing JSON-LD, keep the `AggregateOffer` and add an `offers` array on the same Product/Service node with one `Offer` per row of the new table (name, price as a string of the charged amount, `priceCurrency: "INR"`, and `description` such as "200 GB, billed yearly"). Only include rows that have a price.

## Verification (in order, keep output short)

1. `npx tsc --noEmit 2>&1 | tail -20`
2. `npm run lint 2>&1 | tail -20`
3. `npm test 2>&1 | tail -6`
4. `npm run build 2>&1 | tail -30`
5. Prove the prices are in the server HTML without a server: find the prerendered pricing output (`find .next/server/app -name "pricing.html" -o -name "pricing.rsc" | head`) and grep it for "All plans at a glance" and for at least three different storage sizes (for example `grep -o "75 GB\|500 GB\|1 TB\|4 TB" <file> | sort -u`). If the page is dynamic and has no prerendered file, say so and skip this step.
6. `grep -rn "—" app/pricing/page.tsx | head` must print nothing new.

Reply with the changed files and the outputs of steps 4 (pricing route line only) and 5.
