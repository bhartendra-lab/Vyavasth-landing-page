// lib/pricing-display.ts — PURE. No React, no fetch, no env. Display-side
// figures derived from the plans API (lib/plans.ts) plus the few named
// constants the API does not expose. Every number a visitor sees that comes
// from a plan is computed here from `getPlans()` data; nothing is a price.

import {
  buildStorageTiers,
  chargedPrice,
  eventPlanOf,
  firstPurchaseOfferOf,
  gstInclusiveOf,
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
 *
 * Both sides are compared AS CHARGED, GST included: `eventUnitPrice` is what
 * one event costs to buy (chargedEventPrice below), and the plan's side is its
 * with-GST price. One of them may list its price before GST and the other with
 * it, and the comparison must still be in the same money.
 */
export function sameCostEvents(
  tier: StorageTier,
  interval: "monthly" | "yearly",
  eventUnitPrice: number | null | undefined,
): number | null {
  if (typeof eventUnitPrice !== "number" || eventUnitPrice <= 0) return null;
  const plan = interval === "monthly" ? tier.monthly : tier.yearly;
  const price = chargedPrice(plan?.price, plan?.price_with_gst);
  if (price === null || price <= 0) return null;
  const perYear = interval === "monthly" ? price * 12 : price;
  return Math.ceil(perYear / eventUnitPrice);
}

/** One event as charged, GST included. Null when there is no such price. */
export function chargedEventPrice(eventPlan: Plan | null | undefined): number | null {
  const price = chargedPrice(eventPlan?.event_unit_price, eventPlan?.event_unit_price_with_gst);
  return price !== null && price > 0 ? price : null;
}

/**
 * How GST applies across what is on sale. Each side is true (its prices
 * include GST), false (they are before GST), "mixed" (storage plans that
 * disagree with each other), or null when nothing of that kind is on sale.
 */
export type GstPicture = { event: boolean | null; storage: boolean | "mixed" | null };

export function gstPictureOf(plans: Plan[]): GstPicture {
  const eventPlan = eventPlanOf(plans);
  const modes = new Set(
    buildStorageTiers(plans)
      .flatMap((tier) => [tier.monthly, tier.yearly])
      .filter((plan): plan is Plan => plan !== null)
      .map(gstInclusiveOf),
  );
  return {
    event: eventPlan ? gstInclusiveOf(eventPlan) : null,
    storage: modes.size === 0 ? null : modes.size === 1 ? [...modes][0] : "mixed",
  };
}

/** True when everything on sale includes GST, false when anything does not, null when nothing is on sale. */
export function allGstInclusive(picture: GstPicture): boolean | null {
  const known = [picture.event, picture.storage].filter((side) => side !== null);
  if (known.length === 0) return null;
  return known.every((side) => side === true);
}

/**
 * One sentence on GST for the pricing page's header, or null when no plan is
 * known (the plans request failed): the page then says nothing about GST
 * rather than guess.
 */
export function gstSummary(picture: GstPicture): string | null {
  const { event, storage } = picture;
  if (event === null && storage === null) return null;
  if (allGstInclusive(picture)) return "GST included in every price.";
  if (event !== true && storage !== true && storage !== "mixed") return "Prices are before GST, which is added at checkout.";
  if (event === false && storage === true) return "Pay per event prices are before GST. Storage plan prices include GST.";
  if (event === true && storage === false) return "Pay per event prices include GST. Storage plan prices are before GST.";
  return "Each price says whether GST is included.";
}

/** The pricing FAQ's answer to "Is GST included?", for the same picture. */
export function gstFaqAnswer(picture: GstPicture): string {
  const invoice =
    "Add your GSTIN and billing address once, and every payment gives you a numbered GST invoice as a PDF, with the tax shown separately.";
  const { event, storage } = picture;
  if (allGstInclusive(picture)) return `Yes. The price you see is the price you pay. ${invoice}`;
  if (event === false && storage === true) {
    return `Storage plan prices include GST. Pay per event prices, extra photo capacity and validity extensions are shown before GST, which is added at checkout. ${invoice}`;
  }
  if (event === true && storage === false) {
    return `Pay per event prices, extra photo capacity and validity extensions include GST. Storage plan prices are shown before GST, which is added at checkout. ${invoice}`;
  }
  if (event !== true && storage !== true && storage !== "mixed" && (event !== null || storage !== null)) {
    return `Prices are shown before GST, which is added at checkout. You see the full amount, tax included, before you pay. ${invoice}`;
  }
  return `Each price says whether GST is included, and you see the full amount, tax included, before you pay. ${invoice}`;
}

/**
 * The lowest storage tier that has a yearly plan, with its per-month price as
 * the plan lists it and whether that price includes GST.
 */
export function lowestYearlyTier(
  plans: Plan[],
): { storage_limit: number; yearlyPrice: number; perMonth: number; gstInclusive: boolean; tier: StorageTier } | null {
  for (const tier of buildStorageTiers(plans)) {
    const price = tier.yearly?.price;
    if (typeof price === "number" && price > 0) {
      return {
        storage_limit: tier.storage_limit,
        yearlyPrice: price,
        perMonth: price / 12,
        gstInclusive: gstInclusiveOf(tier.yearly),
        tier,
      };
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
  /**
   * Photo limit per pay-per-event event and the price of extra capacity. Null
   * when the plans API did not give them: no figure is kept on this site to
   * stand in, so the copy that needs one is left out.
   */
  photoCapTerms: PhotoCapTerms | null;
  /** Pay-per-event price as the plan lists it, or null when there is no Event-based plan. */
  eventPrice: number | null;
  /** Whether `eventPrice` includes GST. */
  eventGstInclusive: boolean;
  /** One event as charged, GST included: for structured data and comparisons. */
  eventPriceWithGst: number | null;
  /** Lowest storage plan, billed yearly, at its listed price. Null when no yearly plan exists. */
  lowestStorage: { storage_limit: number; perMonth: number; gstInclusive: boolean } | null;
  /** Events bought one at a time that cost the same as a year of the lowest plan. */
  sameCostEvents: number | null;
  /** How GST applies across what is on sale. */
  gst: GstPicture;
};

/** Everything the home page and the FAQ need from the plans API, in one object. */
export function homeFigures(plans: Plan[]): HomeFigures {
  const eventPlan = eventPlanOf(plans);
  const eventPrice = eventPlan?.event_unit_price ?? null;
  const eventPriceWithGst = chargedEventPrice(eventPlan);
  const lowest = lowestYearlyTier(plans);
  return {
    firstPurchaseOffer: firstPurchaseOfferOf(eventPlan),
    photoCapTerms: photoCapTermsOf(eventPlan),
    eventPrice: typeof eventPrice === "number" && eventPrice > 0 ? eventPrice : null,
    eventGstInclusive: gstInclusiveOf(eventPlan),
    eventPriceWithGst,
    lowestStorage: lowest
      ? { storage_limit: lowest.storage_limit, perMonth: lowest.perMonth, gstInclusive: lowest.gstInclusive }
      : null,
    sameCostEvents: lowest ? sameCostEvents(lowest.tier, "yearly", eventPriceWithGst) : null,
    gst: gstPictureOf(plans),
  };
}
