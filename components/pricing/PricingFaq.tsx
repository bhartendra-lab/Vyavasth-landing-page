"use client";

import { motion, useReducedMotion } from "framer-motion";
import Eyebrow from "@/components/Eyebrow";
import { PRICING_FAQS } from "./pricing-faqs";

export default function PricingFaq() {
  const reduced = useReducedMotion();
  const fadeUp = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 18 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true },
        transition: { duration: 0.5, ease: "easeOut" as const },
      };

  return (
    <section style={{ padding: "clamp(64px, 10vh, 112px) 0" }}>
      <div
        className="mx-auto flex flex-col gap-8"
        style={{ maxWidth: 760, padding: "0 var(--gutter)" }}
      >
        <motion.div {...fadeUp} className="flex flex-col gap-4">
          <Eyebrow>Questions</Eyebrow>
          <h2
            className="font-extrabold"
            style={{
              fontSize: "clamp(1.9rem, 3.6vw, 2.6rem)",
              lineHeight: 1.1,
              letterSpacing: "-0.03em",
              color: "var(--color-primary)",
            }}
          >
            Pricing, plainly explained.
          </h2>
        </motion.div>

        <div className="flex flex-col">
          {PRICING_FAQS.map((item, i) => (
            <motion.div
              key={item.q}
              {...fadeUp}
              transition={{ duration: 0.5, ease: "easeOut" as const, delay: reduced ? 0 : 0.04 * i }}
              className="py-6"
              style={{ borderTop: i === 0 ? "none" : "1px solid var(--color-line)" }}
            >
              <h3
                className="font-bold"
                style={{ fontSize: "1.05rem", color: "var(--color-primary)" }}
              >
                {item.q}
              </h3>
              <p className="mt-2 text-[15px]" style={{ lineHeight: 1.6, color: "var(--color-muted)" }}>
                {item.a}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
