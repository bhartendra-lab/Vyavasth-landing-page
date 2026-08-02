"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Eyebrow from "@/components/Eyebrow";

const WORDS = [
  "Zero",
  "One",
  "Two",
  "Three",
  "Four",
  "Five",
  "Six",
  "Seven",
  "Eight",
  "Nine",
  "Ten",
];

function numberWord(n: number): string {
  return n >= 0 && n <= 10 ? WORDS[n] : String(n);
}

/**
 * Teaches the pricing model as three stages a studio grows through, not a
 * feature-by-feature tier table. Copy describes MECHANICS only; the one number
 * allowed here is the free plan's included-events count, read from the API via
 * `includedEvents`. Every rupee figure lives in the calculator below.
 */
export default function PricingExplainer({
  includedEvents,
}: {
  includedEvents?: number | null;
}) {
  const reduced = useReducedMotion();

  // The included-events count is the only quantity this section may state, and
  // it comes from the Free service (freePlanOf(plans).included_events).
  const freeCount = typeof includedEvents === "number" ? includedEvents : 2;

  const cards = [
    {
      stage: "Stage one",
      title: "Start free",
      body: `Unlimited storage for the first ${freeCount} events. Each event stays live for 3 months. The validity starts when you create the event. All features unlocked.`,
    },
    {
      stage: "Stage two",
      title: "Pay per event",
      body: "One-time payment per event, priced GST-inclusive. Events are cumulative and never expire, so a slow month costs you nothing. Best while you're delivering a handful of events a season.",
    },
    {
      stage: "Stage three",
      title: "Storage plan",
      body: "Monthly or yearly. Unlimited events with capped reusable storage. Best when you're delivering more than 5 events every week.",
    },
  ];

  const ladder = ["Free", "Per event", "Storage plan"];

  const cardMotion = (i: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true, margin: "-60px" },
          transition: { duration: 0.5, ease: "easeOut" as const, delay: 0.08 * i },
        };

  const ladderMotion = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 12 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-60px" },
        // Draws in after the third card's stagger (0.16s) has resolved.
        transition: { duration: 0.5, ease: "easeOut" as const, delay: 0.34 },
      };

  return (
    <section style={{ padding: "clamp(48px, 8vh, 88px) 0 clamp(24px, 4vh, 40px)" }}>
      <div
        className="mx-auto flex flex-col gap-10"
        style={{ maxWidth: "var(--max-w)", padding: "0 var(--gutter)" }}
      >
        <div className="flex max-w-[640px] flex-col gap-4">
          <Eyebrow>How pricing works</Eyebrow>
          <h2
            className="font-extrabold"
            style={{
              fontSize: "clamp(1.9rem, 3.6vw, 2.6rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              color: "var(--color-primary)",
            }}
          >
            Start free. Pay as you grow.
          </h2>
          <p className="text-[15px]" style={{ lineHeight: 1.6, color: "var(--color-muted)" }}>
            Three stages, in the order most studios move through them. Pick the one that
            matches how often you&apos;re delivering right now.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              {...cardMotion(i)}
              className="flex flex-col gap-3 rounded-2xl"
              style={{
                padding: "26px 24px 28px",
                background: "var(--color-surface)",
                border: "1px solid var(--color-line)",
              }}
            >
              <span
                className="text-[11px] font-bold uppercase tracking-[0.07em]"
                style={{ color: "var(--color-accent)" }}
              >
                {card.stage}
              </span>
              <h3
                className="font-bold"
                style={{
                  fontSize: "1.28rem",
                  lineHeight: 1.2,
                  letterSpacing: "-0.02em",
                  color: "var(--color-primary)",
                }}
              >
                {card.title}
              </h3>
              <p className="text-[15px]" style={{ lineHeight: 1.6, color: "var(--color-muted)" }}>
                {card.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
