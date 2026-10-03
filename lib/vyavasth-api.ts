import type { Plan } from "./plans";
import type { Feature } from "./features";

const DEFAULT_BASE_URL = "https://api.vyavasth.in";

function getBaseUrl(): string {
  return process.env.VYAVASTH_API_BASE_URL?.trim() || DEFAULT_BASE_URL;
}

type JsonRecord = Record<string, string | undefined>;

async function postOnboarding(path: string, payload: JsonRecord) {
  const res = await fetch(`${getBaseUrl()}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  let data: unknown = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const error =
      data &&
      typeof data === "object" &&
      ("error" in data || "message" in data)
        ? String(
            "error" in data && data.error != null
              ? data.error
              : (data as { message: unknown }).message
          )
        : "Something went wrong. Please try again.";

    return { ok: false as const, status: res.status, error };
  }

  return { ok: true as const, status: res.status, data };
}

/* ── Pricing (public, no auth) ─────────────────────────────────── */

export type PublicCoupon = { code: string; percent_off: number; valid_until: number };

type ApiResult<T> = { ok: true; data: T } | { ok: false; error: string };

/**
 * GET /billing/plans, every active DH Service (including Free), sorted by
 * sort_order. Revalidated every 5 minutes so a new admin-created plan shows
 * up without a redeploy. Never throws; callers render a fallback on `ok: false`.
 */
export async function getPlans(): Promise<ApiResult<{ currency: string; plans: Plan[] }>> {
  try {
    const res = await fetch(`${getBaseUrl()}/billing/plans`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return { ok: false, error: `Request failed: ${res.status}` };
    const data = await res.json();
    return { ok: true, data };
  } catch {
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

/** GET /billing/coupons/public, universal coupons only. Empty array is normal. */
export async function getPublicCoupons(): Promise<ApiResult<{ coupons: PublicCoupon[] }>> {
  try {
    const res = await fetch(`${getBaseUrl()}/billing/coupons/public`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return { ok: false, error: `Request failed: ${res.status}` };
    const data = await res.json();
    return { ok: true, data };
  } catch {
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

/**
 * GET /features, the marketing capability catalog, sorted by sort_order.
 * `highlight: true` narrows to the homepage strip. Revalidated every 5 minutes,
 * same discipline as getPlans. Never throws; callers render a fallback on
 * `ok: false`.
 */
export async function getFeatures(
  opts?: { highlight?: boolean },
): Promise<ApiResult<{ features: Feature[] }>> {
  try {
    const qs = opts?.highlight ? "?highlight=true" : "";
    const res = await fetch(`${getBaseUrl()}/features${qs}`, {
      next: { revalidate: 300 },
    });
    if (!res.ok) return { ok: false, error: `Request failed: ${res.status}` };
    const data = await res.json();
    return { ok: true, data };
  } catch {
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}

export function createSupportTicket(payload: {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}) {
  return postOnboarding("/onboarding/create-support-ticket", {
    name: payload.name,
    email: payload.email,
    phone: payload.phone,
    subject: payload.subject,
    message: payload.message,
  });
}
