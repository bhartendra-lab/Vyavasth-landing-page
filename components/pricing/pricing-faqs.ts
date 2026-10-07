// Shared FAQ copy, the single source for both the rendered accordion
// (PricingFaq.tsx) and the page's FAQPage JSON-LD (app/pricing/page.tsx).
// Plain data module (no "use client") so a server component can import it too.
//
// Several answers state a figure. None is typed in by hand: the first-purchase
// offer, the photo limit and the price of extra capacity, the lowest storage
// size and the "same cost as N events" figure come from the plans API (via
// homeFigures in lib/pricing-display.ts), and the original-quality threshold
// and event validity are named constants there.
//
// The offer sentences and the "How does the free event work?" item appear only
// while the API says the offer is live. With it switched off, nothing here
// mentions anything free.

import { formatCount, formatInr, formatStorage } from "@/lib/plans";
import {
  EVENT_VALIDITY_MONTHS,
  ORIGINAL_TIER_MIN_STORAGE_GB,
  numberWord,
  type HomeFigures,
} from "@/lib/pricing-display";

export type PricingFaqItem = { q: string; a: string };
export type PricingFaqGroup = { title: string; items: PricingFaqItem[] };

export function buildPricingFaqGroups(figures: HomeFigures): PricingFaqGroup[] {
  const { firstPurchaseOffer: offer, photoCapTerms, lowestStorage, sameCostEvents } = figures;
  const freeLine = offer
    ? offer.bonus_events === 1
      ? "one event"
      : `${numberWord(offer.bonus_events)} events`
    : null;
  const freeCount = offer ? (offer.bonus_events === 1 ? "one free event" : `${numberWord(offer.bonus_events)} free events`) : null;
  const cap = formatCount(photoCapTerms.cap);
  const addonSize = formatCount(photoCapTerms.addonSize);
  const addonPrice = formatInr(photoCapTerms.addonPrice);
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
          a: `Buy events one at a time while you deliver a handful a season.${freeLine ? ` On your first purchase we add ${freeLine} free.` : ""} Move to a storage plan once you deliver regularly${comparison}`,
        },
        {
          q: "Do I get every feature on pay per event?",
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
          a: `On pay per event, each event stays live for ${EVENT_VALIDITY_MONTHS} months from the day you create it, not the day you buy it. Event credits themselves never expire: buy four, use one this month and three next year.`,
        },
        {
          q: "How does storage work?",
          a: `On pay per event, each event holds up to ${cap} photos at a time. Delete photos and you can upload more. You can add ${addonSize} more to an event for ${addonPrice}. On a storage plan, you have one pool that carries across all your events and does not reset when an event ends. Delete an event and the space is yours to use again.`,
        },
        {
          q: "Is there a photo limit on pay per event?",
          a: `Yes. Each event holds up to ${cap} photos and videos at a time. Only what is in the event right now counts, so deleting photos frees room to upload more. If you need more, you can add ${addonSize} photos to that event for ${addonPrice}, as many times as you need. Storage plans have no per-event limit.`,
        },
        ...(freeCount
          ? [
              {
                q: "How does the free event work?",
                a: `Buy at least one event and we add ${freeCount} to your account. It is ${freeCount} per studio, whatever number you buy the first time, for studios buying events for the first time. It works exactly like a paid event.`,
              },
            ]
          : []),
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
