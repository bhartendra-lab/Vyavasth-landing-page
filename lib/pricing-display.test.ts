import { test } from "node:test";
import assert from "node:assert/strict";
import { buildStorageTiers, type Plan } from "./plans.ts";
import {
  ORIGINAL_TIER_MIN_STORAGE_GB,
  STORAGE_TIER_BADGES,
  allGstInclusive,
  chargedEventPrice,
  gstFaqAnswer,
  gstFeesPhrase,
  noneGstInclusive,
  gstPictureOf,
  gstSummary,
  homeFigures,
  includesOriginal,
  lowestYearlyTier,
  numberWord,
  photosFor,
  sameCostEvents,
} from "./pricing-display.ts";

const free = (n?: number): Plan => ({ _id: "free", service_type: "Free", included_events: n, price: 0 });
const event = (unit: number, extra: Partial<Plan> = {}): Plan => ({
  _id: "ev", service_type: "Event-based", event_unit_price: unit, ...extra,
});
const monthly = (gb: number, price: number, extra: Partial<Plan> = {}): Plan => ({
  _id: `m-${gb}`, service_type: "Monthly", billing_interval: "monthly", storage_limit: gb, price, ...extra,
});
const yearly = (gb: number, price: number, extra: Partial<Plan> = {}): Plan => ({
  _id: `y-${gb}`, service_type: "Yearly", billing_interval: "yearly", storage_limit: gb, price, ...extra,
});

const CATALOG: Plan[] = [
  free(2), event(399),
  monthly(75, 749), yearly(75, 7499),
  monthly(200, 1299), yearly(200, 12999),
  monthly(500, 2099), yearly(500, 20999),
];

test("homeFigures promises nothing free from the Free plan, whatever it says", () => {
  // Free events at signup are gone. A Free plan that still lists some (a
  // legacy value) must not put a free-events figure back on the site.
  for (const plans of [[free(3), event(399)], [free(0), event(399)], [event(399)]]) {
    const f = homeFigures(plans);
    assert.equal(f.firstPurchaseOffer, null);
    assert.equal("freeEvents" in f, false);
  }
});

test("homeFigures carries the first-purchase offer only while the API says it is live", () => {
  const live = { bonus_events: 1, valid_until: 1767205799000 };
  assert.deepEqual(homeFigures([event(399, { first_purchase_offer: live })]).firstPurchaseOffer, live);
  assert.equal(homeFigures([event(399, { first_purchase_offer: null })]).firstPurchaseOffer, null);
  assert.equal(
    homeFigures([event(399, { first_purchase_offer: { bonus_events: 0, valid_until: null } })]).firstPurchaseOffer,
    null,
  );
});

test("homeFigures reads the photo-cap terms from the event plan, and has none when the plan does not say", () => {
  assert.deepEqual(
    homeFigures([event(399, { photo_cap: 25000, photo_cap_addon_size: 2500, photo_cap_addon_price: 75 })]).photoCapTerms,
    { cap: 25000, addonSize: 2500, addonPrice: 75, gstInclusive: true },
  );
  // No figure is kept on the site to stand in for the API's.
  assert.equal(homeFigures([]).photoCapTerms, null);
  assert.equal(homeFigures([event(399)]).photoCapTerms, null);
});

test("sameCostEvents rounds up against the API event price", () => {
  const tiers = buildStorageTiers(CATALOG);
  assert.equal(sameCostEvents(tiers[0], "yearly", 399), 19); // 7499 / 399 = 18.8
  assert.equal(sameCostEvents(tiers[1], "yearly", 399), 33); // 12999 / 399 = 32.6
  assert.equal(sameCostEvents(tiers[0], "monthly", 399), 23); // 749 * 12 / 399 = 22.5
});

