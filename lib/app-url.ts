// lib/app-url.ts — links into the delivery web app (deliver.vyavasth.in).
// NEXT_PUBLIC_APP_URL is inlined at build time, so this is safe in client
// components as well as server ones.

export const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://deliver.vyavasth.in";

/** Where "Log in" and the pay-per-event "Buy events" button go. */
export const LOGIN_URL = `${APP_URL}/login`;

/**
 * Checkout link. The web app's /checkout reads `plan` (a plan _id) and `qty`.
 * Quantity is only carried when it is more than one. No coupon parameter.
 */
export function buildCheckoutHref(planId: string, opts: { qty?: number } = {}): string {
  const qs = new URLSearchParams({ plan: planId });
  if (opts.qty && opts.qty > 1) qs.set("qty", String(opts.qty));
  return `${APP_URL}/checkout?${qs.toString()}`;
}
