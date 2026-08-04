"use client";

type Mode = "event" | "storage";

const TABS: { id: Mode; label: string }[] = [
  { id: "storage", label: "Storage plan" },
  { id: "event", label: "Pay per event" }
];

export default function ModeSwitch({
  mode,
  onChange,
}: {
  mode: Mode;
  onChange: (mode: Mode) => void;
}) {
  return (
    <div
      role="tablist"
      aria-label="Pricing mode"
      className="inline-flex items-center justify-center gap-1 self-center rounded-full p-1"
      style={{ background: "var(--color-surface-2)", border: "1px solid var(--color-line)" }}
      onKeyDown={(e) => {
        if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
        e.preventDefault();
        const idx = TABS.findIndex((t) => t.id === mode);
        const next = e.key === "ArrowRight" ? (idx + 1) % TABS.length : (idx - 1 + TABS.length) % TABS.length;
        onChange(TABS[next].id);
      }}
    >
      {TABS.map((tab) => {
        const selected = tab.id === mode;
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            id={`pricing-tab-${tab.id}`}
            aria-selected={selected}
            aria-controls={`pricing-panel-${tab.id}`}
            tabIndex={selected ? 0 : -1}
            onClick={() => onChange(tab.id)}
            className="rounded-full px-5 py-2.5 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/50 cursor-pointer"
            style={
              selected
                ? { background: "var(--color-accent)", color: "#fff" }
                : { color: "var(--color-muted)" }
            }
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