test("sameCostEvents is null when a price is missing", () => {
  const tiers = buildStorageTiers(CATALOG);
  assert.equal(sameCostEvents(tiers[0], "yearly", null), null);
  assert.equal(sameCostEvents(tiers[0], "yearly", 0), null);
  assert.equal(sameCostEvents(buildStorageTiers([monthly(75, 749)])[0], "yearly", 399), null);
});

test("lowestYearlyTier skips a lower tier that only has a monthly plan", () => {
  const plans = [monthly(50, 499), monthly(75, 749), yearly(75, 7499)];
  const lowest = lowestYearlyTier(plans);
  assert.equal(lowest?.storage_limit, 75);
  assert.equal(lowest?.yearlyPrice, 7499);
  assert.equal(lowestYearlyTier([monthly(75, 749)]), null);
});

test("homeFigures derives every number from the plans", () => {
  const f = homeFigures(CATALOG);
  assert.equal(f.eventPrice, 399);
  assert.equal(f.lowestStorage?.storage_limit, 75);
  assert.equal(Math.round(f.lowestStorage?.perMonth ?? 0), 625);
  assert.equal(f.sameCostEvents, 19);
});

test("homeFigures with no plans returns no figures and no offer", () => {
  const f = homeFigures([]);
  assert.deepEqual(f, {
    firstPurchaseOffer: null,
    photoCapTerms: null,
    eventPrice: null,
    eventGstInclusive: true,
    eventPriceWithGst: null,
    lowestStorage: null,
    sameCostEvents: null,
    gst: { event: null, storage: null },
  });
});

test("original-quality threshold mirrors the backend constant", () => {
  assert.equal(ORIGINAL_TIER_MIN_STORAGE_GB, 500);
  assert.equal(includesOriginal(200), false);
  assert.equal(includesOriginal(500), true);
  assert.equal(includesOriginal(4000), true);
});

test("photosFor, numberWord and the badge map", () => {
  assert.equal(photosFor(75), 75000);
  assert.equal(numberWord(2), "two");
  assert.equal(numberWord(11), "11");
  assert.deepEqual(Object.keys(STORAGE_TIER_BADGES), ["200"]);
});

/* ── The GST switch ─────────────────────────────────────────────────────── */

// Pay per event listed before GST, storage plans with it: what is asked for now.
const EXCLUSIVE_EVENT = event(399, { gst_inclusive: false, event_unit_price_with_gst: 470.82 });
const MIXED: Plan[] = [EXCLUSIVE_EVENT, monthly(75, 749), yearly(75, 7499)];
const ALL_EXCLUSIVE: Plan[] = [
  EXCLUSIVE_EVENT,
  monthly(75, 749, { gst_inclusive: false, price_with_gst: 883.82 }),
  yearly(75, 7499, { gst_inclusive: false, price_with_gst: 8848.82 }),
];

test("gstPictureOf: each side of the catalog says whether its prices include GST", () => {
  assert.deepEqual(gstPictureOf(CATALOG), { event: true, storage: true });
  assert.deepEqual(gstPictureOf(MIXED), { event: false, storage: true });
  assert.deepEqual(gstPictureOf(ALL_EXCLUSIVE), { event: false, storage: false });
  assert.deepEqual(gstPictureOf([]), { event: null, storage: null });
  assert.deepEqual(gstPictureOf([event(399)]), { event: true, storage: null });
  // Storage plans that disagree with each other.
  assert.deepEqual(gstPictureOf([monthly(75, 749), yearly(75, 7499, { gst_inclusive: false })]), { event: null, storage: "mixed" });
});

