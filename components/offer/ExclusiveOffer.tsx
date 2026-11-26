"use client";

import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { X, Sparkles, Copy, Check, ArrowRight } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import {
  DEFAULT_CTA_LABEL,
  EXCLUSIVE_CLAIM_URL,
  POPUP_DELAY_MS,
  bannerDismissKey,
  formatEndDate,
  isShowableOffer,
  popupSeenKey,
  urgencyLabel,
  type ExclusiveCoupon,
} from "@/lib/exclusive-offer";
import styles from "./ExclusiveOffer.module.css";

/* Storage can be missing or throw (private windows, blocked site data). The
   offer then simply shows again; nothing depends on it. */
function readFlag(store: "local" | "session", key: string): boolean {
  try {
    return (store === "local" ? window.localStorage : window.sessionStorage).getItem(key) === "1";
  } catch {
    return false;
  }
}
function writeFlag(store: "local" | "session", key: string) {
  try {
    (store === "local" ? window.localStorage : window.sessionStorage).setItem(key, "1");
  } catch {
    /* not remembered; harmless */
  }
}

/**
 * The exclusive offer: a strip above the nav on every page, and a pop-up
 * POPUP_DELAY_MS after the page opens, once per visit. Both show the same
 * coupon, from GET /billing/coupons/exclusive (fetched by the layout).
 *
 * While the strip is up it sets --offer-h on the page, which moves the fixed
 * nav down by the strip's height.
 */
const noSubscribe = () => () => {};

export default function ExclusiveOffer({ coupon }: { coupon: ExclusiveCoupon | null }) {
  // One clock reading per page view. The page can be served from cache after
  // the offer ended, so it is checked here too, not only by the API.
  const [now] = useState(() => Date.now());
  const live = isShowableOffer(coupon, now);
  const code = coupon?.code ?? "";
  // Closed earlier in this browser? Read after hydration (the server renders it open).
  const closedBefore = useSyncExternalStore(noSubscribe, () => readFlag("local", bannerDismissKey(code)), () => false);
  const [closedNow, setClosedNow] = useState(false);
  const [popupOpen, setPopupOpen] = useState(false);
  const bannerOpen = !closedBefore && !closedNow;

  useEffect(() => {
    if (!live) return;
    if (readFlag("session", popupSeenKey(code))) return;
    const timer = window.setTimeout(() => {
      setPopupOpen(true);
      writeFlag("session", popupSeenKey(code));
      trackEvent("exclusive_offer_popup_view", { coupon: code });
    }, POPUP_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [live, code]);

  if (!live || !coupon) return null;

  const closeBanner = () => {
    setClosedNow(true);
    writeFlag("local", bannerDismissKey(code));
  };
  const onClaim = (where: "banner" | "popup") => {
    trackEvent("exclusive_offer_claim", { coupon: code, where });
    // Copied so it is ready to paste; the app also offers it on its own.
    try {
      void navigator.clipboard?.writeText(code).catch(() => {});
    } catch {
      /* no clipboard: the code is on screen */
    }
  };

  return (
    <>
      {bannerOpen && <Banner coupon={coupon} now={now} onClose={closeBanner} onClaim={() => onClaim("banner")} />}
      {/* Portalled to the end of <body>, above every page's own stacking. */}
      {popupOpen && createPortal(<Popup coupon={coupon} now={now} onClose={() => setPopupOpen(false)} onClaim={() => onClaim("popup")} />, document.body)}
    </>
  );
}

type OfferProps = { coupon: ExclusiveCoupon; now: number; onClose: () => void; onClaim: () => void };

function Banner({ coupon, now, onClose, onClaim }: OfferProps) {
  const urgency = urgencyLabel(coupon.valid_until, now);
  return (
    <>
      {/* Moves the page, and the fixed nav (Nav.module.css), below the strip while it is up. */}
      <style>{`:root{--offer-h:40px}@media (max-width:820px){:root{--offer-h:44px}}body{padding-top:var(--offer-h)}`}</style>
      <aside className={styles.banner} aria-label="Exclusive offer">
        <div className={styles.bannerShine} aria-hidden />
        <div className={styles.bannerRow}>
          <span className={styles.badge}>
            <Sparkles size={13} aria-hidden />
            Exclusive
          </span>
          <span className={styles.bannerText}>{coupon.headline}</span>
          <span className={styles.bannerCode}>
            Code <b>{coupon.code}</b>
          </span>
          {urgency && <span className={styles.bannerUrgency}>{urgency}</span>}
          <a
            href={EXCLUSIVE_CLAIM_URL}
            onClick={onClaim}
            className={styles.bannerCta}
            aria-label={coupon.cta_label || DEFAULT_CTA_LABEL}
          >
            <span className={styles.bannerCtaText}>{coupon.cta_label || DEFAULT_CTA_LABEL}</span>
            <ArrowRight size={14} aria-hidden />
          </a>
        </div>
        <button type="button" onClick={onClose} className={styles.bannerClose} aria-label="Close offer">
          <X size={15} aria-hidden />
        </button>
      </aside>
    </>
  );
}

function Popup({ coupon, now, onClose, onClaim }: OfferProps) {
  const [copied, setCopied] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const urgency = urgencyLabel(coupon.valid_until, now);
  const titleId = "exclusive-offer-title";

  useEffect(() => {
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const copy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(coupon.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* the code stays on screen to type */
    }
  }, [coupon.code]);

  return (
    <div className={styles.scrim} onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={styles.card}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.cardTop}>
          <div className={styles.glow} aria-hidden />
          <span className={styles.sparkA} aria-hidden>✦</span>
          <span className={styles.sparkB} aria-hidden>✦</span>
          <span className={styles.sparkC} aria-hidden>✦</span>
          <button ref={closeRef} type="button" onClick={onClose} className={styles.cardClose} aria-label="Close">
            <X size={18} aria-hidden />
          </button>
          <span className={styles.badgeLarge}>
            <Sparkles size={14} aria-hidden />
            Exclusive offer
          </span>
          <h2 id={titleId} className={styles.title}>
            {coupon.headline}
          </h2>
          {coupon.subline && <p className={styles.subline}>{coupon.subline}</p>}
        </div>

        <div className={styles.cardBody}>
          <button type="button" onClick={copy} className={styles.ticket} aria-label={`Copy code ${coupon.code}`}>
            <span className={styles.ticketLabel}>Your code</span>
            <span className={styles.ticketCode}>{coupon.code}</span>
            <span className={styles.ticketCopy}>
              {copied ? <Check size={15} aria-hidden /> : <Copy size={15} aria-hidden />}
              {copied ? "Copied" : "Copy"}
            </span>
          </button>

          {coupon.valid_until != null && (
            <p className={styles.until}>
              <span className={styles.pulse} aria-hidden />
              {urgency}
              {urgency && !urgency.startsWith("Ends") && <> · ends {formatEndDate(coupon.valid_until)}</>}
            </p>
          )}

          <a href={EXCLUSIVE_CLAIM_URL} onClick={onClaim} className={styles.cta}>
            {coupon.cta_label || DEFAULT_CTA_LABEL}
            <ArrowRight size={17} aria-hidden />
          </a>
          <button type="button" onClick={onClose} className={styles.later}>
            Maybe later
          </button>
        </div>
      </div>
    </div>
  );
}
