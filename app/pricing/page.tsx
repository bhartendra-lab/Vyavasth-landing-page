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
import { gstFeesPhrase, gstSummary, homeFigures } from "@/lib/pricing-display";
import { chargedPrice } from "@/lib/plans";
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
        <IncludedBox />
        <PricingFaq groups={faqGroups} />
        <CtaSection offer={offer} />
      </main>
      <Footer />
    </>
  );
}
