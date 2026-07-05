"use client";

import { motion, useReducedMotion } from "framer-motion";
import { FolderSearch, Heart, Images, Send } from "lucide-react";
import Eyebrow from "@/components/Eyebrow";

const FEATURES = [
  {
    Icon: Images,
    tag: "AI Galleries",
    title: "Guests find their own photos",
    body: "Share one link. Each guest takes a quick selfie and instantly sees only the photos they are in — no scrolling through thousands of pictures.",
  },
  {
    Icon: Heart,
    tag: "Smart Selects",
    title: "Your best shots rise to the top",
    body: "Vyavasth learns which photos guests love and puts your strongest work first — so you are not sorting through everything by hand.",
  },
  {
    Icon: FolderSearch,
    tag: "Original Match",
    title: "The full-quality original, found for you",
    body: "Tap any photo a guest liked and Vyavasth pulls up its full-resolution original on its own — no digging through folders or Drive links.",
  },
  {
    Icon: Send,
    tag: "Live Delivery",
    title: "Photos delivered the same night",
    body: "Guests get their gallery while the event is still on — the weeks-long wait people are used to simply disappears.",
  },
];

export default function FeatureSection() {
  const reduced = useReducedMotion();

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
          <Eyebrow>Features, in plain words</Eyebrow>
          <h2
            className="font-extrabold"
            style={{
              fontSize: "clamp(1.9rem, 3.6vw, 2.9rem)",
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              color: "var(--color-primary)",
            }}
          >
            The hard parts of the job — handled for you.
          </h2>
        </motion.header>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map(({ Icon, tag, title, body }, i) => (
            <motion.article
              key={tag}
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
                <Icon size={24} strokeWidth={1.7} />
              </span>
              <span
                className="text-[11px] font-bold uppercase tracking-[0.06em]"
                style={{ color: "var(--color-accent)" }}
              >
                {tag}
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
                {title}
              </h3>
              <p
                className="text-[15px]"
                style={{ lineHeight: 1.6, color: "var(--color-muted)" }}
              >
                {body}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
