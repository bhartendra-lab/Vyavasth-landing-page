// lib/page-meta.ts, PURE. Titles and descriptions for the static pages, kept
// in one place so a test can hold them to the snippet limits: a title of 65
// characters or fewer (Google cuts near 60) and a description of 110 to 155
// (Bing flags longer ones as too long, shorter as too thin). No em dashes.

export const TITLE_MAX = 65;
export const DESCRIPTION_MIN = 110;
export const DESCRIPTION_MAX = 155;

export const PAGE_META = {
  home: {
    title: "Vyavasth | Wedding photo sharing with AI face search, India",
    description:
      "Wedding photo sharing and album selection app for Indian photography studios. Guests find their photos with one selfie, live during the event.",
  },
  about: {
    title: "About Vyavasth: photo delivery software for Indian studios",
    description:
      "Vyavasth is wedding and event photo delivery software for photography studios in India. Live delivery, one-selfie face search, album selection in hours.",
  },
  contact: {
    title: "Contact Vyavasth: WhatsApp, phone and email support",
    description:
      "Contact Vyavasth for support, billing and grievances. Reach us on WhatsApp, phone or email, with our registered address, business hours and a support form.",
  },
  features: {
    title: "Vyavasth features: album selection, face search, live delivery",
    description:
      "What Vyavasth does for photography studios in India: album selection in hours, originals in one click, one-selfie face search and live delivery.",
  },
  compare: {
    title: "Face search photo sharing apps in India: 2026 prices",
    description:
      "Kwikpic, FotoOwl, Samaro, PicPapaya, FaceSnap, Photomall, Kamero and Vyavasth compared for Indian studios: pricing, entry price, GST, album selection.",
  },
  pricing: {
    title: "Vyavasth pricing: pay per event or an annual storage plan",
  },
  payPerEvent: {
    title: "Pay per event photo delivery in India: price and GST | Vyavasth",
  },
} as const;

/**
 * The /pricing description. `bonusEvents` is the first-purchase offer while the
 * plans API says it is live, null otherwise; `fees` is the GST phrase from
 * gstFeesPhrase. The optional middle clause is dropped when it would push the
 * description past the limit.
 */
export function pricingDescription(bonusEvents: number | null, fees: string): string {
  const base = "Pay per event or pick a storage plan.";
  // Longest wording first; the first one that fits wins, and none is the last resort.
  const included = [
    "Every plan has face search, album selection and your studio's branding.",
    "Face search and album selection included.",
    null,
  ];
  const offer =
    bonusEvents === null
      ? null
      : `Buy your first event and get ${bonusEvents === 1 ? "one" : bonusEvents} free.`;
  const build = (middle: string | null) => [base, middle, offer, fees].filter(Boolean).join(" ");
  return build(included.find((m) => build(m).length <= DESCRIPTION_MAX) ?? null);
}
