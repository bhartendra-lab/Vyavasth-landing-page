"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  FileSpreadsheet,
  Inbox,
  MessageCircle,
  MessagesSquare,
  UsersRound,
} from "lucide-react";

function UnifiedWorkflowMockup() {
  const stages = ["Inquiry", "Follow-up", "Booked", "Deliver"];
  return (
    <div
      className="relative rounded-2xl"
      style={{
        background: "#FFFFFF",
        border: "1px solid rgba(26,18,8,0.08)",
      }}
    >
      <div className="relative grid grid-cols-1 md:grid-cols-2 overflow-hidden rounded-2xl">
        {/* Before — fragmented */}
        <div
          className="p-5 md:p-6 flex flex-col gap-4 md:border-r border-b-0 md:border-b-0 min-h-[280px] md:min-h-0"
          style={{ borderColor: "rgba(26,18,8,0.07)" }}
        >
          <span
            className="self-start text-xs px-2.5 py-1 rounded-full font-medium"
            style={{
              background: "rgba(239,68,68,0.08)",
              color: "#DC2626",
              border: "1px solid rgba(239,68,68,0.18)",
            }}
          >
            Tools everywhere
          </span>
          <p
            className="text-xs font-medium uppercase tracking-wide"
            style={{ color: "#7A6F63", fontFamily: "var(--font-dm-sans)" }}
          >
            Typical day
          </p>
          <div className="flex flex-col gap-2.5">
            <div
              className="rounded-xl px-3 py-2.5 flex items-center gap-3"
              style={{
                background: "#F2EFE9",
                border: "1px solid rgba(26,18,8,0.06)",
              }}
            >
              <MessageCircle size={16} style={{ color: "#7A6F63" }} />
              <span className="text-xs" style={{ color: "#1A1208" }}>
                14 WhatsApp threads · 6 still unanswered
              </span>
            </div>
            <div
              className="rounded-xl px-3 py-2.5 flex items-center gap-3"
              style={{
                background: "#F2EFE9",
                border: "1px solid rgba(26,18,8,0.06)",
              }}
            >
              <FileSpreadsheet size={16} style={{ color: "#7A6F63" }} />
              <span className="text-xs" style={{ color: "#1A1208" }}>
                Bookings_master.xlsx · crew list on paper
              </span>
            </div>
            <div
              className="rounded-xl px-3 py-2.5 flex items-center gap-3"
              style={{
                background: "#F2EFE9",
                border: "1px solid rgba(26,18,8,0.06)",
              }}
            >
              <span className="text-xs font-medium" style={{ color: "#DC2626" }}>
                ?
              </span>
              <span className="text-xs" style={{ color: "#1A1208" }}>
                Which inquiry was &quot;call back Tuesday&quot;?
              </span>
            </div>
          </div>
          <span
            className="text-[11px] mt-auto pt-2 text-center md:text-left font-medium"
            style={{ color: "#DC2626" }}
          >
            Nothing talks to anything else.
          </span>
        </div>

        {/* Mobile-only arrow between panels */}
        <div
          className="md:hidden flex justify-center py-2 border-y"
          style={{ borderColor: "rgba(26,18,8,0.07)", background: "#FAF8F5" }}
          aria-hidden
        >
          <ArrowRight
            size={16}
            style={{ color: "#7A6F63", transform: "rotate(90deg)" }}
          />
        </div>

        {/* After — Vyavasth */}
        <div className="p-5 md:p-6 flex flex-col gap-4 min-h-[280px] md:min-h-0">
          <span
            className="self-start text-xs px-2.5 py-1 rounded-full font-medium"
            style={{
              background: "rgba(22,163,74,0.08)",
              color: "#16A34A",
              border: "1px solid rgba(22,163,74,0.18)",
            }}
          >
            On Vyavasth
          </span>
          <p
            className="text-xs font-medium uppercase tracking-wide"
            style={{ color: "#7A6F63", fontFamily: "var(--font-dm-sans)" }}
          >
            Same studio · one flow
          </p>
          {/* Mini pipeline */}
          <div className="flex flex-wrap gap-1.5 items-center">
            {stages.map((label, i) => (
              <div key={label} className="flex items-center gap-1.5">
                <span
                  className="text-[10px] px-2 py-1 rounded-md font-medium"
                  style={{
                    background:
                      i === 0
                        ? "rgba(79,70,229,0.12)"
                        : "rgba(26,18,8,0.05)",
                    color: i === 0 ? "#4F46E5" : "#7A6F63",
                    border: `1px solid ${
                      i === 0
                        ? "rgba(79,70,229,0.2)"
                        : "rgba(26,18,8,0.07)"
                    }`,
                  }}
                >
                  {label}
                </span>
                {i < stages.length - 1 && (
                  <span style={{ color: "#D4CFC9", fontSize: "10px" }}>→</span>
                )}
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-2.5">
            <div
              className="rounded-xl px-3 py-2.5 flex items-start gap-3"
              style={{
                background: "rgba(79,70,229,0.06)",
                border: "1px solid rgba(79,70,229,0.12)",
              }}
            >
              <MessagesSquare size={16} className="shrink-0 mt-0.5" style={{ color: "#4F46E5" }} />
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-medium" style={{ color: "#1A1208" }}>
                  Follow-up queued · Meera · wedding enquiry
                </span>
                <span className="text-[11px]" style={{ color: "#7A6F63" }}>
                  Sends tomorrow 10 AM · template saved
                </span>
              </div>
            </div>
            <div
              className="rounded-xl px-3 py-2.5 flex items-center gap-3"
              style={{
                background: "#F2EFE9",
                border: "1px solid rgba(26,18,8,0.06)",
              }}
            >
              <UsersRound size={16} style={{ color: "#7A6F63" }} />
              <span className="text-xs" style={{ color: "#1A1208" }}>
                Crew · Rahul · Sangeet · Sat 6 PM · deliverables tracked
              </span>
            </div>
          </div>
          <span
            className="text-[11px] mt-auto pt-2 text-center md:text-left font-medium"
            style={{ color: "#16A34A" }}
          >
            One workspace · everyone sees the same truth.
          </span>
        </div>
      </div>

      {/* Center arrow — desktop only */}
      <div
        className="hidden md:flex pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
        aria-hidden
      >
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center"
          style={{
            background: "#FAF8F5",
            border: "1px solid rgba(26,18,8,0.10)",
            boxShadow: "0 2px 8px rgba(26,18,8,0.06)",
          }}
        >
          <ArrowRight size={16} style={{ color: "#7A6F63" }} />
        </div>
      </div>
    </div>
  );
}

const supportingPoints = [
  {
    icon: Inbox,
    title: "Leads & CRM in one inbox",
    body: "Inquiries land in one place — so you know who to call back first before they book someone else.",
  },
  {
    icon: MessagesSquare,
    title: "WhatsApp workflows that keep moving",
    body: "Saved replies and scheduled nudges — follow-ups don’t die when you’re on a shoot all day.",
  },
  {
    icon: UsersRound,
    title: "Crew, deliverables & money together",
    body: "Assignments, what’s delivered, and what’s earned vs pending — without midnight spreadsheet detective work.",
  },
];

export default function FeatureSection() {
  const reduced = useReducedMotion();

  return (
    <section
      id="feature"
      className="relative py-24 overflow-hidden"
      style={{ background: "#FAF8F5" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(79,70,229,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        <motion.p
          initial={reduced ? {} : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="text-center uppercase tracking-[0.12em] text-xs font-medium mb-4"
          style={{ color: "#7A6F63", fontFamily: "var(--font-dm-sans)" }}
        >
          How It Works
        </motion.p>

        <motion.h2
          initial={reduced ? {} : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="text-center mb-4"
          style={{
            fontFamily: "var(--font-syne)",
            fontWeight: 700,
            fontSize: "clamp(30px, 4vw, 40px)",
            color: "#1A1208",
            letterSpacing: "-0.02em",
          }}
        >
          One Place to Run the Studio.
          <br />
          Automations That Keep Things Moving.
        </motion.h2>

        <motion.p
          initial={reduced ? {} : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center max-w-2xl mx-auto mb-14"
          style={{
            fontSize: "17px",
            lineHeight: "1.65",
            color: "#7A6F63",
            fontFamily: "var(--font-dm-sans)",
          }}
        >
          Vyavasth connects leads, WhatsApp, crew jobs, deliverables, and your
          numbers in one workflow — so day-to-day operations stay visible and the
          repetitive follow-up work scales down.
        </motion.p>

        <motion.div
          initial={reduced ? {} : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="relative mx-auto mb-14"
          style={{
            maxWidth: "820px",
            filter: "drop-shadow(0 8px 40px rgba(26,18,8,0.08))",
          }}
        >
          <UnifiedWorkflowMockup />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {supportingPoints.map((pt, i) => {
            const Icon = pt.icon;
            return (
              <motion.div
                key={pt.title}
                initial={reduced ? {} : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex flex-col items-center text-center gap-2.5"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(79,70,229,0.08)" }}
                >
                  <Icon size={18} style={{ color: "#4F46E5" }} strokeWidth={1.8} />
                </div>
                <p
                  className="font-semibold text-sm"
                  style={{
                    fontFamily: "var(--font-syne)",
                    color: "#1A1208",
                  }}
                >
                  {pt.title}
                </p>
                <p
                  className="text-sm"
                  style={{
                    color: "#7A6F63",
                    fontFamily: "var(--font-dm-sans)",
                    lineHeight: "1.5",
                  }}
                >
                  {pt.body}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
