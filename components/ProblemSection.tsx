"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Layers, ListTodo, Wallet } from "lucide-react";

const problems = [
  {
    icon: Layers,
    accentColor: "#F97316",
    title: "Your Studio Runs on Too Many Tools",
    body: "Leads live in WhatsApp, bookings in your head, crew on calls, and money in a spreadsheet. Nothing talks to everything else — so you spend your day switching tabs instead of growing the studio.",
  },
  {
    icon: ListTodo,
    accentColor: "#EF4444",
    title: "Follow-Ups Slip When You're on a Shoot",
    body: "Estimates, reminders, and status updates stack up the moment you step on location. Without a clear workflow, warm inquiries cool down — not because you don't care, but because there's no system catching what you miss.",
  },
  {
    icon: Wallet,
    accentColor: "#F59E0B",
    title: "You Can't See What's Earned vs. What's Still Pending",
    body: "Advances, balances, expenses, and payouts sit in different chats and sheets. Closing the month feels like detective work instead of a five-minute check on how the business actually did.",
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
      className="py-16 md:py-24"
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
          className="text-center mb-8 md:mb-14"
          style={{
            fontFamily: "var(--font-syne)",
            fontWeight: 700,
            fontSize: "clamp(30px, 4vw, 40px)",
            color: "#1A1208",
            letterSpacing: "-0.02em",
          }}
        >
          Three Ways Chaos Creeps Into Your Studio.
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
          className="mt-8 md:mt-14"
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
