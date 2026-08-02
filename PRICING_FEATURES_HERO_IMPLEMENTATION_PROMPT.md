# Pricing Page Upgrade · Feature Catalog · Homepage Rebrand

**Implementation prompt — hand this to the agent doing the work.**

Repos touched (all three are already mounted):

| Repo | Path | Role in this task |
| --- | --- | --- |
| Backend | `Vyavasth/backend` | New `features` collection, public read endpoint, seed script |
| Landing page | `Vyavasth-landing-page` | Pricing page rebuild, homepage rebrand |
| Delivery app | `delivery-promotional-page` | **Read-only reference.** Do not modify. Source of billing truth. |

---

## 0. Read this before writing a line of code

1. `Vyavasth-landing-page/AGENTS.md` says this is **Next.js 16.2.6 / React 19.2.4** and that APIs differ from training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any component or route.
2. `Vyavasth-landing-page/lib/plans.ts` carries a header comment: it is **byte-for-byte identical** to `delivery-promotional-page/frontend/lib/plans.ts`. Treat it as frozen for this task. If you genuinely must change it, change both files in the same commit — but you should not need to.
3. The backend is ESM (`"type": "module"`), Express 5, Mongoose 9, `pino` for logging. Controllers return via `next(error)`, never throw to the client. Reads use `.lean()`. Validation is `express-validator` + the shared `validate` middleware.
4. Everything on the pricing page is already DB-driven via `GET /billing/plans`. **Nothing about price, storage size, plan name or event count may be hardcoded in the landing page.** That rule now extends to feature copy.
5. Read `delivery-promotional-page/Vyavasth Design System.md` §5 (colour), §6 (type), §7 (motion), §11 (voice). Particularly the forbidden-phrases list: *revolutionary, game-changing, unlock, empower, seamless, world-class, AI-powered (as a brag), trusted by thousands, leverage, synergy.* None of these may appear in any copy you write.

**Dependencies:** `framer-motion@^12`, `lucide-react@^1.14` and Tailwind v4 are already installed and are all you need for Phases 1–4. Phase 5 adds React Three Fiber — that is the *only* sanctioned new dependency, and it comes with a measured performance gate (§7.1).

---

## 1. What we are building

Three deliverables, in this order:

**A. A `features` collection in the backend** — the canonical catalog of what Vyavasth does, served over a public endpoint, with a feature-to-service mapping architecture in place from day one but *intentionally unused*, so premium tiers can be introduced later without a schema migration or a data backfill.

**B. A rebuilt `/pricing` page** that (i) teaches the pricing model properly instead of just presenting a calculator, (ii) renders the feature catalog from the API with polished motion, and (iii) carries a `Get Started` CTA.

**C. A homepage rebrand** — Hero and every section below it — so the whole page sells the one thing we sell today: an AI event-gallery that delivers photos to guests during the event. All CRM/leads/bookings/payments positioning comes out.

**D. A motion & interaction layer on the hero** (§7) — an ambient 3D bokeh field, a magnetic CTA, and cursor-reactive depth on the live-gallery collage. Purely additive: no colour, type, copy or layout changes. Built and reviewed in three separate passes.

---

## 2. Non-negotiable constraints

- **Do not break checkout.** The pricing calculator builds `${NEXT_PUBLIC_APP_URL}/checkout?plan=<serviceId>&qty=<n>&coupon=<code>`. That contract is consumed by the delivery app. `components/pricing/PricingClient.tsx` keeps its current behaviour, props and href construction. You are wrapping it in a better page, not rewriting it.
- **`Service.features: [String]` stays exactly as it is.** It is the short bullet list rendered inside `PlanSummary` ("Never expires", "All features included"). The new `Feature` collection is the *marketing capability catalog* — a different thing, rendered in a different section. Do not repopulate `PlanSummary` from the catalog; a ten-item checklist inside the price card would wreck it.
- **Design tokens only.** Every colour comes from `app/globals.css` (`--color-accent`, `--color-primary`, `--color-muted`, `--color-surface`, `--color-line`, `--color-success`, …). No new hex values. One accent — terracotta — and that stays true.
- **Every network read degrades gracefully.** `lib/vyavasth-api.ts` helpers never throw; they return `{ ok: false, error }`. Follow that pattern for features, and give both the pricing page and the homepage a sensible render when the API is down.
- **Reduced motion is respected everywhere.** Every animated component calls `useReducedMotion()` and returns bare props when it is true — this is already the pattern in `Hero.tsx`, `FeatureSection.tsx`, `CtaSection.tsx`.

---

## 3. Phase 1 — Backend: the `features` collection

### 3.1 `src/models/feature.model.js` (new)

```js
import mongoose from "mongoose";

const featureSchema = new mongoose.Schema(
  {
    // Stable slug — the join key for the seed script and any future
    // hardcoded reference. Never regenerate these; renaming a feature
    // changes `name`, not `key`.
    key: { type: String, required: true, unique: true, trim: true, lowercase: true },
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    // Lucide icon name, resolved through a frontend registry with a
    // fallback — an unknown value here can never crash the page.
    icon: { type: String, default: null },
    category: {
      type: String,
      enum: ["discovery", "delivery", "brand", "growth", "operations"],
      required: true,
    },
    // Empty array === included in EVERY plan. This is the whole gating
    // architecture: today every document ships with `service_ids: []`, so
    // the pricing page truthfully advertises "every feature, every plan".
    // When premium tiers arrive, populate this on the premium features
    // only — no migration, no schema change, no frontend rewrite.
    service_ids: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service" }],
      default: [],
    },
    // Surfaced on the homepage's short feature strip.
    is_highlight: { type: Boolean, default: false },
    sort_order: { type: Number, default: 0 },
    is_active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

featureSchema.index({ is_active: 1, sort_order: 1 });
featureSchema.index({ service_ids: 1 });

const Feature = mongoose.model("Feature", featureSchema, "features");

export { Feature };
```

`key` already gets a unique index from `unique: true`; run `npm run db:sync-indexes` after deploying so the compound indexes land.

### 3.2 `src/services/features.service.js` (new)

One exported resolver. This is the piece that makes the future premium-tier work a config change rather than a refactor.

