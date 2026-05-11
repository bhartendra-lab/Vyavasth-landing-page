"use client";

import { Star } from "lucide-react";

/** Grayscale wordmark placeholders — swap for SVG logos in `public/logos/` when ready */
const LOGO_LABELS = [
  "Kamal Studios",
  "Silverline Weddings",
  "The Wedding Archive",
  "Studio Twelve",
  "House of Still",
];

export default function HeroTrustStrip() {
  const duplicated = [...LOGO_LABELS, ...LOGO_LABELS];

  return (
    <div className="flex flex-col lg:flex-row lg:items-center gap-8 lg:gap-10 w-full">
      {/* Rating + trust copy */}
      <div className="flex gap-4 shrink-0 lg:max-w-[min(100%,280px)]">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white"
          style={{ backgroundColor: "#F59E0B" }}
          aria-hidden
        >
          V
        </div>
        <div className="flex flex-col gap-1 text-left">
          <div className="flex flex-wrap items-center gap-1.5">
            {[0, 1, 2, 3, 4].map((i) => (
              <Star
                key={i}
                size={16}
                className="shrink-0"
                fill="#F59E0B"
                stroke="#F59E0B"
                aria-hidden
              />
            ))}
            <span
              className="ml-1 text-sm font-semibold tabular-nums"
              style={{ color: "#4F46E5", fontFamily: "var(--font-dm-sans)" }}
            >
              4.8 / 5
            </span>
          </div>
          <p
            className="text-[13px] font-semibold leading-snug sm:text-sm"
            style={{
              color: "#1A1208",
              fontFamily: "var(--font-syne)",
            }}
          >
            Trusted by photography &amp; video studios across India
          </p>
        </div>
      </div>

      {/* Marquee — decorative; partner names are illustrative */}
      <div
        className="relative min-h-[52px] flex-1 min-w-0 overflow-hidden"
        aria-hidden
      >
        <div
          className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-12 sm:w-20"
          style={{
            background:
              "linear-gradient(to right, #FAF8F5 0%, transparent 100%)",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-12 sm:w-20"
          style={{
            background:
              "linear-gradient(to left, #FAF8F5 0%, transparent 100%)",
          }}
          aria-hidden
        />

        <div className="flex overflow-hidden py-2">
          <div className="hero-marquee-track flex items-center gap-10 sm:gap-14 pr-10 sm:pr-14">
            {duplicated.map((label, i) => (
              <span
                key={`${label}-${i}`}
                className="whitespace-nowrap text-sm font-semibold uppercase tracking-[0.15em] select-none"
                style={{
                  color: "#B8B2A8",
                  fontFamily: "var(--font-dm-sans)",
                  letterSpacing: "0.12em",
                }}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
