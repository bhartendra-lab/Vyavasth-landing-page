import type { Viewport } from "next";
import Nav from "@/components/Nav";
import Hero from "@/components/home/Hero";
import Workflow from "@/components/home/Workflow";
import Features from "@/components/home/Features";
import Proof from "@/components/home/Proof";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";
import WhatsAppFab from "@/components/WhatsAppFab";
import { getPlans } from "@/lib/vyavasth-api";
import { homeFigures } from "@/lib/pricing-display";

// The home hero is deep brown at the top, so the browser chrome matches it.
export const viewport: Viewport = { themeColor: "#2B140D" };

export default async function Home() {
  // Every figure on the home page (the first-purchase offer, per-event price,
  // the lowest storage plan) is derived from the plans API. If the fetch fails,
  // the price card renders without figures; nothing is hard-coded.
  const plansResult = await getPlans();
  const figures = homeFigures(plansResult.ok ? plansResult.data.plans : []);

  // No free tier any more, so the structured data states the real entry price
  // (one event) and no offer at all when the price is unknown.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Vyavasth",
    applicationCategory: "BusinessApplication",
    description: "An AI event gallery that delivers photos to guests during the event.",
    operatingSystem: "Web, iOS, Android",
    ...(figures.eventPrice !== null
      ? { offers: { "@type": "Offer", price: String(figures.eventPrice), priceCurrency: "INR" } }
      : {}),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <main style={{ background: "var(--page)" }}>
        <Hero offer={figures.firstPurchaseOffer} />
        <Workflow />
        <Features />
        <Proof figures={figures} />
        <CtaSection offer={figures.firstPurchaseOffer} />
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
