import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import LegalPageShell from "@/components/LegalPageShell";
import { whatsappUrl } from "@/lib/site-legal";
import { getPlans } from "@/lib/vyavasth-api";
import {
  baseLifetimeLabel,
  chargedPrice,
  eventPlanOf,
  firstPurchaseOfferOf,
  formatCount,
  formatPrice,
  formatStorage,
  freeEventsLabel,
  gstInclusiveOf,
  gstNote,
  photoCapTermsOf,
  validityBaseDaysOf,
  validityOptionsOf,
  type Plan,
} from "@/lib/plans";
import {
  ORIGINAL_TIER_MIN_STORAGE_GB,
  chargedEventPrice,
  lowestYearlyTier,
} from "@/lib/pricing-display";

const SITE = "https://vyavasth.in";
const PAGE_URL = `${SITE}/pricing/pay-per-event`;
const TITLE = "Pay per event photo delivery in India: price, limits and GST | Vyavasth";

/** Stands in for any sentence that needs a figure the plans API did not give. */
const SEE_PRICES = "See current prices on the pricing page.";

const link = "text-[#C25A3A] underline";
const h2 = "text-xl font-semibold mt-2 mb-3 tracking-tight";
const h2Style = { fontFamily: "var(--font-syne)", color: "#1A1208" } as const;
const list = "list-disc pl-5 space-y-2 m-0";
const cellBorder = "border-b border-[rgba(26,18,8,0.08)]";

/** Every figure on this page, taken from the plans API through the plan helpers. */
function figuresOf(plans: Plan[]) {
  const eventPlan = eventPlanOf(plans);
  const inclusive = gstInclusiveOf(eventPlan);
  const eventPrice = eventPlan?.event_unit_price;
  const hasPrice = typeof eventPrice === "number" && eventPrice > 0;
  const capTerms = photoCapTermsOf(eventPlan);
  const lowest = lowestYearlyTier(plans);
  const charged = chargedEventPrice(eventPlan);
  const yearlyCharged = lowest
    ? chargedPrice(lowest.tier.yearly?.price, lowest.tier.yearly?.price_with_gst)
    : null;
  const sameCost =
    charged !== null && yearlyCharged !== null ? Math.floor(yearlyCharged / charged) : null;

  return {
    eventPlan,
    offer: firstPurchaseOfferOf(eventPlan),
    /** "₹249 (GST included)" or "₹249 plus GST" */
    perEvent: hasPrice ? `${formatPrice(eventPrice)}${inclusive ? " (GST included)" : " plus GST"}` : null,
    /** "₹249" */
    perEventPlain: hasPrice ? formatPrice(eventPrice) : null,
    /** "₹249" or "₹249 + GST" */
    perEventShort: hasPrice ? (inclusive ? formatPrice(eventPrice) : `${formatPrice(eventPrice)} + GST`) : null,
    inclusive,
    charged,
    capTerms,
    lifetime: eventPlan ? baseLifetimeLabel(validityBaseDaysOf(eventPlan)) : null,
    extensions: eventPlan ? validityOptionsOf(eventPlan) : [],
    lowest,
    lowestStorage: lowest ? formatStorage(lowest.storage_limit) : null,
    lowestYearly: lowest
      ? lowest.gstInclusive
        ? formatPrice(lowest.yearlyPrice)
        : `${formatPrice(lowest.yearlyPrice)} + GST`
      : null,
    sameCost: sameCost !== null && sameCost >= 1 ? sameCost : null,
  };
}

type Figures = ReturnType<typeof figuresOf>;

const months = (n: number) => `${n} month${n === 1 ? "" : "s"}`;

function addonText(f: Figures): { size: string; price: string } | null {
  if (!f.capTerms) return null;
  const note = gstNote(f.capTerms.gstInclusive);
  return {
    size: formatCount(f.capTerms.addonSize),
    price: `${formatPrice(f.capTerms.addonPrice)}, ${note}`,
  };
}

