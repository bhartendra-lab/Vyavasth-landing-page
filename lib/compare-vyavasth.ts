// lib/compare-vyavasth.ts, PURE. Vyavasth's own prices for the /compare pages,
// worked out from the plans API (lib/plans.ts). Nothing here is a price: every
// figure comes from a plan, and a price the plan does not carry comes back
// null so the page can point to /pricing instead.

import {
  baseLifetimeLabel,
  buildStorageTiers,
  eventPlanOf,
  formatCount,
  formatPrice,
  formatStorage,
  gstInclusiveOf,
  photoCapTermsOf,
  planForTier,
  validityBaseDaysOf,
  type Plan,
} from "./plans.ts";
import { ORIGINAL_TIER_MIN_STORAGE_GB } from "./pricing-display.ts";

export type VyavasthCompare = {
  /** The pay-per-event row; null when there is no usable Event-based plan. */
  event: { what: string; price: string } | null;
  /** One row per storage size that has a yearly plan, smallest first. */
  tiers: { size: string; what: string; price: string }[];
  /** "₹470.82 per event (with GST), or ₹7,499 a year (75 GB)" for the hub table. */
  hubEntry: string | null;
  /** The hub table's GST cell. */
  hubGst: string | null;
};

/**
 * A price as charged, GST included: the `*_with_gst` figure, or the listed
 * price when the plan's prices already include GST. null when a plan lists
 * prices before GST and sends no with-GST figure.
 */
export function chargedAmount(
  listed: number | null | undefined,
  withGst: number | null | undefined,
  inclusive: boolean,
): number | null {
  if (typeof withGst === "number") return withGst;
  return inclusive && typeof listed === "number" ? listed : null;
}

/** "₹7,499 a year, GST included", or "₹6,355 + GST a year" when no with-GST figure is known. */
function priceText(
  listed: number | null | undefined,
  withGst: number | null | undefined,
  inclusive: boolean,
  suffix: string,
): string | null {
  const amount = chargedAmount(listed, withGst, inclusive);
  if (amount !== null) return `${formatPrice(amount)} ${suffix}, GST included`;
  return typeof listed === "number" && listed > 0 ? `${formatPrice(listed)} + GST ${suffix}` : null;
}

export function vyavasthCompare(plans: Plan[]): VyavasthCompare {
  const eventPlan = eventPlanOf(plans);

  let event: VyavasthCompare["event"] = null;
  let eventShort: string | null = null;
  if (eventPlan) {
    const inclusive = gstInclusiveOf(eventPlan);
    const price = priceText(eventPlan.event_unit_price, eventPlan.event_unit_price_with_gst, inclusive, "per event");
    const cap = photoCapTermsOf(eventPlan);
    if (price) {
      event = {
        what: [
          "One event",
          cap ? `up to ${formatCount(cap.cap)} photos at a time` : null,
          `live for ${baseLifetimeLabel(validityBaseDaysOf(eventPlan))}`,
        ]
          .filter(Boolean)
          .join(", "),
        price,
      };
      const amount = chargedAmount(eventPlan.event_unit_price, eventPlan.event_unit_price_with_gst, inclusive);
      eventShort =
        amount !== null
          ? `${formatPrice(amount)} per event (with GST)`
          : `${formatPrice(eventPlan.event_unit_price as number)} + GST per event`;
    }
  }

  const yearly = buildStorageTiers(plans)
    .map((tier) => ({ tier, plan: planForTier(tier, "yearly") }))
    .filter((t): t is { tier: (typeof t)["tier"]; plan: Plan } => t.plan !== null);

  const tiers = yearly.flatMap(({ tier, plan }) => {
    const price = priceText(plan.price, plan.price_with_gst, gstInclusiveOf(plan), "a year");
    if (!price) return [];
    const size = formatStorage(tier.storage_limit);
    return [
      {
        size,
        what: `${size} reusable storage${tier.storage_limit >= ORIGINAL_TIER_MIN_STORAGE_GB ? ", original-quality delivery" : ""}`,
        price,
      },
    ];
  });

  let storageShort: string | null = null;
  if (yearly.length > 0) {
    const { tier, plan } = yearly[0];
    const amount = chargedAmount(plan.price, plan.price_with_gst, gstInclusiveOf(plan));
    const size = formatStorage(tier.storage_limit);
    if (amount !== null) storageShort = `${formatPrice(amount)} a year (${size})`;
    else if (typeof plan.price === "number") storageShort = `${formatPrice(plan.price)} + GST a year (${size})`;
  }

  const entryParts = [eventShort, storageShort].filter((x): x is string => x !== null);

  const storageModes = new Set(yearly.map(({ plan }) => gstInclusiveOf(plan)));
  let hubGst: string | null = null;
  if (storageModes.size === 1) {
    hubGst = storageModes.has(true) ? "Included in storage plan prices" : "Extra";
  } else if (storageModes.size > 1) {
    hubGst = "Varies by plan";
  } else if (eventPlan) {
    hubGst = gstInclusiveOf(eventPlan) ? "Included" : "Extra";
  }

  return {
    event,
    tiers,
    hubEntry: entryParts.length > 0 ? entryParts.join(", or ") : null,
    hubGst,
  };
}
