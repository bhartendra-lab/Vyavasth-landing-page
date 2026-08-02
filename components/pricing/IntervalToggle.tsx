"use client";

type Interval = "monthly" | "yearly";

export default function IntervalToggle({
  interval,
  onChange,
  maxSavingsPercent,
}: {
  interval: Interval;
  onChange: (interval: Interval) => void;
  maxSavingsPercent: number | null;
}) {
  const options: { id: Interval; label: string }[] = [
    { id: "monthly", label: "Monthly" },
    { id: "yearly", label: "Yearly" },
  ];

  return (
    <div
      role="tablist"
      aria-label="Billing interval"
      className="inline-flex items-center gap-1 rounded-full p-1"
      style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-line)" }}
      onKeyDown={(e) => {
        if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
        e.preventDefault();
        onChange(interval === "monthly" ? "yearly" : "monthly");
      }}
    >
      {options.map((opt) => {
        const selected = opt.id === interval;
        return (
          <button
            key={opt.id}
            type="button"
            role="tab"
            aria-selected={selected}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(opt.id)}
            className="relative flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/50"
            style={
              selected
                ? { background: "var(--color-accent)", color: "#fff" }
                : { color: "var(--color-muted)" }
            }
          >
            {opt.label}
            {opt.id === "yearly" && maxSavingsPercent && (
              <span
                className="rounded-full px-2 py-0.5 text-[11px] font-bold"
                style={
                  selected
                    ? { background: "rgba(255,255,255,0.25)", color: "#fff" }
                    : { background: "var(--color-accent-soft)", color: "var(--color-accent)" }
                }
              >
                Save {maxSavingsPercent}%
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