function faqsOf(f: Figures): { q: string; a: string }[] {
  const addon = addonText(f);
  return [
    {
      q: "Is there a subscription?",
      a: "No. Pay per event is a one-time payment for each event. Storage plans are yearly or monthly and are a separate choice.",
    },
    {
      q: "Do event credits expire?",
      a: f.lifetime
        ? `No. Buy several events and use them whenever you shoot. Each event's gallery stays live for ${f.lifetime} from the day you create it.`
        : `No. Buy several events and use them whenever you shoot. ${SEE_PRICES}`,
    },
    {
      q: f.capTerms
        ? `What if a wedding has more than ${formatCount(f.capTerms.cap)} photos?`
        : "What if a wedding has more photos than the event limit?",
      a: addon
        ? `Add ${addon.size} more photos to that event for ${addon.price}, as many times as you need, or delete photos you no longer need.`
        : SEE_PRICES,
    },
    { q: "Can I pay with UPI?", a: "Yes. UPI, cards and netbanking all work." },
    { q: "Do I get a GST invoice?", a: "Yes, for every purchase." },
    {
      q: "My clients still want a pen drive. Is this useful?",
      a: "Yes. Use the gallery for sharing, face search and album selection during and after the wedding, and hand over a pen drive with the final edits at the end.",
    },
  ];
}

export async function generateMetadata(): Promise<Metadata> {
  const plansResult = await getPlans();
  const f = figuresOf(plansResult.ok ? plansResult.data.plans : []);
  const parts: string[] = [];
  if (f.perEventPlain) {
    parts.push(`Deliver a wedding gallery for ${f.perEventPlain} per event, GST ${f.inclusive ? "included" : "extra"}.`);
  } else {
    parts.push("Deliver a wedding gallery one event at a time.");
  }
  if (f.capTerms && f.lifetime) {
    parts.push(
      `Up to ${formatCount(f.capTerms.cap)} photos, live for ${f.lifetime}, face search and album selection included.`,
    );
  } else {
    parts.push("Face search and album selection included.");
  }
  parts.push("No subscription.");
  const description = parts.join(" ");
  return {
    title: TITLE,
    description,
    alternates: { canonical: "/pricing/pay-per-event" },
    openGraph: {
      title: TITLE,
      description,
      url: "/pricing/pay-per-event",
      type: "website",
      siteName: "Vyavasth",
      locale: "en_IN",
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: TITLE }],
    },
    twitter: {
      card: "summary_large_image",
      title: TITLE,
      description,
      images: ["/og-image.png"],
    },
  };
}

/** Renders text, turning the "see current prices" sentence into a link to /pricing. */
function Rich({ text }: { text: string }): ReactNode {
  const at = text.indexOf(SEE_PRICES);
  if (at === -1) return text;
  return (
    <>
      {text.slice(0, at)}
      <Link href="/pricing" className={link}>
        {SEE_PRICES}
      </Link>
      {text.slice(at + SEE_PRICES.length)}
    </>
  );
}

