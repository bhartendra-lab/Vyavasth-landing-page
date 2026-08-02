import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import StudioMarquee from "@/components/StudioMarquee";
import ProofBand from "@/components/ProofBand";
import ProblemSection from "@/components/ProblemSection";
import FeatureSection from "@/components/FeatureSection";
import HowItWorks from "@/components/HowItWorks";
import WhySection from "@/components/WhySection";
import CtaSection from "@/components/CtaSection";
import Footer from "@/components/Footer";
import { getFeatures } from "@/lib/vyavasth-api";

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
  // The homepage feature strip is DB-driven, so one edit in Mongo updates both
  // this strip and the pricing showcase. FeatureSection falls back to its
  // hardcoded highlights if this fetch fails.
  const featuresResult = await getFeatures({ highlight: true });
  const features = featuresResult.ok ? featuresResult.data.features : [];

  return (
    <main style={{ background: "var(--color-bg)", minHeight: "100vh" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <Hero />
      <StudioMarquee />
      <ProofBand />
      <ProblemSection />
      <FeatureSection features={features} />
      <HowItWorks />
      <WhySection />
      <CtaSection />
      <Footer />
    </main>
  );
}
