import type { Metadata, Viewport } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CtaSection from "@/components/CtaSection";
import PricingClient from "@/components/pricing/PricingClient";
import PricingFaq from "@/components/pricing/PricingFaq";
import PricingErrorFallback from "@/components/pricing/PricingErrorFallback";
import IncludedBox from "@/components/pricing/IncludedBox";
import {
  buildPricingFaqGroups,
  flattenPricingFaqs,
} from "@/components/pricing/pricing-faqs";
import { getPlans } from "@/lib/vyavasth-api";
import {
  ORIGINAL_TIER_MIN_STORAGE_GB,
  chargedEventPrice,
  gstFeesPhrase,
  gstSummary,
  homeFigures,
} from "@/lib/pricing-display";
import {
  baseLifetimeLabel,
  buildStorageTiers,
  chargedPrice,
  eventPlanOf,
  formatCount,
  formatListPrice,
  formatStorage,
  gstInclusiveOf,
  photoCapTermsOf,
  planForTier,
  validityBaseDaysOf,
} from "@/lib/plans";
import styles from "@/components/pricing/pricing.module.css";

// The pricing header is deep brown at the top, so the browser chrome matches it.
export const viewport: Viewport = { themeColor: "#2B140D" };

const TITLE = "Vyavasth pricing: pay per event or an annual storage plan";

/**
 * The description mentions the first-purchase offer only while the plans API
 * says it is live, so a search result never promises a free event that has
 * been switched off. (getPlans is the same cached fetch the page itself makes.)
 */
export async function generateMetadata(): Promise<Metadata> {
  const plansResult = await getPlans();
  const { firstPurchaseOffer, gst } = homeFigures(plansResult.ok ? plansResult.data.plans : []);
  // From the plans' own gst_inclusive switch (lib/pricing-display.ts).
  const fees = gstFeesPhrase(gst);
  const description = firstPurchaseOffer
    ? `Pay per event or pick a storage plan. Buy your first event and get ${firstPurchaseOffer.bonus_events === 1 ? "one" : firstPurchaseOffer.bonus_events} free. ${fees}`
    : `Pay per event or pick a storage plan. ${fees}`;
  return {
    title: TITLE,
    description,
    alternates: { canonical: "/pricing" },
    openGraph: {
      title: TITLE,
      description,
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: TITLE }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: TITLE,
      description,
      images: ["/og-image.png"],
    },
  };
}

