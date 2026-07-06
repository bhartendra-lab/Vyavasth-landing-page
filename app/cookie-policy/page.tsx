import type { Metadata } from "next";
import LegalPageShell from "@/components/LegalPageShell";
import { SUPPORT_EMAIL } from "@/lib/site-legal";

export const metadata: Metadata = {
  title: "Cookie Policy — Vyavasth",
  description:
    "How Vyavasth uses cookies and similar technologies across the Studio dashboard and Guest gallery pages, and what we never use cookies for.",
  alternates: { canonical: "/cookie-policy" },
};

const h2 = "text-xl font-semibold mt-2 mb-3 tracking-tight";
const h2Style = { fontFamily: "var(--font-syne)", color: "#1A1208" } as const;
const list = "list-disc pl-5 space-y-2 m-0";
const muted = { color: "#7A6F63" } as const;

const tableWrap = "overflow-x-auto rounded-lg";
const tableStyle = {
  borderCollapse: "collapse" as const,
  border: "1px solid rgba(26,18,8,0.12)",
};
const th = "text-left text-sm font-semibold p-3 align-top";
const thStyle = {
  background: "rgba(26,18,8,0.04)",
  borderBottom: "1px solid rgba(26,18,8,0.12)",
  color: "#1A1208",
} as const;
const td = "text-sm p-3 align-top";
const tdStyle = { borderBottom: "1px solid rgba(26,18,8,0.08)" } as const;

function CookieTable({
  rows,
}: {
  rows: { name: string; purpose: string; type: string; duration: string }[];
}) {
  return (
    <div className={tableWrap}>
      <table className="w-full min-w-[560px]" style={tableStyle}>
        <thead>
          <tr>
            <th className={th} style={thStyle}>Name</th>
            <th className={th} style={thStyle}>Purpose</th>
            <th className={th} style={thStyle}>Type</th>
            <th className={th} style={thStyle}>Duration</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.name}>
              <td className={td} style={tdStyle}>{r.name}</td>
              <td className={td} style={tdStyle}>{r.purpose}</td>
              <td className={td} style={tdStyle}>{r.type}</td>
              <td className={td} style={tdStyle}>{r.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CookiePolicyPage() {
  return (
    <LegalPageShell title="Cookie Policy">
      <p style={muted}>
        This Cookie Policy explains how Vyavasth uses cookies and similar
        technologies across its surfaces — the Studio dashboard and the Guest
        gallery pages — and, just as importantly, what we never use cookies for.
      </p>

      <section>
        <h2 className={h2} style={h2Style}>
          1. What cookies are
        </h2>
        <p>
          Cookies are small text files a website stores in your browser. Some
          are strictly necessary to keep you signed in or to secure a page;
          others are set by infrastructure providers for performance and
          protection. Related technologies such as local storage keep data in
          your browser without using a cookie at all.
        </p>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          2. Cookies on the Studio dashboard
        </h2>
        <p>
          The dashboard (used by Studios and their Members) sets a single
          first-party cookie, plus cookies that Google sets during sign-in:
        </p>
        <CookieTable
          rows={[
            {
              name: "dlp_token",
              purpose:
                "Keeps a signed-in Member authenticated by holding the session token (a JWT). Strictly necessary.",
              type: "First-party, essential",
              duration: "7 days",
            },
            {
              name: "Google account cookies",
              purpose:
                "Set by Google on its own domains during “Sign in with Google” to authenticate you. Vyavasth does not set or read these.",
              type: "Third-party (Google)",
              duration: "Managed by Google",
            },
          ]}
        />
        <p>
          We do not use <code>sessionid</code>, <code>csrftoken</code>, or any
          server-session cookie. The Studio profile (<code>dlp_company</code>)
          is held in your browser&rsquo;s local storage, which is not a cookie.
          Product-analytics cookies are not set.
        </p>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          3. Cookies on Guest gallery pages
        </h2>
        <p>
          On a published gallery, Vyavasth sets no first-party cookie. A
          Guest&rsquo;s session token is stored in the browser&rsquo;s local
          storage, not a cookie. The only cookies a Guest may encounter are:
        </p>
        <CookieTable
          rows={[
            {
              name: "__cf_bm",
              purpose:
                "Set by Cloudflare at the network edge for bot management and security. Cloudflare-controlled infrastructure; not used by Vyavasth for analytics or advertising.",
              type: "Third-party (Cloudflare)",
              duration: "Short-lived (Cloudflare-managed)",
            },
            {
              name: "Google account cookies",
              purpose:
                "Set by Google on its own domains only if a Host signs in with Google. Vyavasth does not set or read these.",
              type: "Third-party (Google)",
              duration: "Managed by Google",
            },
          ]}
        />
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          4. What Vyavasth does not use cookies for
        </h2>
        <p>On any surface — including Guest gallery pages — Vyavasth does not set:</p>
        <ul className={list}>
          <li>advertising or retargeting cookies;</li>
          <li>cross-site tracking cookies;</li>
          <li>
            third-party marketing pixels — there is no Facebook Pixel and no
            Google Ads cookie.
          </li>
        </ul>
        <p>A Guest&rsquo;s presence in a gallery is never used for ad targeting.</p>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          5. Other tracking technologies
        </h2>
        <p>
          Our surfaces are served through Cloudflare, which may set edge
          identifiers such as <code>__cf_bm</code> for security and
          performance. These are Cloudflare-controlled and are not used by
          Vyavasth for analytics or advertising. As noted above, session tokens
          are kept in local storage rather than cookies.
        </p>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          6. Controlling cookies
        </h2>
        <p>
          You can view, block, or delete cookies through your browser settings,
          and clear local storage from the same controls. Blocking strictly
          necessary cookies (such as the dashboard&rsquo;s authentication
          cookie) will prevent you from staying signed in. Because we do not use
          advertising or analytics cookies, there is nothing to opt out of for
          tracking.
        </p>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          7. Updates and contact
        </h2>
        <p>
          We may update this Cookie Policy from time to time and will revise
          the &ldquo;Last Updated&rdquo; date above. Questions about this
          policy:{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-[#C25A3A] underline">
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
      </section>
    </LegalPageShell>
  );
}
