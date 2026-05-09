import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import ProblemSection from "@/components/ProblemSection";
import FeatureSection from "@/components/FeatureSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main style={{ background: "#0A0A0A", minHeight: "100vh" }}>
      <Nav />
      <Hero />
      <ProblemSection />
      <FeatureSection />
      <ContactSection />
      <Footer />
    </main>
  );
}
