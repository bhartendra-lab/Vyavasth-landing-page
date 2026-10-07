# Pay-per-event: paid entry, first-purchase free event, and 20,000-photo cap

Implementation prompt for Claude Code. Written 2026-10-07 against the code as it stood that morning.

**Status: built in all three repos on 2026-10-07.** This revision (same day) brings the document in line with what Bharat decided during the build and with what the code actually does. Every place that differs from the first version is marked "Revised", "Added", "Corrected" or "Built", and section 0.1 lists the decisions. Section 2 describes the code BEFORE this change. Nothing has been tested in a browser or against Razorpay yet: section 9 has the setup steps and the test checklist.

This one document covers three repos. The same file is saved in each. If the repos for the other parts are attached to your session, do those parts too; otherwise work only on the part for the repo you are in. Either way read the whole thing first, because the three parts share one API contract (section 4).

| Part | Repo | Path |
|---|---|---|
| A | Backend | `Projects/Vyavasth/backend` |
| B | Studio web app | `Projects/delivery-promotional-page/frontend` |
| C | Marketing site | `Projects/Vyavasth-landing-page` |

Ship order: A, then the data switch in A8, then B, then C. Part A is additive and safe to deploy before B and C exist.

---

## 0. Standing rules (apply to every part)

- Read `CLAUDE.md` / `AGENTS.md` in the repo first. Both frontends are on a Next.js version with breaking changes: read the relevant guide in `node_modules/next/dist/docs/` before writing code.
- Before touching code: restate the situation and your plan in your own words, list anything in this document that does not match what you find in the code, ask your follow-up questions, and wait for approval.
- Do NOT run the dev server, start the app, or do any browser or visual testing. Type-check, lint, build and unit tests are allowed.
- Stop after the code changes and hand back a manual test checklist (section 9 is the starting point).
- Backend scoping rule: extend existing endpoints, controllers, validators and models. This task adds NO new routes, controllers, validator files or models. It adds fields, enum values, and functions inside existing files. If you believe a new route is unavoidable, stop and ask.
- No em dashes in any user-facing copy. No short coloured dash or line before a heading or eyebrow label.
- Every price and number shown to a studio comes from the plans API. Nothing in this document that looks like a price (₹50, 20,000, 5,000, 1 free event) may be hard-coded in a frontend except as a named fallback constant.

### 0.1 What changed in this revision

Decisions Bharat gave on 2026-10-07 that override the first version:

1. **Offer eligibility is narrower.** Only a studio that signed up with no free events can earn the first-purchase bonus. A studio onboarded with free events never gets it, whether or not it has bought events. (Sections 1, 4.2, A1, A3, A4, B3, 8.)
2. **A desk-recorded offline sale earns no bonus.** It also counts as that studio's first purchase, so there is no bonus later either. The second half is Claude's reading and is still to be confirmed by Bharat. (A4.)
3. **A studio with no active subscription, or with a fully lapsed storage plan, can buy events.** Doing so permanently deletes the galleries held under the storage plan. The studio is warned and must confirm before paying. (Sections 3, 4.4, A6b, B3, 8.)
4. **WhatsApp number duplicate check at onboarding.** New, outside the original scope. (Sections 4.7, A9, B11.)
5. **D8 is settled: count-based gate, no counter.** D1 to D7 confirmed as written.
6. **Terms wording says "photos", not "photos and videos".** Videos still count (D1). Bharat changed it on the marketing site. The app's copy of `lib/plans.ts` still has the old wording and needs the same one-line edit (see B5).

Places where the first version did not match the code, and what was built instead, are noted inline in sections 1, 2, B2, B6, B7, B8, C1 and C3.

---

## 1. What is changing, in plain words

Today a new studio signs up, gets a Free plan with 2 free events, and reaches the dashboard without paying. Pay-per-event events have no storage or photo limit at all.

After this change:

1. **Nothing is free at signup.** A new studio finishes onboarding (details, WhatsApp OTP, Google Business) and then lands on a compulsory "choose how you pay" step. They must either buy at least 1 event or buy a storage plan before they can reach the dashboard.
2. **First-purchase offer.** The first time a studio buys events, it gets bonus free events on top (1 by default). The bonus is a fixed number per studio, not per event bought: buying 5 events gives 5 + 1, not 5 + 5. It is given once per studio, ever. We control the number of bonus events and the date the offer runs until, without a deploy. Revised: only a studio that signed up with no free events qualifies (see "Decisions added by Bharat").
3. **Photo cap on pay-per-event events.** Every event that belongs to the pay-per-event or legacy Free plan can hold at most 20,000 items at a time. Deleting frees room. The cap is enforced on the server at upload time.
4. **Paid cap increase.** A studio can raise one event's cap in blocks of 5,000 for ₹50 per block. If a selected folder would cross the cap, the upload modal asks for payment first and uploads only after the payment is confirmed, or the studio goes back and selects fewer photos. Each such payment produces a GST invoice by email, like every other payment.
5. **Copy.** "Start free" goes away everywhere. Pricing copy says: buy an event, get one free on your first purchase. Photo copy says "Upload unlimited photos" with a "T&C apply" link that opens the cap terms.
6. **Added: lapsed storage plan to pay per event.** A studio with no active subscription, or whose storage plan has fully lapsed, can buy events. This deletes the galleries that were held under the storage plan, so the studio is warned and must tick a confirmation before paying.
7. **Added: WhatsApp number check.** The onboarding WhatsApp step refuses a number that another studio already holds.

### Decisions already locked by Abhishek

- Existing studios keep what they have. Unused free events stay usable and they are never sent to the forced payment step. Revised by Bharat: they do NOT qualify for the first-purchase bonus (see below).
- "Offer validity" means the offer window: a date until which first purchases earn the bonus. After that date first purchases earn nothing extra. Bonus credits already granted never expire.
- The cap applies to ALL pay-per-event and Free events, including ones created before launch. An old event already above the cap keeps its photos but cannot take new uploads until it is under the cap or capacity is bought.
- No lifetime upload ceiling. Only the at-a-time cap. (Reusing one event for many weddings is being handled separately by locking event name and cover photo. That lock is NOT part of this task. Do not build it here. Corrected: the app already locks the event name once the gallery has been published, `nameLocked={publishedEver}` in `MediaTab`. Nothing was added to it.)

### Decisions added by Bharat on 2026-10-07

- **Who gets the offer.** Only a studio that signed up with no free events. Studios onboarded with free events before this change are left alone and get no free event on their first purchase. Studios that have already bought events get nothing either. In code this is `Companies.first_purchase_offer_eligible`, set once at signup when the Free grant is 0 and never set for anyone else.
- **Desk-recorded offline sales** (the onboarding desk) are not eligible for the offer. Built as: a desk sale of events earns no bonus and counts as the studio's first purchase. Open: Bharat to confirm the second half. It is one clause in `priorEventPurchaseFilter` if a desk-sold studio should still earn the bonus on its first online purchase.
- **Buying events with no running plan.** Allowed when the studio has no active subscription or its storage plan has fully lapsed. The old storage-plan galleries are deleted and the studio is warned before paying. Still refused while a storage plan is running, including a past-due plan whose mandate Razorpay is still retrying.
- **WhatsApp number check** at onboarding, for new studios only. Studios already onboarded with a shared number are left as they are, and the Settings change-number flow is untouched.
- **Cap gate is count-based** (D8). No counter on the booking.

### Defaults that were not specified (all confirmed by Bharat on 2026-10-07)

