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
const DESCRIPTION =
  "Pay per event or pick a storage plan. Start free with 2 events. GST included, no hidden fees.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/pricing" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: TITLE }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.png"],
  },
};

export default async function PricingPage() {
  const plansResult = await getPlans();
  const plans = plansResult.ok ? plansResult.data.plans : [];

  // Free-event count, lowest storage plan and "same cost as N events" for the
  // FAQ answers, all derived from the plans API.
  const figures = homeFigures(plans);

  const prices = plans
    .map((p) => p.price)
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
      offerCount: plans.length,
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
          <h1>Start free. Pay as you grow.</h1>
          <p className={styles.lede}>GST included in every price.</p>
          {plansResult.ok ? <PricingClient plans={plans} /> : <PricingErrorFallback />}
        </section>
        <IncludedBox />
        <PricingFaq groups={faqGroups} />
        <CtaSection freeEvents={figures.freeEvents} />
      </main>
      <Footer />
    </>
  );
}
