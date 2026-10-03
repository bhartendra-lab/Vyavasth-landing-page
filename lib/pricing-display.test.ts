import { test } from "node:test";
import assert from "node:assert/strict";
import { buildStorageTiers, type Plan } from "./plans.ts";
import {
  FREE_EVENTS_FALLBACK,
  ORIGINAL_TIER_MIN_STORAGE_GB,
  STORAGE_TIER_BADGES,
  freeEventsOf,
  homeFigures,
  includesOriginal,
  lowestYearlyTier,
  numberWord,
  photosFor,
  sameCostEvents,
} from "./pricing-display.ts";

const free = (n?: number): Plan => ({ _id: "free", service_type: "Free", included_events: n, price: 0 });
const event = (unit: number): Plan => ({ _id: "ev", service_type: "Event-based", event_unit_price: unit });
const monthly = (gb: number, price: number): Plan => ({
  _id: `m-${gb}`, service_type: "Monthly", billing_interval: "monthly", storage_limit: gb, price,
});
const yearly = (gb: number, price: number): Plan => ({
  _id: `y-${gb}`, service_type: "Yearly", billing_interval: "yearly", storage_limit: gb, price,
});

const CATALOG: Plan[] = [
  free(2), event(399),
  monthly(75, 749), yearly(75, 7499),
  monthly(200, 1299), yearly(200, 12999),
  monthly(500, 2099), yearly(500, 20999),
];

test("freeEventsOf reads the Free plan, and falls back when it is missing or empty", () => {
  assert.equal(freeEventsOf([free(3)]), 3);
  assert.equal(freeEventsOf([]), FREE_EVENTS_FALLBACK);
  assert.equal(freeEventsOf([free()]), FREE_EVENTS_FALLBACK);
  assert.equal(freeEventsOf([free(0)]), FREE_EVENTS_FALLBACK);
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
  assert.equal(f.freeEvents, 2);
  assert.equal(f.eventPrice, 399);
  assert.equal(f.lowestStorage?.storage_limit, 75);
  assert.equal(Math.round(f.lowestStorage?.perMonth ?? 0), 625);
  assert.equal(f.sameCostEvents, 19);
});

test("homeFigures with no plans returns no figures, only the free-events fallback", () => {
  const f = homeFigures([]);
  assert.deepEqual(f, {
    freeEvents: FREE_EVENTS_FALLBACK,
    eventPrice: null,
    lowestStorage: null,
    sameCostEvents: null,
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
