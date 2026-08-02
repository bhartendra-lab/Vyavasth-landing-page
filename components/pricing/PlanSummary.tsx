"use client";

import { Check } from "lucide-react";

export default function PlanSummary({
  title,
  priceLine,
  subLine,
  subNote,
  features,
  ctaHref,
  ctaLabel,
  ctaDisabled,
  footnote,
  movedNote,
}: {
  title: string;
  priceLine: string;
  subLine: string;
  subNote?: string | null;
  features: string[];
  ctaHref: string | null;
  ctaLabel: string;
  ctaDisabled?: boolean;
  footnote?: string;
  movedNote?: string | null;
}) {
  return (
    <div className="flex flex-col gap-5">
      {movedNote && (
        <p className="text-xs" style={{ color: "var(--color-muted)" }} aria-live="polite">
          {movedNote}
        </p>
      )}

      <div>
        <p
          className="text-xs font-bold uppercase tracking-[0.06em]"
          style={{ color: "var(--color-accent)" }}
        >
          {title}
        </p>
        <p
          aria-live="polite"
          className="mt-1 font-extrabold tabular-nums transition-opacity duration-150"
          style={{ fontSize: "clamp(2rem, 4vw, 2.6rem)", lineHeight: 1.1, color: "var(--color-primary)" }}
        >
          {priceLine}
        </p>
        <p className="mt-1 text-sm" style={{ color: "var(--color-muted)" }}>
          {subLine}
        </p>
        {subNote && (
          <p className="text-sm" style={{ color: "var(--color-muted)" }}>
            {subNote}
          </p>
        )}
      </div>

      {features.length > 0 && (
        <ul className="flex flex-col gap-2">
          {features.map((f) => (
            <li key={f} className="flex items-start gap-2 text-sm" style={{ color: "var(--color-primary)" }}>
              <Check size={16} className="mt-0.5 shrink-0" style={{ color: "var(--color-accent)" }} aria-hidden />
              {f}
            </li>
          ))}
        </ul>
      )}

      {ctaHref && !ctaDisabled ? (
        <a
          href={ctaHref}
          className="inline-flex min-h-11 items-center justify-center rounded-full px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-deep)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/50"
          style={{ background: "var(--color-accent)" }}
        >
          {ctaLabel}
        </a>
      ) : (
        <button
          type="button"
          disabled
          className="inline-flex min-h-11 cursor-not-allowed items-center justify-center rounded-full px-6 py-3 text-sm font-semibold"
          style={{ background: "var(--color-surface-2)", color: "var(--color-faint)" }}
        >
          {ctaLabel}
        </button>
      )}

      {footnote && (
        <p className="text-xs" style={{ color: "var(--color-muted)", lineHeight: 1.5 }}>
          {footnote}
        </p>
      )}
    </div>
  );
}