export default async function PricingPage() {
  const plansResult = await getPlans();
  const plans = plansResult.ok ? plansResult.data.plans : [];

  // The first-purchase offer, the photo-limit terms, the lowest storage plan
  // and "same cost as N events" for the FAQ answers, all from the plans API.
  const figures = homeFigures(plans);
  const offer = figures.firstPurchaseOffer;
  // One sentence on GST, from the plans themselves; nothing when none is known.
  const lede = [offer ? "On your first purchase." : null, gstSummary(figures.gst)].filter(Boolean).join(" ");

  // What can actually be bought: storage plans by their price, pay per event by
  // its per-event price, each as charged (GST included) since that is what a
  // structured-data price means. The legacy Free plan is not an offer and is
  // left out.
  const prices = plans
    .map((p) =>
      p.service_type === "Event-based"
        ? chargedPrice(p.event_unit_price, p.event_unit_price_with_gst)
        : chargedPrice(p.price, p.price_with_gst),
    )
    .filter((p): p is number => typeof p === "number" && p > 0);
  const lowPrice = prices.length ? Math.min(...prices) : 0;
  const highPrice = prices.length ? Math.max(...prices) : 0;

  // ── "All plans at a glance": every plan as plain HTML, so a crawler that does
  // not click sees the 75 GB to 4 TB prices too. Each price is the plan's own,
  // with its GST wording from formatListPrice (the same number as charged on a
  // GST-inclusive plan, "+ GST" on one that is not).
  const eventPlan = eventPlanOf(plans);
  const capTerms = photoCapTermsOf(eventPlan);
  const tiers = buildStorageTiers(plans);
  const eventCharged = chargedEventPrice(eventPlan);
  const eventListed = eventPlan?.event_unit_price;
  const eventCell =
    eventPlan && typeof eventListed === "number" && eventListed > 0
      ? `${formatListPrice(eventListed, gstInclusiveOf(eventPlan))} per event`
      : null;
  const eventWhat = eventPlan
    ? [
        "One event",
        capTerms ? `up to ${formatCount(capTerms.cap)} photos at a time` : null,
        `live for ${baseLifetimeLabel(validityBaseDaysOf(eventPlan))}`,
      ]
        .filter(Boolean)
        .join(", ")
    : null;
  const storageRows = tiers.map((tier) => {
    const monthly = planForTier(tier, "monthly");
    const yearly = planForTier(tier, "yearly");
    const size = formatStorage(tier.storage_limit);
    return {
      size,
      what: `${size} reusable storage${tier.storage_limit >= ORIGINAL_TIER_MIN_STORAGE_GB ? ", original-quality delivery" : ""}`,
      monthlyCell: monthly && typeof monthly.price === "number" ? `${formatListPrice(monthly.price, gstInclusiveOf(monthly))} a month` : "Not offered",
      yearlyCell: yearly && typeof yearly.price === "number" ? `${formatListPrice(yearly.price, gstInclusiveOf(yearly))} a year` : "Not offered",
      monthlyCharged: monthly ? chargedPrice(monthly.price, monthly.price_with_gst) : null,
      yearlyCharged: yearly ? chargedPrice(yearly.price, yearly.price_with_gst) : null,
    };
  });
  const showTable = plansResult.ok && (eventPlan !== null || tiers.length > 0);
  const gstLine = gstSummary(figures.gst);

  // One Offer per priced row of that table, as charged (GST included).
  const rowOffers = [
    ...(eventPlan && eventCharged !== null
      ? [
          {
            "@type": "Offer",
            name: "Pay per event",
            price: String(eventCharged),
            priceCurrency: "INR",
            description: eventWhat,
          },
        ]
      : []),
    ...storageRows.flatMap((r) => [
      ...(r.monthlyCharged !== null
        ? [{ "@type": "Offer", name: `${r.size} storage plan, monthly`, price: String(r.monthlyCharged), priceCurrency: "INR", description: `${r.size}, billed monthly` }]
        : []),
      ...(r.yearlyCharged !== null
        ? [{ "@type": "Offer", name: `${r.size} storage plan, yearly`, price: String(r.yearlyCharged), priceCurrency: "INR", description: `${r.size}, billed yearly` }]
        : []),
    ]),
  ];

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Vyavasth",
    description: "An AI event gallery that delivers photos to guests during the event.",
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice,
      highPrice,
      offerCount: prices.length,
      // schema.org: an AggregateOffer lists the Offers it summarises.
      ...(rowOffers.length ? { offers: rowOffers } : {}),
    },
  };

  // Free SEO: the FAQ answers already exist on the page; feeding them into a
  // FAQPage block costs nothing visually. Single source: pricing-faqs.ts.
  const faqGroups = buildPricingFaqGroups(figures);
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: flattenPricingFaqs(faqGroups).map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([productLd, faqLd]) }}
      />
      <Nav />
      <main style={{ background: "var(--page)" }}>
        <section className={styles.top}>
          <h1>
            {offer
              ? `Buy one event. Get ${offer.bonus_events === 1 ? "one" : offer.bonus_events} free.`
              : "Pay per event or pick a plan."}
          </h1>
          {lede && <p className={styles.lede}>{lede}</p>}
          {plansResult.ok ? <PricingClient plans={plans} /> : <PricingErrorFallback />}
        </section>
        <p style={{ textAlign: "center", margin: "28px 24px 0", fontSize: 15 }}>
          <Link href="/pricing/pay-per-event" style={{ color: "#C25A3A", textDecoration: "underline" }}>
            How pay per event works
          </Link>
        </p>
        {showTable && (
          <section className="px-[clamp(14px,5.3vw,76px)] pt-[clamp(56px,7vw,96px)]">
            <div className="max-w-[1288px] mx-auto rounded-3xl bg-white border border-[#f0e3dc] p-[clamp(24px,3vw,40px)]">
              <h2 className="m-0 text-[clamp(26px,2.8vw,40px)] leading-[1.1] tracking-[-0.035em] font-medium text-[var(--brown)]">
                All plans at a glance
              </h2>
              <p className="mt-3 mb-5 text-[15px] text-[var(--brown)]">
                Every plan includes face search, album selection with Smart Selects, Locate Originals,
                your branding and watermark, and the Google review prompt. Original-quality delivery
                needs {formatStorage(ORIGINAL_TIER_MIN_STORAGE_GB)} or more.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse text-[var(--brown)]">
                  <caption className="sr-only">Vyavasth plans and prices in rupees</caption>
                  <thead>
                    <tr>
                      {["Plan", "What you get", "Monthly", "Yearly"].map((h) => (
                        <th
                          key={h}
                          scope="col"
                          className="text-left font-bold py-2.5 px-3 align-top whitespace-nowrap border-b border-[rgba(26,18,8,0.08)]"
                        >
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {eventPlan && (
                      <tr>
                        <th scope="row" className="text-left font-semibold py-2.5 px-3 align-top whitespace-nowrap border-b border-[rgba(26,18,8,0.08)]">
                          Pay per event
                        </th>
                        <td className="py-2.5 px-3 align-top border-b border-[rgba(26,18,8,0.08)]">{eventWhat}</td>
                        <td className="py-2.5 px-3 align-top whitespace-nowrap border-b border-[rgba(26,18,8,0.08)]">{eventCell ?? "See above"}</td>
                        <td className="py-2.5 px-3 align-top whitespace-nowrap border-b border-[rgba(26,18,8,0.08)]">No subscription</td>
                      </tr>
                    )}
                    {storageRows.map((r) => (
                      <tr key={r.size}>
                        <th scope="row" className="text-left font-semibold py-2.5 px-3 align-top whitespace-nowrap border-b border-[rgba(26,18,8,0.08)]">
                          {r.size}
                        </th>
                        <td className="py-2.5 px-3 align-top border-b border-[rgba(26,18,8,0.08)]">{r.what}</td>
                        <td className="py-2.5 px-3 align-top whitespace-nowrap border-b border-[rgba(26,18,8,0.08)]">{r.monthlyCell}</td>
                        <td className="py-2.5 px-3 align-top whitespace-nowrap border-b border-[rgba(26,18,8,0.08)]">{r.yearlyCell}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {gstLine && <p className="mt-4 mb-0 text-sm text-[var(--brown)]">{gstLine}</p>}
            </div>
          </section>
        )}
        <IncludedBox />
        <PricingFaq groups={faqGroups} />
        <CtaSection offer={offer} />
      </main>
      <Footer />
    </>
  );
}
