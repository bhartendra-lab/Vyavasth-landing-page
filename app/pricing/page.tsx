import type { Metadata, Viewport } from "next";
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
import { homeFigures } from "@/lib/pricing-display";
import styles from "@/components/pricing/pricing.module.css";

// The pricing header is deep brown at the top, so the browser chrome matches it.
export const viewport: Viewport = { themeColor: "#2B140D" };

const TITLE = "Pricing: Vyavasth";

/**
 * The description mentions the first-purchase offer only while the plans API
 * says it is live, so a search result never promises a free event that has
 * been switched off. (getPlans is the same cached fetch the page itself makes.)
 */
export async function generateMetadata(): Promise<Metadata> {
  const plansResult = await getPlans();
  const { firstPurchaseOffer } = homeFigures(plansResult.ok ? plansResult.data.plans : []);
  const description = firstPurchaseOffer
    ? `Pay per event or pick a storage plan. Buy your first event and get ${firstPurchaseOffer.bonus_events === 1 ? "one" : firstPurchaseOffer.bonus_events} free. GST included, no hidden fees.`
    : "Pay per event or pick a storage plan. GST included, no hidden fees.";
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

  // What can actually be bought: storage plans by their price, pay per event by
  // its per-event price. The legacy Free plan is not an offer and is left out.
  const prices = plans
    .map((p) => (p.service_type === "Event-based" ? p.event_unit_price : p.price))
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
          <p className={styles.lede}>
            {offer ? "On your first purchase. GST included in every price." : "GST included in every price."}
          </p>
          {plansResult.ok ? <PricingClient plans={plans} /> : <PricingErrorFallback />}
        </section>
        <IncludedBox />
        <PricingFaq groups={faqGroups} />
        <CtaSection offer={offer} />
      </main>
      <Footer />
    </>
  );
}