```js
import { Feature } from "../models/feature.model.js";

/**
 * Features visible for a given service.
 *
 * `service_ids: []` means universal — included in every plan. A non-empty
 * array means the feature is gated to exactly those services. Passing no
 * serviceId returns the full active catalog (what the public pricing page
 * asks for today).
 *
 * Today every Feature is universal, so both branches return the same set.
 * That is deliberate: the branch is exercised in production from day one
 * and cannot rot before we need it.
 */
export async function resolveFeaturesForService(serviceId = null) {
  const query = { is_active: true };
  if (serviceId) {
    query.$or = [{ service_ids: { $size: 0 } }, { service_ids: serviceId }];
  }
  return Feature.find(query).sort({ sort_order: 1 }).lean();
}
```

### 3.3 Public endpoint

Add `src/routes/features.routes.js` and mount it in `src/server.js` as `app.use("/features", featuresRoutes)`, alongside the existing route mounts. Controller: `src/controllers/features.controller.js`.

```
GET /features                      → full active catalog
GET /features?service_id=<mongoId> → catalog filtered for that service
GET /features?highlight=true       → is_highlight only (homepage strip)
```

Response — mirror the shape and discipline of `getPlans` in `billing.controller.js` (explicit field projection, never spread the raw document):

```json
{
  "features": [
    {
      "_id": "…",
      "key": "ai-face-search",
      "name": "AI Face Search",
      "description": "…",
      "icon": "ScanFace",
      "category": "discovery",
      "is_highlight": true,
      "included_in_all_plans": true,
      "sort_order": 10
    }
  ]
}
```

`included_in_all_plans` is computed (`(f.service_ids?.length ?? 0) === 0`) — **never return `service_ids` itself**. It is internal wiring, and leaking plan-gating structure to a public marketing endpoint invites confusion later.

Validator: `src/validators/features.validator.js` with `query("service_id").optional().isMongoId()` and `query("highlight").optional().isBoolean()`, wired through the existing `validate` middleware. Public route, no `protect`.

**No CORS change is needed.** The landing page fetches this server-side from a Next.js server component, so `vyavasth.in` never appears as a browser `Origin` — same as `GET /billing/plans` today. Do not add origins to `server.js`.

### 3.4 `src/scripts/seed-features.js` (new)

Idempotent, keyed on `key`, safe to run repeatedly:

```js
await Feature.bulkWrite(
  FEATURES.map((f) => ({
    updateOne: { filter: { key: f.key }, update: { $set: f }, upsert: true },
  })),
);
```

Mirror `src/scripts/seed-whatsapp-templates.js` for the connect/disconnect/logging shape. Add `"db:seed-features": "node src/scripts/seed-features.js"` to `package.json` scripts.

Seed data is **Appendix B** below — use that copy verbatim. `service_ids` is omitted everywhere (schema default `[]` = universal). Running the script twice must produce zero new documents; prove it.

### 3.5 Backend verification

- `npm run db:seed-features` twice → `Feature.countDocuments()` is 10 both times.
- `curl localhost:5000/features` → 10 features, sorted, every `included_in_all_plans: true`, no `service_ids` in the payload.
- `curl "localhost:5000/features?highlight=true"` → 4 features.
- `curl "localhost:5000/features?service_id=<a real Service _id>"` → same 10 (proves the universal branch).
- Add `src/services/features.service.test.js` (`node --test`) covering: universal-only catalog, a synthetic gated feature excluded for a non-matching service and included for a matching one.

---

## 4. Phase 2 — Landing page data layer

### 4.1 `lib/features.ts` (new — pure, no React, no fetch)

Follow the discipline of `lib/plans.ts`: types plus pure helpers, unit-testable in isolation.

```ts
export type FeatureCategory = "discovery" | "delivery" | "brand" | "growth" | "operations";

export type Feature = {
  _id: string;
  key: string;
  name: string;
  description: string;
  icon?: string | null;
  category: FeatureCategory;
  is_highlight?: boolean;
  included_in_all_plans: boolean;
  sort_order?: number;
};

export const CATEGORY_LABELS: Record<FeatureCategory, string> = {
  discovery: "Finding photos",
  delivery: "Getting them out",
  brand: "Your identity",
  growth: "Growing the studio",
  operations: "Running it day to day",
};

export function sortFeatures(features: Feature[]): Feature[];
export function highlightsOf(features: Feature[], limit?: number): Feature[];
export function groupByCategory(features: Feature[]): Array<{ category: FeatureCategory; features: Feature[] }>;
/** True when every active feature is universal — drives the "included in every plan" banner. */
export function allIncludedInEveryPlan(features: Feature[]): boolean;
```

Add `lib/features.test.ts` alongside `lib/plans.test.ts`; `npm test` already globs `lib/**/*.test.ts`.

### 4.2 `lib/vyavasth-api.ts` — add `getFeatures()`

Copy the exact shape of `getPlans()`: `next: { revalidate: 300 }`, try/catch, returns `ApiResult<{ features: Feature[] }>`, never throws.

```ts
export async function getFeatures(opts?: { highlight?: boolean }): Promise<ApiResult<{ features: Feature[] }>>
```

Reuse `getBaseUrl()`. Do not introduce a second base-URL constant.

### 4.3 `components/features/FeatureIcon.tsx` (new)

The DB stores an icon *name*; the frontend owns the mapping. A missing or unknown key must degrade, not crash.

```tsx
import { Sparkles, ScanFace, Zap, Database, SlidersHorizontal, Lock, Star, QrCode, Stamp, MessageCircle, FolderTree } from "lucide-react";

const ICONS: Record<string, LucideIcon> = { ScanFace, Zap, Database, SlidersHorizontal, Lock, Star, QrCode, Stamp, MessageCircle, FolderTree };

export default function FeatureIcon({ name, size = 18 }: { name?: string | null; size?: number }) {
  const Icon = (name && ICONS[name]) || Sparkles;   // Sparkles is the fallback
  return <Icon size={size} aria-hidden />;
}
```

