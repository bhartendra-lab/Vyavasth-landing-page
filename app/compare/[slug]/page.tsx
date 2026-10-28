import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { whatsappUrl } from "@/lib/site-legal";
import { formatInr } from "@/lib/plans";
import {
  CHECKED_ON,
  CHECKED_ON_LABEL,
  COMPETITORS,
  competitorBySlug,
  withGst,
  type CompetitorPlan,
} from "@/lib/compare-data";
import f from "../../features/feature.module.css";
import styles from "../compare.module.css";
import { Ext, SeePrices, loadVyavasth } from "../shared";

// Rendered per request. Prerendered pages under a dynamic segment 404 on our
// Cloudflare (OpenNext) hosting. Unknown slugs 404 through notFound() below.
export const dynamic = "force-dynamic";

const SITE = "https://vyavasth.in";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = competitorBySlug(slug);
  if (!c) return { robots: { index: false } };
  const url = `/compare/${c.slug}`;
  return {
    title: c.title,
    description: c.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: c.title,
      description: c.metaDescription,
      url,
      type: "website",
      siteName: "Vyavasth",
      locale: "en_IN",
      images: [{ url: "/og-image.png", width: 1200, height: 630, alt: c.title }],
    },
    twitter: { card: "summary_large_image", title: c.title, description: c.metaDescription, images: ["/og-image.png"] },
  };
}

/** "₹3,490 a year + GST", "Free", "Not published" */
function listedText(p: CompetitorPlan): string {
  if (p.listedPerYear === null) return "Not published";
  if (p.listedPerYear === 0) return "Free";
  const suffix = p.gstIncluded === false ? " + GST" : p.gstIncluded === null ? " (GST not stated)" : "";
  return `${formatInr(p.listedPerYear)} a year${suffix}`;
}

function withGstText(p: CompetitorPlan): string {
  const n = withGst(p);
  if (n === null) return "Not published";
  if (n === 0) return "Free";
  return `${formatInr(n)} a year`;
}

