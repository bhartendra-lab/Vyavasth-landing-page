"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { Plan } from "@/lib/plans";
import {
  buildStorageTiers,
  eventPlanOf,
  formatInr,
  formatStorage,
  freePlanOf,
  nearestAvailableIndex,
  planForTier,
  yearlySavingsPercent,
} from "@/lib/plans";
import {
  EVENT_PRESETS,
  EVENT_VALIDITY_MONTHS,
  ORIGINAL_TIER_MIN_STORAGE_GB,
  STORAGE_TIER_BADGES,
  freeEventsOf,
  includesOriginal,
  lowestYearlyTier,
  photosFor,
  sameCostEvents,
} from "@/lib/pricing-display";
import { LOGIN_URL, buildCheckoutHref } from "@/lib/app-url";
import { whatsappUrl } from "@/lib/site-legal";
import PricingErrorFallback from "./PricingErrorFallback";
import styles from "./pricing.module.css";

type Interval = "monthly" | "yearly";

const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(" ");

const Svg = ({ stroke, children }: { stroke: string; children: React.ReactNode }) => (
  <svg viewBox="0 0 18 18" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {children}
  </svg>
);
const Tick = ({ light }: { light?: boolean }) => (
  <Svg stroke={light ? "#F0B39D" : "#C25A3A"}><path d="M3.5 9.4l3.4 3.400 7.600-8" /></Svg>
);
const Clock = () => (
  <Svg stroke="currentColor"><circle cx="9" cy="9" r="6.5" /><path d="M9 5.500V9l2.300 1.500" /></Svg>
);
const Lock = () => (
  <Svg stroke="#F0B39D"><rect x="3.5" y="8" width="11" height="7" rx="2" /><path d="M6 8V6a3 3 0 0 1 6 0v2" /></Svg>
);

/**
 * A value that fades out, changes, and fades back in (the prototype's `swap`).
 * React renders the first value only; later values are written to the DOM after
 * the fade-out, so the text never jumps.
 */
function Swap({ value, inherit }: { value: string; inherit?: boolean }) {
  const [initial] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);
  const shown = useRef(value);

  useEffect(() => {
    const el = ref.current;
    if (!el || shown.current === value) return;
    el.classList.add(styles.out);
    const t = window.setTimeout(() => {
      el.textContent = value;
      shown.current = value;
      el.classList.remove(styles.out);
    }, 170);
    return () => window.clearTimeout(t);
  }, [value]);

  return (
    <span
      ref={ref}
      className={styles.swap}
      style={inherit ? { fontSize: "inherit", opacity: 1 } : undefined}
    >
      {initial}
    </span>
  );
}