All eleven names above were verified present in the installed `lucide-react@^1.14`. If you swap any of them, re-check with `node -e "const l=require('lucide-react'); console.log('Stamp' in l)"` and keep Appendix B's `icon` column in sync — the DB and the registry must agree.

---

## 5. Phase 3 — The pricing page

`app/pricing/page.tsx` becomes a server component that fetches three things in parallel and composes six sections. Keep the existing `Metadata` export and the `Product`/`AggregateOffer` JSON-LD; extend the JSON-LD with a `FAQPage` block built from the FAQ items (free SEO, no visual cost).

```tsx
const [plansResult, couponsResult, featuresResult] = await Promise.all([
  getPlans(), getPublicCoupons(), getFeatures(),
]);
```

### 5.1 Page structure (top to bottom)

| # | Section | Component | New? |
| --- | --- | --- | --- |
| 1 | Header + dual CTA | inline in `page.tsx` | modified |
| 2 | How pricing works | `components/pricing/PricingExplainer.tsx` | **new** |
| 3 | The calculator | `PricingClient` | unchanged |
| 4 | Everything included | `components/features/FeatureShowcase.tsx` | **new** |
| 5 | Billing, plainly | `components/pricing/BillingFacts.tsx` | **new** |
| 6 | FAQ → CTA → Footer | `PricingFaq`, `CtaSection`, `Footer` | FAQ extended |

### 5.2 §1 — Header

Keep `Eyebrow` + `h1` + subcopy. Add a CTA row directly under the subcopy:

- **Primary:** `Get Started` → `${process.env.NEXT_PUBLIC_APP_URL ?? "https://deliver.vyavasth.in"}/login`, pill, `--color-accent` fill, white text, `ArrowRight` icon that translates `1px` on hover — copy the exact button treatment from `Hero.tsx` so the two pages feel like one product.
- **Secondary:** `Book a demo` → `openEnquiry()` from `useEnquiry()`. Because `page.tsx` is a server component, put this pair in a small `"use client"` component (`components/pricing/PricingHeaderCta.tsx`).

Suggested subcopy rewrite (current copy is fine but under-sells the free tier):

> Start free with two events. Buy events one at a time when work picks up, or move to a storage plan once you're delivering every week.

### 5.3 §2 — `PricingExplainer` (the heart of this task)

This is the section that teaches the model. Three cards on one row (stack on mobile), each a *stage a studio passes through*, not a plan tier — the ladder is the story.

**Card 1 — Start free**
> Unlimited storage for the first two events. Each event stays live for 3 months. The validity starts when you create the event. All features unlocked.

**Card 2 — Pay per event**
> One-time payment per event, priced GST-inclusive. 1 Credit = 1 event. Credits are cumulative and never expire, so a slow month costs you nothing. Best while you're delivering a handful of events a season.

**Card 3 — Storage plan**
> Monthly or yearly. Unlimited events; you're capped by storage, not by count. Yearly costs less than twelve months of monthly. Best once delivery is weekly.

Under the three cards, a slim horizontal ladder — `Free → Per event → Storage plan` — with a one-line honest caveat rendered as a muted note beside the last arrow:

> Moving to a storage plan is a one-way door. You can change tiers, switch monthly ↔ yearly, or cancel — but not go back to paying per event.

**Data rule:** the cards describe *mechanics*, never numbers. "Two events, included" is the only quantity allowed, and only because it also appears in `included_events` on the Free service — if you want to be strict, read it from `freePlanOf(plans)?.included_events`. Every rupee figure lives in §3, rendered from the API.

**Motion:** cards fade up on scroll, 18px, 0.5s `easeOut`, staggered `0.08s * index`, `viewport={{ once: true, margin: "-60px" }}`. The ladder arrows draw in after the third card.

### 5.4 §3 — The calculator

`<PricingClient plans={plans} coupons={coupons} />` on `plansResult.ok`, `<PricingErrorFallback />` otherwise. **Zero behavioural change.** Give it a short heading above it ("Work out your number") so it reads as the third beat of the explainer rather than a bare widget.

### 5.5 §4 — `FeatureShowcase`

The DB-driven catalog. This is the section the reference image describes, upgraded.

**Banner (above the grid).** Only render when `allIncludedInEveryPlan(features)` is true — the component must be honest the day that stops being true:

> **Every feature, every plan.** Nothing below is held back for a higher tier. Free, pay-per-event and storage plans all ship the complete product.

Style it as a full-width strip on `--color-surface-2` with a terracotta left rule, not a coloured alert box.

**Grid.** Two columns on desktop, one on mobile — deliberately echoing the reference layout, which reads beautifully. Per card:

- A two-digit index in terracotta, tabular-nums, `01`…`10` — the numbering is the visual signature of this section, keep it.
- `FeatureIcon` in a 32×32 rounded tile, `--color-accent-soft` background, `--color-accent` glyph.
- `name` — bold, `--color-primary`, ~1.05rem.
- `description` — `--color-muted`, `line-height: 1.6`.
- A hairline `--color-line` divider between rows (as in the reference), **not** boxed cards. The reference's airy list beats a card grid here; don't over-chrome it.

**Motion (this is where "professional animations and smooth effects" gets spent):**

- Whole-section `whileInView` with a parent `staggerChildren: 0.055`, `delayChildren: 0.05`. Cap total stagger at ~0.5s so the last card isn't left behind.
- Each item: `opacity 0 → 1`, `y: 20 → 0`, `duration 0.5`, `ease: "easeOut"`.
- Hover (desktop, pointer only): item lifts `-2px`, the icon tile's background deepens toward `--color-accent` at 12% and the number goes from 55% to 100% opacity. `200ms` `cubic-bezier(0.4, 0, 0.2, 1)`. Subtle. Nothing scales, nothing bounces.
- Focus-visible on the whole item (make it a focusable `<li tabIndex={-1}>` only if you add interaction — otherwise leave it non-interactive and skip the focus ring; do not add fake affordances).
- `useReducedMotion()` → all of the above collapses to a plain static list.
- The section is `<ul>`/`<li>` with a visually-hidden `<h2>`-anchored label, so screen readers get a list of ten items, not ten orphan headings. Feature names are `<h3>`.

