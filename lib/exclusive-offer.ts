// lib/exclusive-offer.ts — the exclusive offer: the top banner and the pop-up.
// PURE: the coupon, its words and its end date all come from the API
// (GET /billing/coupons/exclusive). No code, figure or headline lives here, so
// switching the offer off in the database takes it off the site.

import { LOGIN_URL } from "./app-url.ts";

export type ExclusiveCoupon = {
  code: string;
  valid_until: number | null;
  headline: string | null;
  subline: string | null;
  cta_label: string | null;
  exclusive: boolean;
};

const DAY_MS = 24 * 60 * 60 * 1000;

/** The pop-up opens this long after the page does. */
export const POPUP_DELAY_MS = 7000;

/** Where both buttons go: the Studio app's sign-up, tagged so these signups can be told apart. */
export const EXCLUSIVE_CLAIM_URL = `${LOGIN_URL}?src=exclusive`;

/** The words used when the coupon carries none of its own. */
export const DEFAULT_CTA_LABEL = "Claim offer";

/** Whether a response is an exclusive offer the site can show right now. */
export function isShowableOffer(coupon: ExclusiveCoupon | null | undefined, now: number): coupon is ExclusiveCoupon {
  if (!coupon || !coupon.code || !coupon.headline) return false;
  return coupon.valid_until == null || coupon.valid_until >= now;
}

/** Days left, counting today: 1 on the last day, 0 once it has ended. */
export function daysLeft(validUntil: number, now: number): number {
  if (validUntil < now) return 0;
  return Math.max(1, Math.ceil((validUntil - now) / DAY_MS));
}

/** "13 Dec", in India's calendar (the offer ends at midnight IST). */
export function formatEndDate(validUntil: number): string {
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" }).format(new Date(validUntil));
}

/** The urgency line: how long is left, sharper as the end nears. No dashes. */
export function urgencyLabel(validUntil: number | null, now: number): string | null {
  if (validUntil == null) return null;
  const days = daysLeft(validUntil, now);
  if (days <= 1) return "Last day today";
  if (days <= 31) return `Only ${days} days left`;
  return `Ends ${formatEndDate(validUntil)}`;
}

/** Storage keys, per code, so a new exclusive offer is shown afresh. */
export const bannerDismissKey = (code: string) => `vy-exclusive-banner-closed:${code}`;
export const popupSeenKey = (code: string) => `vy-exclusive-popup-seen:${code}`;
