"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import HeroTrustStrip from "@/components/HeroTrustStrip";

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

// Rangoli/mandala-inspired background circle — very faint, purely decorative
function BackgroundMandala() {
  const rings = [340, 270, 200, 130, 65, 25];
  const petalCount = 8;

  return (
    <svg
      className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-[28%] pointer-events-none select-none"
      width="960"
      height="960"
      viewBox="0 0 960 960"
      fill="none"
      aria-hidden="true"
      style={{ opacity: 0.042 }}
    >
      {/* Concentric rings — alternating solid and dashed */}
      {rings.map((r, i) => (
        <circle
          key={r}
          cx="480"
          cy="480"
          r={r}
          stroke="#92400E"
          strokeWidth={i % 2 === 0 ? "1.5" : "1"}
          strokeDasharray={i % 2 !== 0 ? "6 5" : undefined}
        />
      ))}

      {/* 8 lotus petals radiating outward */}
      {Array.from({ length: petalCount }).map((_, i) => {
        const angle = (i * 360) / petalCount;
        const rad = (angle * Math.PI) / 180;
        const px = 480 + 200 * Math.cos(rad);
        const py = 480 + 200 * Math.sin(rad);
        return (
          <ellipse
            key={i}
            cx={px}
            cy={py}
            rx="52"
            ry="116"
            transform={`rotate(${angle + 90}, ${px}, ${py})`}
            stroke="#92400E"
            strokeWidth="1"
            fill="none"
          />
        );
      })}

      {/* 16 outer dots */}
      {Array.from({ length: 16 }).map((_, i) => {
        const rad = ((i * 360) / 16) * (Math.PI / 180);
        return (
          <circle
            key={i}
            cx={480 + 340 * Math.cos(rad)}
            cy={480 + 340 * Math.sin(rad)}
            r="4.5"
            fill="#92400E"
          />
        );
      })}

      {/* 8 mid dots between petals */}
      {Array.from({ length: 8 }).map((_, i) => {
        const rad = ((i * 360) / 8 + 22.5) * (Math.PI / 180);
        return (
          <circle
            key={i}
            cx={480 + 270 * Math.cos(rad)}
            cy={480 + 270 * Math.sin(rad)}
            r="3"
            fill="#92400E"
          />
        );
      })}

      {/* Center dot cluster */}
      <circle cx="480" cy="480" r="6" fill="#92400E" />
      {Array.from({ length: 8 }).map((_, i) => {
        const rad = ((i * 360) / 8) * (Math.PI / 180);
        return (
          <circle
            key={i}
            cx={480 + 25 * Math.cos(rad)}
            cy={480 + 25 * Math.sin(rad)}
            r="2.5"
            fill="#92400E"
          />
        );
      })}
    </svg>
  );
}