**Empty / failed state.** If `featuresResult.ok === false` or the array is empty, render a compact static fallback list of the four highlight features (hardcoded constant in the component, clearly commented as a fallback) rather than an empty section or an error. The pricing page must never look broken because a catalog fetch timed out.

**Optional, only if it reads well:** group by `category` using `CATEGORY_LABELS`. Build the flat grid first, look at it, and only add grouping if ten ungrouped items genuinely feel long. Flat is likely better.

### 5.6 §5 — `BillingFacts`

The "understand the billing" section, sourced from the delivery app's Plan & Billing behaviour. Compact two-column definition list, no motion beyond a single fade-up. Every claim below is verified against backend code — see **Appendix A** for the source. Do not embellish beyond it.

- **GST is included.** Every price shown is the price you pay. Your invoice breaks the tax out separately.
- **Proper GST invoices.** Add your GSTIN and billing address once; every payment produces a numbered invoice with CGST/SGST or IGST split by place of supply, downloadable as a PDF.
- **Payments run on Razorpay.** Cards, UPI, netbanking. Storage plans use an auto-renewing mandate.
- **Upgrades are prorated.** Move up a storage tier or from monthly to yearly and you're charged only the difference for the remainder of your cycle. Downgrades take effect at your next renewal.
- **Cancelling is not deleting.** Auto-renew stops, you keep full access to the end of the period. After that the dashboard goes read-only and galleries are archived.
- **You get warned first.** Renewal reminders land 7, 5, 3 and 1 days before a charge. A failed payment opens a grace window, not an instant cut-off.
- **Event credits never expire.** They're cumulative — buy four, use one this month and three next year.

### 5.7 §6 — FAQ

Keep the five existing questions in `PricingFaq.tsx`, add three:

- *"Do I get all the features on the free plan?"* → Yes. Every feature is included on every plan today. If that ever changes, this page changes with it.
- *"How does storage work — is it per event?"* → No. It's a single pool that carries forward across every booking. It doesn't reset when an event ends.
- *"What if I run out of storage mid-event?"* → Uploads pause rather than fail. Move up a tier and they resume — the upgrade is prorated and takes effect immediately.

Then feed all eight into the page's `FAQPage` JSON-LD.

---

## 6. Phase 4 — Homepage rebrand

### 6.1 The positioning shift

| Out | In |
| --- | --- |
| "The AI Companion for photography studios" | An AI event gallery that delivers photos to guests *during* the event |
| Leads, bookings, payments, CRM, "one place for the studio" | Face search, live delivery, originals located in one click, your branding |
| "One product for the whole studio" | The delivery half of the job, done properly |

Everything below the fold currently reinforces the CRM story. All of it changes.

### 6.2 `components/Hero.tsx`

Keep the structure — it's good. The scrolling collage, the browser chrome, the two floating chips, the trust pills: all stay. Only the *words* and the emphasis change.

**Headline — use this:**

> ### Your guests find themselves. Before they leave the venue.

with "find themselves" in `--color-accent`. It's specific, it's a benefit, it has a little poetry, and it says the product in seven words. (Alternates if it tests badly: *"Every guest. Every photo of them. The same night."* / *"One link. One selfie. Their photos."*)

**Subcopy:**

> One link, one selfie, and every guest sees only the photos they're in — while the event is still running. Behind it, your team gets every original located in a click, in a gallery that carries your studio's name, not ours.

**Trust pills** (`TRUST_PILLS`): `AI face search` · `Delivered during the event` · `Your branding, end to end`

**Buttons:** unchanged — `Get Started` → `${APP_URL}/login`, `Book a demo` → `openEnquiry()`.

**Chips:** keep both. The face-match chip already reads `128 photos matched to your face` — perfect, leave it. Change the second chip's caption from `Delivered live · tonight` to `Delivered · during the event`.

**Photos:** the `HERO_PHOTOS` set mixes weddings, concerts and conferences. Keep the mix — we serve all events, and the collage is the only place that's currently visible.

### 6.3 Section-by-section

**`ProofBand.tsx`** — replace all four:

```
AI face search — guests find their own photos
Delivered during the event, not weeks later
Originals and RAWs located in one click
Passcode-gated, and branded as yours
```

**`ProblemSection.tsx`** — the strikethrough headline is a strong device; keep it, retarget it. The problem is no longer "the studio is scattered", it's "delivery is the part that breaks":

> A wedding ends and the real work starts: <s>4,000 photos</s>, <s>an expiring Drive link</s>, <s>and forty people asking for theirs</s>.

Body:

> The gallery goes out weeks late, guests scroll past thousands of frames looking for themselves, and every "can you find the one where I'm with dadi?" comes back to you on WhatsApp. Vyavasth turns that into a link the family opens at the venue — each guest sees only their own photos, and every original stays one click from your team.

**`FeatureSection.tsx`** — **make this API-driven.** `app/page.tsx` becomes a server component that calls `getFeatures({ highlight: true })` and passes the result down. Keep the existing four-item hardcoded array in the file as the fallback when the fetch fails, clearly commented. Reuse `FeatureIcon`. This is what makes the feature catalog worth building — one edit in Mongo updates both pages.

**`HowItWorks.tsx`** — retarget the three steps to the actual delivery pipeline:

1. **Photos leave the camera on their own.** Shoot as you always do — frames reach Vyavasth over FTP while the event runs. No end-of-night upload marathon.
2. **Every face is matched.** Guests register once with a selfie. Each frame is sorted to the people in it, and each one stays linked to its original.
3. **Guests open their own gallery.** One passcode-gated link, your branding on every screen, sorted by Haldi, Sangeet and Reception — not one flat dump.

**`WhySection.tsx`** — three points, reframed. Drop "Runs the business side" entirely:

- **The dreaded part gets quiet.** No folder-hunting for originals, no manual sorting, no forty WhatsApp requests. The work that used to eat a week takes an evening.
- **The gallery sells for you.** Your name and watermark on every screen, and a one-tap review prompt built into the gallery every guest opens.
- **Made for Indian events.** Built with studios across India — shaped around how weddings, families and functions here actually run. 🙏

**`CtaSection.tsx`** — headline `Bring your studio into one place.` no longer fits. Use:

