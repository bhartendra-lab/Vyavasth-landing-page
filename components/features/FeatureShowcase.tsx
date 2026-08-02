"use client";

import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import Eyebrow from "@/components/Eyebrow";
import FeatureIcon from "@/components/features/FeatureIcon";
import { allIncludedInEveryPlan, sortFeatures, type Feature } from "@/lib/features";

// Static fallback, the four highlight features, shown verbatim when the
// catalog fetch fails or comes back empty. The pricing page must never look
// broken because /features timed out. Keep in sync with the seed's highlights.
const FALLBACK_FEATURES: Array<Pick<Feature, "name" | "description" | "icon">> = [
  {
    name: "AI Face Search",
    description:
      "Guests take one selfie and see only the photos they appear in. No scrolling through four thousand frames, and nobody has to ask the studio to find them.",
    icon: "ScanFace",
  },
  {
    name: "Live Delivery",
    description:
      "Photos travel straight from the camera over FTP and reach registered guests while the event is still running. The gallery is live before the function ends.",
    icon: "Zap",
  },
  {
    name: "Smart Filters & One-Click Locate",
    description:
      "Sort a gallery by family member, most-liked, or the bride-and-groom pairing, then jump from any frame to its original or RAW file in a single click.",
    icon: "SlidersHorizontal",
  },
  {
    name: "Studio Branding & Watermark",
    description:
      "Your logo, colours and watermark carry through the entire gallery, not just the landing page. Guests remember whose work it is.",
    icon: "Stamp",
  },
];

function Row({
  index,
  name,
  description,
  icon,
}: {
  index: number;
  name: string;
  description: string;
  icon?: string | null;
}) {
  return (
    <div className="flex items-start gap-4 py-5">
      <span
        className="feature-num shrink-0 pt-0.5 text-[15px] font-bold tabular-nums"
        style={{ color: "var(--color-accent)" }}
        aria-hidden
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <span
        className="feature-icon-tile inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
        aria-hidden
      >
        <FeatureIcon name={icon} size={18} />
      </span>
      <div className="flex flex-col gap-1">
        <h3
          className="font-bold"
          style={{ fontSize: "1.05rem", lineHeight: 1.3, color: "var(--color-primary)" }}
        >
          {name}
        </h3>
        <p className="text-[15px]" style={{ lineHeight: 1.6, color: "var(--color-muted)" }}>
          {description}
        </p>
      </div>
    </div>
  );
}

export default function FeatureShowcase({ features }: { features: Feature[] }) {
  const reduced = useReducedMotion();
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    // Pointer-only lift: gate the framer whileHover so touch devices never
    // trigger a hover transform. The CSS colour/number hover is gated the same
    // way in globals.css via @media (hover: hover) and (pointer: fine).
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const sorted = sortFeatures(features);
  const usingFallback = sorted.length === 0;
  const rows: Array<Pick<Feature, "name" | "description" | "icon">> = usingFallback
    ? FALLBACK_FEATURES
    : sorted;

  const showBanner = allIncludedInEveryPlan(features);

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.05, delayChildren: 0.05 } },
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
  };

  return (
    <section style={{ padding: "clamp(56px, 9vh, 104px) 0" }}>
      <div
        className="mx-auto flex flex-col gap-8"
        style={{ maxWidth: "var(--max-w)", padding: "0 var(--gutter)" }}
      >
        <div className="flex max-w-[640px] flex-col gap-4">
          <Eyebrow>What&apos;s included</Eyebrow>
          <h2
            className="font-extrabold"
            style={{
              fontSize: "clamp(1.9rem, 3.6vw, 2.6rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              color: "var(--color-primary)",
            }}
          >
            Everything the product does, on every plan.
          </h2>
        </div>

        {showBanner && (
          <div
            className="rounded-r-lg"
            style={{
              background: "var(--color-surface-2)",
              borderLeft: "3px solid var(--color-accent)",
              padding: "16px 20px",
            }}
          >
            <p
              className="text-[15px]"
              style={{ lineHeight: 1.6, color: "var(--color-primary)" }}
            >
              <strong className="font-bold">Every feature, every plan.</strong> Nothing below
              is held back for a higher tier. Free, pay-per-event and storage plans all ship
              the complete product.
            </p>
          </div>
        )}

        {reduced ? (
          <ul
            aria-label="Included features"
            style={{ borderBottom: "1px solid var(--color-line)" }}
            className="grid grid-cols-1 md:grid-cols-2 md:gap-x-10"
          >
            {rows.map((f, i) => (
              <li
                key={f.name}
                className="feature-row"
                style={{ borderTop: "1px solid var(--color-line)" }}
              >
                <Row index={i} name={f.name} description={f.description} icon={f.icon} />
              </li>
            ))}
          </ul>
        ) : (
          <motion.ul
            aria-label="Included features"
            variants={container}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            style={{ borderBottom: "1px solid var(--color-line)" }}
            className="grid grid-cols-1 md:grid-cols-2 md:gap-x-10"
          >
            {rows.map((f, i) => (
              <motion.li
                key={f.name}
                variants={item}
                whileHover={
                  canHover
                    ? { y: -2, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } }
                    : undefined
                }
                className="feature-row"
                style={{ borderTop: "1px solid var(--color-line)" }}
              >
                <Row index={i} name={f.name} description={f.description} icon={f.icon} />
              </motion.li>
            ))}
          </motion.ul>
        )}
      </div>
    </section>
  );
}
