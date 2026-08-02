"use client";

import { useEnquiry } from "@/components/EnquiryProvider";

/** §9.2 — getPlans() failed server-side. The rest of the page still renders;
 *  this is a quiet fallback, never a blank page. */
export default function PricingErrorFallback() {
  const { openEnquiry } = useEnquiry();

  return (
    <section style={{ padding: "24px 0 96px" }}>
      <div className="mx-auto" style={{ maxWidth: "var(--max-w)", padding: "0 var(--gutter)" }}>
        <div
          className="flex flex-col items-start gap-4 rounded-2xl p-8"
          style={{ background: "var(--color-surface)", border: "1px solid var(--color-line)" }}
        >
          <p className="text-lg font-semibold" style={{ color: "var(--color-primary)" }}>
            We&apos;re having trouble loading prices right now.
          </p>
          <button
            type="button"
            onClick={openEnquiry}
            className="inline-flex min-h-11 items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-deep)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/50"
            style={{ background: "var(--color-accent)" }}
          >
            Book a demo
          </button>
        </div>
      </div>
    </section>
  );
}
