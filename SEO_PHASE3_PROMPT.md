# SEO Phase 3: blog authors, comparison tables, pay-per-event page

Repo: `Vyavasth-landing-page`. Three small additions, driven by an AI-visibility baseline: ChatGPT cites small, plain pages that state rupee prices, compare options in a table and answer objections in an FAQ. It also weighs named authors over "Team" bylines.

## Working rules (keep token use low)

- Do NOT run the dev server, open a browser or take screenshots.
- Read only the files named in each part, plus `app/about/page.tsx` for the page pattern. Do not explore further unless a build error requires it.
- AGENTS.md: check `node_modules/next/dist/docs/` only if unsure about an API.
- No new dependencies. No em dashes ("—") in user-visible strings.
- Do not commit, push or deploy.
- Reply at the end with the changed/created file list and the verification output only.

## Part A: named blog authors

Already in the repo: `lib/blog/authors.ts` (do not change its copy). Both posts now have `author:` in their frontmatter.

Read: `lib/blog/authors.ts`, `scripts/build-blog.mjs`, `lib/blog/index.ts`, `app/blog/[slug]/page.tsx`, `app/blog/page.tsx`.

1. `scripts/build-blog.mjs`: add `author` to the known frontmatter keys and make it required. Fail the build (naming the file) when the author id is not in `AUTHORS`, or when that author's `bio` is `null`. Read `AUTHORS` by importing `lib/blog/authors.ts` if the script can (Node supports TS type stripping in this repo, as the tests already rely on it); otherwise parse the ids and the `bio: null` entries from the file with a regex. Emit `author` (the id) in each generated post.
2. `lib/blog/index.ts`: add `author: string` to `BlogPost`.
3. Post page byline: "By {author.name}" linking to `/blog/author/{id}`, then the existing date and reading-time parts. Under the article, before the CTA, a small author box: name, role, bio, link "More from {name}".
4. New route `app/blog/author/[id]/page.tsx` (rendered per request like the other blog routes): `LegalPageShell` titled with the author's name, the role as a muted line, the bio, then their published posts listed the same way as `/blog`. 404 for unknown ids, and for authors with no published posts. Metadata: title "{name}, {role} | Vyavasth Blog", canonical `/blog/author/{id}`. JSON-LD: `Person` with `@id: https://vyavasth.in/blog/author/{id}#person`, `name`, `jobTitle` (role), `description` (bio), `worksFor: {"@id":"https://vyavasth.in/#organization"}`, `url`.
5. `BlogPosting.author` on post pages becomes `{"@id": "https://vyavasth.in/blog/author/{id}#person", "@type": "Person", "name": ...}`; keep `publisher` as the Organization.
6. Sitemap: add `/blog/author/{id}` for authors who have at least one published post.

## Part B: tables in feature pages

Read: `lib/feature-pages.ts` (types and the live-delivery entry only), `app/features/[slug]/page.tsx`.

1. Extend the `Section` type with optional `table?: { caption: string; head: string[]; rows: string[][] }`. Render it after a section's paragraphs and bullets, as a real `<table>` with `<caption>`, `<thead>` and `<th scope="col">`, inside `<div className="overflow-x-auto">`, styled like the blog tables (thin row borders, header bold, `text-sm`).
2. In the `live-photo-delivery` entry, add this section as the second item of its `sections` array (copy exactly):

```ts
{
  h2: "Pen drive, Google Drive or a delivery gallery",
  table: {
    caption: "How the common ways of delivering wedding photos compare",
    head: ["", "Pen drive", "Google Drive", "Vyavasth gallery"],
    rows: [
      ["Reaches every guest", "No", "Only if they scroll the whole folder", "Yes, each guest finds their own photos with a selfie"],
      ["When photos arrive", "Weeks after the wedding", "After the wedding", "During the wedding"],
      ["Album selection", "Lists of file numbers on WhatsApp", "Lists of file numbers on WhatsApp", "Likes in the gallery, filtered by the studio"],
      ["Works on a phone", "No", "Partly, downloads come as zip files", "Yes"],
      ["Studio branding", "A sticker on the drive", "None", "Logo and watermark on every screen"],
      ["Good final archive", "Yes", "No", "Pair it with a pen drive of the final edits"],
    ],
  },
},
```
3. Extend `lib/feature-pages.test.ts`: every table row has the same number of cells as its `head`.

## Part C: pay-per-event page (`/pricing/pay-per-event`)

The page that wins "cheapest photo delivery software India pay per event" in ChatGPT today is a plain India pricing page: rupee prices, UPI, GST, a comparison table and objection-handling FAQ. Ours has a stronger offer and no such page.

Read: `app/pricing/page.tsx` (how plans are fetched, failure handling, FAQ JSON-LD), `lib/plans.ts` (exports only: `eventPlanOf`, `chargedPrice`, `formatInr`, `formatCount`, `photoCapTermsOf`, `validityOptionsOf`, `validityBaseDaysOf`, `firstPurchaseOfferOf`, `buildStorageTiers`, `planForTier`, `formatStorage`, `gstInclusiveOf`), `lib/pricing-display.ts` (exports only).

Every number on this page comes from the plans API through those helpers. Nothing numeric is hard-coded except the 18% GST mention already handled by the helpers. If the API fails, render the page with the text below but replace every sentence that needs a number with "See current prices on the pricing page." linking to `/pricing`, and never throw.

Use the same caching/revalidation as `app/pricing/page.tsx`. `LegalPageShell` with title "Pay per event photo delivery for Indian studios".

