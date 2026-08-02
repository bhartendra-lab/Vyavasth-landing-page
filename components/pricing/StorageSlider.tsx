"use client";

import { useId } from "react";
import type { StorageTier } from "@/lib/plans";
import { formatStorage, formatInr, planForTier } from "@/lib/plans";

type Interval = "monthly" | "yearly";

export default function StorageSlider({
  tiers,
  index,
  interval,
  onChange,
}: {
  tiers: StorageTier[];
  index: number;
  interval: Interval;
  onChange: (index: number) => void;
}) {
  const id = useId();
  const max = tiers.length - 1;
  const pct = max > 0 ? (index / max) * 100 : 0;
  const activePlan = planForTier(tiers[index], interval);
  const priceLabel = activePlan
    ? `${formatInr(activePlan.price ?? 0)} per ${interval === "monthly" ? "month" : "year"}`
    : `Not available on ${interval} billing`;

  return (
    <div className="flex flex-col gap-3">
      {/* Slider — tablet and up. Below 640px, tick labels collide, so mobile
          gets tappable chips instead (a slider you can't read is worse than
          a list). */}
      <div className="hidden sm:block">
        <div className="relative flex h-11 items-center">
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 right-0 h-1 rounded-full"
            style={{ background: "var(--color-line)" }}
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-0 h-1 rounded-full"
            style={{ background: "var(--color-accent)", width: `${pct}%` }}
          />
          <input
            type="range"
            min={0}
            max={max}
            step={1}
            value={index}
            onChange={(e) => onChange(Number(e.target.value))}
            aria-label="Storage plan"
            aria-valuetext={`${formatStorage(tiers[index].storage_limit)} — ${priceLabel}`}
            list={`${id}-tiers`}
            className="range-slider relative z-10"
          />
          <datalist id={`${id}-tiers`}>
            {tiers.map((_, i) => (
              <option key={i} value={i} />
            ))}
          </datalist>
        </div>
        <div className="relative mt-1 h-9">
          {tiers.map((t, i) => {
            const available = Boolean(planForTier(t, interval));
            const selected = i === index;
            return (
              <span
                key={t.storage_limit}
                className="absolute top-0 -translate-x-1/2 whitespace-nowrap text-center text-xs"
                style={{
                  left: `${max > 0 ? (i / max) * 100 : 50}%`,
                  color: !available
                    ? "var(--color-faint)"
                    : selected
                      ? "var(--color-primary)"
                      : "var(--color-muted)",
                  fontWeight: selected ? 700 : 500,
                  textDecoration: available ? "none" : "line-through",
                }}
              >
                {formatStorage(t.storage_limit)}
              </span>
            );
          })}
        </div>
      </div>

      {/* Chips — mobile only */}
      <div className="flex flex-wrap gap-2 sm:hidden" role="group" aria-label="Storage plan">
        {tiers.map((t, i) => {
          const available = Boolean(planForTier(t, interval));
          const selected = i === index;
          return (
            <button
              key={t.storage_limit}
              type="button"
              onClick={() => onChange(i)}
              className="min-h-11 rounded-full px-4 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/50"
              style={
                selected
                  ? { background: "var(--color-accent)", color: "#fff" }
                  : {
                      background: "var(--color-bg)",
                      color: available ? "var(--color-primary)" : "var(--color-faint)",
                      border: "1px solid var(--color-line)",
                      textDecoration: available ? "none" : "line-through",
                    }
              }
            >
              {formatStorage(t.storage_limit)}
            </button>
          );
        })}
      </div>

      {!activePlan && (
        <p className="text-sm" style={{ color: "var(--color-muted)" }}>
          Not available on {interval} billing.
        </p>
      )}
    </div>
  );
}