export default async function PayPerEventPage() {
  const plansResult = await getPlans();
  const f = figuresOf(plansResult.ok ? plansResult.data.plans : []);
  const addon = addonText(f);
  const faqs = faqsOf(f);

  const opening = f.perEvent
    ? `On Vyavasth you can pay for one event at a time: ${f.perEvent} for a full wedding gallery with face search, album selection and your studio's branding. There is no subscription and no monthly bill in the off-season.`
    : `${SEE_PRICES} There is no subscription and no monthly bill in the off-season.`;

  const bullets: string[] = [
    f.capTerms && addon
      ? `Up to ${formatCount(f.capTerms.cap)} photos in the event at a time. Delete photos to make room, or add ${addon.size} more for ${addon.price}.`
      : SEE_PRICES,
    f.lifetime
      ? `The gallery stays live for ${f.lifetime} from the day you create the event.`
      : SEE_PRICES,
    f.extensions.length > 0
      ? `Extend it later: ${f.extensions.map((o) => `${months(o.months)} for ${formatPrice(o.price)}`).join(", ")}, ${gstNote(f.inclusive)}.`
      : SEE_PRICES,
    "Every feature: face search for guests, album selection with likes and filters, Locate Originals, your branding and watermark, and the Google review prompt.",
    `Original-quality delivery needs a storage plan of ${formatStorage(ORIGINAL_TIER_MIN_STORAGE_GB)} or more.`,
  ];

  const storageParagraph =
    f.lowestStorage && f.lowestYearly
      ? `If you deliver many events a year, a storage plan can work out cheaper: ${f.lowestStorage} for a year costs ${f.lowestYearly}${
          f.sameCost !== null ? `, about the same as ${f.sameCost} event${f.sameCost === 1 ? "" : "s"} bought one at a time` : ""
        }.`
      : SEE_PRICES;

  const head = ["", "Pay per event", "Storage plan", "Pen drive", "Google Drive"];
  const rows: string[][] = [
    [
      "Cost",
      f.perEventShort ? `${f.perEventShort} per event` : SEE_PRICES,
      f.lowestYearly ? `From ${f.lowestYearly} a year` : SEE_PRICES,
      "Drive plus courier for every client",
      "Monthly Google storage once the free 15 GB is full",
    ],
    ["Best for", "A few weddings a season", "Studios delivering every week", "The final copy the couple keeps", "Sharing a folder with one person"],
    ["Guests find their own photos", "Yes", "Yes", "No", "No"],
    ["Album selection", "Yes", "Yes", "File-number lists", "File-number lists"],
    ["Paid in rupees, GST invoice", "Yes", "Yes", "Not applicable", "Billed by Google"],
  ];

  const jsonLd: object[] = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((x) => ({
        "@type": "Question",
        name: x.q,
        acceptedAnswer: { "@type": "Answer", text: x.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: "Pricing", item: `${SITE}/pricing` },
        { "@type": "ListItem", position: 3, name: "Pay per event", item: PAGE_URL },
      ],
    },
  ];
  if (f.charged !== null) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "Offer",
      name: "Pay per event",
      price: String(f.charged),
      priceCurrency: "INR",
      url: PAGE_URL,
      seller: { "@id": `${SITE}/#organization` },
    });
  }

  return (
    <LegalPageShell title="Pay per event photo delivery for Indian studios">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <p className="text-lg m-0">
        <Rich text={opening} />
        {f.offer && f.perEvent ? ` Your first purchase includes ${freeEventsLabel(f.offer.bonus_events)}.` : ""}
      </p>

      <section>
        <h2 className={h2} style={h2Style}>
          What one event includes
        </h2>
        <ul className={list}>
          {bullets.map((b, i) => (
            <li key={i}>
              <Rich text={b} />
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          When a storage plan costs less
        </h2>
        <p className="m-0">
          <Rich text={storageParagraph} />{" "}
          <Link href="/pricing" className={link}>
            Compare all plans
          </Link>
          .
        </p>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          Pay per event, storage plan, pen drive or Google Drive
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm border-collapse">
            <caption className="sr-only">
              Pay per event compared with a storage plan, a pen drive and Google Drive
            </caption>
            <thead>
              <tr>
                {head.map((h, i) => (
                  <th key={i} scope="col" className={`text-left font-bold py-2.5 px-3 align-top ${cellBorder}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row[0]}>
                  {row.map((cell, i) =>
                    i === 0 ? (
                      <th key={i} scope="row" className={`text-left font-medium py-2.5 px-3 align-top ${cellBorder}`}>
                        {cell}
                      </th>
                    ) : (
                      <td key={i} className={`py-2.5 px-3 align-top ${cellBorder}`}>
                        <Rich text={cell} />
                      </td>
                    ),
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          Paying from India
        </h2>
        <p className="m-0">
          Pay with UPI, cards or netbanking through Razorpay. Prices are in rupees, and you receive a GST invoice for every purchase.
        </p>
      </section>

      <section className="flex flex-col gap-4">
        <h2 className={h2} style={h2Style}>
          Questions
        </h2>
        {faqs.map((x) => (
          <div key={x.q}>
            <h3 className="text-base font-semibold m-0 mb-1">{x.q}</h3>
            <p className="m-0">
              <Rich text={x.a} />
            </p>
          </div>
        ))}
      </section>

      <section className="flex flex-col sm:flex-row sm:items-center gap-4">
        <a
          href={whatsappUrl("Hi, I want to buy events on Vyavasth")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-semibold text-white transition-all duration-200 hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C25A3A]/50 no-underline w-full sm:w-auto text-center"
          style={{ backgroundColor: "#C25A3A", fontFamily: "var(--font-dm-sans)" }}
        >
          Chat on WhatsApp
        </a>
        <Link href="/pricing" className={link}>
          See all plans
        </Link>
      </section>
    </LegalPageShell>
  );
}