> ### Deliver the next one while it's still happening.

Body: *"See Vyavasth on your own event — from the first frame off the camera to a gallery in your guests' hands the same evening. Twenty minutes, nothing to set up."*

**`StudioMarquee.tsx`** — verified clean. It is a list of studio names only, no positioning copy. Leave it.

### 6.4 Metadata, JSON-LD, nav

`app/layout.tsx` currently reads:

```ts
const TITLE = "Vyavasth — The AI Companion for photography studios";
const DESCRIPTION =
  "Vyavasth runs the business side of a photography studio and delivers photos to guests during the event — AI galleries, face-matching, and same-evening delivery, in one place.";
```

Both need rewriting — "runs the business side" is exactly the claim we're retiring. Suggested:

```ts
const TITLE = "Vyavasth — AI event galleries, delivered during the event";
const DESCRIPTION =
  "One link, one selfie, and every guest sees only the photos they're in — while the event is still running. Face search, live delivery and your studio's branding on every screen.";
```

Also:

- `app/page.tsx` JSON-LD `description` → `"An AI event gallery that delivers photos to guests during the event."`
- **Bug, fix while you're here:** `metadataBase` in `layout.tsx` is `new URL("https://vyavasth.com")`. The site is **vyavasth.in** (cf. `api.vyavasth.in`, `deliver.vyavasth.in`, `tech@vyavasth.in`). This makes every OG/canonical URL resolve to the wrong domain. Change it to `https://vyavasth.in` and confirm against the live deployment before merging.
- `/og-image.png` still carries the old positioning. Regenerating it is out of scope — note it in the PR description so it gets picked up.
- `Nav.tsx`: links are fine as-is.

### 6.5 Sweep for stale copy

Before you call this done:

```bash
grep -rniE "leads|bookings|payments|CRM|spreadsheet|one place for the studio" \
  app components lib --include="*.tsx" --include="*.ts"
```

Reconcile every hit. Pay attention to `app/about/page.tsx` and `components/ContactPageForm.tsx` — they were written under the old positioning. Legal pages (`terms`, `privacy-policy`, `refund-policy`, `cookie-policy`) describe the *service* and may legitimately mention broader scope — read before editing, and if a change looks substantive, flag it instead of making it.

---

## 7. Phase 5 — Motion & interaction layer (hero + live gallery)

Bold, interactive motion on the hero — **without touching the visual theme.**

### 7.0 Locked vs. in-play

