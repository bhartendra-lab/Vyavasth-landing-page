import type { Metadata } from "next";
import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { whatsappUrl } from "@/lib/site-legal";
import { CHECKED_ON, CHECKED_ON_LABEL, COMPETITORS, HUB_ONLY } from "@/lib/compare-data";
import f from "../features/feature.module.css";
import styles from "./compare.module.css";
import { Ext, SeePrices, firstSentence, loadVyavasth } from "./shared";

// Rendered per request. Prerendered pages under a dynamic segment 404 on our
// Cloudflare (OpenNext) hosting, so no /compare route is prerendered.
export const dynamic = "force-dynamic";

const SITE = "https://vyavasth.in";
const TITLE = "AI face search photo sharing apps in India: 2026 price comparison | Vyavasth";
const DESCRIPTION = `Kwikpic, FotoOwl, Samaro, PicPapaya, FaceSnap, Photomall, Kamero and Vyavasth compared for Indian studios: how each is priced, entry price, GST and album selection. Checked ${CHECKED_ON_LABEL}.`;

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/compare" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/compare",
    type: "website",
    siteName: "Vyavasth",
    locale: "en_IN",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: TITLE }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/og-image.png"] },
};

export default async function CompareHubPage() {
  const v = await loadVyavasth();

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: "Compare", item: `${SITE}/compare` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      itemListElement: COMPETITORS.map((c, i) => ({
        "@type": "ListItem",
        position: i + 1,
        url: `${SITE}/compare/${c.slug}`,
        name: `Vyavasth vs ${c.name}`,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: TITLE,
      url: `${SITE}/compare`,
      description: DESCRIPTION,
      dateModified: CHECKED_ON,
      isPartOf: { "@id": `${SITE}/#website` },
      about: { "@id": `${SITE}/#software` },
    },
  ];

  const sources = [
    ...COMPETITORS.flatMap((c) => c.sources),
    ...HUB_ONLY.map((t) => t.source),
  ];

  return (
    <div className={f.page}>
      <Nav />
      <main>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

        <section className={`${f.wrap} ${f.hero}`}>
          <div style={{ maxWidth: 860 }}>
            <p className={f.crumb}>
              <Link href="/">Home</Link>
            </p>
            <h1 className={f.h1}>AI face search photo sharing apps in India, compared</h1>
            <p className={f.lede}>
              How the photo delivery tools Indian studios ask about are priced, what the cheapest paid plan costs,
              whether GST is extra, and whether album selection is included. Every price is from the tool&apos;s own
              website on {CHECKED_ON_LABEL}. We make Vyavasth, so we also say where the others are better.
            </p>
          </div>
        </section>

        <section className={`${f.wrap}`}>
          <div className={styles.box}>
            <div className={styles.tableWrap}>
              <table className={`${styles.table} ${styles.wide}`}>
                <caption>Photo delivery tools for Indian studios, compared</caption>
                <thead>
                  <tr>
                    {["Tool", "How it is priced", "Entry price", "GST", "Album selection", "Details"].map((h) => (
                      <th key={h} scope="col">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row">Vyavasth</th>
                    <td>Pay per event, or yearly storage</td>
                    <td>{v.hubEntry ?? <SeePrices />}</td>
                    <td>{v.hubGst ?? <SeePrices />}</td>
                    <td>Collections, side filters and Locate Originals, on every plan</td>
                    <td>
                      <Link href="/pricing">Vyavasth pricing</Link>
                    </td>
                  </tr>
                  {COMPETITORS.map((c) => (
                    <tr key={c.slug}>
                      <th scope="row">{c.name}</th>
                      <td>{c.hub.pricedBy}</td>
                      <td>{c.hub.entry}</td>
                      <td>{c.hub.gst}</td>
                      <td>{c.hub.albumSelection}</td>
                      <td>
                        <Link href={`/compare/${c.slug}`}>Vyavasth vs {c.name}</Link>
                      </td>
                    </tr>
                  ))}
                  {HUB_ONLY.map((t) => (
                    <tr key={t.name}>
                      <th scope="row">{t.name}</th>
                      <td>{t.hub.pricedBy}</td>
                      <td>{t.hub.entry}</td>
                      <td>{t.hub.gst}</td>
                      <td>{t.hub.albumSelection}</td>
                      <td>
                        {t.note} <Ext href={t.source.url}>{t.source.label}</Ext>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className={`${f.wrap} ${f.section} ${styles.pick}`}>
          <h2 className={f.h2}>Which one should you choose?</h2>
          {COMPETITORS.map((c) => (
            <p key={c.slug}>
              {firstSentence(c.verdict)} <Link href={`/compare/${c.slug}`}>Vyavasth vs {c.name}</Link>
            </p>
          ))}
        </section>

        <section className={`${f.wrap} ${f.section} ${styles.sources}`}>
          <h2 className={f.h2}>Sources</h2>
          <ul>
            {sources.map((s) => (
              <li key={s.url}>
                <Ext href={s.url}>{s.label}</Ext>: {s.url}
              </li>
            ))}
          </ul>
          <p className={styles.fine} style={{ marginTop: 20 }}>
            Checked on {CHECKED_ON_LABEL}. If something has changed, tell us on{" "}
            <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" style={{ color: "var(--terra)", textDecoration: "underline" }}>
              WhatsApp
            </a>{" "}
            and we will update this page.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