// Torana/invitation-border inspired corner ornament
function CornerOrnament({ flip = false }: { flip?: boolean }) {
  return (
    <svg
      className={`absolute top-0 ${flip ? "right-0" : "left-0"} pointer-events-none select-none`}
      width="180"
      height="180"
      viewBox="0 0 180 180"
      fill="none"
      aria-hidden="true"
      style={{ transform: flip ? "scaleX(-1)" : undefined }}
    >
      {/* Curved arc lines — like a quarter of a torana arch */}
      <path d="M0 160 Q100 100 160 0" stroke="rgba(146,64,14,0.13)" strokeWidth="1" fill="none" />
      <path d="M0 130 Q82 82 130 0" stroke="rgba(146,64,14,0.10)" strokeWidth="1" fill="none" />
      <path d="M0 100 Q62 62 100 0" stroke="rgba(146,64,14,0.08)" strokeWidth="1" fill="none" />
      <path d="M0 72 Q44 44 72 0" stroke="rgba(146,64,14,0.06)" strokeWidth="1" fill="none" />

      {/* Corner diamond */}
      <rect
        x="9"
        y="9"
        width="12"
        height="12"
        transform="rotate(45 15 15)"
        fill="rgba(146,64,14,0.28)"
      />

      {/* Dots along top edge */}
      <circle cx="42" cy="10" r="2.5" fill="rgba(146,64,14,0.20)" />
      <circle cx="70" cy="10" r="2" fill="rgba(146,64,14,0.14)" />
      <circle cx="100" cy="10" r="1.5" fill="rgba(146,64,14,0.09)" />

      {/* Dots along left edge */}
      <circle cx="10" cy="42" r="2.5" fill="rgba(146,64,14,0.20)" />
      <circle cx="10" cy="70" r="2" fill="rgba(146,64,14,0.14)" />
      <circle cx="10" cy="100" r="1.5" fill="rgba(146,64,14,0.09)" />

      {/* Inner accent dots */}
      <circle cx="32" cy="22" r="2" fill="rgba(146,64,14,0.16)" />
      <circle cx="22" cy="32" r="2" fill="rgba(146,64,14,0.16)" />
      <circle cx="26" cy="26" r="1.5" fill="rgba(146,64,14,0.12)" />
    </svg>
  );
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
        <div
          className="w-full rounded-t-2xl overflow-hidden relative aspect-[8/5]"
          style={{
            boxShadow:
              "0 -4px 6px rgba(43,31,23,0.03), 0 20px 60px rgba(43,31,23,0.10), 0 8px 24px rgba(43,31,23,0.07)",
            border: "1px solid rgba(43,31,23,0.07)",
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
          "linear-gradient(165deg, #FFF8ED 0%, #FDF3E3 35%, #FFF0CC 65%, #FAF6EC 100%)",
      }}
    >
      {/* Warm saffron / marigold / terracotta glows — no indigo */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 55% at 50% -10%, rgba(217,119,6,0.11) 0%, transparent 68%), radial-gradient(ellipse 60% 45% at 85% 20%, rgba(245,158,11,0.10) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 10% 35%, rgba(196,78,0,0.07) 0%, transparent 72%)",
        }}
      />

      {/* Rangoli-inspired mandala in the upper background */}
      <BackgroundMandala />

      {/* Corner torana ornaments */}
      <CornerOrnament />
      <CornerOrnament flip />

      {/* Centered text content */}
      <div className="relative w-full max-w-3xl mx-auto px-6 lg:px-8 pt-24 sm:pt-32 md:pt-36 pb-8 text-center flex flex-col items-center gap-5 sm:gap-6">

        {/* Eyebrow pill — saffron/terracotta instead of indigo */}
        <motion.div {...useFadeUp(0)} className="max-w-full">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium uppercase"
            style={{
              background: "rgba(146,64,14,0.08)",
              color: "#92400E",
              letterSpacing: "0.08em",
              border: "1px solid rgba(146,64,14,0.16)",
            }}
          >
            <span aria-hidden style={{ fontSize: "10px" }}>✦</span>
            Built for Indian Photography Studios
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          {...useFadeUp(0.06)}
          className="w-full leading-[1.08] tracking-[-0.03em]"
          style={{
            fontFamily: "var(--font-playfair)",
            fontWeight: 800,
            fontSize: "clamp(26px, 7.5vw, 64px)",
            color: "#2B1F17",
          }}
        >
          Run Your Studio.
          <br />
          Not Spreadsheets.
        </motion.h1>

        {/* Decorative divider — rangoli dot row */}
        <motion.div
          {...useFadeUp(0.09)}
          className="flex items-center justify-center gap-2"
          aria-hidden="true"
        >
          <span style={{ color: "rgba(146,64,14,0.30)", fontSize: "9px" }}>◆</span>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                width: 3,
                height: 3,
                borderRadius: "50%",
                backgroundColor: "rgba(146,64,14,0.18)",
              }}
            />
          ))}
          <span style={{ color: "rgba(146,64,14,0.30)", fontSize: "9px" }}>◆</span>
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                display: "inline-block",
                width: 3,
                height: 3,
                borderRadius: "50%",
                backgroundColor: "rgba(146,64,14,0.18)",
              }}
            />
          ))}
          <span style={{ color: "rgba(146,64,14,0.30)", fontSize: "9px" }}>◆</span>
        </motion.div>

        {/* Subheadline */}
        <motion.p
          {...useFadeUp(0.12)}
          className="w-full max-w-xl"
          style={{
            fontSize: "clamp(15px, 4vw, 17px)",
            lineHeight: "1.65",
            color: "#6B5240",
            fontFamily: "var(--font-inter)",
          }}
        >
          From the first enquiry to the final delivery — Vyavasth keeps your
          bookings, payments, and team in order, so you focus on the frame.
        </motion.p>

        {/* CTA */}
        <motion.div {...useFadeUp(0.18)}>
          <button
            onClick={scrollToContact}
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white transition-all duration-200 hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4500A]/50"
            style={{ backgroundColor: "#D4500A" }}
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
            "✓ GST-ready billing",
          ].map((chip) => (
            <span
              key={chip}
              className="text-xs"
              style={{
                color: "#6B5240",
                fontFamily: "var(--font-inter)",
              }}
            >
              {chip}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Social proof: trust badge + scrolling studio name strip */}
      <div className="relative w-full max-w-6xl mx-auto px-6 lg:px-8 mt-4 pb-2">
        <motion.div {...useFadeUp(0.28)}>
          <HeroTrustStrip />
        </motion.div>
      </div>

      {/* Scroll-tilt product image */}
      <ProductImageReveal
        heroRef={heroRef}
        imageSrc={HERO_PRODUCT_IMAGE_SRC}
        imageAlt="Vyavasth product preview"
      />
    </section>
  );
}
