"use client";

import { motion, useReducedMotion } from "framer-motion";
import Eyebrow from "@/components/Eyebrow";

// Every claim here is verified against the delivery app's billing behaviour
// (Appendix A of the implementation brief). Do not embellish beyond it.
const FACTS: Array<{ term: string; detail: string }> = [
  {
    term: "GST is included",
    detail:
      "Every price shown is the price you pay. Your invoice breaks the tax out separately.",
  },
  {
    term: "Proper GST invoices",
    detail:
      "Add your GSTIN and billing address once; every payment produces a numbered invoice with CGST/SGST or IGST split by place of supply, downloadable as a PDF.",
  },
  {
    term: "Payments run on Razorpay",
    detail: "Cards, UPI, netbanking. Storage plans use an auto-renewing mandate.",
  },
  {
    term: "Upgrades are prorated",
    detail:
      "Move up a storage tier or from monthly to yearly and you're charged only the difference for the remainder of your cycle. Downgrades take effect at your next renewal.",
  },
  {
    term: "Cancelling is not deleting",
    detail:
      "Auto-renew stops, you keep full access to the end of the period. After that the dashboard goes read-only and galleries are archived.",
  },
  {
    term: "You get warned first",
    detail:
      "Renewal reminders land 7, 5, 3 and 1 days before a charge. A failed payment opens a grace window, not an instant cut-off.",
  },
  {
    term: "Event credits never expire",
    detail:
      "They're cumulative: buy four, use one this month and three next year. Each event's 3-month validity starts when you create it, not when you buy it.",
  },
];

export default function BillingFacts() {
  const reduced = useReducedMotion();
  const fadeUp = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: "-60px" },
        transition: { duration: 0.5, ease: "easeOut" as const },
      };

  return (
    <section
      style={{
        padding: "clamp(56px, 9vh, 104px) 0",
        background: "var(--color-surface)",
        borderTop: "1px solid var(--color-line)",
        borderBottom: "1px solid var(--color-line)",
      }}
    >
      <motion.div
        {...fadeUp}
        className="mx-auto flex flex-col gap-8"
        style={{ maxWidth: "var(--max-w)", padding: "0 var(--gutter)" }}
      >
        <div className="flex max-w-[640px] flex-col gap-4">
          <Eyebrow>Billing, plainly</Eyebrow>
          <h2
            className="font-extrabold"
            style={{
              fontSize: "clamp(1.9rem, 3.6vw, 2.6rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              color: "var(--color-primary)",
            }}
          >
            How the money side works.
          </h2>
        </div>

        <dl className="grid grid-cols-1 gap-x-12 gap-y-7 md:grid-cols-2">
          {FACTS.map((fact) => (
            <div key={fact.term} className="flex flex-col gap-1.5">
              <dt className="font-bold" style={{ fontSize: "1rem", color: "var(--color-primary)" }}>
                {fact.term}
              </dt>
              <dd className="text-[15px]" style={{ lineHeight: 1.6, color: "var(--color-muted)" }}>
                {fact.detail}
              </dd>
            </div>
          ))}
        </dl>
      </motion.div>
    </section>
  );
}
