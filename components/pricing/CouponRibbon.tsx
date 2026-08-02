"use client";

import { useState } from "react";
import type { PublicCoupon } from "@/lib/vyavasth-api";

function formatEndsDate(validUntilMs: number): string {
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short" }).format(
    new Date(validUntilMs),
  );
}

export default function CouponRibbon({
  coupons,
  onApply,
}: {
  coupons: PublicCoupon[];
  onApply: (code: string) => void;
}) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  if (coupons.length === 0) return null;
  const coupon = coupons[0];

  async function handleClick() {
    onApply(coupon.code);
    try {
      await navigator.clipboard.writeText(coupon.code);
      setCopiedCode(coupon.code);
      setTimeout(() => setCopiedCode(null), 1500);
    } catch {
      // Clipboard access can fail silently (permissions, insecure context) —
      // the coupon is still applied via onApply above either way.
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex w-fit items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/50"
      style={{
        background: "var(--color-accent-soft)",
        border: "1px solid var(--color-line)",
        color: "var(--color-accent-deep)",
      }}
    >
      <span className="font-bold">{copiedCode === coupon.code ? "Copied" : coupon.code}</span>
      <span>
        — {coupon.percent_off}% off your first payment · ends {formatEndsDate(coupon.valid_until)}
      </span>
    </button>
  );
}
