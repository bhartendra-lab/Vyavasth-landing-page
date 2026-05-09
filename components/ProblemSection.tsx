"use client";

import { motion, useReducedMotion } from "framer-motion";
import { MessageCircleOff, Clock, TrendingDown } from "lucide-react";

const problems = [
  {
    icon: MessageCircleOff,
    accentColor: "#F97316",
    title: "Inquiries Fall Through the Cracks",
    body: "You're on a shoot. Three people messaged asking about availability. By the time you check, two of them have already booked someone else. There's no system — just a WhatsApp thread you forgot to reply to.",
  },
  {
    icon: Clock,
    accentColor: "#EF4444",
    title: "You Deliver First, Chase Payment Later",
    body: "You spend 40 hours editing. You send the Google Drive link. Client downloads everything. Now begins the follow-up — two weeks of 'payment kal tak ho jayega.' The work is done but the money isn't in.",
  },
  {
    icon: TrendingDown,
    accentColor: "#F59E0B",
    title: "Five Months of Silence After Wedding Season",
    body: "November to February is packed. March onwards — the bookings dry up but the EMIs don't. No retainer clients, no recurring income, no system to fill the calendar during off-season.",
  },
];

export default function ProblemSection() {
  const reduced = useReducedMotion();

  const cardVariant = (i: number) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 24 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.5, ease: "easeOut" as const, delay: i * 0.1 },
        };

  return (
    <section
      id="problem"
      className="py-24"
      style={{ background: "#F2EFE9" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Eyebrow */}
        <motion.p
          initial={reduced ? {} : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mb-4 text-center uppercase tracking-[0.12em] text-xs font-medium"
          style={{ color: "#7A6F63", fontFamily: "var(--font-dm-sans)" }}
        >
          The Problem
        </motion.p>

        {/* Headline */}
        <motion.h2
          initial={reduced ? {} : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-center mb-14"
          style={{
            fontFamily: "var(--font-syne)",
            fontWeight: 700,
            fontSize: "clamp(30px, 4vw, 40px)",
            color: "#1A1208",
            letterSpacing: "-0.02em",
          }}
        >
          Every Studio Faces the Same Three Problems.
        </motion.h2>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {problems.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                {...cardVariant(i)}
                className="rounded-2xl p-6 flex flex-col gap-4"
                style={{
                  background: "#FFFFFF",
                  border: `1px solid rgba(26,18,8,0.07)`,
                  borderLeftWidth: "4px",
                  borderLeftColor: p.accentColor,
                }}
              >
                <Icon
                  size={22}
                  style={{ color: p.accentColor }}
                  strokeWidth={1.8}
                />
                <h3
                  className="font-semibold leading-snug"
                  style={{
                    fontFamily: "var(--font-syne)",
                    color: "#1A1208",
                    fontSize: "16px",
                  }}
                >
                  {p.title}
                </h3>
                <p
                  style={{
                    color: "#7A6F63",
                    fontSize: "15px",
                    lineHeight: "1.65",
                    fontFamily: "var(--font-dm-sans)",
                  }}
                >
                  {p.body}
                </p>
              </motion.div>
            );
          })}
        </div>

        {/* Divider + closing line */}
        <motion.div
          initial={reduced ? {} : { opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-14"
        >
          <div
            className="w-full mb-8"
            style={{ borderTop: "1px solid rgba(26,18,8,0.08)" }}
          />
          <p
            className="text-center"
            style={{
              color: "#7A6F63",
              fontSize: "16px",
              fontFamily: "var(--font-dm-sans)",
            }}
          >
            Vyavasth is built to fix{" "}
            <span
              className="font-medium"
              style={{
                color: "#1A1208",
                borderBottom: "2px solid #4F46E5",
                paddingBottom: "1px",
              }}
            >
              all three
            </span>
            .
          </p>
        </motion.div>
      </div>
    </section>
  );
}
