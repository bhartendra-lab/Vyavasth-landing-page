"use client";

import { motion, useReducedMotion } from "framer-motion";
import Eyebrow from "@/components/Eyebrow";

export default function ProblemSection() {
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
      style={{
        padding: "clamp(72px, 12vh, 128px) 0",
        background: "var(--color-bg)",
      }}
    >
      <div
        className="mx-auto flex max-w-[960px] flex-col gap-6"
        style={{ padding: "0 var(--gutter)" }}
      >
        <motion.div {...fadeUp(0)}>
          <Eyebrow>The everyday reality</Eyebrow>
        </motion.div>

        <motion.h2
          {...fadeUp(0.05)}
          className="font-extrabold"
          style={{
            fontSize: "clamp(1.9rem, 4.4vw, 3.4rem)",
            lineHeight: 1.1,
            letterSpacing: "-0.03em",
            color: "var(--color-primary)",
          }}
        >
          A studio&apos;s work is spread across{" "}
          <span className="strike">WhatsApp threads</span>,{" "}
          <span className="strike">spreadsheets</span>,{" "}
          <span className="strike">Drive links</span> and memory.
        </motion.h2>

        <motion.p
          {...fadeUp(0.1)}
          className="max-w-[680px]"
          style={{
            fontSize: "clamp(1.02rem, 1.5vw, 1.22rem)",
            lineHeight: 1.7,
            color: "var(--color-muted)",
          }}
        >
          Every lead, shoot, payment and photo lives somewhere different — and
          the handoff between them is manual. Vyavasth brings the whole studio
          into one place: one product for the business, and an AI gallery that
          delivers photos to guests during the event and finds the originals
          afterward — cutting out the work studios dread most.
        </motion.p>
      </div>
    </section>
  );
}
