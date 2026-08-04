"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useEnquiry } from "@/components/EnquiryProvider";
import type { PublicCoupon } from "@/lib/vyavasth-api";
import type { Plan } from "@/lib/plans";
import {
  buildStorageTiers,
  eventPlanOf,
  formatInr,
  formatStorage,
  nearestAvailableIndex,
  planForTier,
  planLabel,
  yearlySavingsPercent,
} from "@/lib/plans";
import ModeSwitch from "./ModeSwitch";
import EventQuantity from "./EventQuantity";
import StorageSlider from "./StorageSlider";
import IntervalToggle from "./IntervalToggle";
import PlanSummary from "./PlanSummary";
import CouponRibbon from "./CouponRibbon";

type Mode = "event" | "storage";
type Interval = "monthly" | "yearly";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://deliver.vyavasth.in";
const MAX_QTY = 100;

function buildCheckoutHref(planId: string, opts: { qty?: number; coupon?: string | null }): string {
  const qs = new URLSearchParams({ plan: planId });
  if (opts.qty && opts.qty > 1) qs.set("qty", String(opts.qty));
  if (opts.coupon) qs.set("coupon", opts.coupon);
  return `${APP_URL}/checkout?${qs.toString()}`;
}

export default function PricingClient({
  plans,
  coupons,
}: {
  plans: Plan[];
  coupons: PublicCoupon[];
}) {
  const { openEnquiry } = useEnquiry();

  const eventPlan = useMemo(() => eventPlanOf(plans), [plans]);
  const tiers = useMemo(() => buildStorageTiers(plans), [plans]);
  const hasEvent = Boolean(eventPlan);
  const hasStorage = tiers.length > 0;

  const [mode, setMode] = useState<Mode>(() => (hasStorage ? "storage" : "event"));
  const [qty, setQty] = useState(1);
  const [interval, setInterval_] = useState<Interval>(() =>
    tiers.some((t) => (yearlySavingsPercent(t) ?? 0) > 0) ? "yearly" : "monthly",
  );
  const [tierIndex, setTierIndex] = useState(() => Math.min(1, Math.max(0, tiers.length - 1)));
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [movedNote, setMovedNote] = useState<string | null>(null);
  const movedNoteTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (movedNoteTimer.current) clearTimeout(movedNoteTimer.current);
    };
  }, []);

  function handleIntervalChange(next: Interval) {
    const nextIndex = nearestAvailableIndex(tiers, tierIndex, next);
    if (nextIndex !== tierIndex) {
      setTierIndex(nextIndex);
      setMovedNote(`Moved to the closest ${next} plan.`);
      if (movedNoteTimer.current) clearTimeout(movedNoteTimer.current);
      movedNoteTimer.current = setTimeout(() => setMovedNote(null), 4000);
    }
    setInterval_(next);
  }

  // Nothing at all — misconfigured catalog (§9.4).
  if (!hasEvent && !hasStorage) {
    return (
      <section style={{ padding: "24px 0 96px" }}>
        <div className="mx-auto" style={{ maxWidth: "var(--max-w)", padding: "0 var(--gutter)" }}>
          <div
            className="flex flex-col items-start gap-4 rounded-2xl p-8"
            style={{ background: "var(--color-surface)", border: "1px solid var(--color-line)" }}
          >
            <p className="text-lg font-semibold" style={{ color: "var(--color-primary)" }}>
              We&apos;re updating our pricing.
            </p>
            <p style={{ color: "var(--color-muted)" }}>Talk to us and we&apos;ll sort you out.</p>
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

  const showModeSwitch = hasEvent && hasStorage;
  const activeMode: Mode = hasEvent && hasStorage ? mode : hasEvent ? "event" : "storage";

  // ── Pay per event ──────────────────────────────────────────────
  const eventPrice = eventPlan ? qty * (eventPlan.event_unit_price ?? 0) : 0;
  const eventFeatures =
    eventPlan?.features && eventPlan.features.length > 0
      ? eventPlan.features
      : ["Never expires", "All features included"];
  const eventHref = eventPlan ? `${APP_URL}/login` : null;

  // ── Storage plan ───────────────────────────────────────────────
  const tier = tiers[tierIndex];
  const activeStoragePlan = tier ? planForTier(tier, interval) : null;
  const maxSavings = tiers.length
    ? Math.max(0, ...tiers.map((t) => yearlySavingsPercent(t) ?? 0))
    : 0;
  const tierSavings = tier ? yearlySavingsPercent(tier) : null;
  const storageHref = activeStoragePlan
    ? buildCheckoutHref(activeStoragePlan._id, { coupon: appliedCoupon })
    : null;

  return (
    <section style={{ padding: "24px 0 96px" }}>
      <div className="mx-auto flex flex-col gap-8" style={{ maxWidth: "var(--max-w)", padding: "0 var(--gutter)" }}>
        <CouponRibbon coupons={coupons} onApply={setAppliedCoupon} />

        {showModeSwitch && <ModeSwitch mode={mode} onChange={setMode} />}

        {activeMode === "event" && eventPlan && (
          <div
            id="pricing-panel-event"
            role="tabpanel"
            aria-labelledby={showModeSwitch ? "pricing-tab-event" : undefined}
            className="grid grid-cols-1 gap-10 rounded-3xl p-8 lg:grid-cols-2 lg:p-10"
            style={{ background: "var(--color-surface)", border: "1px solid var(--color-line)" }}
          >
            <div className="flex flex-col gap-6">
              <div>
                <h2 className="text-lg font-bold" style={{ color: "var(--color-primary)" }}>
                  How many events?
                </h2>
                <p className="mt-1 text-sm" style={{ color: "var(--color-muted)" }}>
                  {formatInr(eventPlan.event_unit_price ?? 0)} per event, GST included.
                </p>
              </div>
              <EventQuantity quantity={qty} onChange={(n) => setQty(Math.min(MAX_QTY, Math.max(1, n)))} onTalkToUs={openEnquiry} />
            </div>

            <PlanSummary
              title={planLabel(eventPlan)}
              priceLine={formatInr(eventPrice)}
              subLine={`${qty} event${qty === 1 ? "" : "s"} × ${formatInr(eventPlan.event_unit_price ?? 0)}`}
              features={eventFeatures}
              ctaHref={eventHref}
              ctaLabel="Continue →"
              footnote="GST included. One-time payment — bought events never expire until you utilize one."
            />
          </div>
        )}

        {activeMode === "storage" && hasStorage && (
          <div
            id="pricing-panel-storage"
            role="tabpanel"
            aria-labelledby={showModeSwitch ? "pricing-tab-storage" : undefined}
            className="grid grid-cols-1 gap-10 rounded-3xl p-8 lg:grid-cols-2 lg:p-10"
            style={{ background: "var(--color-surface)", border: "1px solid var(--color-line)" }}
          >
            <div className="flex flex-col gap-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-bold" style={{ color: "var(--color-primary)" }}>
                  Pick a storage tier
                </h2>
                <IntervalToggle
                  interval={interval}
                  onChange={handleIntervalChange}
                  maxSavingsPercent={maxSavings > 0 ? maxSavings : null}
                />
              </div>
              <StorageSlider tiers={tiers} index={tierIndex} interval={interval} onChange={setTierIndex} />
            </div>

            <PlanSummary
              title={
                activeStoragePlan
                  ? planLabel(activeStoragePlan)
                  : tier
                    ? `${formatStorage(tier.storage_limit)} · ${interval === "monthly" ? "Monthly" : "Yearly"}`
                    : ""
              }
              priceLine={
                activeStoragePlan
                  ? `${formatInr(activeStoragePlan.price ?? 0)} /${interval === "monthly" ? "month" : "year"}`
                  : "—"
              }
              subLine={
                activeStoragePlan
                  ? `${formatStorage(tier.storage_limit)} = ${Number(tier.storage_limit * 1000).toLocaleString("en-IN")} photos · unlimited events · reusable storage`
                  : `Not available on ${interval} billing`
              }
              subNote={
                activeStoragePlan && interval === "yearly"
                  ? `${formatInr((activeStoragePlan.price ?? 0) / 12)}/month, billed yearly${
                      tierSavings ? ` — save ${tierSavings}%` : ""
                    }`
                  : null
              }
              features={activeStoragePlan?.features ?? []}
              ctaHref={storageHref}
              ctaLabel={activeStoragePlan ? "Continue →" : "Choose an available plan"}
              ctaDisabled={!activeStoragePlan}
              footnote="Storage plans can be changed or cancelled anytime, but can't be switched back to pay-per-event."
              movedNote={movedNote}
            />
          </div>
        )}

        {!activeStoragePlan && activeMode === "storage" && (
          <button
            type="button"
            onClick={() => handleIntervalChange(interval === "monthly" ? "yearly" : "monthly")}
            className="-mt-4 w-fit text-sm font-semibold underline-offset-2 hover:underline"
            style={{ color: "var(--color-accent)" }}
          >
            Switch to {interval === "monthly" ? "yearly" : "monthly"}
          </button>
        )}
      </div>
    </section>
  );
}
