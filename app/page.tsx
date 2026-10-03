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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Vyavasth",
  applicationCategory: "BusinessApplication",
  description: "An AI event gallery that delivers photos to guests during the event.",
  operatingSystem: "Web, iOS, Android",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
};

export default async function Home() {
  // Every figure on the home page (free events, per-event price, the lowest
  // storage plan) is derived from the plans API. If the fetch fails, the
  // price card renders without figures; nothing is hard-coded.
  const plansResult = await getPlans();
  const figures = homeFigures(plansResult.ok ? plansResult.data.plans : []);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <main style={{ background: "var(--page)" }}>
        <Hero freeEvents={figures.freeEvents} />
        <Workflow />
        <Features />
        <Proof figures={figures} />
        <CtaSection freeEvents={figures.freeEvents} />
      </main>
      <Footer />
      <WhatsAppFab />
    </>
  );
}
