"use client";

import { ShieldCheck } from "lucide-react";

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
      {/* Trust copy (rating hidden for now) */}
      <div className="flex gap-4 shrink-0 lg:max-w-[min(100%,280px)]">
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full ring-2 ring-[#4F46E5]/15"
          style={{
            background: "linear-gradient(155deg, #FBBF24 0%, #F59E0B 45%, #D97706 100%)",
            boxShadow:
              "0 2px 10px rgba(245, 158, 11, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.35)",
          }}
          role="img"
          aria-label="Verified trust badge"
        >
          <ShieldCheck
            className="text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)]"
            size={22}
            strokeWidth={2.25}
            aria-hidden
          />
        </div>
        <div className="flex flex-col justify-center gap-1 text-left">
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
              "linear-gradient(to right, #FFF5E0 0%, transparent 100%)",
          }}
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-0 z-[1] w-12 sm:w-20"
          style={{
            background:
              "linear-gradient(to left, #FFF5E0 0%, transparent 100%)",
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
