// lib/campaign-link.ts — pure helpers for the campaign tracking link
// (app/w/[token]/route.ts). Kept pure so node tests can cover them.
//
// The link in a WhatsApp campaign is https://vyavasth.in/w/<id>, where <id>
// is made by the CRM for that one message. The dashboard reads the cookie set
// here at sign up (its lib/campaign-link.ts uses the same name and format).

/** First-party cookie holding the id of the message that brought this browser. */
export const ACQ_COOKIE = "vy_acq";
/** 30 days: long enough for a studio that taps today and signs up next week. */
export const ACQ_COOKIE_MAX_AGE = 30 * 24 * 60 * 60;

/** A CRM recipient id: a ULID, 26 Crockford base32 characters. */
export function isRecipientToken(v: unknown): v is string {
  return typeof v === "string" && /^[0-9A-HJKMNP-TV-Z]{26}$/.test(v);
}

/** Where a tap lands: the home page, tagged for GA4. The slug comes from the CRM campaign name. */
export function campaignLanding(campaignSlug: string | null | undefined): string {
  const slug = campaignSlug && /^[a-z0-9-]{1,60}$/.test(campaignSlug) ? campaignSlug : "whatsapp-campaign";
  const q = new URLSearchParams({ utm_source: "whatsapp", utm_medium: "campaign", utm_campaign: slug });
  return `/?${q.toString()}`;
}

/**
 * The Set-Cookie value. On vyavasth.in the cookie is for the whole domain, so
 * it is still there at deliver.vyavasth.in when the studio signs up. Anywhere
 * else (local, preview) it stays on that host.
 */
export function acqCookie(token: string, hostname: string): string {
  const shared = hostname === "vyavasth.in" || hostname.endsWith(".vyavasth.in");
  return `${ACQ_COOKIE}=${token}; Max-Age=${ACQ_COOKIE_MAX_AGE}; Path=/;${shared ? " Domain=vyavasth.in;" : ""} Secure; SameSite=Lax`;
}
