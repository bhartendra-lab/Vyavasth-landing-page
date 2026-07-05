"use client";

import { motion, useReducedMotion } from "framer-motion";
import Eyebrow from "@/components/Eyebrow";

const POINTS = [
  {
    title: "Runs the business side",
    body: "Leads, bookings and payments — the parts of the studio that usually live in a dozen chats — handled in one place.",
  },
  {
    title: "Cuts the manual work",
    body: "Original Match ends folder-hunting. Smart Selects ends the curation grind. The dreaded parts of the job get quieter.",
  },
  {
    title: "Made for India",
    body: "Built hand-in-hand with studios across India — shaped for the way events, guests and celebrations actually run here. 🙏",
  },
];

export default function WhySection() {
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
      id="why"
      style={{
        padding: "clamp(80px, 13vh, 140px) 0",
        background: "var(--color-primary)",
        color: "var(--color-bg)",
      }}
    >
      <div
        className="mx-auto grid grid-cols-1 items-start gap-9 min-[901px]:grid-cols-[0.9fr_1.1fr] min-[901px]:gap-[clamp(36px,5vw,72px)]"
        style={{ maxWidth: "var(--max-w)", padding: "0 var(--gutter)" }}
      >
        <motion.div {...fadeUp(0)}>
          <Eyebrow light>Why Vyavasth</Eyebrow>
          <h2
            className="mt-4 font-extrabold text-white"
            style={{
              fontSize: "clamp(1.9rem, 3.4vw, 2.8rem)",
              lineHeight: 1.12,
              letterSpacing: "-0.03em",
            }}
          >
            One product for the whole studio — not one more tool to juggle.
          </h2>
        </motion.div>

        <div className="flex flex-col gap-7">
          {POINTS.map((p, i) => (
            <motion.div
              key={p.title}
              {...fadeUp(0.08 + i * 0.08)}
              className="pl-5"
              style={{ borderLeft: "2px solid var(--color-accent)" }}
            >
              <h3
                className="mb-2 font-bold text-white"
                style={{ fontSize: "1.16rem", letterSpacing: "-0.02em" }}
              >
                {p.title}
              </h3>
              <p
                className="max-w-[460px] text-[15.5px]"
                style={{
                  lineHeight: 1.65,
                  color: "rgba(245, 237, 224, 0.72)",
                }}
              >
                {p.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