| # | Default | Why |
|---|---|---|
| D1 | Videos count toward the cap along with photos. One media row = one item. | Otherwise video is an unlimited hole. Copy still says "photos". |
| D2 | ₹50 per block is GST-inclusive, like every other price in the system. | `Service.price` and `event_unit_price` are GST-inclusive and invoices back the tax out. |
| D3 | A first purchase made with a 100% coupon (nothing paid) earns no bonus and does not use up the studio's one-time eligibility. | The offer is a reward for paying. |
| D4 | The bonus event is a normal event credit: same cap, same 3-month live window, never expires while unused. | Simplest, matches "one event will be provided in free". |
| D5 | Cap increases are per event, permanent for that event, not refundable, not transferable to another event. | Needs to be in the T&C. |
| D6 | Coupons do not apply to cap increases. | ₹50 purchases, no reason to discount. |
| D7 | One purchase can add at most 20 blocks (100,000 photos). A studio can buy again. | Sanity bound on a typo. |
| D8 | The cap gate is count-based (count media rows at the time of the check). See A5 for the bounded overshoot this allows and the stricter alternative. | No new counter to keep in sync. Confirmed by Bharat. |
| D9 | Marketing site in-page buttons that said "Start your first event free" become an offer button that goes to `/pricing#events`. The nav keeps only "Log in". | Abhishek asked for "only login option"; a hero with no button at all would hurt signups. Easy to change to a plain "Log in" if preferred. |

---

## 2. How it worked before this change (verified in code on 2026-10-07)

