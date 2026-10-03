/** Single source of truth for legal / compliance copy (Razorpay, India). */

export const LAST_UPDATED = "29 June 2026";

export const BUSINESS_NAME = "Vyavasth";

export const SUPPORT_EMAIL = "support@vyavasth.in";

export const SUPPORT_PHONE_DISPLAY = "+91-8929163903";

/** E.164-style for tel: links */
export const SUPPORT_PHONE_TEL = "+918929163903";

/**
 * Digits-only (with country code) for wa.me links. This is the one WhatsApp
 * number for the whole site; it is deliberately not SUPPORT_PHONE_TEL (that
 * number is used for dev/OTP messaging and stays on the contact and legal pages).
 */
export const WHATSAPP_NUMBER = "917581072329";

/** How the WhatsApp number is shown to people. */
export const WHATSAPP_DISPLAY = "+91 75810 72329";

/** wa.me link for the site's WhatsApp number, with an optional prefilled message. */
export function whatsappUrl(text?: string): string {
  const base = `https://wa.me/${WHATSAPP_NUMBER}`;
  return text ? `${base}?text=${encodeURIComponent(text)}` : base;
}

export const REGISTERED_ADDRESS =
  "Ward No. 06, Rajghat road, Chanderi, Ashoknagar, M.P., 473446";

export const GRIEVANCE_OFFICER_NAME = "Bhartendra Chauhan";

export const GRIEVANCE_OFFICER_EMAIL = SUPPORT_EMAIL;

export const GRIEVANCE_OFFICER_PHONE_DISPLAY = SUPPORT_PHONE_DISPLAY;

export const GRIEVANCE_OFFICER_PHONE_TEL = SUPPORT_PHONE_TEL;

export const SERVICE_DESCRIPTION_SHORT =
  "SaaS platform for business operations management";

export const BUSINESS_HOURS =
  "Monday to Friday, 10:00 AM to 6:00 PM IST (excluding public holidays in India)";

export const RESPONSE_TIME_BUSINESS_HOURS =
  "We aim to acknowledge support requests within 48 business hours.";
