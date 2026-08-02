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
          <Eyebrow>The part that breaks</Eyebrow>
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
          A wedding ends and the real work starts:{" "}
          <span className="strike">4,000 photos</span>,{" "}
          <span className="strike">an expiring link</span>, and{" "}
          <span className="strike">forty people</span> asking for theirs.
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
          {`The gallery goes out weeks late, guests scroll past thousands of frames looking for themselves, and every "can you find the one where I'm with dadi?" comes back to you on WhatsApp. Vyavasth turns that into a link the family opens at the venue; each guest sees only their own photos, and every original stays one click from your team.`}
        </motion.p>
      </div>
    </section>
  );
}