### Backend
- Signup provisions a Free subscription in two places, both calling `provisionFreeSubscription(companyId, session)` in `src/services/billing.service.js` (~line 131): `src/utils/auth.utils.js` (~269) and `src/controllers/onboarding.controller.js` (~128). The grant is `limit: freeService.included_events ?? 2`.
- `Subscription.limit` (in `src/models/onboarding.model.js`) is the cumulative event cap for Free and Event-based. Usage is counted live by `countCompanyDhEventUsage`. `assertEventQuotaAvailable` throws 402 at event creation (`bookings.controller.js` ~341) when `used >= limit`.
- Buying events: `POST /billing/checkout` -> `initiateCheckout` -> `resolveCheckoutTarget` returns purpose `event_topup` when the target Service is Event-based and the current one is Free or Event-based -> `initiateEventTopup` creates a `PaymentOrder` and a Razorpay Order. On `payment.captured`, `handleOrderPaymentCaptured` does an atomic CAS to `paid`, then `grantEntitlementForPaymentOrder` runs `$inc: { limit: quantity }` and sets `service_id` to the Event-based Service, then `createInvoiceForPaymentOrder` records, renders and emails the invoice.
- `activateWithoutPayment` handles a 100% coupon: no Razorpay, no invoice, same grant function.
- `PaymentOrder.purpose` enum: `event_topup, new_subscription, plan_switch, renewal, mandate_auth, resume`.
- Config lives on `Service` documents and is edited by hand through `POST /billing/admin/services` (`createOrUpdateAdminService`, platform-admin only). `GET /billing/plans` (`getPlans`) is public and feeds both frontends.
- A booking carries its own `service_type` (stamped at creation from the company's plan). That stamp, not the company's current plan, decides whether the event counts toward storage (`countsTowardStorage` in `deliverables.controller.js`) and whether it is auto-deleted after 90 days (`AUTO_DELETE_SERVICE_TYPES` in `src/utils/retention.utils.js`).
- Upload path: `POST /deliverables/presign-uploads/:booking_id` (`presignUploads`, max 100 files per call, also used for the single cover-photo file which sends no quality tier) then `POST /deliverables/create-media/:booking_id` (`createMedia`, roughly 200 rows per call, idempotent inserts via `insertMediaIdempotent` on the unique `{ booking_id, media_id }` index). `create-media` already returns a live `storage` object the uploader reads to pause a storage-plan run.
- `GET /deliverables/archive-tiers/:booking_id` is a dashboard-only, once-per-event read the upload modal already uses.
- Nothing today caps the number of media in a Free or Event-based event.
- `resolveCheckoutTarget` refuses an Event-based target for a studio on a Monthly or Yearly plan, even a lapsed one.
- Nothing in the onboarding WhatsApp step checks whether another studio already holds the number.

### Studio web app
- `app/(dashboard)/onboarding/page.tsx`: three steps (`details`, `otp`, `google`), then `router.replace("/dashboard")`. "Step N of 3".
- `app/(dashboard)/dashboard/layout.tsx` gates on `needsOnboarding(company)` from `lib/auth.ts`.
- `app/(dashboard)/checkout/page.tsx` already contains the whole purchase flow: `PlanChooser`, billing details form, coupon, `useCheckoutFlow`, `ConfirmingPayment`. It reads `plan`, `qty`, `coupon` from the query string.
- `components/billing/PlanChooser.tsx` holds the pay-per-event card copy ("Unlimited storage on every event", "Each event stays live for 3 months").
- `components/onboarding/WelcomeDialog.tsx` is the one-time "you've got 2 free events" dialog with a "Start with free events" button.
- `app/(dashboard)/dashboard/events/[booking_id]/UploadModal.tsx` (steps `picker`, `select`, `preferences`) and `useUploadEngine.ts` run the upload. `overStorage` already blocks the Upload button for storage plans.
- Plan and billing settings: `app/(dashboard)/dashboard/settings/billing/page.tsx`. Corrected: `settings/plan/page.tsx` is only a redirect to it.
- `lib/plans.ts` is meant to stay identical to `Vyavasth-landing-page/lib/plans.ts`. Corrected: the two already differed in `formatStorage` (the site treats 1 TB as 1000 GB, the app as 1024 GB). That difference was left alone; everything else in the two files is kept the same.

### Marketing site
- `components/Nav.tsx`: "Log in" and "Start free", both to `LOGIN_URL` (desktop and drawer).
- "Start your first event free" in `components/home/Hero.tsx`, `components/CtaSection.tsx`, `components/home/Proof.tsx`. "Start free" in `app/welcome/page.tsx`.
- `app/pricing/page.tsx`: h1 "Start free. Pay as you grow." and a meta description mentioning 2 free events.
- `components/pricing/PricingClient.tsx`: a Free card (`#free`), a pay-per-event card (`#events`), a storage card, and a jump nav.
- `components/pricing/pricing-faqs.ts` and `lib/pricing-display.ts` (`freeEventsOf` treats 0 as "missing" and falls back to 2: this must change).
- `app/terms/page.tsx`, `app/refund-policy/page.tsx`.

---

## 3. Design in one page

**No new plan type.** New signups still get a Free subscription, but with `limit: 0`. A Free subscription with `limit === 0` is what "has not paid yet" means. Everything else already works off that: event creation is already blocked by the quota check, and the first event purchase already converts Free to Event-based.

**The launch switch is data, not code.** Setting `included_events: 0` on the Free Service turns off free events for new signups. Setting the offer fields on the Event-based Service turns the offer on.

**First-purchase bonus.** Decided at checkout, recorded on the `PaymentOrder`, granted together with the paid events, guarded by an atomic one-time stamp on the company.

**Photo cap.** Effective cap for an event = global base cap (on the Event-based Service, default 20,000) + that booking's purchased extra. Checked at presign (early, friendly) and at create-media (authoritative).

**Cap purchase.** A new `PaymentOrder.purpose` value, `photo_cap_topup`, that travels through the existing checkout endpoint, the existing Razorpay Order path, the existing webhook handler and the existing invoice function.

**Lapsed storage plan to pay per event (added).** An event purchase is also accepted when the studio has no active subscription or its Monthly/Yearly plan has lapsed (`currentPlanHasLapsed`). The preview carries a `storage_data_warning` and checkout refuses until the request says `confirm_storage_clear: true`. When the payment lands, the storage-plan galleries are marked archived and torn down, a new Event-based subscription is created and made the active one, and its `limit` starts at the number of events already used plus the credits bought.

**WhatsApp number check (added).** The three onboarding WhatsApp endpoints refuse a number that another company already holds, where "holds" means that company has verified it or has finished onboarding.

---

## 4. Shared API contract (all three parts depend on this)

### 4.1 `GET /billing/plans` (public). Event-based plan gains:

```
photo_cap: number                 // 20000
photo_cap_addon_size: number      // 5000
photo_cap_addon_price: number     // 50, GST-inclusive rupees
first_purchase_offer: null | {
  bonus_events: number,           // 1
  valid_until: number | null      // epoch ms, null = no end date
}
```

`first_purchase_offer` is `null` whenever the offer is not live right now (bonus is 0, or now is outside the window). Frontends never do date math on it; they show the offer if it is non-null.

### 4.2 `GET /billing/subscription`. Every snapshot gains:

```
first_purchase_offer_eligible: boolean   // this studio would get the bonus if it bought events now
```

Revised. True only when all of these hold: the offer is live, the company has `first_purchase_offer_eligible: true` (it signed up with no free events), it has not been given the bonus, and it has never bought events. For a studio on a running storage plan it is always false, because that studio cannot buy events. For a lapsed storage plan it follows the same rule as everyone else.

### 4.3 Company payload (whichever existing response the dashboard layout already reads to decide `needsOnboarding`) gains:

```
plan_required: boolean   // true only when the active subscription is Free with limit === 0, or there is no active subscription
```

This lives on the company payload, not the subscription endpoint, because `GET /billing/subscription` is restricted to admin / billing users and the gate must work for anyone.

Built: a suspended storage plan still has its active subscription row, so it is not `plan_required`; that studio sees the dashboard with the existing renew prompts. Only a company with no active subscription row at all, or a Free one with `limit === 0`, is sent to the plan step.

### 4.4 `POST /billing/checkout/preview` and `POST /billing/checkout`

Event purchase (unchanged request). Preview response gains `bonus_events: number` (0 when none).

Added, for a studio leaving a lapsed storage plan (or with no active subscription):

- Preview response gains `storage_data_warning: null | { galleries: number, message: string }`. It is non-null only when that studio still has storage-plan galleries.
- Checkout request accepts `confirm_storage_clear: boolean`. When there are galleries to delete and it is not `true`, checkout answers HTTP 409 with `{ message, code: "STORAGE_CLEAR_UNCONFIRMED", storage_data_warning: { galleries, message } }` and creates nothing.
- The message reads: "Moving to pay per event permanently deletes all {N} galleries from your storage plan, with every photo and video in them. This cannot be undone."
- An Event-based target is still refused with 409 while a storage plan is running.

Cap purchase. New optional request fields, valid only together:

```
{ service_id: <Event-based service _id>, booking_id: <mongo id>, photo_cap_blocks: <int 1..20> }
```

Preview response: `mode: "photo_cap_topup"`, with the usual `description`, `gross_amount`, `taxable_value`, `tax_lines`, `total`, `requires_payment: true`, plus `photos_added: number`. Checkout response: the existing `{ razorpay_order_id, amount, key_id }` shape.

### 4.5 Photo cap status object

```
PhotoCap = null | {
  cap: number,          // base + extra for this event
  used: number,         // media rows in the event right now
  remaining: number,    // max(0, cap - used)
  addon_size: number,
  addon_price: number
}
```

`null` means the event is not capped (storage-plan event). Returned by `GET /deliverables/archive-tiers/:booking_id` as `photo_cap`, and by `create-media` next to the existing `storage` field.

### 4.6 Cap refusal

`presign-uploads` and `create-media` answer HTTP 402 with:

```
{ message: "This event has reached its photo limit.", code: "PHOTO_CAP_EXCEEDED", photo_cap: PhotoCap }
```

Built: `src/middleware/error.middleware.js` puts an error's `errorCode` in `code` and spreads an optional `clientPayload` object into the body, for errors below 500 only. The payload is spread first, so it can never override `success` or `message`. No existing response changed.

### 4.7 WhatsApp number already in use (added)

The onboarding request-OTP, resend-OTP and verify-OTP endpoints answer HTTP 409 with:

```
{ message: "This WhatsApp number is already registered with another studio. Use a different number, or log in to the account that has it.", code: "WHATSAPP_NUMBER_IN_USE" }
```

---

## PART A. Backend

### A1. Model fields (no new models)

`Service` (`src/models/onboarding.model.js`), meaningful only on the Event-based document:

- `first_purchase_bonus_events: Number, default 0`
- `first_purchase_bonus_valid_from: Number, default null` (epoch ms)
- `first_purchase_bonus_valid_until: Number, default null` (epoch ms)
- `event_photo_cap: Number, default null`
- `photo_cap_addon_size: Number, default null`
- `photo_cap_addon_price: Number, default null` (GST-inclusive rupees)

`Companies` (`src/models/companies.model.js`):

- `first_event_bonus_granted_at: Number, default null`. Stamped once, atomically, when the bonus is granted.
- `first_purchase_offer_eligible: Boolean, default false` (added). Set to true once, at signup, only when the Free grant is 0. Never set for a studio that was given free events, so every existing studio stays false.

`Booking` (`src/models/bookings.model.js`):

- `photo_cap_extra: Number, default 0`. Extra items bought for this event. Always a multiple of the addon size.

`PaymentOrder` (`src/models/payment-order.model.js`):

- add `"photo_cap_topup"` to the `purpose` enum. Use the existing `notes` field for `{ bonus_events }` and `{ booking_id, photos_added }`. Built: `notes` also carries `bonus_granted` (what was actually granted), `starts_event_plan` and `starting_limit` (A6b).

Named fallback constants in `billing.service.js`, used only when the Service fields are null: `DEFAULT_EVENT_PHOTO_CAP = 20000`, `DEFAULT_PHOTO_CAP_ADDON_SIZE = 5000`, `DEFAULT_PHOTO_CAP_ADDON_PRICE = 50`, `MAX_PHOTO_CAP_BLOCKS_PER_ORDER = 20`.

### A2. Admin config and plans API

- `createOrUpdateAdminServiceValidation` (`src/validators/billing.validator.js`) and `createOrUpdateAdminService`: accept the six new Service fields. Integers >= 0 for counts and sizes, float >= 0 for price, nullable ints for the two dates. Reject `valid_until <= valid_from` when both are set.
- `getPlans`: for the Event-based plan, add the fields in 4.1. Compute `first_purchase_offer` with one small pure helper, e.g. `activeFirstPurchaseOffer(service, now)`, exported for unit tests. Apply fallbacks for the three cap fields so the frontends always receive numbers.

### A3. Stop giving free events

- `provisionFreeSubscription`: change the fallback from `?? 2` to `?? 0`. The real switch is the data change in A8. Revised: when the grant is 0 it also sets `Companies.first_purchase_offer_eligible: true` in the same session. This is the only place that flag is ever set.
- Fix the now-wrong comments that say "2 free" (`onboarding.model.js` near `limit`, `bookings.controller.js` ~329, `companies.model.js` near `welcome_dialog_seen_at`).
- `assertEventQuotaAvailable`: when the plan is Free and `limit === 0`, throw 402 with a message that fits the new world: "Buy an event or a storage plan to create your first event." Keep the existing message for every other case.
- Add `plan_required` (4.3) to the company payload. Find the function that builds the company object returned at login and by the company-details endpoint, and compute it there with one indexed `Subscription.findOne({ company_id, is_active: true })` read. If that payload is built in more than one place, use one shared helper.

Existing studios are untouched by all of this: their `limit` is already 2 or more, so `plan_required` is false.

Built: the shared helper is `companyPayloadFor(company)` in `billing.service.js`, used by both login payloads and by every onboarding and company-details payload.

### A4. First-purchase bonus

Eligibility (revised), one function `resolveFirstPurchaseBonus(companyId, eventService, { amountPayable, now })` returning a number. The pure rule is `firstPurchaseBonusFor`:

1. `activeFirstPurchaseOffer(eventService, now)` is non-null, AND
2. the amount payable is above 0 (D3), AND
3. `company.first_purchase_offer_eligible === true` (it signed up with no free events), AND
4. `company.first_event_bonus_granted_at` is null, AND
5. the company has no earlier event purchase: no paid `PaymentOrder` that is either `purpose: "event_topup"` with `amount > 0`, or a desk-recorded sale (`notes.source: "onboarding_desk"` with `notes.event_limit` set). The `{ company_id, createdAt }` index serves it.

Otherwise 0.

Wire it in:

- `computeCheckoutQuote`, `event_topup` branch: add `bonus_events` to the response. If a coupon makes the total 0, `bonus_events` is 0 (D3).
- `initiateEventTopup`: when `finalAmount > 0`, compute the bonus and store it as `notes: { bonus_events }` on the `PaymentOrder`. The 100% coupon path stores nothing.
- `grantEntitlementForPaymentOrder`, `event_topup` case: if `notes.bonus_events > 0`, first try the one-time stamp (`claimFirstPurchaseBonus`):
  `Companies.findOneAndUpdate({ _id: company_id, first_purchase_offer_eligible: true, first_event_bonus_granted_at: null }, { $set: { first_event_bonus_granted_at: Date.now() } })`.
  If it matched, `$inc` the limit by `quantity + bonus_events` and record `notes.bonus_granted`. If it did not match (a second order raced it), `$inc` by `quantity` only and log at info level. Never fail the grant because of the bonus.
- The bonus is fixed at the moment of checkout. If the offer is switched off between checkout and payment, the studio still gets what the checkout screen promised.
- `describePaymentOrderPurpose`, `event_topup` case: when the order carries a bonus, the description reads `"<service name>: 5 event credit(s) + 1 free event (first purchase offer)"`. The invoice line item quantity stays the paid quantity so the unit price is right. Note that `createInvoiceForPaymentOrder` runs after the grant, so read the bonus from `notes` and whether it was actually granted (pass it through, or re-read the stamp) rather than assuming.
- `getSubscriptionSnapshot`: add `first_purchase_offer_eligible` to both snapshot shapes. For a studio on a running storage plan it is false (they cannot buy events). Revised: for a lapsed storage plan it is computed like everyone else's, because that studio can now buy events (A6b).

Admin grants through `change-subscription.js` do not touch `first_event_bonus_granted_at` and do not create `event_topup` orders, so they do not use up an eligible studio's bonus. Revised: an onboarding-desk sale of events is different. It earns no bonus itself and counts as the studio's first purchase (rule 5 above), so that studio gets no bonus later. Open: Bharat to confirm that second half.

### A5. Photo cap enforcement

One helper in `billing.service.js`:

```
getPhotoCapForBooking(booking, eventService?) -> PhotoCap | null
```

- Returns `null` unless `booking.service_type` is in `AUTO_DELETE_SERVICE_TYPES` (`["Event-based", "Free"]`). Use the booking's own stamp, exactly as `countsTowardStorage` does, never the company's current plan. A studio that later moves to a storage plan keeps its old events capped; its new events are uncapped.
- `cap = (eventService.event_photo_cap ?? DEFAULT_EVENT_PHOTO_CAP) + (booking.photo_cap_extra || 0)`.
- `used = Media.countDocuments({ booking_id })`. This is an index-only count on the `{ booking_id, ... }` indexes, bounded by the size of one event. Counts images and videos (D1).
- Cache the Event-based Service read for the life of the request, not globally.

Gate 1, `presignUploads`:
- Only when the batch is a media run (it declares a quality tier). The cover-photo presign and the selfie presign must not be gated. Use the same condition the function already uses to decide whether to record `upload_quality_tier`.
- If `used + files.length > cap`, throw the 402 in 4.6. Sign nothing.

Gate 2, `createMedia` (the authoritative one):
- Before inserting, work out how many of the incoming rows are genuinely new: one query for existing `media_id`s among the incoming ones for this booking. A retried chunk whose rows already landed must not be refused. This matters because inserts are idempotent today and a naive count would break retries.
- If `used + newCount > cap`, refuse the whole call with the 402 in 4.6. Do not insert a partial batch.
- On success, return `photo_cap` alongside the existing `storage` field.
- The existing booking read in `createMedia` selects three fields; add `photo_cap_extra`.

Also:
- `getArchiveTiers`: add `photo_cap` to the response (4.5).
- A refused `create-media` leaves that batch's objects on R2 with no rows. `reclaim-orphaned-media.js` already exists for this. Do not build new cleanup. Mention it in the hand-back notes.
- Deletes need no change: the count is live, so deleting media frees room immediately. Verify that every delete path removes the `Media` row at delete time (not a soft-delete flag). If any path soft-deletes, stop and flag it, because those rows would keep counting.
- Do not gate the archive multipart endpoints. They only attach an archive object to a file whose delivery pair was already presigned.

**Known limit of this design (D8).** Both gates are check-then-write. Two devices uploading to the same event at the same moment can each pass the check and together overshoot the cap by at most one in-flight `create-media` batch per device (a few hundred items in the worst case). After that the next check refuses. The stricter alternative is an atomic `media_count` counter on the booking, incremented with a conditional update and decremented on every delete path, plus a backfill and a recount tool, the same shape as `storage_used`. It is exact but adds a second number that can drift. Decided by Bharat: count-based. The counter was not built.

### A6. Cap purchase through the existing checkout

`checkoutValidation` and the preview validator: accept optional `booking_id` (mongo id) and `photo_cap_blocks` (int, 1 to `MAX_PHOTO_CAP_BLOCKS_PER_ORDER`). Both or neither.

`initiateCheckout` and `computeCheckoutQuote`: when both fields are present, branch to the cap flow BEFORE `resolveCheckoutTarget`. That function refuses an Event-based target for a studio currently on a storage plan, and such a studio must still be able to add capacity to an old pay-per-event event.

`initiatePhotoCapTopup`:
1. `assertBillingProfileComplete(companyId)` as usual.
2. Load the Service by `service_id`; it must be active and Event-based.
3. Load the booking and prove it belongs to this company the same way `requireOwnedBooking` does (reuse its logic, do not reimplement the join). It must be a capped booking (`getPhotoCapForBooking` non-null) and not archived or deleted.
4. Reject a `coupon_code` with 400 (D6).
5. `amount = round2(blocks * addon_price)`, `photos_added = blocks * addon_size`.
6. Create the `PaymentOrder`: `purpose: "photo_cap_topup"`, `service_id`, `quantity: blocks`, `subscription_id`: the company's active subscription id, `notes: { booking_id, photos_added }`. Then `createOrder` and save `razorpay_order_id`, exactly like `initiateEventTopup`.

`grantEntitlementForPaymentOrder`: new case `photo_cap_topup` -> `Booking.updateOne({ _id: notes.booking_id }, { $inc: { photo_cap_extra: notes.photos_added } })`. The CAS in `handleOrderPaymentCaptured` already guarantees this runs once per order.

`describePaymentOrderPurpose`: new case -> `"Extra photo capacity: 10,000 photos for <event name>"`. Fetch the event name where the description is built; fall back to "your event" if the booking is gone.

`createInvoiceForPaymentOrder`: no structural change. Line item quantity = blocks, unit price = taxable value / blocks, `service_type: "Event-based"`. The invoice is recorded, rendered, stored and emailed by the existing code. Confirm `invoice-pdf.service.js` and the invoice email template render this description without assuming a plan purchase.

Check these for an exhaustive switch on `purpose` and add the new value so nothing logs "unexpected purpose": `billingAudit.service.js`, `audit-billing.js`, `subscriptionAdmin.service.js`, `handleRefundProcessed`.

Built: the audit's event-credit check (S5) counts bonuses from `notes.bonus_granted`, honours `notes.starts_event_plan` with `notes.starting_limit`, and accepts either the current Free allowance or the legacy 2 as a studio's starting grant. The stale-order check (C6) in `subscriptionAdmin.service.js` skips open `photo_cap_topup` orders.

### A6b. Lapsed storage plan to pay per event (added)

- `resolveCheckoutTarget`: an Event-based target is accepted with `startsEventPlan: true` when the studio has no active subscription, or its current Monthly/Yearly plan `currentPlanHasLapsed` (suspended, expired, or past its period end with no live mandate). A running storage plan is still refused with 409, and so is a past-due plan whose mandate Razorpay is still retrying.
- `computeCheckoutQuote`: returns `storage_data_warning` (4.4) when that studio still has Monthly/Yearly galleries.
- `initiateEventTopup`: refuses with the 409 in 4.4 until `confirm_storage_clear` is true. The order's `notes` carry `starts_event_plan: true`.
- `startEventPlanForPaymentOrder`, called from the `event_topup` grant, decides again from the live state when the payment lands (`eventPlanStartActionFor`):
  - `top_up`: the studio is already on Free or Event-based. Normal `$inc`.
  - `start`: mark the company's Monthly/Yearly Delivery Hub galleries archived with a backdated `gallery_archived_at` (`clearedGalleryArchiveDate`) so the nightly cleanup treats them as already due; create a new Event-based `Subscription` with `limit = events already used + credits`; `promoteSubscriptionToActive`; record `notes.starting_limit`; then tear the galleries down straight away without awaiting it. The nightly gallery cleanup is the retry if that teardown fails part way.
  - `refuse`: a storage plan is running again (the studio renewed between checkout and payment). Nothing is cleared, nothing is granted, and an error is logged asking for a refund or a manual grant. This is the one case that needs a person.
- The first-purchase bonus is claimed only after the `refuse` branch, so a refused order never uses up the one-time bonus.
- Deletion is immediate once the payment lands. It does not wait out the 7 days a suspended plan's galleries are normally kept, and guests of those galleries receive the usual deletion notices. Open: Bharat to confirm this timing.

### A7. Tests

Add unit tests next to the existing `*.test.js` files for the pure pieces: `activeFirstPurchaseOffer` (bonus 0, before window, inside, after, open-ended), bonus eligibility (never bought, bought before, already stamped, 100% coupon), `getPhotoCapForBooking` (storage-plan booking -> null, base only, base + extra), cap arithmetic at the boundary (exactly at cap passes, one over fails, retried chunk passes), cap order pricing (1 block, 20 blocks, 21 rejected).

Built: also covered are `firstPurchaseBonusFor`, `eventPlanStartActionFor`, `clearedGalleryArchiveDate`, `whatsappNumberHeldElsewhereFilter`, the error middleware payload, the login payloads, the audit changes, and handler-level tests of both cap gates with mocked models. 988 backend tests passed on 2026-10-07. Nothing was run against a database or Razorpay.

### A8. Launch switch (data, run by hand after A is deployed. Do not run it yourself)

Two edits through `POST /billing/admin/services`. The caller must be logged in as a user whose `_id` is listed in the backend env var `PLATFORM_ADMIN_USER_IDS`, otherwise the endpoint answers 403. Take the two `_id` values from `GET /billing/plans`. Sending `_id` makes it an update, and only the fields sent are changed.

1. Event-based Service. `first_purchase_bonus_valid_until` is epoch milliseconds: use the last millisecond of the final day in IST, or `null` for no end date.

```
{
  "_id": "<Event-based service _id>",
  "first_purchase_bonus_events": 1,
  "first_purchase_bonus_valid_until": <epoch ms for the date Abhishek gives, or null>,
  "event_photo_cap": 20000,
  "photo_cap_addon_size": 5000,
  "photo_cap_addon_price": 50
}
```

2. Free Service. This is the moment new signups stop getting free events and start being eligible for the offer.

```
{ "_id": "<Free service _id>", "included_events": 0 }
```

To switch the offer off later: `{ "_id": "<Event-based service _id>", "first_purchase_bonus_events": 0 }`.

Checked: no seed in this repo creates the Free Service. Services are created by hand through this endpoint. A Free Service with `included_events` missing now means 0 free events.

### A9. WhatsApp number check at onboarding (added)

`src/controllers/onboarding.controller.js`: `requestWhatsappOtp`, `resendWhatsappOtp` and `verifyWhatsappOtp` refuse with the 409 in 4.7 when another company already holds the number. One exported helper builds the query, `whatsappNumberHeldElsewhereFilter(number, companyId)`: a different company with the same `whatsapp_number` that has either verified it or finished onboarding. A half-finished signup that typed the number but never verified it does not block anyone.

Not touched: studios already sharing a number, and the Settings change-number flow.

### Part A non-goals

No lifetime upload ceiling. No event name or cover lock. No migration of existing subscriptions. No change to storage-plan behaviour, proration, mandates or the lapse sweep, apart from A6b. No admin UI.

---

## PART B. Studio web app

### B1. Types and API client

- `lib/plans.ts`: add the 4.1 fields to `Plan` as optional. Add pure helpers: `firstPurchaseOfferOf(plan)`, `photoCapTermsOf(plan)` (returns cap, addon size, addon price with named fallbacks). Make the identical edit in the marketing repo's copy in the same change set, or note clearly in the hand-back that Part C must copy it byte for byte. Built: both copies carry the same new code, including `offerLine`, `payPerEventTerms`, `formatCount` and `formatOfferDate`. They still differ in `formatStorage`, as they did before.
- `lib/billing-types.ts`: `first_purchase_offer_eligible` on the snapshot base; `bonus_events?`, `storage_data_warning?` and the `photo_cap_topup` mode on `CheckoutPreview`; a `PhotoCap` type.
- `lib/types.ts`: `plan_required?: boolean` on `Company`.
- `lib/api.ts`: `checkout` and `previewCheckout` accept optional `booking_id`, `photo_cap_blocks` and `confirm_storage_clear`; the archive-tiers and create-media response types gain `photo_cap`.
- `ApiError` must expose the 402 body's `code` and `photo_cap`. Check how it is built today and extend it if it only keeps `message`. Built: `isPhotoCapExceeded(err)` and `getApiPhotoCap(err)` in `lib/api.ts`.

### B2. Compulsory plan step after onboarding

- `lib/auth.ts`: add `needsPlan(company)` -> `company.plan_required === true`. Treat `undefined` as false so an old cached company object never traps anyone.
- Reuse `/checkout`. Do not build a second purchase flow. Add an onboarding mode switched on by `?onboarding=1`. Built as its own component on the same route, `components/billing/OnboardingPlanStep.tsx`, which reuses `PlanChooser`, `BillingDetailsForm`, `CheckoutSummary` and `useCheckoutFlow`. Reason: the existing page never moved past the chooser without a `plan` parameter, and its "Add billing details" link points into the dashboard, which this studio is locked out of. So the billing form is shown inline as a step (choose, billing details, confirm, status):
  - Heading: "Choose how you want to pay". Sub line: "Pick one to open your dashboard. You can switch to a storage plan later."
  - Progress indicator consistent with onboarding: "Step 4 of 4".
  - No "back to dashboard" or close control. The only exits are paying, logging out, and a "Chat with us on WhatsApp" link.
  - Both options offered: pay per event (default) and storage plan.
  - After `ConfirmingPayment` succeeds, go to `/dashboard`.
- `app/(dashboard)/onboarding/page.tsx`: progress becomes "Step N of 4". After the Google step, and in the branch that today redirects an already-onboarded studio to `/dashboard`, go to `/checkout?onboarding=1` when `needsPlan`.
- `app/(dashboard)/dashboard/layout.tsx`: after the `needsOnboarding` checks (both the cached check and the fresh-response check), if `needsPlan(company)` then `router.replace("/checkout?onboarding=1")`. Keep the existing rule that a late response must not yank someone off a page they were already let into, except for this gate: an unpaid new studio must never see the dashboard.
- After a successful purchase the cached company still says `plan_required: true`. Refresh the company (same call the layout uses) before navigating to `/dashboard`, or the gate will bounce the studio straight back.
- The gate must never apply to `/checkout`, `/login`, `/onboarding`.
- A studio that reaches `/checkout?onboarding=1` without needing a plan is sent to `/dashboard`. Built: the step decides this from a fresh company fetch, not the cached one.
- The billing details form is already required before checkout (`assertBillingProfileComplete`). Keep that; it is part of this step.

### B3. Offer and cap copy in the purchase UI

`components/billing/PlanChooser.tsx`, pay-per-event card and event mode:

- When the plan has a live offer AND the snapshot says `first_purchase_offer_eligible`, show a line: "Buy 1 event, get 1 free on your first purchase" (number from `bonus_events`; "get 2 free" if it is 2).
- Under the quantity picker in event mode, when the offer applies: "You pay for {qty}. You get {qty + bonus}." This is the line that makes "only one free, however many you buy" obvious.
- Replace "Unlimited storage on every event" with "Upload unlimited photos" followed by a small "T&C apply" text button that opens the terms dialog (B5).
- Keep "Each event stays live for 3 months" and "No monthly commitment".

`components/billing/CheckoutSummary.tsx`: when the preview has `bonus_events > 0`, add a row "First purchase offer: +1 free event" with amount "₹0".

`components/billing/UpgradeModal.tsx`: same offer line, same conditions, since it embeds the same chooser.

Existing studios that have bought events before must never see the offer line. That is what the eligibility flag is for. Revised: the same goes for every studio that was onboarded with free events. The flag covers both.

Added, lapsed storage plan (A6b): the chooser and the upgrade modal offer pay per event to a studio whose storage plan has lapsed. When the preview carries `storage_data_warning`, the confirm step shows it with a tick box (`components/billing/StorageClearConfirm.tsx`) and the pay button stays disabled until it is ticked. Checkout is then sent with `confirm_storage_clear: true`.

### B4. Welcome dialog

`components/onboarding/WelcomeDialog.tsx` currently promises free events with unlimited storage. Rewrite:

- Body for a pay-per-event studio: "Your studio is verified and your plan is active. You have {remaining} event{s} ready to use. Create a gallery, share the QR, and watch the deliveries land." For a storage studio: "...You have {storage} of storage ready to use. ..."
- One button: "Create your first event" (closes the dialog and marks it seen). Remove "Upgrade plan" and "Start with free events".
- Remove `FALLBACK_FREE_EVENTS`. Fix the "2 free events" comments in `lib/api.ts` and `lib/types.ts`.

### B5. Photo limit terms dialog (one shared component)

New small component, e.g. `components/billing/PhotoLimitTerms.tsx`, built on the existing `Modal`. Used by the PlanChooser, the plan settings page and the upload modal. All numbers come from `photoCapTermsOf(eventPlan)`. Built: the lines themselves come from one pure function, `payPerEventTerms(plan, { includeOffer })` in `lib/plans.ts`, shared with the marketing site.

Title: "Pay per event: terms"

- "Each event can hold up to 20,000 photos at a time." Revised by Bharat from "photos and videos"; videos still count (D1). Changed in the marketing site's `lib/plans.ts`. Open: the app's copy still says "photos and videos" and needs the same one-line edit in `payPerEventTerms` and its test.
- "You can delete photos and upload new ones whenever you like. Only what is in the event right now counts."
- "Need more room? Add 5,000 photos to an event for ₹50. Capacity is added in blocks of 5,000."
- "Extra capacity belongs to that one event. It cannot be moved to another event and is not refundable."
- "Each event stays live for 3 months from the day you create it. Unused events never expire."
- Only when a live offer exists: "First purchase offer for new studios: buy at least 1 event and get 1 free. One time per studio, whatever number of events you buy. Offer valid till {date}." Leave out "Offer valid till" when `valid_until` is null. Revised: "for new studios" was added because existing studios no longer qualify.

### B6. Plan and billing settings

`app/(dashboard)/dashboard/settings/billing/page.tsx` (corrected: `settings/plan/page.tsx` is only a redirect to it): for a pay-per-event or Free studio, add a short "How pay per event works" block (`components/billing/PayPerEventExplainer.tsx`):

- "Buy events as you need them. Each event stays live for 3 months."
- "Upload unlimited photos. T&C apply" with the same terms dialog link.
- If eligible and the offer is live: "First purchase offer: buy 1 event, get 1 free."

Do not show this block to a storage-plan studio. Corrected: `InvoiceList` shows the invoice number and total, not a description, so it needed no change and cap invoices appear as ordinary rows.

### B7. Upload modal: cap check before upload

In `UploadModal.tsx`:

- Read `photo_cap` from the archive-tiers response the modal already loads. `null` means no cap logic at all (storage-plan events behave exactly as today).
- On the `preferences` step, once the selection is final and after the existing duplicate filter has removed files already in the gallery, compute `incoming` = number of files that will actually be uploaded, and `over = used + incoming - cap`. Corrected: the duplicate filter lives in the upload engine, not the modal. The modal now runs the same `resolveDedup` against `getUploadedMediaIds` itself to count `incoming` before the run starts.
- If `over <= 0`: nothing changes, except a quiet line near the Upload button: "{used + incoming} of {cap} photos after this upload".
- If `over > 0`: the Upload button is replaced by a cap panel. Model it on how `overStorage` already blocks the button so the two behave alike.

Cap panel content:

- Heading: "This upload goes over the event's photo limit"
- Body: "This event holds {cap} photos. It has {used} and you selected {incoming}, which is {over} too many."
- Block picker: minimum `ceil(over / addon_size)`, cannot go below the minimum, can go up to 20. Label: "Add {blocks x addon_size} photos" with the price "₹{blocks x addon_price}, GST included".
- Primary button: "Pay ₹{amount} and upload"
- Secondary button: "Go back and select fewer photos" (returns to the `select` step with the selection intact)
- Small link: "T&C apply" opening the terms dialog.
- If the signed-in user is neither admin nor billing user (the checkout endpoint will 403 them): hide the pay button and show "Ask your studio admin to add photo capacity for this event, or select fewer photos."

Payment sequence, reusing `useCheckoutFlow` and the Razorpay helper rather than writing a second one. Extend `RunCheckoutInput` and `CheckoutPurpose` with a `photo_cap_topup` purpose carrying `bookingId` and `blocks`:

1. `checkout({ service_id: eventPlan._id, booking_id, photo_cap_blocks })`.
2. If the API answers that the billing profile is incomplete, show the existing `BillingDetailsForm` inline in the modal, then retry. Legacy free-event studios may never have filled it in.
3. Open Razorpay with the returned order.
4. On Razorpay success, the grant arrives by webhook, so poll archive-tiers until `photo_cap.cap` has grown by the purchased amount (same idea and timings as `ConfirmingPayment`). Show "Confirming your payment".
5. When confirmed, start the upload automatically with the selection and preferences already chosen. The studio should not have to press Upload again.
6. If Razorpay is dismissed: stay on the cap panel, nothing lost.
7. If confirmation times out: "Your payment went through but the capacity has not shown up yet. This usually takes a minute." with a "Check again" button. Never start the upload before the cap has actually grown; the server would refuse it.

The selection must survive the whole payment round trip. Do not reset modal state when the Razorpay overlay opens or closes.

Built: the panel is `components/billing/PhotoCapPanel.tsx`, with its arithmetic in the pure `lib/photo-cap.ts`. After Razorpay succeeds it re-reads the cap every 2 seconds, up to 15 times, before showing the timeout message.

### B8. Upload engine: cap hit during a run

`useUploadEngine.ts`: a 402 with `code === "PHOTO_CAP_EXCEEDED"` from presign or create-media (another device filled the event meanwhile, or a stale tab) must pause the run, not fail it, the same way a full storage plan pauses a run today. `UploadProgress` shows: "This event reached its photo limit. {n} photos are waiting." with "Add capacity" (opens the same cap panel, minimum blocks computed from the waiting count) and "Stop here". After a confirmed payment the run resumes from where it paused. Also read `photo_cap` from each create-media response to keep the count live.

Make sure the existing blanket 402 handling (which opens the upgrade modal for quota errors) does not swallow this code. Check `code` first.

Corrected: the only blanket 402 handler is in `AddEventModal` (event creation), not on the upload path, so nothing needed guarding. Built: the pause lives in `lib/r2-upload/engine.ts`. The refused batch is re-queued and nothing is marked failed; `resumeAfterPhotoCap()` restarts the run. If a run ended with refused rows, the media tab shows a banner with "Try again" and "Add capacity". The engine changes are type-checked and linted but have no unit tests.

### B9. Showing the cap on the event

In the media tab header for a capped event (where the photo count is already shown): "{used} of {cap} photos". At 90% or more, add an "Add capacity" text button that opens the cap panel in a standalone modal with minimum 1 block. Storage-plan events show nothing new.

### B10. Other copy to sweep in this repo

Search for "free event", "2 free", "Start free", "unlimited storage" across `app`, `components`, `lib`. Known hits: `WelcomeDialog.tsx`, `PlanChooser.tsx`, comments in `lib/api.ts` and `lib/types.ts`. The Free plan label stays for legacy studios still on it; do not remove `Free` handling from types or from the custom-domain locked state.

The mobile-browser rule stays: bulk upload is not offered on mobile viewports, so the cap panel only needs to be right on desktop, but it must not break the layout if the modal is opened on a narrow screen.

### B11. WhatsApp number already in use (added)

No frontend change was needed. `StudioDetailsStep` and `WhatsappOtpStep` already show the server's `message`, so the 409 in 4.7 appears as the inline error on request, resend and verify.

### Part B non-goals

No redesign of checkout or the upload modal beyond what is listed. No Hindi. No change to storage-plan flows. No Android app work (the app uses the same backend endpoints, so the server gate already covers it; its own UI is separate).

---

## PART C. Marketing site

### C1. Data helpers

- `lib/plans.ts`: the same as the app's copy after B1, apart from the `formatStorage` difference that was already there (section 2).
- `lib/pricing-display.ts`: remove `FREE_EVENTS_FALLBACK` and `freeEventsOf` (or make them return 0 honestly) and every use of `freeEvents` in `HomeFigures`. Add `firstPurchaseOffer` (from the event plan, `null` when not live) and `photoCapTerms` to the figures. Update `pricing-display.test.ts` and `plans.test.ts`.
- Add one pure formatter for the offer line so the wording is identical everywhere: `offerLine(offer)` -> "Buy 1 event, get 1 free" / "Buy 1 event, get 2 free".

### C2. Remove "Start free" everywhere

- `components/Nav.tsx`: remove the "Start free" button in both the desktop bar and the drawer. Only "Log in" remains. Restyle "Log in" as the primary nav button so the bar does not look empty (use the existing `.go` style).
- `components/home/Hero.tsx`: button text becomes the offer line when an offer is live, otherwise "See pricing". It links to `/pricing#events`, not `LOGIN_URL` (D9).
- `components/CtaSection.tsx`: replace "Your first N events are free." with, when an offer is live, "Buy your first event and get 1 more free. Every feature included." and otherwise "Every feature included from your first event." Same button rule as the hero. Drop the `freeEvents` prop.
- `components/home/Proof.tsx`: the "Start free / 2 events" card becomes "First purchase offer" with the big line "1 event free", body "Buy your first event and we add 1 more. Every feature unlocked.", button "See pricing" to `/pricing#events`. When no offer is live, the card reads "Pay per event", big line "{event price}", body "One wedding at a time. Every feature unlocked." In the next card, "per event, unlimited storage" becomes "per event, unlimited photos*" with the footnote "*T&C apply" linking to `/pricing#photo-terms`.
- `app/welcome/page.tsx`: "New here? Start free" becomes "New here? Log in to get started" (same `buildSignupUrl()`).
- `lib/app-url.ts`: fix the comment that mentions "Start free".
- `app/page.tsx`: stop passing `freeEvents`.

### C3. Pricing page

`app/pricing/page.tsx`:

- h1: "Buy one event. Get one free." when an offer is live; "Pay per event or pick a plan." when not.
- Lede: "On your first purchase. GST included in every price." when live; "GST included in every price." when not.
- Meta description: "Pay per event or pick a storage plan. Buy your first event and get one free. GST included, no hidden fees." (drop the offer sentence when no offer is live).
- Update the Product JSON-LD if it lists a free offer at ₹0.

`components/pricing/PricingClient.tsx`:

- Delete the Free card and its entry in the jump nav. Check `pricing.module.css` so two cards lay out properly where three did. Built: the grid is two columns capped at 900px wide. Not looked at in a browser yet.
- Pay-per-event card:
  - Tag: the offer line when live, otherwise "Pay per event".
  - Under the amount, when live: "You pay for {qty}. You get {qty + bonus}." It must update with the quantity buttons, so buying 5 visibly shows 6, not 10.
  - Bullets: "Upload unlimited photos" with a "T&C apply" text button; "Unused events never expire"; "Each event stays live for 3 months from the day you create it".
  - Button stays "Buy events" to `LOGIN_URL`.
  - When the offer has an end date, a small line under the button: "Offer valid till {date}".
- Add the photo terms as an anchored block, `id="photo-terms"`, either as a dialog opened by "T&C apply" or an expandable block directly under the cards. Same six lines as B5. It must be reachable by URL so other pages can link to it. Built: an always-visible section under the cards, so the anchor works without script. "T&C apply" on the card is a link to it.

`components/pricing/pricing-faqs.ts`:

- "Which plan should I start with?" -> "Buy events one at a time while you deliver a handful a season. On your first purchase we add one event free. Move to a storage plan once you deliver regularly{comparison}" (drop the offer sentence when not live).
- "Do I get every feature on the free plan?" -> "Do I get every feature on pay per event?" with the same answer about original-quality delivery.
- "How long does an event stay live?" -> remove "free and" from the answer.
- "How does storage work?" -> "On pay per event, each event holds up to {cap} photos at a time. Delete photos and you can upload more. You can add {addon size} more to an event for {addon price}. On a storage plan, you have one pool that carries across all your events and does not reset when an event ends. Delete an event and the space is yours to use again."
- New item: "Is there a photo limit on pay per event?" with the cap, delete-and-reupload, and the addon price.
- New item, only when live: "How does the free event work?" -> "Buy at least one event and we add {N free event(s)} to your account. It is {N free event(s)} per studio, whatever number you buy the first time, for studios buying events for the first time. It works exactly like a paid event." (Revised wording, since existing studios no longer qualify.)
- The FAQ JSON-LD on the pricing page is built from these groups; it will follow.

`components/pricing/IncludedBox.tsx` and `CouponRibbon.tsx`: read them for any "free" or "unlimited storage" wording and fix it the same way.

### C4. Legal pages

- `app/terms/page.tsx`: in the payments section, add a short "Pay per event" paragraph stating the photo limit per event, that deleting frees room, the price and block size of extra capacity, that extra capacity is per event and non-refundable, and that the first-purchase offer is one time per studio and can be withdrawn for future purchases. Because legal pages are static text, write the numbers plainly here and add a code comment pointing at the Service fields they mirror. Check `lib/site-legal.ts` for a last-updated date and bump it. Built: `LAST_UPDATED` is "7 October 2026". The paragraph says "20,000 photos at a time".
- `app/refund-policy/page.tsx`: one line that extra photo capacity purchases are non-refundable once applied to an event.

### C5. Sweep

Search the repo for "free", "Start free", "unlimited storage", "2 events". Fix every user-facing hit. Leave the `WELCOME_PAGE_IMPLEMENTATION_PROMPT.md` and other prompt files alone.

### Part C non-goals

No layout redesign. No new pages. No Hindi. Do not touch `landing_page_v2` prototype assets. Do not add the coupon ribbon back.

---

## 8. Edge cases to get right

| Case | Expected |
|---|---|
| New studio buys 5 events during the offer | Limit becomes 6. Invoice shows 5 paid and mentions 1 free. |
| New studio buys a storage plan at the compulsory step | No bonus. Dashboard opens. Its events are uncapped. |
| That storage studio's plan lapses and it later buys events for the first time, offer still live | Allowed (A6b). Warned that its storage-plan galleries will be deleted and must confirm. Gets the bonus, because it signed up with no free events and has never bought events. |
| Studio opens two checkouts and pays both | Only the first captured order gets the bonus. |
| Offer window ends between checkout and payment | Studio still gets the bonus shown at checkout. |
| First purchase with a 100% coupon | No bonus, eligibility kept. |
| Existing studio with 1 unused free event | Not sent to the payment step. Revised: no offer shown and no bonus. Buying 1 gives 1 on top of the unused one. |
| Existing studio that bought events last month | No offer shown, no bonus. |
| Old pay-per-event event with 31,000 photos | Photos stay. New uploads refused until capacity is bought or photos are deleted. Minimum blocks = ceil((31,000 + incoming - 20,000) / 5,000), so selecting 500 more needs 3 blocks. |
| Event at 19,950, studio selects 100, 60 are already in the gallery | 40 incoming, fits, no panel. |
| Retried create-media chunk whose rows already landed | Accepted, not counted twice. |
| Studio deletes 3,000 photos then uploads 3,000 | Fits. |
| Team member without billing access hits the cap | Sees "ask your admin", can go back and select fewer. |
| Payment succeeds, webhook is slow | Modal waits, then uploads. Never uploads before the cap grows. |
| Razorpay closed without paying | Back on the cap panel, selection intact. |
| Second device fills the event during a run | Run pauses with the cap message, resumes after capacity is bought. |
| Cover photo upload on an event at its cap | Allowed. |
| Storage-plan studio adds capacity to an old pay-per-event event | Allowed. |
| Suspended studio | Unchanged: writes are already blocked by `enforceSubscriptionState`. It is not sent to the plan step. |
| Studio on a running storage plan tries to buy events | Refused with 409, as before. |
| Lapsed storage studio pays for events without confirming the deletion | Checkout refuses with 409 `STORAGE_CLEAR_UNCONFIRMED`; nothing is created. |
| Lapsed storage studio confirms and pays | Storage-plan galleries are deleted straight away, a new Event-based subscription becomes active, limit = events already used + credits bought. |
| Studio renews its storage plan between event checkout and payment | Nothing deleted, nothing granted, bonus kept. Error logged for a refund or a manual grant. |
| Studio whose first events were sold at the onboarding desk | No bonus on that sale and none on a later online purchase (second half to be confirmed). |
| New studio enters a WhatsApp number another studio has verified or onboarded with | 409 `WHATSAPP_NUMBER_IN_USE` at request, resend and verify. |
| New studio enters a number that an abandoned signup typed but never verified | Allowed. |

---

## 9. Setup and manual test checklist

### 9.0 Before you test

1. Restart the backend so the new model fields load. There is no migration and no new index. Old documents simply lack the new fields and read as the defaults.
2. Razorpay must be in test mode, and the `payment.captured` webhook must reach the backend you are testing. Events, the bonus, the plan start and photo capacity are all granted by the webhook; there is no client-side confirm call. On a laptop that means a tunnel URL registered as a webhook in the Razorpay test dashboard, with the matching `RAZORPAY_WEBHOOK_SECRET`.
3. Run the A8 data switch on that environment. Without the Free edit, new signups still get free events, never see the plan step and never become eligible for the offer. Without the Event-based edit there is no offer anywhere. `POST /billing/admin/services` needs your user `_id` in `PLATFORM_ADMIN_USER_IDS`; on 2026-10-07 the local backend `.env` had no such line.
4. Do the Free edit BEFORE creating the test studios. Eligibility for the offer is stamped at signup and never set afterwards, so a studio created while Free still granted events can never be used to test the bonus.
5. To test the cap without 20,000 files, set a small cap on the test environment, for example `event_photo_cap: 20` and `photo_cap_addon_size: 5`. The app reads every figure from the API. Put the real values back before launch: the terms page and the refund policy state 20,000, 5,000 and ₹50 as plain text.
6. Each new test studio needs a WhatsApp number that no other studio on that environment has verified or onboarded with. A number you have reused across test accounts now returns 409.
7. The marketing site caches the plans API for 5 minutes. After changing the offer, wait or rebuild before judging the pages.
8. Make the app's terms wording match the site's ("photos at a time", B5) so the two do not disagree during the test.

### 9.1 Backend, with Razorpay test mode

1. Set the offer and cap fields through the admin endpoint; `GET /billing/plans` shows them; set `valid_until` in the past and `first_purchase_offer` becomes null.
2. Sign up a new studio after setting Free `included_events: 0`: subscription limit is 0, the company has `first_purchase_offer_eligible: true`, the company payload has `plan_required: true`, creating an event returns 402.
3. Buy 5 events: limit 6, company stamped (`first_event_bonus_granted_at`), the order has `notes.bonus_granted`, invoice emailed with the offer wording, `plan_required` false.
4. Buy 1 more: limit 7, no bonus.
5. Existing studio with free events: `plan_required` false; the preview shows `bonus_events: 0`; its first purchase gives no bonus (revised).
6. Capped event: presign and create-media refuse at the cap with the 402 body; delete media and they pass again.
7. Buy 2 blocks for an event: `photo_cap_extra` is 10,000, invoice emailed, uploads pass up to 30,000.
8. Replay the same webhook: nothing granted twice.
9. Lapsed storage plan with galleries: the preview returns `storage_data_warning`; checkout without `confirm_storage_clear` answers 409 and creates no order; with it, after payment the storage galleries are gone, the active subscription is Event-based and its limit is events used + credits.
10. Running storage plan: event checkout still answers 409.
11. Onboarding with a WhatsApp number another studio holds: request OTP answers 409 `WHATSAPP_NUMBER_IN_USE`. A number only typed by an abandoned signup is accepted.
12. Run the billing audit after the purchases above: no S5 or C6 findings for the test studios.

### 9.2 App

13. New signup cannot reach `/dashboard` by typing the URL until it pays; logout and WhatsApp links work on the payment step.
14. On the plan step, a studio with no billing details can fill them in and pay without leaving the step. Closing Razorpay leaves it on the step, with no "Back to dashboard" button.
15. Paying for events or for a storage plan both open the dashboard, with the new welcome dialog.
16. Offer line appears for a studio that signed up after the switch and has not bought. It does not appear for a studio onboarded with free events, or for one that has bought before.
17. Select a folder that crosses the cap: panel shows the right minimum; pay; upload starts on its own.
18. Same, but close Razorpay: selection still there. Same, but "select fewer": back on the select step.
19. Fill the event from a second tab during a run: the run pauses with the limit message; "Add capacity" then resumes it; "Stop here" ends it and the banner offers "Try again".
20. Event header shows "{used} of {cap} photos", with "Add capacity" from 90%.
21. Team member without billing access at the cap sees "ask your studio admin" and no pay button.
22. Terms dialog opens from the chooser, Plan & Billing and the cap panel, with numbers from the API. Opened from inside the upgrade modal, Escape closes only the terms dialog.
23. Lapsed storage studio: the chooser offers pay per event; the pay button stays disabled until the deletion box is ticked.
24. Onboarding with a WhatsApp number already in use shows the server's message on the details step.
25. Narrow screen: the cap panel in the upload dialog does not break the layout.

### 9.3 Site

26. No "Start free" anywhere; nav shows only "Log in".
27. Pricing page: no Free card; the two cards sit properly side by side; quantity 5 shows "You get 6"; "T&C apply" jumps to the terms; `/pricing#photo-terms` works.
28. With an end date set, the card shows "Offer valid till {date}" and the extra FAQ item appears.
29. With the offer switched off in the API, every offer line disappears and nothing reads oddly.