| Locked — do not touch in this phase | In play |
| --- | --- |
| Colour palette (`--color-bg` #F5EDE0 cream, terracotta accent, all tokens in `globals.css`) | Ambient background motion |
| Typography (Plus Jakarta Sans, all sizes and weights) | Cursor-driven interaction |
| **All copy** | Hover/glow treatments |
| Layout structure and section order | Depth and parallax |

**Reconciling with Phase 4.** Phase 4 rewrites hero *copy*; this phase says copy is locked. These aren't in conflict — "copy is locked" scopes *this* phase, meaning the motion work must not become a second copy exercise. Land Phase 4's rebrand first, then treat that copy as frozen while you build Phase 5. Do not revert Phase 4.

### 7.1 The one new dependency, and its gate

React Three Fiber needs `three` + `@react-three/fiber`. **Do not install `@react-three/drei`** — you need roughly 40 lines of `three`, and drei pulls in a large surface you won't use.

```bash
npm i three @react-three/fiber
npm i -D @types/three
```

Honest cost: `three` is ~150 KB gzipped on the client, R3F ~15 KB. That is a real number for a landing page whose current hero JS is small. It is served from `.open-next/assets` as a static chunk, so there is **no Cloudflare Worker size implication** — the cost is purely Lighthouse and time-to-interactive.

**The gate:** record `npm run build` chunk sizes and a mobile Lighthouse run *before* you install anything. Those are the baseline. If, after §7.3, mobile Performance drops or TBT rises more than 50 ms and you cannot recover it with the mitigations in §7.7, **ship the CSS-only bokeh (§7.3c) as the real implementation and drop the dependency.** The CSS version is required regardless as the mobile/reduced-motion fallback, so this is never wasted work — it is a fallback that gets promoted. Bring the numbers to the review gate; don't decide silently either way.

### 7.2 Build order and review gates

Three passes, each stopping for review against the live site. **Do not start the next step until the previous one is signed off.**

```
Step 1 → hero bokeh field        → STOP, review
Step 2 → magnetic CTA            → STOP, review
Step 3 → collage cursor depth    → STOP, review
```

At each stop, present: the diff, a screen recording (or a preview deploy), the Lighthouse delta, and the reduced-motion rendering. Keep each step on its own commit so any one can be reverted alone.

---

### 7.3 Step 1 — Hero bokeh field

**Files:** `components/hero/HeroBokeh.tsx` (R3F), `components/hero/HeroBokehCss.tsx` (fallback), mounted from `Hero.tsx`.

**The look.** Camera bokeh, not a tech-startup particle field. Think out-of-focus fairy lights at a wedding venue at dusk. **18–26 orbs, maximum.** If it reads as "particles", the density is too high — cut it.

**Critical detail — blending.** The background is *cream* (#F5EDE0), not dark. `AdditiveBlending` on a light background blows straight to white and will look broken. Use `NormalBlending` with low opacity. Orb colours: sample only from the existing palette —

```
#FBF3E6  (a shade above --color-surface)   ~40% of orbs
#F7E8E3  (--color-accent-soft)             ~35%
#E8C4B4  (terracotta at low saturation)    ~20%
#C25A3A  (--color-accent, opacity ≤ 0.14)  ~5%, the rare "hot" bokeh
```

Opacity per orb 0.22–0.5. No orb should be individually identifiable as a shape at a glance.

**Implementation notes:**

- `THREE.Points` with a runtime-generated sprite texture — draw a radial gradient into an offscreen `<canvas>` in a `useMemo` and wrap in `CanvasTexture`. **No texture file to download.** Give the gradient a slightly hard-ish edge falloff (stop at ~0.62 before the taper) so orbs read as defocused *lens circles*, not gaussian blobs. That single stop is the difference between "bokeh" and "glow".
- `PointsMaterial`: `sizeAttenuation: true`, `transparent: true`, `depthWrite: false`, `blending: THREE.NormalBlending`.
- `<Canvas dpr={[1, 1.5]} gl={{ antialias: false, alpha: true, powerPreference: "low-power" }} camera={{ fov: 50, position: [0, 0, 6] }} />` — `alpha: true` so the cream background shows through; the canvas must never paint its own background colour.
- Drift: in `useFrame`, offset each orb on a slow sine keyed off its index (`Math.sin(t * 0.08 + i)`). Very slow — a full excursion should take 20–30 s. Multiply by `delta`-normalised time, never raw frame count, so it looks the same at 60 Hz and 120 Hz.
- **Parallax:** split the orbs into 3 depth groups with parallax factors ~`0.4 / 0.8 / 1.4`. Lerp each group's `position.x/y` toward the normalised pointer with a damping of ~0.04 (`current += (target - current) * 0.04`). Max offset ≈ 0.35 world units — the cursor should feel like it's *nudging* light, not dragging a layer. Read the pointer from a `pointermove` listener on the hero `<section>`, not `window`.
- **Never move the camera.** Camera motion changes perspective across the whole field and reads as a wobble.

**Placement.** Absolutely positioned, `inset: 0`, `z-index: -10` inside the hero `<section>` (which already sets `isolation: isolate`), `pointer-events: none`, `aria-hidden`. It sits *behind* the existing terracotta radial glow div — keep that glow, the two layer beautifully. The `<h1>` must remain the LCP element; if the canvas ever becomes LCP you have mounted it too early.

**Mounting — lazy, and only where it earns its place:**

```tsx
const HeroBokeh = dynamic(() => import("./HeroBokeh"), { ssr: false, loading: () => null });
```

Gate mounting on all of these being true, evaluated in `useEffect` (never during render — they'd break hydration):

1. `!useReducedMotion()`
2. `window.matchMedia("(min-width: 901px)").matches` — 900 px is this codebase's existing breakpoint
3. `(navigator.hardwareConcurrency ?? 4) > 4`
4. First paint is done — mount inside `requestIdleCallback` (with a `setTimeout(…, 200)` fallback for Safari)

Re-evaluate #2 on resize so rotating a tablet does the right thing.

**7.3c — `HeroBokehCss`, the fallback.** Renders whenever the R3F layer is gated out (mobile, reduced motion, low-core, no WebGL). 6–8 absolutely-positioned `<div>`s with `radial-gradient` backgrounds in the same palette, `filter: blur(…)`, animated with the **existing `floaty` keyframe** already in `globals.css` at staggered durations (7 s–13 s) and delays. Zero JS, zero bytes beyond the markup. Under `prefers-reduced-motion` it renders but does not animate — `globals.css` already disables `.floaty` in that media query, so you get this for free.

---

### 7.4 Step 2 — Magnetic CTA

**File:** `components/ui/MagneticButton.tsx` — a generic wrapper, so it can be reused later.

Applies to the hero's **"Book a demo"** button, as specified. Note for review: "Get Started" sits directly beside it; two magnetic buttons side by side tends to feel busy. Recommendation is that the primary gets the glow intensification only and the secondary gets the full magnetic pull — but build what's asked first and raise it at the gate.

**Behaviour:**

- Wrapper listens for `pointermove`; when the cursor is within **90 px** of the button's centre, translate the button toward it by `delta * 0.28`, clamped to **±10 px**. Small displacement is deliberate — a button that runs more than ~10 px from its layout position desyncs from its own hit area and starts to feel broken rather than alive.
- Framer Motion: `useMotionValue` for x/y piped through `useSpring({ stiffness: 150, damping: 15, mass: 0.1 })`. Spring, not tween — a tween on cursor input feels rubbery.
- On `pointerleave`, animate both values to 0 through the same spring.
- Glow: on hover, transition `box-shadow` from the existing `0 6px 18px rgba(194,90,58,0.28)` toward `0 10px 30px rgba(194,90,58,0.42)` over 200 ms `cubic-bezier(0.4, 0, 0.2, 1)`. **Terracotta only** — no new colour enters the system. The outline "Book a demo" button has no shadow today, so give it a soft terracotta halo that appears from nothing on hover.

**Guards:**

- Only bind pointer handlers when `matchMedia("(hover: hover) and (pointer: fine)")` matches. Touch devices get the plain button, untouched.
- `useReducedMotion()` → wrapper becomes a pass-through, rendering children with no transform and no listener.
- Do **not** change the button's semantics, `onClick`, focus ring, or `min-height`. `openEnquiry()` must still fire, and keyboard focus must still land in the button's true layout position — so reset the transform to 0 on `focus-visible`.

---

### 7.5 Step 3 — Cursor-reactive gallery depth

**⚠️ Read this before starting — the brief describes something that isn't on the site.**

There is no *horizontal* photo scroll on the homepage. What exists:

| Element | Reality |
| --- | --- |
| `Hero.tsx` collage | **Vertical** — two columns, `collage-up` / `collage-down` CSS keyframes, 38 s and 46 s. Its browser bar literally reads *"the annual gala · live gallery"*. **This is the "live gallery" the brief means.** |
| `StudioMarquee.tsx` | Horizontal, but it scrolls studio *names*, not photos |
| `HowItWorks.tsx` | A static 2-panel photo grid, no scroll at all |

**Apply the effect to the hero collage, keeping it vertical.** Converting it to horizontal would violate the brief's own "layout structure unchanged" rule, and the "flipping through a stack of prints" feel works identically on a vertical column. Confirm this reading at the Step 2 review gate before building.

**Implementation — use pointer hit-testing, not distance maths.** The tiles are in continuous CSS-keyframe motion, so their bounding rects change every frame. A distance-falloff implementation would have to re-read ~24 `getBoundingClientRect()`s per `pointermove`, forcing layout against animated elements every time. The browser's own hit-testing already solves this correctly and for free:

- Per tile: `onPointerEnter` / `onPointerLeave` → `scale(1.045)`, `box-shadow: var(--shadow-raised)`, `z-index: 2`, `filter: brightness(1.03)`. Transition `180 ms cubic-bezier(0, 0, 0.2, 1)` on enter, `260 ms` on leave — quicker to lift than to settle, which is what reads as a print being picked up.
- Immediate neighbours get a smaller lift (`scale(1.018)`, no shadow) via CSS sibling selectors, so the row responds as a *stack* rather than one isolated tile.
- **Compose, don't fight.** The tile's `transform` is a child of the column's animated `translate3d` — these compose cleanly. Never put a `transition` on the *column*; that would fight the keyframe animation and cause visible stutter.
- Add `will-change: transform` to the hovered tile only, via a class toggled on enter and removed on leave. Applying it to all 24 tiles permanently costs GPU memory for no gain.

**Existing behaviour that must survive:** the two columns keep scrolling at their current speeds and directions, the seamless double-list loop is untouched, and the `maskImage` top/bottom fade is untouched. Hovering must not pause the scroll — the brief says keep the marquee behaviour intact.

**Accessibility:** the collage container is `aria-hidden="true"` and purely decorative. Keep it that way — add no `tabIndex`, no focus handlers, no roles. Gate the whole effect behind `(hover: hover) and (pointer: fine)` and `!useReducedMotion()`.

*Optional upgrade, only if the hit-test version feels flat at review:* a true distance-falloff pass where tiles within ~180 px of the cursor scale on a smooth curve. Cache rects once per `requestAnimationFrame`, never per `pointermove`. Measure before and after — if it costs more than ~1 ms of scripting per frame it isn't worth the extra depth.

---

### 7.6 Reduced motion — the cross-cutting rule

`prefers-reduced-motion: reduce` must produce a hero that is **still complete and attractive**, not a stripped one:

| Layer | Reduced-motion behaviour |
| --- | --- |
| Bokeh | `HeroBokehCss` renders, static. `globals.css` already kills `.floaty` under this query |
| Magnetic CTA | Plain button. No transform, no listener. Hover glow may stay — it is a colour change, not motion |
| Collage | Existing `globals.css` rule already stops `.collage-column`. Add the hover lift to that same `@media` block's disable list |
| Framer Motion | Every new component calls `useReducedMotion()` — the established pattern in `Hero.tsx`, `FeatureSection.tsx`, `CtaSection.tsx` |

Test by toggling *Emulate CSS prefers-reduced-motion* in DevTools **and** by reloading with it already set — some of these gates only run at mount.

### 7.7 Performance budget

Baseline first: `npm run build`, record `.next/static/chunks` sizes, run mobile Lighthouse on the current deploy, write the numbers down. Then, after each step:

| Metric | Budget |
| --- | --- |
| Mobile Performance score | **No drop.** The 3D layer never mounts on mobile, so this should be exactly flat |
| Desktop TBT | +50 ms maximum |
| LCP element | Still the `<h1>`. If the canvas becomes LCP, it mounted too early |
| CLS | 0. The canvas is absolutely positioned and reserves no layout space |
| Main bundle | Unchanged — `three` must land in its own dynamic chunk. Verify by name in `.next/static/chunks` |

Mitigations if you're over budget, in order: cut orb count → clamp `dpr` to `[1, 1]` → drop to two depth groups → pause `useFrame` when the hero scrolls out of view via `IntersectionObserver` (do this regardless, it's free) → promote the CSS fallback and drop the dependency (§7.1).

---

## 8. Verification checklist

**Backend**

- [ ] `npm run db:seed-features` run twice → exactly 10 documents both times
- [ ] `npm run db:sync-indexes` clean
- [ ] `node --test "src/**/*.test.js"` passes, including the new `features.service.test.js`
- [ ] All three query variants of `GET /features` return the expected sets
- [ ] `service_ids` never appears in any response body

**Landing page**

- [ ] `npm run lint` clean
- [ ] `npm run build` clean (this is `next build` on Next 16 — treat any new warning as a failure)
- [ ] `npm test` passes, including the new `lib/features.test.ts`
- [ ] `/pricing` renders all six sections; calculator still produces the correct `/checkout?plan=…&qty=…&coupon=…` href for pay-per-event **and** for a storage tier
- [ ] `Get Started` on `/pricing` lands on `${NEXT_PUBLIC_APP_URL}/login`
- [ ] With `VYAVASTH_API_BASE_URL` pointed at a dead host: `/pricing` shows `PricingErrorFallback` **and** the feature-section fallback list; `/` shows the hardcoded highlight features. Neither page errors.
- [ ] `prefers-reduced-motion: reduce` in DevTools → every new section renders static, no transform, no fade
- [ ] Keyboard tab order through `/pricing` is sane; both CTAs show a visible focus ring
- [ ] Mobile at 375px: two-column feature grid collapses to one, nothing overflows horizontally (`html { overflow-x: hidden }` is masking, not fixing — check with it off)
- [ ] Feature copy contains none of the forbidden phrases from §11 of the design system
- [ ] No hardcoded price, storage size or plan name anywhere in `app/` or `components/`

**Final pass**

- [ ] Read the homepage top to bottom as a studio owner in Indore. Does every section sell the same product? Any sentence still implying we do lead management gets cut.

**Phase 5 — motion layer** (verify per step, at each review gate)

- [ ] Baseline Lighthouse + chunk sizes recorded *before* installing `three`
- [ ] Bokeh reads as ambient venue light, not a particle background — 26 orbs is the hard ceiling
- [ ] No `AdditiveBlending`; nothing on the hero has blown out toward white
- [ ] No colour outside the existing palette appears anywhere in the new code — grep the diff for `#` and check every hit
- [ ] Canvas has `alpha: true` and never paints its own background
- [ ] `<h1>` is still the LCP element (check the Lighthouse LCP node, don't assume)
- [ ] `three` is in its own dynamic chunk; main bundle byte-identical in size
- [ ] Mobile (375 px): no canvas in the DOM at all, CSS bokeh renders instead
- [ ] Low-core simulation (`hardwareConcurrency` ≤ 4): CSS fallback
- [ ] WebGL blocked in the browser: no error, CSS fallback renders
- [ ] Magnetic pull never exceeds 10 px; keyboard focus lands on the button's true position
- [ ] `openEnquiry()` still fires from "Book a demo"; touch devices get a plain button
- [ ] Collage still scrolls at its original speed and direction, loop still seamless, hover does not pause it
- [ ] Mask fade at the top and bottom of the collage is unchanged
- [ ] `prefers-reduced-motion` set *before load*: static CSS bokeh, no magnetic, no tile lift, hero still looks finished
- [ ] Copy, type scale and layout are byte-identical to post-Phase-4 — this phase touches motion only

---

## 9. Explicitly out of scope

- Premium/tiered feature gating on the pricing page. Build the `service_ids` architecture, ship it empty, advertise everything as included. The pricing page gets revisited when premium tiers actually exist.
- An admin UI or admin CRUD endpoints for features — the seed script is the editing surface for now.
- Any change to `PricingClient`, `StorageSlider`, `EventQuantity`, `IntervalToggle`, `PlanSummary`, `CouponRibbon`, `ModeSwitch` behaviour.
- Any change to `delivery-promotional-page`.
- Regenerating `/og-image.png`.
- Extending the Phase 5 motion layer to `/pricing` or to sections below the hero. The bokeh field belongs to the hero only — repeating it down the page turns a signature into wallpaper.
- `@react-three/drei`, post-processing, depth-of-field passes, or any shader work beyond the generated sprite texture.

---

## Appendix A — Billing facts, with sources

Everything in §5.6 traces to code. If you need to word something differently, verify it here first.

| Claim | Source |
| --- | --- |
| Prices are GST-inclusive in ₹; invoices back the tax out | `backend/src/models/onboarding.model.js` — comment on `serviceSchema.price`; `utils/billing-math.utils.js#reverseGst` |
| CGST/SGST vs IGST by place of supply | `lib/billing-types.ts#InvoiceTaxLine`; `models/tax-config.model.js`; `utils/gst-state-codes.utils.js` |
| Numbered invoices with GSTIN, PDF download | `controllers/billing.controller.js#getInvoice`; `services/invoice-pdf.service.js` |
| Razorpay; storage plans use a subscription mandate | `services/razorpay.service.js`; `CheckoutResponse` union in `lib/billing-types.ts` |
| Prorated tier/interval upgrades; downgrades scheduled | `CheckoutProration` (`mode: "tier_upgrade" \| "interval_upgrade"`); the `{ mode: "scheduled", effective_at }` preview branch |
| Cancel = auto-renew off, access to period end | `cancelSubscription` → `{ status: "cancelled", runs_until }`; `cancel_at_period_end` on `subscriptionSchema` |
| Archive then purge | `suspend_at` / `delete_at` on `subscriptionSchema` (7-day archived teardown, `services/galleryCleanup.js`) |
| Renewal reminders at 7/5/3/1 days | `last_reminder_days_left` comment on `subscriptionSchema`; `runBillingSweep`, 9 PM IST cron in `server.js` |
| Grace window on failed payment | `grace_until` on `subscriptionSchema`; `past_due` → `suspended` transition in the billing sweep |
| Event credits cumulative, consumed on creation, no expiry | `limit` field comment on `subscriptionSchema` ("Cumulative, consumed-on-creation event cap") |
| Storage plans are a one-way door | `PlanChooser.tsx` → `eventOptionAvailable = Boolean(eventPlan) && !isStorageBasedPlan(currentServiceType)`; existing FAQ item |
| Free tier grants a starting allowance | `included_events` on `serviceSchema` |

## Appendix B — The ten features (seed data, verbatim)

Copy the `name` and `description` exactly. Numbers 3–10 are the reference image's list, expanded to full sentences in brand voice; 1 and 2 are the additions.

| # | key | name | description | icon | category | highlight | sort |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 01 | `ai-face-search` | AI Face Search | Guests take one selfie and see only the photos they appear in. No scrolling through four thousand frames, and nobody has to ask the studio to find them. | `ScanFace` | discovery | ✅ | 10 |
| 02 | `live-delivery` | Live Delivery | Photos travel straight from the camera over FTP and reach registered guests while the event is still running. The gallery is live before the function ends. | `Zap` | delivery | ✅ | 20 |
| 03 | `reusable-storage` | Reusable Storage | Storage carries forward from one booking to the next and never resets at the end of an event. What you paid for stays yours. | `Database` | operations | — | 30 |
| 04 | `smart-filters` | Smart Filters & One-Click Locate | Sort a gallery by family member, most-liked, or the bride-and-groom pairing — then jump from any frame to its original or RAW file in a single click. | `SlidersHorizontal` | discovery | ✅ | 40 |
| 05 | `passcode-gallery` | Secured, Passcode-Gated Gallery | One link for the whole event, opened only by the host's passcode. Nothing is public and nothing is guessable. | `Lock` | delivery | — | 50 |
| 06 | `reviews-seo` | Google Reviews & Local SEO | A one-tap review prompt sits inside every gallery, so the goodwill from a good delivery lands on your Google listing. | `Star` | growth | — | 60 |
| 07 | `dynamic-qr` | One Dynamic QR, Every Wedding | A single branded QR code, reused at every event. Print it on your standee once and point it at whichever gallery is live. | `QrCode` | delivery | — | 70 |
| 08 | `studio-branding` | Studio Branding & Watermark | Your logo, colours and watermark carry through the entire gallery — not just the landing page. Guests remember whose work it is. | `Stamp` | brand | ✅ | 80 |
| 09 | `notifications` | WhatsApp & Email Notifications | The studio and the host are told automatically at every delivery moment — upload finished, gallery live, guests notified. | `MessageCircle` | operations | — | 90 |
| 10 | `organised-delivery` | Organised, Compressed Delivery | Uploads land sorted by Haldi, Sangeet and Reception, compressed to open fast on a phone. Never one flat dump of four thousand files. | `FolderTree` | delivery | — | 100 |

**Note on #02.** Live Delivery ships this month and is listed alongside everything else, without a "coming soon" badge — that is a deliberate decision. If the launch slips past the pricing page going live, flag it rather than quietly leaving the claim up.
