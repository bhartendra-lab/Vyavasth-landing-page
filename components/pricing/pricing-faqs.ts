// Shared FAQ copy, the single source for both the rendered accordion
// (PricingFaq.tsx) and the page's FAQPage JSON-LD (app/pricing/page.tsx).
// Plain data module (no "use client") so a server component can import it too.
//
// Three answers state a figure. None is typed in by hand: the free-event count,
// the lowest storage size and the "same cost as N events" figure come from the
// plans API (via homeFigures in lib/pricing-display.ts), and the original-quality
// threshold and event validity are named constants there.

import { formatStorage } from "@/lib/plans";
import {
  EVENT_VALIDITY_MONTHS,
  ORIGINAL_TIER_MIN_STORAGE_GB,
  numberWord,
  type HomeFigures,
} from "@/lib/pricing-display";

export type PricingFaqItem = { q: string; a: string };
export type PricingFaqGroup = { title: string; items: PricingFaqItem[] };

export function buildPricingFaqGroups(figures: HomeFigures): PricingFaqGroup[] {
  const { freeEvents, lowestStorage, sameCostEvents } = figures;
  const freeLine = freeEvents === 1 ? "one event" : `${numberWord(freeEvents)} events`;
  // The comparison sentence needs both figures; without them it is left out
  // rather than guessed.
  const comparison =
    lowestStorage && sameCostEvents !== null
      ? `: ${formatStorage(lowestStorage.storage_limit)} for a year costs about the same as ${sameCostEvents} events bought one at a time.`
      : ".";

  return [
    {
      title: "Choosing a plan",
      items: [
        {
          q: "Which plan should I start with?",
          a: `Start free with ${freeLine}. After that, buy events one at a time while you deliver a handful a season. Move to a storage plan once you deliver regularly${comparison}`,
        },
        {
          q: "Do I get every feature on the free plan?",
          a: `Yes, with one exception. Original-quality delivery needs a storage plan of ${formatStorage(ORIGINAL_TIER_MIN_STORAGE_GB)} or larger. Everything else is included on every plan.`,
        },
        {
          q: "Can I change plans later?",
          a: "Yes. Move between storage sizes, or between monthly and yearly, at any time. Upgrades apply at once and you pay only the difference for the rest of your cycle. Downgrades take effect at your next renewal.",
        },
        {
          q: "Can I go back to pay per event from a storage plan?",
          a: "No. Once you are on a storage plan you stay on storage plans. You can change size or cancel, but not move back to pay per event.",
        },
      ],
    },
    {
      title: "Events and storage",
      items: [
        {
          q: "How long does an event stay live?",
          a: `On the free and pay-per-event plans, each event stays live for ${EVENT_VALIDITY_MONTHS} months from the day you create it, not the day you buy it. Event credits themselves never expire: buy four, use one this month and three next year.`,
        },
        {
          q: "How does storage work?",
          a: "On free and pay per event, every event gets unlimited storage. On a storage plan, you have one pool that carries across all your events and does not reset when an event ends. Delete an event and the space is yours to use again.",
        },
        {
          q: "What if I run out of storage in the middle of an event?",
          a: "Uploads pause. They do not fail. Move up a size and they resume straight away, and you pay only the difference.",
        },
        {
          q: "What happens when I have used all my events?",
          a: "You keep working. Creating new events is paused until you buy more or move to a storage plan. Nothing you have already delivered is affected.",
        },
      ],
    },
    {
      title: "Billing and GST",
      items: [
        {
          q: "Is GST included?",
          a: "Yes. The price you see is the price you pay. Add your GSTIN and billing address once, and every payment gives you a numbered GST invoice as a PDF, with the tax shown separately.",
        },
        {
          q: "How do I pay?",
          a: "Cards, UPI or netbanking, through Razorpay. Storage plans renew automatically. You get reminders 7, 5, 3 and 1 days before a charge, and a failed payment opens a grace period, not an instant cut-off.",
        },
      ],
    },
    {
      title: "Cancelling",
      items: [
        {
          q: "What happens if I cancel?",
          a: "Auto-renew stops and you keep full access until the end of the period you paid for. After that your dashboard becomes read-only and your galleries are archived, then permanently deleted 7 days later.",
        },
      ],
    },
  ];
}

/** Flat list, for the FAQPage JSON-LD. */
export function flattenPricingFaqs(groups: PricingFaqGroup[]): PricingFaqItem[] {
  return groups.flatMap((g) => g.items);
}
