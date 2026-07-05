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

// The backend requires name, business_name, phone and city; email, website,
// message and source are optional extras it now records too.
export function createEnquiry(payload: {
  name: string;
  business_name: string;
  phone: string;
  city: string;
  email?: string;
  website?: string;
  message?: string;
  source?: string;
}) {
  return postOnboarding("/onboarding/create-enquiry", {
    ...payload,
    source: payload.source ?? "landing_page",
  });
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
