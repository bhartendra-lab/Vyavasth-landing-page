"use client";

import { ArrowRight } from "lucide-react";
import { useEnquiry } from "@/components/EnquiryProvider";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://deliver.vyavasth.in";

/**
 * The pricing header's dual CTA. The primary button copies Hero.tsx's treatment
 * exactly so the two pages read as one product. Client component because the
 * secondary opens the shared enquiry modal.
 */
export default function PricingHeaderCta() {
  const { openEnquiry } = useEnquiry();

  return (
    <div className="mt-2 flex w-full flex-col gap-3.5 sm:w-auto sm:flex-row">
      <a
        href={`${APP_URL}/login`}
        className="group inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-4 text-[15px] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-accent-deep)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/50"
        style={{
          background: "var(--color-accent)",
          boxShadow: "0 6px 18px rgba(194, 90, 58, 0.28)",
        }}
      >
        Get Started
        <ArrowRight
          size={18}
          className="transition-transform duration-200 group-hover:translate-x-1"
        />
      </a>
      <button
        type="button"
        onClick={openEnquiry}
        className="inline-flex items-center justify-center gap-2.5 rounded-full px-7 py-4 text-[15px] font-semibold transition-all duration-200 hover:bg-[var(--color-surface-2)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/50"
        style={{ border: "1px solid var(--color-line-strong)", color: "var(--color-primary)" }}
      >
        Book a demo
      </button>
    </div>
  );
}