Metadata: title "Pay per event photo delivery in India: price, limits and GST | Vyavasth", description built from live numbers: "Deliver a wedding gallery for {event price} per event, GST {included|extra}. Up to {cap} photos, live for {months} months, face search and album selection included. No subscription." Canonical `/pricing/pay-per-event`.

Sections, in order (h2 headings exactly as written; fill `{…}` from the API):

1. Opening `<p className="text-lg">`: "On Vyavasth you can pay for one event at a time: {event price per event, stating GST as the helpers do} for a full wedding gallery with face search, album selection and your studio's branding. There is no subscription and no monthly bill in the off-season."
   If `firstPurchaseOfferOf` returns an offer, add one more sentence: "Your first purchase includes {n} free event(s)."
2. **h2 "What one event includes"**: bullets:
   - "Up to {cap} photos in the event at a time. Delete photos to make room, or add {addon size} more for {addon price}."
   - "The gallery stays live for {base months} months from the day you create the event."
   - "Extend it later: {each validity option as '{months} months for {price}', joined with commas}."
   - "Every feature: face search for guests, album selection with likes and filters, Locate Originals, your branding and watermark, and the Google review prompt."
   - "Original-quality delivery needs a storage plan of 500 GB or more."
3. **h2 "When a storage plan costs less"**: one paragraph using the lowest yearly storage tier: "If you deliver many events a year, a storage plan can work out cheaper: {lowest tier storage} for a year costs {its yearly price}, about the same as {N} events bought one at a time." Compute N = floor(yearly price / per-event charged price). Link "Compare all plans" to `/pricing`.
4. **h2 "Pay per event, storage plan, pen drive or Google Drive"**: a table (same table styling as Part B) with head ["", "Pay per event", "Storage plan", "Pen drive", "Google Drive"] and rows:
   - ["Cost", "{per-event price} per event", "From {lowest yearly price} a year", "Drive plus courier for every client", "Monthly Google storage once the free 15 GB is full"]
   - ["Best for", "A few weddings a season", "Studios delivering every week", "The final copy the couple keeps", "Sharing a folder with one person"]
   - ["Guests find their own photos", "Yes", "Yes", "No", "No"]
   - ["Album selection", "Yes", "Yes", "File-number lists", "File-number lists"]
   - ["Paid in rupees, GST invoice", "Yes", "Yes", "Not applicable", "Billed by Google"]
5. **h2 "Paying from India"**: "Pay with UPI, cards or netbanking through Razorpay. Prices are in rupees, and you receive a GST invoice for every purchase."
6. **h2 "Questions"**: h3 + p, plus FAQPage JSON-LD:
   - "Is there a subscription?" / "No. Pay per event is a one-time payment for each event. Storage plans are yearly or monthly and are a separate choice."
   - "Do event credits expire?" / "No. Buy several events and use them whenever you shoot. Each event's gallery stays live for {base months} months from the day you create it."
   - "What if a wedding has more than {cap} photos?" / "Add {addon size} more photos to that event for {addon price}, as many times as you need, or delete photos you no longer need."
   - "Can I pay with UPI?" / "Yes. UPI, cards and netbanking all work."
   - "Do I get a GST invoice?" / "Yes, for every purchase."
   - "My clients still want a pen drive. Is this useful?" / "Yes. Use the gallery for sharing, face search and album selection during and after the wedding, and hand over a pen drive with the final edits at the end."
7. CTA: same WhatsApp button as the about page, `whatsappUrl("Hi, I want to buy events on Vyavasth")`, plus a text link "See all plans" to `/pricing`.

JSON-LD (array): `FAQPage`; `BreadcrumbList` Home > Pricing (`/pricing`) > "Pay per event"; and an `Offer` node: `{"@type":"Offer","name":"Pay per event","price": "<charged per-event price as string>","priceCurrency":"INR","url":"https://vyavasth.in/pricing/pay-per-event","seller":{"@id":"https://vyavasth.in/#organization"}}` (omit the Offer when the API failed).

Links: on `app/pricing/page.tsx`, add one plain text link under the existing pricing area: "How pay per event works" to `/pricing/pay-per-event`. Touch nothing else on the pricing page. Add `/pricing/pay-per-event` to the sitemap (weekly, 0.8).

## Verification (in order, keep output short)

1. `node scripts/build-blog.mjs 2>&1 | tail -5` (no errors; both posts carry `"author"`)
2. Author guard: `sed -i.bak 's/^author: bharat$/author: nobody/' content/blog/find-raw-files-from-client-selection.md; node scripts/build-blog.mjs; echo "exit=$?"; mv content/blog/find-raw-files-from-client-selection.md.bak content/blog/find-raw-files-from-client-selection.md; node scripts/build-blog.mjs >/dev/null` (expect a non-zero exit saying author "nobody" is unknown). Also confirm in code that an author with `bio: null` fails the same way.
3. `npx tsc --noEmit 2>&1 | tail -20`
4. `npm run lint 2>&1 | tail -20`
5. `npm test 2>&1 | tail -15`
6. `npm run build 2>&1 | tail -40`
7. `grep -rn "—" app/pricing/pay-per-event app/blog/author | head` must print nothing.
8. `grep -rn "Vyavasth Team" app/blog | head` must print nothing.

Fix failures, then reply with the file list and the outputs of steps 1, 2, 6 (route lines for /pricing/pay-per-event and /blog/author only), 7 and 8. If `graphify` is installed, run `graphify update .` last.
