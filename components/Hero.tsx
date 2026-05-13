"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import HeroTrustStrip from "@/components/HeroTrustStrip";

/** Put your hero PNG in `public/` and point this path at it (e.g. `/hero.png`). */
export const HERO_PRODUCT_IMAGE_SRC = "/product-preview.png";

function useFadeUp(delay = 0) {
  const reduced = useReducedMotion();
  if (reduced) return {};
  return {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: "easeOut" as const, delay },
  };
}

function ProductImageReveal({
  heroRef,
  imageSrc,
  imageAlt,
}: {
  heroRef: React.RefObject<HTMLElement | null>;
  imageSrc: string;
  imageAlt: string;
}) {
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const rotateX = useTransform(
    scrollYProgress,
    [0, 0.45],
    reduced ? [0, 0] : [13, 0]
  );
  const y = useTransform(
    scrollYProgress,
    [0, 0.45],
    reduced ? [0, 0] : [56, -10]
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 0.45],
    reduced ? [1, 1] : [0.93, 1]
  );

  return (
    <div
      className="w-full max-w-5xl mx-auto px-6 lg:px-8 mt-16 pb-0"
      style={{ perspective: "1200px" }}
    >
      <motion.div
        style={{ rotateX, y, scale }}
        className="w-full rounded-t-2xl overflow-hidden"
        initial={reduced ? {} : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        aria-hidden="true"
      >
        {/* Drop-shadow to give depth */}
        <div
          className="w-full rounded-t-2xl overflow-hidden relative aspect-[8/5]"
          style={{
            boxShadow:
              "0 -4px 6px rgba(26,18,8,0.03), 0 20px 60px rgba(26,18,8,0.10), 0 8px 24px rgba(26,18,8,0.07)",
            border: "1px solid rgba(26,18,8,0.07)",
            borderBottom: "none",
          }}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1024px"
            className="object-cover object-top"
            priority
          />
        </div>
      </motion.div>
    </div>
  );
}

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);

  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      ref={heroRef}
      className="relative flex flex-col items-center overflow-hidden"
      style={{
        background:
          "linear-gradient(165deg, #F3F0FF 0%, #FAF8F5 38%, #FFF6E8 72%, #FAF8F5 100%)",
      }}
    >
      {/* Soft indigo and amber glows */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% -10%, rgba(79,70,229,0.12) 0%, transparent 68%), radial-gradient(ellipse 60% 45% at 85% 20%, rgba(245,158,11,0.08) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 10% 35%, rgba(79,70,229,0.06) 0%, transparent 72%)",
        }}
      />

      {/* Centered text content */}
      <div className="relative max-w-3xl mx-auto px-6 lg:px-8 pt-36 pb-8 text-center flex flex-col items-center gap-6">
        {/* Eyebrow pill */}
        <motion.div {...useFadeUp(0)}>
          <span
            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium uppercase"
            style={{
              background: "rgba(79,70,229,0.08)",
              color: "#4F46E5",
              letterSpacing: "0.12em",
              border: "1px solid rgba(79,70,229,0.14)",
            }}
          >
            Built for Photography Studios
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          {...useFadeUp(0.06)}
          className="leading-[1.05] tracking-[-0.03em]"
          style={{
            fontFamily: "var(--font-syne)",
            fontWeight: 800,
            fontSize: "clamp(42px, 6vw, 64px)",
            color: "#1A1208",
          }}
        >
          Run Your Studio.
          <br />
          Not Spreadsheets.
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          {...useFadeUp(0.12)}
          className="max-w-xl"
          style={{
            fontSize: "17px",
            lineHeight: "1.65",
            color: "#7A6F63",
            fontFamily: "var(--font-dm-sans)",
          }}
        >
          Vyavasth brings your leads, bookings, team, and payments into one
          place — so you spend less time managing and more time shooting.
        </motion.p>

        {/* CTA */}
        <motion.div {...useFadeUp(0.18)}>
          <button
            onClick={scrollToContact}
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-[#0A0A0A] transition-all duration-200 hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B]/50"
            style={{ backgroundColor: "#F59E0B" }}
          >
            Use Vyavasth for Free
            <ArrowRight
              size={18}
              className="transition-transform duration-200 group-hover:translate-x-0.5"
            />
          </button>
        </motion.div>

        {/* Trust chips */}
        <motion.div
          {...useFadeUp(0.24)}
          className="flex flex-wrap justify-center gap-5"
        >
          {[
            "✓ 2-minute setup",
            "✓ UPI-native payments",
            "✓ Built for Indian studios",
          ].map((chip) => (
            <span
              key={chip}
              className="text-xs"
              style={{
                color: "#7A6F63",
                fontFamily: "var(--font-dm-sans)",
              }}
            >
              {chip}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Social proof: rating + scrolling logo strip */}
      <div className="relative w-full max-w-6xl mx-auto px-6 lg:px-8 mt-4 pb-2">
        <motion.div {...useFadeUp(0.28)}>
          <HeroTrustStrip />
        </motion.div>
      </div>

      {/* Scroll-tilt product image — add file at `public` path matching HERO_PRODUCT_IMAGE_SRC */}
      <ProductImageReveal
        heroRef={heroRef}
        imageSrc={HERO_PRODUCT_IMAGE_SRC}
        imageAlt="Vyavasth product preview"
      />
    </section>
  );
}
