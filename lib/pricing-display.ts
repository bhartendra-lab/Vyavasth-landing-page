// lib/pricing-display.ts — PURE. No React, no fetch, no env. Display-side
// figures derived from the plans API (lib/plans.ts) plus the few named
// constants the API does not expose. Every number a visitor sees that comes
// from a plan is computed here from `getPlans()` data; nothing is a price.

import {
  buildStorageTiers,
  eventPlanOf,
  firstPurchaseOfferOf,
  photoCapTermsOf,
  type FirstPurchaseOffer,
  type PhotoCapTerms,
  type Plan,
  type StorageTier,
} from "./plans.ts";

/**
 * Smallest storage plan (GB) that allows original-quality delivery. The backend
 * enforces this and the plans API does not expose it, so it is mirrored here.
 * Source of truth: backend/src/services/billing.service.js,
 * `export const ORIGINAL_TIER_MIN_STORAGE_GB = 500`. Change both together.
 */
export const ORIGINAL_TIER_MIN_STORAGE_GB = 500;

/**
 * How long a pay-per-event event stays live after it is created. Marketing
 * copy, not an API field; the pricing page already stated this before the
 * redesign.
 */
export const EVENT_VALIDITY_MONTHS = 3;

/**
 * Deliberate, hard-coded marketing labels, keyed by storage size in GB. A badge
 * only shows if the API actually returns a plan with that storage size.
 */
export const STORAGE_TIER_BADGES: Readonly<Record<number, string>> = {
  200: "Most chosen",
};

/** Quick quantities offered on the pay-per-event card. */
export const EVENT_PRESETS = [1, 5, 10, 25] as const;

/** Photos per GB, as the pricing page has always stated it (75 GB = 75,000 photos). */
export const PHOTOS_PER_GB = 1000;

const NUMBER_WORDS = ["Zero", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];

/** 2 → "two", 11 → "11". Lower case, for use mid-sentence. */
export function numberWord(n: number): string {
  return n >= 0 && n <= 10 ? NUMBER_WORDS[n].toLowerCase() : String(n);
}

/** Whether a storage size includes original-quality delivery. */
export function includesOriginal(storageGb: number): boolean {
  return storageGb >= ORIGINAL_TIER_MIN_STORAGE_GB;
}

/** 75 → 75000. */
export function photosFor(storageGb: number): number {
  return storageGb * PHOTOS_PER_GB;
}

/**
 * "Same cost as N pay-per-event events a year": how many events bought one at
 * a time cost at least as much as a year of this plan. Null when incomparable.
 */
export function sameCostEvents(
  tier: StorageTier,
  interval: "monthly" | "yearly",
  eventUnitPrice: number | null | undefined,
): number | null {
  if (typeof eventUnitPrice !== "number" || eventUnitPrice <= 0) return null;
  const plan = interval === "monthly" ? tier.monthly : tier.yearly;
  if (typeof plan?.price !== "number" || plan.price <= 0) return null;
  const perYear = interval === "monthly" ? plan.price * 12 : plan.price;
  return Math.ceil(perYear / eventUnitPrice);
}

/** The lowest storage tier that has a yearly plan, with its per-month price. */
export function lowestYearlyTier(
  plans: Plan[],
): { storage_limit: number; yearlyPrice: number; perMonth: number; tier: StorageTier } | null {
  for (const tier of buildStorageTiers(plans)) {
    const price = tier.yearly?.price;
    if (typeof price === "number" && price > 0) {
      return { storage_limit: tier.storage_limit, yearlyPrice: price, perMonth: price / 12, tier };
    }
  }
  return null;
}

export type HomeFigures = {
  /**
   * The first-purchase offer (buy an event, get more free), or null whenever it
   * is not live. Nothing is free at signup any more: this is the only "free"
   * the site may promise, and only while the API says it is on.
   */
  firstPurchaseOffer: FirstPurchaseOffer | null;
  /** Photo limit per pay-per-event event and the price of extra capacity. */
  photoCapTerms: PhotoCapTerms;
  /** Pay-per-event price, or null when there is no Event-based plan. */
  eventPrice: number | null;
  /** Lowest storage plan, billed yearly. Null when no yearly plan exists. */
  lowestStorage: { storage_limit: number; perMonth: number } | null;
  /** Events bought one at a time that cost the same as a year of the lowest plan. */
  sameCostEvents: number | null;
};

/** Everything the home page and the FAQ need from the plans API, in one object. */
export function homeFigures(plans: Plan[]): HomeFigures {
  const eventPlan = eventPlanOf(plans);
  const eventPrice = eventPlan?.event_unit_price ?? null;
  const lowest = lowestYearlyTier(plans);
  return {
    firstPurchaseOffer: firstPurchaseOfferOf(eventPlan),
    photoCapTerms: photoCapTermsOf(eventPlan),
    eventPrice: typeof eventPrice === "number" && eventPrice > 0 ? eventPrice : null,
    lowestStorage: lowest ? { storage_limit: lowest.storage_limit, perMonth: lowest.perMonth } : null,
    sameCostEvents: lowest ? sameCostEvents(lowest.tier, "yearly", eventPrice) : null,
  };
}