export default async function ComparePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const c = competitorBySlug(slug);
  if (!c) notFound();

  const v = await loadVyavasth();
  const url = `${SITE}/compare/${c.slug}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: c.faqs.map((x) => ({
        "@type": "Question",
        name: x.q,
        acceptedAnswer: { "@type": "Answer", text: x.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: "Compare", item: `${SITE}/compare` },
        { "@type": "ListItem", position: 3, name: c.h1, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: c.title,
      url,
      description: c.metaDescription,
      dateModified: CHECKED_ON,
      isPartOf: { "@id": `${SITE}/#website` },
      about: { "@id": `${SITE}/#software` },
    },
  ];

  const others = COMPETITORS.filter((o) => o.slug !== c.slug);
  const hasVyavasthPrices = v.event !== null || v.tiers.length > 0;

  return (
    <div className={f.page}>
      <Nav />
      <main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <section className={`${f.wrap} ${f.hero}`}>
          <div style={{ maxWidth: 860 }}>
            <p className={f.crumb}>
              <Link href="/compare">Compare</Link>
            </p>
            <h1 className={f.h1}>{c.h1}</h1>
            <p className={styles.muted}>Prices and features checked on {CHECKED_ON_LABEL}.</p>
            <p className={styles.verdict}>{c.verdict}</p>
            <div className={f.actions}>
              <a
                className={f.primary}
                href={whatsappUrl("Hi, I am comparing Vyavasth with " + c.name)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Chat on WhatsApp
              </a>
              <Link className={f.secondary} href="/pricing">
                See Vyavasth pricing
              </Link>
            </div>
          </div>
        </section>

        <section className={`${f.wrap} ${f.section}`}>
          <h2 className={f.h2}>Price comparison</h2>
          <p className={styles.intro}>{c.pricingModel}</p>
          <div className={`${styles.twoUp} ${styles.prices}`}>
            <div className={styles.box}>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <caption>Vyavasth</caption>
                  <thead>
                    <tr>
                      {["Plan", "What you get", "Price you pay"].map((h) => (
                        <th key={h} scope="col">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {hasVyavasthPrices ? (
                      <>
                        {v.event && (
                          <tr>
                            <th scope="row">Pay per event</th>
                            <td>{v.event.what}</td>
                            <td>{v.event.price}</td>
                          </tr>
                        )}
                        {v.tiers.map((t) => (
                          <tr key={t.size}>
                            <th scope="row">{t.size}</th>
                            <td>{t.what}</td>
                            <td>{t.price}</td>
                          </tr>
                        ))}
                      </>
                    ) : (
                      <tr>
                        <th scope="row">Vyavasth plans</th>
                        <td>Pay per event, or yearly storage</td>
                        <td>
                          <SeePrices />
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className={styles.box}>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <caption>{c.name}</caption>
                  <thead>
                    <tr>
                      {["Plan", "What you get", "Listed price", "With 18% GST"].map((h) => (
                        <th key={h} scope="col">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {c.plans.map((p) => (
                      <tr key={p.name}>
                        <th scope="row">
                          {p.name}
                          {p.note && <span className={styles.small}>{p.note}</span>}
                        </th>
                        <td>{p.limit}</td>
                        <td>{listedText(p)}</td>
                        <td>{withGstText(p)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <p className={styles.note}>
            {c.pricingNote} Source:{" "}
            {c.sources.map((s, i) => (
              <span key={s.url}>
                {i > 0 && ", "}
                <Ext href={s.url}>{s.label}</Ext>
              </span>
            ))}
            .
          </p>
        </section>

        <section className={`${f.wrap} ${f.section}`}>
          <h2 className={f.h2}>Feature by feature</h2>
          <div className={styles.box} style={{ marginTop: 24 }}>
            <div className={styles.tableWrap}>
              <table className={styles.table} style={{ minWidth: 640 }}>
                <caption className={styles.srOnly}>
                  Vyavasth and {c.name}, feature by feature
                </caption>
                <thead>
                  <tr>
                    <th scope="col">
                      <span className={styles.srOnly}>Feature</span>
                    </th>
                    <th scope="col">Vyavasth</th>
                    <th scope="col">{c.name}</th>
                  </tr>
                </thead>
                <tbody>
                  {c.rows.map((r) => (
                    <tr key={r.label}>
                      <th scope="row">{r.label}</th>
                      <td>{r.vyavasth}</td>
                      <td>{r.competitor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className={`${f.wrap} ${f.section}`}>
          <div className={`${styles.twoUp} ${styles.cards}`} style={{ marginTop: 0 }}>
            <div className={styles.card}>
              <h2>Where {c.name} is better</h2>
              <ul>
                {c.theyAreBetterAt.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
            <div className={styles.card}>
              <h2>Where Vyavasth is better</h2>
              <ul>
                {c.vyavasthIsBetterAt.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className={`${f.wrap} ${f.section}`}>
          <h2 className={f.h2}>Which one should you choose?</h2>
          <div className={`${styles.twoUp} ${styles.cards}`}>
            <div className={styles.card}>
              <h3>Choose {c.name} if</h3>
              <ul>
                {c.chooseThemIf.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
            <div className={styles.card}>
              <h3>Choose Vyavasth if</h3>
              <ul>
                {c.chooseVyavasthIf.map((x) => (
                  <li key={x}>{x}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className={`${f.wrap} ${f.section}`}>
          <h2 className={f.h2}>Questions</h2>
          <div className={f.faq}>
            {c.faqs.map((x) => (
              <details key={x.q}>
                <summary>
                  <h3>{x.q}</h3>
                </summary>
                <p>{x.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className={`${f.wrap}`} style={{ paddingBottom: "clamp(48px, 6vw, 84px)" }}>
          <p className={styles.fine} style={{ marginTop: 0 }}>
            {c.name} is a trademark of its owner. Details about {c.name} come from its public website on{" "}
            {CHECKED_ON_LABEL}. If something has changed, tell us on{" "}
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" style={{ color: "var(--terra)", textDecoration: "underline" }}>
              WhatsApp
            </a>{" "}
            and we will update this page.
          </p>
          <h2 className={f.h2} style={{ marginTop: "clamp(32px, 4vw, 48px)", fontSize: "clamp(22px, 2.4vw, 30px)" }}>
            More comparisons
          </h2>
          <ul className={styles.more}>
            {others.map((o) => (
              <li key={o.slug}>
                <Link href={`/compare/${o.slug}`}>Vyavasth vs {o.name}</Link>
              </li>
            ))}
            <li>
              <Link href="/compare">All comparisons</Link>
            </li>
          </ul>
        </section>
      </main>
      <Footer />
    </div>
  );
}
