// lib/analytics.ts — Google Tag Manager + Consent Mode helpers.
//
// All tracking (GA4, Meta Pixel) is configured inside the GTM container, not in
// code. This file only (1) pushes events to the dataLayer and (2) manages the
// visitor's consent choice. Nothing is loaded unless NEXT_PUBLIC_GTM_ID is set.
//
// NEXT_PUBLIC_GTM_ID is inlined at build time, so set it in the build
// environment (same as NEXT_PUBLIC_APP_URL).

export const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export const CONSENT_KEY = "vyavasth-consent";
/** Window event the footer "Cookie settings" link fires to reopen the banner. */
export const OPEN_CONSENT_EVENT = "vyavasth:open-consent";

export type ConsentChoice = "granted" | "denied";

declare global {
  interface Window {
    dataLayer?: unknown[];
  }
}

// Consent Mode requires gtag-style pushes (an `arguments` object, not an array).
// `args` is only there to type the call sites; the `arguments` object is pushed.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function gtag(...args: unknown[]) {
  // eslint-disable-next-line prefer-rest-params
  (window.dataLayer ||= []).push(arguments);
}

/**
 * Runs in <head> before GTM loads: every storage type starts denied, then a
 * previously saved "granted" choice is re-applied. Kept as a string so it can be
 * inlined (it must run before any tag fires).
 */
export const CONSENT_BOOTSTRAP_SCRIPT = `
window.dataLayer=window.dataLayer||[];
function gtag(){dataLayer.push(arguments)}
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',wait_for_update:500});
try{if(localStorage.getItem('${CONSENT_KEY}')==='granted'){gtag('consent','update',{ad_storage:'granted',ad_user_data:'granted',ad_personalization:'granted',analytics_storage:'granted'})}}catch(e){}
`.trim();

export function getStoredConsent(): ConsentChoice | null {
  try {
    const v = window.localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

/** Persist the visitor's choice and tell GTM about it. */
export function setConsent(choice: ConsentChoice) {
  try {
    window.localStorage.setItem(CONSENT_KEY, choice);
  } catch {
    // Storage blocked: the choice still applies for this page view.
  }
  gtag("consent", "update", {
    ad_storage: choice,
    ad_user_data: choice,
    ad_personalization: choice,
    analytics_storage: choice,
  });
}

// GTM's data model keeps values pushed earlier, so a `location` set by one
// event would leak into the next event that maps it. Every event therefore
// starts by clearing the shared parameter keys (undefined resets a key).
const SHARED_PARAM_KEYS = ["location", "method", "plan", "purpose"] as const;

/**
 * Push a custom event to the dataLayer. GTM decides what to do with it (GA4
 * event, Meta Pixel event, ...). Never put personal data in params.
 */
export function trackEvent(
  event: string,
  params: Record<string, string | number | boolean> = {},
) {
  if (!GTM_ID || typeof window === "undefined") return;
  const cleared = Object.fromEntries(SHARED_PARAM_KEYS.map((k) => [k, undefined]));
  (window.dataLayer ||= []).push({ ...cleared, event, ...params });
}
