"use client";

import { motion, useReducedMotion } from "framer-motion";
import Eyebrow from "@/components/Eyebrow";
import FeatureIcon from "@/components/features/FeatureIcon";
import { CATEGORY_LABELS, type Feature } from "@/lib/features";

type Highlight = Pick<Feature, "name" | "description" | "icon" | "category">;

// Fallback, the four highlight features, shown only when getFeatures({ highlight
// }) fails or comes back empty. Keep in sync with the seed's highlights; the
// live page is driven by the API so one edit in Mongo updates this strip.
const FALLBACK: Highlight[] = [
  {
    name: "AI Face Search",
    description:
      "Guests take one selfie and see only the photos they appear in. No scrolling through four thousand frames, and nobody has to ask the studio to find them.",
    icon: "ScanFace",
    category: "discovery",
  },
  {
    name: "Live Delivery",
    description:
      "Photos travel straight from the camera over FTP and reach registered guests while the event is still running. The gallery is live before the function ends.",
    icon: "Zap",
    category: "delivery",
  },
  {
    name: "Smart Filters & One-Click Locate",
    description:
      "Sort a gallery by family member, most-liked, or the bride-and-groom pairing, then jump from any frame to its original or RAW file in a single click.",
    icon: "SlidersHorizontal",
    category: "discovery",
  },
  {
    name: "Studio Branding & Watermark",
    description:
      "Your logo, colours and watermark carry through the entire gallery, not just the landing page. Guests remember whose work it is.",
    icon: "Stamp",
    category: "brand",
  },
];

export default function FeatureSection({ features = [] }: { features?: Feature[] }) {
  const reduced = useReducedMotion();

  const items: Highlight[] = features.length > 0 ? features : FALLBACK;

  const fadeUp = (delay = 0) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.5, ease: "easeOut" as const, delay },
        };

  return (
    <section
      id="features"
      style={{
        padding: "clamp(72px, 12vh, 128px) 0",
        background: "var(--color-surface)",
        borderTop: "1px solid var(--color-line)",
        borderBottom: "1px solid var(--color-line)",
      }}
    >
      <div className="mx-auto" style={{ maxWidth: "var(--max-w)", padding: "0 var(--gutter)" }}>
        <motion.header
          {...fadeUp(0)}
          className="flex max-w-[640px] flex-col gap-4"
          style={{ marginBottom: "clamp(40px, 6vh, 60px)" }}
        >
          <Eyebrow>What the product does</Eyebrow>
          <h2
            className="font-extrabold"
            style={{
              fontSize: "clamp(1.9rem, 3.6vw, 2.9rem)",
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              color: "var(--color-primary)",
            }}
          >
            The part everyone dreads, handled for you.
          </h2>
        </motion.header>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ name, description, icon, category }, i) => (
            <motion.article
              key={name}
              {...fadeUp(0.05 + i * 0.06)}
              className="flex flex-col items-start gap-3 rounded-2xl transition-all duration-300 hover:-translate-y-1"
              style={{
                padding: "30px 26px 32px",
                background: "var(--color-bg)",
                border: "1px solid var(--color-line)",
              }}
            >
              <span
                className="mb-1 inline-flex h-[46px] w-[46px] items-center justify-center rounded-xl"
                style={{
                  background: "var(--color-accent-soft)",
                  color: "var(--color-accent)",
                }}
                aria-hidden
              >
                <FeatureIcon name={icon} size={24} />
              </span>
              <span
                className="text-[11px] font-bold uppercase tracking-[0.06em]"
                style={{ color: "var(--color-accent)" }}
              >
                {CATEGORY_LABELS[category]}
              </span>
              <h3
                className="font-bold"
                style={{
                  fontSize: "1.14rem",
                  lineHeight: 1.25,
                  letterSpacing: "-0.02em",
                  color: "var(--color-primary)",
                }}
              >
                {name}
              </h3>
              <p className="text-[15px]" style={{ lineHeight: 1.6, color: "var(--color-muted)" }}>
                {description}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
