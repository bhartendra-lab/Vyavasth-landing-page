"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Eyebrow from "@/components/Eyebrow";
import { useEnquiry } from "@/components/EnquiryProvider";
import { WHATSAPP_NUMBER } from "@/lib/site-legal";

export default function CtaSection() {
  const { openEnquiry } = useEnquiry();
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
      id="demo"
      style={{
        padding: "clamp(80px, 14vh, 150px) 0",
        background:
          "radial-gradient(circle at 50% 0%, rgba(194, 90, 58, 0.1) 0%, transparent 55%), var(--color-bg)",
      }}
    >
      <div
        className="mx-auto flex max-w-[640px] flex-col items-center gap-5 text-center"
        style={{ padding: "0 var(--gutter)" }}
      >
        <motion.div {...fadeUp(0)}>
          <Eyebrow>Get started</Eyebrow>
        </motion.div>
        <motion.h2
          {...fadeUp(0.05)}
          className="font-extrabold"
          style={{
            fontSize: "clamp(2.1rem, 5.2vw, 3.6rem)",
            lineHeight: 1.06,
            letterSpacing: "-0.035em",
            color: "var(--color-primary)",
          }}
        >
          Bring your studio into one place.
        </motion.h2>
        <motion.p
          {...fadeUp(0.1)}
          className="max-w-[500px]"
          style={{
            fontSize: "clamp(1rem, 1.4vw, 1.15rem)",
            lineHeight: 1.65,
            color: "var(--color-muted)",
          }}
        >
          See Vyavasth run on your own events — from the first lead to a
          gallery in your guests&apos; hands the same night. A 20-minute
          walkthrough, no setup needed.
        </motion.p>
        <motion.div
          {...fadeUp(0.15)}
          className="mt-2 flex w-full flex-col justify-center gap-3.5 sm:w-auto sm:flex-row"
        >
          <button
            type="button"
            onClick={openEnquiry}
            className="group inline-flex items-center justify-center gap-2.5 rounded-full px-8 py-4 text-base font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-accent-deep)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/50"
            style={{
              background: "var(--color-accent)",
              boxShadow: "0 6px 18px rgba(194, 90, 58, 0.28)",
            }}
          >
            Book a demo
            <ArrowRight
              size={18}
              className="transition-transform duration-200 group-hover:translate-x-1"
            />
          </button>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-full px-7 py-4 text-base font-semibold transition-colors hover:bg-[var(--color-surface-2)]"
            style={{
              border: "1px solid var(--color-line-strong)",
              color: "var(--color-primary)",
            }}
          >
            Talk on WhatsApp
          </a>
        </motion.div>
      </div>
    </section>
  );
}
