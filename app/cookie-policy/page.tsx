import type { Metadata } from "next";
import LegalPageShell from "@/components/LegalPageShell";
import { BUSINESS_NAME, SUPPORT_EMAIL } from "@/lib/site-legal";

export const metadata: Metadata = {
  title: "Cookie Policy — Vyavasth",
  description:
    "What cookies Vyavasth uses on the Studio dashboard and Guest gallery pages, and what we never use cookies for.",
  alternates: { canonical: "/cookie-policy" },
};

const h2 = "text-xl font-semibold mt-2 mb-3 tracking-tight";
const h2Style = { fontFamily: "var(--font-syne)", color: "#1A1208" } as const;
const list = "list-disc pl-5 space-y-2 m-0";
const muted = { color: "#7A6F63" } as const;

const cell: React.CSSProperties = {
  border: "1px solid rgba(43,31,23,0.10)",
  padding: "10px 12px",
  textAlign: "left",
  verticalAlign: "top",
  fontSize: 14,
};
const headCell: React.CSSProperties = {
  ...cell,
  fontWeight: 600,
  color: "#1A1208",
  background: "rgba(43,31,23,0.04)",
  fontFamily: "var(--font-syne)",
};

function CookieTable({ rows }: { rows: [string, string, string, string][] }) {
  return (
    <div className="w-full overflow-x-auto">
      <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 520 }}>
        <thead>
          <tr>
            <th style={headCell}>Name</th>
            <th style={headCell}>Purpose</th>
            <th style={headCell}>Type</th>
            <th style={headCell}>Duration</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              <td style={{ ...cell, fontFamily: "var(--font-mono, monospace)" }}>{r[0]}</td>
              <td style={cell}>{r[1]}</td>
              <td style={cell}>{r[2]}</td>
              <td style={cell}>{r[3]}</td>
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
        This Cookie Policy explains how {BUSINESS_NAME} uses cookies and similar
        technologies across its surfaces — the Studio dashboard and the Guest
        gallery pages — and, just as importantly, what we never use cookies for.
      </p>

      <section>
        <h2 className={h2} style={h2Style}>
          1. What cookies are
        </h2>
        <p>
          Cookies are small text files a website stores in your browser. Some are
          strictly necessary to keep you signed in or to secure a page; others are
          set by infrastructure providers for performance and protection. Related
          technologies such as <strong>local storage</strong> keep data in your
          browser without using a cookie at all.
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
            [
              "dlp_token",
              "Keeps a signed-in Member authenticated by holding the session token (a JWT). Strictly necessary.",
              "First-party, essential",
              "7 days",
            ],
            [
              "Google account cookies",
              "Set by Google on its own domains during “Sign in with Google” to authenticate you. Vyavasth does not set or read these.",
              "Third-party (Google)",
              "Managed by Google",
            ],
          ]}
        />
        <p style={muted}>
          We do not use <code>sessionid</code>, <code>csrftoken</code>, or any
          server-session cookie. The Studio profile (<code>dlp_company</code>) is
          held in your browser&rsquo;s local storage, which is not a cookie.
          Product-analytics cookies are not set.
        </p>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          3. Cookies on Guest gallery pages
        </h2>
        <p>
          On a published gallery, <strong>Vyavasth sets no first-party cookie</strong>.
          A Guest&rsquo;s session token is stored in the browser&rsquo;s local
          storage, not a cookie. The only cookies a Guest may encounter are:
        </p>
        <CookieTable
          rows={[
            [
              "__cf_bm",
              "Set by Cloudflare at the network edge for bot management and security. Cloudflare-controlled infrastructure; not used by Vyavasth for analytics or advertising.",
              "Third-party (Cloudflare)",
              "Short-lived (Cloudflare-managed)",
            ],
            [
              "Google account cookies",
              "Set by Google on its own domains only if a Host signs in with Google. Vyavasth does not set or read these.",
              "Third-party (Google)",
              "Managed by Google",
            ],
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
            third-party marketing pixels — there is <strong>no Facebook Pixel</strong>{" "}
            and <strong>no Google Ads</strong> cookie.
          </li>
        </ul>
        <p>
          A Guest&rsquo;s presence in a gallery is never used for ad targeting.
        </p>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          5. Other tracking technologies
        </h2>
        <p>
          Our surfaces are served through <strong>Cloudflare</strong>, which may
          set edge identifiers such as <code>__cf_bm</code> for security and
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
          necessary cookies (such as the dashboard&rsquo;s authentication cookie)
          will prevent you from staying signed in. Because we do not use
          advertising or analytics cookies, there is nothing to opt out of for
          tracking.
        </p>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          7. Updates and contact
        </h2>
        <p>
          We may update this Cookie Policy from time to time and will revise the
          &ldquo;Last Updated&rdquo; date above. Questions about this policy:{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-[#4F46E5] underline">
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
      </section>
    </LegalPageShell>
  );
}
