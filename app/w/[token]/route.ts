import { acqCookie, campaignLanding, isRecipientToken } from "@/lib/campaign-link";

/**
 * GET /w/<recipient id> — the tracking link in a WhatsApp campaign template
 * (button link https://vyavasth.in/w/{{1}}, filled per studio by the CRM).
 *
 * Tells the CRM about the tap (server to server, so the studio's browser never
 * talks to the CRM), remembers the id in a first-party cookie, and sends the
 * studio to the home page with utm tags for GA4. The id is not in the page's
 * URL, so it never reaches Google.
 *
 * Never fails the visitor: a bad token, an unset CRM, a slow or broken CRM all
 * still land on the home page. Settings: CRM_CLICK_URL and CRM_CLICK_SECRET.
 */
const CRM_TIMEOUT_MS = 1500;

export async function GET(request: Request, ctx: { params: Promise<{ token: string }> }) {
  const { token } = await ctx.params;
  const valid = isRecipientToken(token);

  let campaign: string | null = null;
  const url = process.env.CRM_CLICK_URL;
  const secret = process.env.CRM_CLICK_SECRET;
  if (valid && url && secret) {
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json", authorization: `Bearer ${secret}` },
        body: JSON.stringify({ token }),
        signal: AbortSignal.timeout(CRM_TIMEOUT_MS),
      });
      if (res.ok) campaign = ((await res.json()) as { campaign?: string | null }).campaign ?? null;
    } catch {
      // The click is lost, the visitor is not.
    }
  }

  const here = new URL(request.url);
  const headers = new Headers({ location: new URL(campaignLanding(campaign), here).toString(), "cache-control": "no-store" });
  if (valid) headers.append("set-cookie", acqCookie(token, here.hostname));
  return new Response(null, { status: 302, headers });
}