export default function PricingClient({ plans }: { plans: Plan[] }) {
  const eventPlan = useMemo(() => eventPlanOf(plans), [plans]);
  const tiers = useMemo(() => buildStorageTiers(plans), [plans]);
  const freePlan = useMemo(() => freePlanOf(plans), [plans]);
  const freeEvents = useMemo(() => freeEventsOf(plans), [plans]);
  const lowest = useMemo(() => lowestYearlyTier(plans), [plans]);
  const unit = eventPlan?.event_unit_price ?? 0;

  const initialInterval = (): Interval =>
    tiers.some((t) => (yearlySavingsPercent(t) ?? 0) > 0) ? "yearly" : "monthly";

  const [qty, setQty] = useState<number>(EVENT_PRESETS[0]);
  const [interval, setInterval_] = useState<Interval>(initialInterval);
  const [tierIndex, setTierIndex] = useState(() =>
    tiers.length ? nearestAvailableIndex(tiers, Math.min(1, tiers.length - 1), initialInterval()) : 0,
  );
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

  // Nothing at all: a misconfigured catalog.
  if (!eventPlan && tiers.length === 0) {
    return (
      <PricingErrorFallback
        title="We're updating our pricing."
        body="Talk to us and we'll sort you out."
      />
    );
  }

  const freeCount = freeEvents === 1 ? "1 event" : `${freeEvents} events`;

  // ── Storage plan ───────────────────────────────────────────────
  const tier = tiers[tierIndex];
  const storagePlan = tier ? planForTier(tier, interval) : null;
  const maxSavings = tiers.length ? Math.max(0, ...tiers.map((t) => yearlySavingsPercent(t) ?? 0)) : 0;
  const storagePrice = storagePlan?.price ?? 0;
  const priceValue = storagePlan ? formatInr(interval === "yearly" ? storagePrice / 12 : storagePrice) : "N/A";
  const billedValue = !storagePlan
    ? `Not available on ${interval} billing`
    : interval === "yearly"
      ? `${formatInr(storagePrice)} billed yearly`
      : "Billed every month";
  const evenEvents = tier ? sameCostEvents(tier, interval, eventPlan?.event_unit_price) : null;

  return (
    <>
      <nav className={styles.jump} aria-label="Jump to a plan">
        <a href="#free"><b>{formatInr(freePlan?.price ?? 0)}</b>{freeCount}</a>
        {eventPlan && <a href="#events"><b>{formatInr(unit)}</b>per event</a>}
        {lowest && <a href="#storage"><b>{formatInr(lowest.perMonth)}</b>a month</a>}
      </nav>

      <div className={styles.plans}>
        {/* ── Free ── */}
        <article className={cx(styles.p, styles.free)} id="free">
          <span className={styles.tag}>Start here</span>
          <h2>Free</h2>
          <p className={styles.who}>To try it on a real wedding</p>
          <div className={styles.amt}>
            <b>{formatInr(freePlan?.price ?? 0)}</b>
            <span>for your first {freeCount}</span>
          </div>
          <div className={styles.sub}>For every new studio.</div>
          <ul>
            <li><Tick />Unlimited storage for {freeEvents === 2 ? "both events" : "each event"}</li>
            <li><Tick />Every feature unlocked</li>
            <li className={styles.catch}><Clock />Each event stays live for {EVENT_VALIDITY_MONTHS} months</li>
          </ul>
          <span className={styles.sp}></span>
          <a className={styles.cta} href={LOGIN_URL}>Start free</a>
          <div className={styles.foot}>Then pick either paid plan.</div>
        </article>

        {/* ── Pay per event ── */}
        {eventPlan && (
          <article className={cx(styles.p, styles.ev)} id="events">
            <span className={styles.tag}>Pay per event</span>
            <h2>One wedding at a time</h2>
            <p className={styles.who}>For a handful of events a season</p>
            <div className={styles.amt} aria-live="polite">
              <b><Swap value={formatInr(qty * unit)} inherit /></b>
              <span>{qty === 1 ? "for 1 event" : `for ${qty} events`}</span>
            </div>
            <div className={styles.sub}>{formatInr(unit)} per event, paid once.</div>
            <div className={styles.pick} role="group" aria-label="How many events">
              {EVENT_PRESETS.map((n) => (
                <button
                  key={n}
                  type="button"
                  className={qty === n ? styles.on : undefined}
                  aria-pressed={qty === n}
                  onClick={() => setQty(n)}
                >
                  {n}
                </button>
              ))}
            </div>
            <ul>
              <li><Tick />Unlimited storage per event</li>
              <li><Tick />Unused events never expire</li>
              <li className={styles.catch}><Clock />Each event stays live for {EVENT_VALIDITY_MONTHS} months from the day you create it</li>
            </ul>
            <span className={styles.sp}></span>
            <a className={styles.cta} href={LOGIN_URL}>Buy events</a>
            <div className={styles.foot}>
              More than 100 events?{" "}
              <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">Talk to us</a>
            </div>
          </article>
        )}

        {/* ── Storage plan ── */}
        {tier && (
          <article className={cx(styles.p, styles.st)} id="storage">
            <div className={styles.sthead}>
              <span className={styles.tag}>Storage plan</span>
              <div className={styles.bill} role="group" aria-label="Billing period">
                <button
                  type="button"
                  className={interval === "monthly" ? styles.on : undefined}
                  aria-pressed={interval === "monthly"}
                  onClick={() => handleIntervalChange("monthly")}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  className={interval === "yearly" ? styles.on : undefined}
                  aria-pressed={interval === "yearly"}
                  onClick={() => handleIntervalChange("yearly")}
                >
                  Yearly{maxSavings > 0 && <em>save {maxSavings}%</em>}
                </button>
              </div>
            </div>
            <h2>Deliver all season</h2>
            <p className={styles.who}>Unlimited events, one pool of storage</p>
            <div className={styles.amt} aria-live="polite">
              <b><Swap value={priceValue} inherit /></b>
              <span>a month</span>
            </div>
            <div className={styles.sub}><Swap value={billedValue} /></div>
            <div className={styles.pick} role="group" aria-label="Storage size">
              {tiers.map((t, i) => {
                const badge = STORAGE_TIER_BADGES[t.storage_limit];
                return (
                  <button
                    key={t.storage_limit}
                    type="button"
                    className={i === tierIndex ? styles.on : undefined}
                    aria-pressed={i === tierIndex}
                    disabled={!planForTier(t, interval)}
                    onClick={() => setTierIndex(i)}
                  >
                    {formatStorage(t.storage_limit)}
                    {badge && <i>{badge}</i>}
                  </button>
                );
              })}
            </div>
            <ul>
              <li>
                <Tick light />
                <span><Swap value={photosFor(tier.storage_limit).toLocaleString("en-IN")} /> photos, reusable when you delete an event</span>
              </li>
              <li>
                <Tick light />
                <Swap
                  value={
                    includesOriginal(tier.storage_limit)
                      ? "Original-quality delivery included"
                      : `HD and 4K delivery. Originals from ${formatStorage(ORIGINAL_TIER_MIN_STORAGE_GB)}.`
                  }
                />
              </li>
              {evenEvents !== null && (
                <li>
                  <Tick light />
                  <span>Same cost as <Swap value={String(evenEvents)} /> pay-per-event events a year</span>
                </li>
              )}
              <li className={styles.catch}><Lock />You can&apos;t switch back to pay per event</li>
            </ul>
            <span className={styles.sp}></span>
            <a
              className={styles.cta}
              href={storagePlan ? buildCheckoutHref(storagePlan._id) : undefined}
              aria-disabled={!storagePlan}
            >
              Choose this plan
            </a>
            <div className={styles.foot} aria-live="polite">{movedNote ?? "Change size or cancel anytime."}</div>
          </article>
        )}
      </div>
    </>
  );
}
