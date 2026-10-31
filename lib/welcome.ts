import { WHATSAPP_NUMBER } from "./site-legal.ts";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://deliver.vyavasth.in";

/** Everything event-specific for /welcome lives here; the next event only edits this. */
export const WELCOME_EVENT = {
  /** Shown in the header and in the prefilled WhatsApp message. */
  name: "Bhopal Photo Fair 2026",

  /** Vyavasth event gallery link for this event. Empty string = not set yet. */
  galleryUrl: "https://deliver.vyavasth.in/event/bhopal-photofair-2026-W9POsi",

  /** Photo Fair offer landing link, tagged for QR tracking. Empty string = not set yet. */
  offerUrl:
    "https://www.vyavasth.in/?utm_source=welcome&utm_medium=qr&utm_campaign=bhopal-photo-fair-2026",

  /** Shown under the tagline in the header. */
  dates: "31 Oct & 1 Nov 2026",

  /** Shown after the dates in the header. */
  venue: "Manas Bhawan, Near Polytechnic, Bhopal",
} as const;

/** wa.me link with a prefilled message naming the event. */
export function buildWhatsAppUrl(eventName: string): string {
  const text = `Hi, I visited the Vyavasth booth at ${eventName}.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/** Signup link, tagged so we can tell event signups apart. */
export function buildSignupUrl(): string {
  return `${APP_URL}/login?src=welcome`;
}

/** A link is live only when it is a non-empty https URL. */
export function isLinkReady(url: string): boolean {
  const trimmed = url.trim();
  return trimmed.length > 0 && trimmed.startsWith("https://");
}
