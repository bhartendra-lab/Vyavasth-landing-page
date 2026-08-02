import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Eyebrow from "@/components/Eyebrow";
import CtaSection from "@/components/CtaSection";
import PricingClient from "@/components/pricing/PricingClient";
import PricingFaq from "@/components/pricing/PricingFaq";
import PricingErrorFallback from "@/components/pricing/PricingErrorFallback";
import PricingHeaderCta from "@/components/pricing/PricingHeaderCta";
import PricingExplainer from "@/components/pricing/PricingExplainer";
import BillingFacts from "@/components/pricing/BillingFacts";
import FeatureShowcase from "@/components/features/FeatureShowcase";
import { PRICING_FAQS } from "@/components/pricing/pricing-faqs";
import { getPlans, getPublicCoupons, getFeatures } from "@/lib/vyavasth-api";
import { freePlanOf } from "@/lib/plans";

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
  const [plansResult, couponsResult, featuresResult] = await Promise.all([
    getPlans(),
    getPublicCoupons(),
    getFeatures(),
  ]);

  const plans = plansResult.ok ? plansResult.data.plans : [];
  const coupons = couponsResult.ok ? couponsResult.data.coupons : [];
  const features = featuresResult.ok ? featuresResult.data.features : [];

  // The only number the explainer may state is the free plan's included
  // events, sourced from the API rather than hardcoded.
  const includedEvents = freePlanOf(plans)?.included_events ?? null;

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
  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: PRICING_FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <main style={{ background: "var(--color-bg)", minHeight: "100vh" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([productLd, faqLd]) }}
      />
      <Nav />

      {/* ── §1 Header + dual CTA ─────────────────────────────────── */}
      <section style={{ padding: "clamp(120px, 16vh, 160px) 0 32px" }}>
        <div
          className="mx-auto flex flex-col gap-4"
          style={{ maxWidth: "var(--max-w)", padding: "0 var(--gutter)" }}
        >
          <Eyebrow>Pricing</Eyebrow>
          <h1
            className="font-extrabold"
            style={{
              fontSize: "clamp(2.2rem, 5vw, 3.6rem)",
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              color: "var(--color-primary)",
              maxWidth: 760,
            }}
          >
            Pay for what you deliver.
          </h1>
          <p
            className="max-w-[560px] text-lg"
            style={{ color: "var(--color-muted)", lineHeight: 1.6 }}
          >
            Start free with two events. Buy events one at a time when work picks up, or move to a storage plan once you're delivering every week.
          </p>
          <PricingHeaderCta />
        </div>
      </section>

      {/* ── §2 How pricing works ─────────────────────────────────── */}
      <PricingExplainer includedEvents={includedEvents} />

      {/* ── §3 The calculator ────────────────────────────────────── */}
      <section style={{ padding: "clamp(24px, 4vh, 40px) 0 0" }}>
        <div
          className="mx-auto flex flex-col gap-2"
          style={{ maxWidth: "var(--max-w)", padding: "0 var(--gutter)" }}
        >
          <Eyebrow>The calculator</Eyebrow>
          <h2
            className="font-extrabold"
            style={{
              fontSize: "clamp(1.9rem, 3.6vw, 2.6rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              color: "var(--color-primary)",
            }}
          >
            Work out your number.
          </h2>
        </div>
      </section>
      {plansResult.ok ? (
        <PricingClient plans={plans} coupons={coupons} />
      ) : (
        <PricingErrorFallback />
      )}

      {/* ── §4 Everything included ───────────────────────────────── */}
      <FeatureShowcase features={features} />

      {/* ── §5 Billing, plainly ──────────────────────────────────── */}
      <BillingFacts />

      {/* ── §6 FAQ → CTA → Footer ────────────────────────────────── */}
      <PricingFaq />
      <CtaSection />
      <Footer />
    </main>
  );
}
