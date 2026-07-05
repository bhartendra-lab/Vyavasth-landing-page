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

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "Vyavasth",
  applicationCategory: "BusinessApplication",
  description: "The AI Companion for photography studios.",
  operatingSystem: "Web, iOS, Android",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
};

export default function Home() {
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
      <FeatureSection />
      <HowItWorks />
      <WhySection />
      <CtaSection />
      <Footer />
    </main>
  );
}
