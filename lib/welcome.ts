import { WHATSAPP_NUMBER } from "./site-legal.ts";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://deliver.vyavasth.in";

/** Everything event-specific for /welcome lives here; the next expo only edits this. */
export const WELCOME_EVENT = {
  /** Shown in the header and in the prefilled WhatsApp message. */
  name: "Imagic Expo Photofair 2026",

  /** Vyavasth event gallery link for this expo. Empty string = not set yet. */
  galleryUrl: "https://deliver.vyavasth.in/event/imagic-expo-photofair-2026-Cl8X9u",

  /** YouTube playlist of the 60-second feature explainers. Empty string = not set yet. */
  shortsUrl: "https://youtube.com/playlist?list=PLS98GCGPorQs&si=_MFOSuig7oax399g",
} as const;

/** wa.me link with a prefilled message naming the event. */
export function buildWhatsAppUrl(eventName: string): string {
  const text = `Hi, I visited the Vyavasth booth at ${eventName}.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
}

/** Signup link, tagged so we can tell expo signups apart. */
export function buildSignupUrl(): string {
  return `${APP_URL}/login?src=welcome`;
}

/** A link is live only when it is a non-empty https URL. */
export function isLinkReady(url: string): boolean {
  const trimmed = url.trim();
  return trimmed.length > 0 && trimmed.startsWith("https://");
}
