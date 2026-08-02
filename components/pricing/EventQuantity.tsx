"use client";

import { useEffect, useRef, useState } from "react";
import { Minus, Plus } from "lucide-react";

const PRESETS = [1, 5, 10, 25];
const MAX_QTY = 100;

export default function EventQuantity({
  quantity,
  onChange,
  onTalkToUs,
}: {
  quantity: number;
  onChange: (qty: number) => void;
  onTalkToUs: () => void;
}) {
  const [draft, setDraft] = useState(String(quantity));
  const focused = useRef(false);

  // Keep the text input in sync when quantity changes from outside (preset
  // click, +/- buttons) — but never fight the user while they're mid-edit.
  useEffect(() => {
    if (!focused.current) setDraft(String(quantity));
  }, [quantity]);

  function commit(raw: string) {
    const parsed = Math.round(Number(raw));
    const clamped = Number.isFinite(parsed) ? Math.min(MAX_QTY, Math.max(1, parsed)) : quantity;
    onChange(clamped);
    setDraft(String(clamped));
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Quick quantities">
        {PRESETS.map((p) => {
          const selected = p === quantity;
          return (
            <button
              key={p}
              type="button"
              onClick={() => {
                onChange(p);
                setDraft(String(p));
              }}
              className="min-h-11 rounded-full px-4 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/50"
              style={
                selected
                  ? { background: "var(--color-accent)", color: "#fff" }
                  : {
                      background: "var(--color-bg)",
                      color: "var(--color-primary)",
                      border: "1px solid var(--color-line)",
                    }
              }
            >
              {p}
            </button>
          );
        })}
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Decrease quantity"
          onClick={() => commit(String(quantity - 1))}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/50"
          style={{ border: "1px solid var(--color-line)", color: "var(--color-primary)" }}
        >
          <Minus size={16} />
        </button>
        <input
          id="event-qty-input"
          type="text"
          inputMode="numeric"
          value={draft}
          onFocus={() => {
            focused.current = true;
          }}
          onChange={(e) => setDraft(e.target.value.replace(/[^0-9]/g, ""))}
          onBlur={(e) => {
            focused.current = false;
            commit(e.target.value);
          }}
          aria-label="Number of events"
          className="h-11 w-20 rounded-xl text-center text-lg font-bold tabular-nums focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/50"
          style={{
            background: "var(--color-bg)",
            border: "1px solid var(--color-line)",
            color: "var(--color-primary)",
          }}
        />
        <button
          type="button"
          aria-label="Increase quantity"
          onClick={() => commit(String(quantity + 1))}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/50"
          style={{ border: "1px solid var(--color-line)", color: "var(--color-primary)" }}
        >
          <Plus size={16} />
        </button>
      </div>

      <p className="text-sm" style={{ color: "var(--color-muted)" }}>
        Delivering more than {MAX_QTY} events?{" "}
        <button
          type="button"
          onClick={onTalkToUs}
          className="font-semibold underline-offset-2 hover:underline"
          style={{ color: "var(--color-accent)" }}
        >
          Talk to us
        </button>
      </p>
    </div>
  );
}