test("gstSummary: the header sentence follows the switch, and says nothing when no plan is known", () => {
  assert.equal(gstSummary(gstPictureOf(CATALOG)), "GST included in every price.");
  assert.equal(gstSummary(gstPictureOf(MIXED)), "Pay per event prices are before GST. Storage plan prices include GST.");
  assert.equal(gstSummary(gstPictureOf(ALL_EXCLUSIVE)), "Prices are before GST, which is added at checkout.");
  assert.equal(gstSummary({ event: true, storage: false }), "Pay per event prices include GST. Storage plan prices are before GST.");
  assert.equal(gstSummary({ event: true, storage: "mixed" }), "Each price says whether GST is included.");
  assert.equal(gstSummary({ event: false, storage: null }), "Prices are before GST, which is added at checkout.");
  assert.equal(gstSummary(gstPictureOf([])), null);
  assert.equal(allGstInclusive(gstPictureOf([])), null);
  assert.equal(allGstInclusive(gstPictureOf(MIXED)), false);
});

test("gstFaqAnswer: never says the listed price is the price paid unless every price includes GST", () => {
  assert.ok(gstFaqAnswer(gstPictureOf(CATALOG)).startsWith("Yes. The price you see is the price you pay."));
  for (const picture of [gstPictureOf(MIXED), gstPictureOf(ALL_EXCLUSIVE), gstPictureOf([]), { event: true, storage: "mixed" as const }]) {
    const answer = gstFaqAnswer(picture);
    assert.ok(!answer.includes("The price you see is the price you pay"), answer);
    assert.ok(answer.includes("numbered GST invoice"), answer);
    assert.doesNotMatch(answer, /[\u2013\u2014]/);
  }
  assert.ok(gstFaqAnswer(gstPictureOf(MIXED)).startsWith("Storage plan prices include GST. Pay per event prices"));
  assert.ok(gstFaqAnswer(gstPictureOf(ALL_EXCLUSIVE)).startsWith("Prices are shown before GST"));
});

test("homeFigures: an event listed before GST keeps its listed price and carries what it costs to buy", () => {
  const f = homeFigures(MIXED);
  assert.equal(f.eventPrice, 399);
  assert.equal(f.eventGstInclusive, false);
  assert.equal(f.eventPriceWithGst, 470.82);
  assert.equal(f.lowestStorage?.gstInclusive, true);
  assert.deepEqual(f.gst, { event: false, storage: true });
  // An API from before the switch sends no with-GST figure: the listed price is the charged one.
  assert.equal(chargedEventPrice(event(399)), 399);
  assert.equal(chargedEventPrice(null), null);
});

test("sameCostEvents compares as charged, so a plan with GST and an event before it are in the same money", () => {
  const tier = buildStorageTiers(MIXED)[0];
  // 7499 with GST against 470.82 an event: 15.9, not the 18.8 the listed 399 would give.
  assert.equal(sameCostEvents(tier, "yearly", chargedEventPrice(EXCLUSIVE_EVENT)), 16);
  assert.equal(homeFigures(MIXED).sameCostEvents, 16);
  // Both before GST: the same answer as on the listed prices.
  assert.equal(homeFigures(ALL_EXCLUSIVE).sameCostEvents, 19);
});

test("gstFeesPhrase: the meta description claims GST included only when every price has it, and before GST only when none does", () => {
  assert.equal(gstFeesPhrase(gstPictureOf(CATALOG)), "GST included, no hidden fees.");
  assert.equal(gstFeesPhrase(gstPictureOf(ALL_EXCLUSIVE)), "Prices are before GST, with no hidden fees.");
  assert.equal(gstFeesPhrase({ event: false, storage: null }), "Prices are before GST, with no hidden fees.");
  // Mixed, or nothing known: neither claim.
  for (const picture of [gstPictureOf(MIXED), gstPictureOf([]), { event: true, storage: "mixed" as const }, { event: false, storage: "mixed" as const }]) {
    assert.equal(gstFeesPhrase(picture), "No hidden fees.");
  }
  assert.equal(noneGstInclusive(gstPictureOf(ALL_EXCLUSIVE)), true);
  assert.equal(noneGstInclusive(gstPictureOf(MIXED)), false);
  assert.equal(noneGstInclusive(gstPictureOf(CATALOG)), false);
  assert.equal(noneGstInclusive(gstPictureOf([])), null);
});
