// Shared FAQ copy, the single source for both the rendered accordion
// (PricingFaq.tsx) and the page's FAQPage JSON-LD (app/pricing/page.tsx).
// Plain data module (no "use client") so a server component can import it too.

export type PricingFaqItem = { q: string; a: string };

export const PRICING_FAQS: PricingFaqItem[] = [
  {
    q: "Is GST included in these prices?",
    a: "Yes. Every price shown is GST-inclusive; the number you see is the number you pay. Your invoice breaks the tax out separately for your records.",
  },
  {
    q: "What happens when I hit my event cap?",
    a: "You can keep working; we just pause new event creation until you buy more credits or move to a storage plan. Nothing you've already delivered is affected.",
  },
  {
    q: "Can I switch plans later?",
    a: "Yes. Move between storage tiers or between Monthly and Yearly billing anytime; upgrades apply immediately (prorated for the rest of your cycle) and downgrades take effect at your next renewal.",
  },
  {
    q: "Can I switch back to pay-per-event from a storage plan?",
    a: "No, once you're on a storage plan, you stay on storage plans. You can change tiers or cancel, but not move back to pay-per-event.",
  },
  {
    q: "What happens if I cancel?",
    a: "Cancelling turns off auto-renew; you keep full access until the end of your current billing period. After that, your dashboard becomes read-only and your galleries are archived, then permanently deleted 7 days later.",
  },
  {
    q: "Do I get all the features on the free plan?",
    a: "Yes. Every feature is included on every plan today. If that ever changes, this page changes with it.",
  },
  {
    q: "How does storage work? Is it per event?",
    a: "It depends on the plan. On a storage plan, it's a single pool that carries forward across every booking and doesn't reset when an event ends. On the free and pay-per-event plans, each event gets unlimited storage.",
  },
  {
    q: "What if I run out of storage mid-event?",
    a: "Uploads pause rather than fail. Move up a tier and they resume; the upgrade is prorated and takes effect immediately.",
  },
];
