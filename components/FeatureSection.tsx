"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Eye, Smartphone, Unlock, Lock, ArrowRight } from "lucide-react";

function PhotoGrid({ locked }: { locked: boolean }) {
  return (
    <div className="grid grid-cols-3 gap-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="relative rounded-lg overflow-hidden"
          style={{ aspectRatio: "4/3" }}
        >
          <div
            className="absolute inset-0"
            style={{
              background: locked
                ? "linear-gradient(135deg, #E8E3DC 0%, #D4CFC9 100%)"
                : `linear-gradient(135deg, hsl(${30 + i * 12}, 35%, 80%) 0%, hsl(${40 + i * 10}, 28%, 88%) 100%)`,
            }}
          />
          {locked && (
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ background: "rgba(26,18,8,0.12)" }}
            >
              <Lock size={14} style={{ color: "#7A6F63" }} strokeWidth={2} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

const supportingPoints = [
  {
    icon: Eye,
    title: "Watermarked Preview",
    body: "Client sees the quality before paying.",
  },
  {
    icon: Smartphone,
    title: "UPI + Card via Razorpay",
    body: "Payment in under 30 seconds.",
  },
  {
    icon: Unlock,
    title: "Instant Auto-Unlock",
    body: "No manual step needed from your end.",
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
      {/* Subtle indigo wash */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(79,70,229,0.04) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8">
        {/* Eyebrow */}
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

        {/* Headline */}
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
          Client Pays First.
          <br />
          Then the Photos Unlock.
        </motion.h2>

        {/* Subheadline */}
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
          Send your client a delivery link. They see a preview — five
          watermarked photos. The rest is locked. The moment UPI payment clears,
          the full gallery unlocks automatically. No awkward follow-ups. No
          &ldquo;I&rsquo;ll pay you tomorrow.&rdquo;
        </motion.p>

        {/* Split-screen mockup */}
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
          <div
            className="relative rounded-2xl overflow-hidden"
            style={{
              background: "#FFFFFF",
              border: "1px solid rgba(26,18,8,0.08)",
            }}
          >
            <div className="grid grid-cols-2">
              {/* Before panel */}
              <div
                className="p-5 flex flex-col gap-4"
                style={{
                  borderRight: "1px solid rgba(26,18,8,0.07)",
                }}
              >
                <span
                  className="self-start text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{
                    background: "rgba(239,68,68,0.08)",
                    color: "#DC2626",
                    border: "1px solid rgba(239,68,68,0.18)",
                  }}
                >
                  Before Payment
                </span>
                <PhotoGrid locked />
                <span
                  className="text-xs px-3 py-1.5 rounded-full text-center font-medium"
                  style={{
                    background: "rgba(239,68,68,0.07)",
                    color: "#DC2626",
                    border: "1px solid rgba(239,68,68,0.16)",
                  }}
                >
                  Payment Pending · ₹15,000 due
                </span>
              </div>

              {/* Divider with arrow */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    background: "#FAF8F5",
                    border: "1px solid rgba(26,18,8,0.10)",
                    boxShadow: "0 2px 8px rgba(26,18,8,0.06)",
                  }}
                >
                  <ArrowRight size={14} style={{ color: "#7A6F63" }} />
                </div>
              </div>

              {/* After panel */}
              <div className="p-5 flex flex-col gap-4">
                <span
                  className="self-start text-xs px-2.5 py-1 rounded-full font-medium"
                  style={{
                    background: "rgba(22,163,74,0.08)",
                    color: "#16A34A",
                    border: "1px solid rgba(22,163,74,0.18)",
                  }}
                >
                  After Payment
                </span>
                <PhotoGrid locked={false} />
                <span
                  className="text-xs px-3 py-1.5 rounded-full text-center font-medium"
                  style={{
                    background: "rgba(22,163,74,0.08)",
                    color: "#16A34A",
                    border: "1px solid rgba(22,163,74,0.18)",
                  }}
                >
                  Paid · Gallery Unlocked ✓
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Three supporting points */}
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
