import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { whatsappUrl } from "@/lib/site-legal";
import { featureBySlug, type Figure } from "@/lib/feature-pages";
import styles from "../feature.module.css";

// Rendered per request, like the blog. Prerendered pages under a dynamic
// segment 404 on Cloudflare (OpenNext has no incremental cache configured).
// Unknown slugs still 404 through notFound() below.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const p = featureBySlug(slug);
  if (!p) return {};
  const url = `/features/${p.slug}`;
  return {
    title: p.title,
    description: p.metaDescription,
    alternates: { canonical: url },
    openGraph: { title: p.title, description: p.metaDescription, url },
  };
}

const firstSentence = (s: string) => s.split(/(?<=\.)\s/)[0];

function FigureImage({ figure, priority }: { figure: Figure; priority?: boolean }) {
  return (
    <Image
      src={figure.src}
      alt={figure.alt}
      width={figure.width}
      height={figure.height}
      unoptimized
      priority={priority}
    />
  );
}

export default async function FeaturePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const p = featureBySlug(slug);
  if (!p) notFound();

  const url = `https://vyavasth.in/features/${p.slug}`;
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: p.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://vyavasth.in/" },
        { "@type": "ListItem", position: 2, name: "Features", item: "https://vyavasth.in/features" },
        { "@type": "ListItem", position: 3, name: p.navLabel, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: p.title,
      url,
      description: p.metaDescription,
      isPartOf: { "@id": "https://vyavasth.in/#website" },
      about: { "@id": "https://vyavasth.in/#software" },
    },
  ];

  const related = p.related
    .map((s) => featureBySlug(s))
    .filter((r): r is NonNullable<typeof r> => r !== undefined);

  // The hero shows `hero`, else the first figure from the details. In the
  // second case that figure is shown once, in the hero, not again below.
  const firstSectionFigure = p.sections.find((s) => s.figure)?.figure;
  const hero = p.hero ?? firstSectionFigure;
  const heroIsSectionFigure = !p.hero && firstSectionFigure !== undefined;
  const lede = p.lede ?? firstSentence(p.summary);
  const whatsapp = whatsappUrl(p.whatsappText);

  return (
    <div className={styles.page}>
      <Nav />
      <main>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        <section className={`${styles.wrap} ${styles.hero}`}>
          <div className={`${styles.heroGrid} ${hero ? "" : styles.solo}`}>
            <div>
              <p className={styles.crumb}>
                <Link href="/features">Features</Link>
              </p>
              <h1 className={styles.h1}>{p.h1}</h1>
              <p className={styles.lede}>{lede}</p>
              <div className={styles.actions}>
                <a className={styles.primary} href={whatsapp} target="_blank" rel="noopener noreferrer">
                  Chat on WhatsApp
                </a>
                <Link className={styles.secondary} href="/pricing">
                  See pricing
                </Link>
              </div>
            </div>
            {hero && (
              <figure className={`${styles.frame} ${hero.mobile ? styles.phone : ""}`}>
                <div className={styles.frameBox}>
                  <FigureImage figure={hero} priority />
                </div>
                <figcaption className={styles.cap}>{hero.caption}</figcaption>
              </figure>
            )}
          </div>
        </section>

        <section className={`${styles.wrap} ${styles.section}`}>
          <h2 className={styles.h2}>{p.stepsHeading}</h2>
          <ol className={styles.steps}>
            {p.steps.map((step, i) => (
              <li key={step.title} className={styles.step}>
                {step.image && (
                  <Image
                    className={styles.stepImg}
                    src={step.image.src}
                    alt={step.image.alt}
                    width={step.image.width}
                    height={step.image.height}
                    unoptimized
                  />
                )}
                <span className={styles.num} aria-hidden>
                  {i + 1}
                </span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </section>

        {p.benefits && p.benefits.length > 0 && (
          <div className={styles.band}>
            <section className={`${styles.wrap} ${styles.section}`} aria-label="Benefits">
              <ul className={styles.benefits}>
                {p.benefits.map((b) => (
                  <li key={b.title} className={styles.benefit}>
                    <h3>{b.title}</h3>
                    <p>{b.text}</p>
                  </li>
                ))}
              </ul>
            </section>
          </div>
        )}

        {p.quote && (
          <section className={`${styles.wrap} ${styles.section}`} aria-label="What studios say">
            <figure className={styles.quoteCard}>
              <blockquote>{p.quote.text}</blockquote>
              <figcaption>
                <strong>{p.quote.studio}</strong>, {p.quote.city}
              </figcaption>
            </figure>
          </section>
        )}

        <section className={`${styles.wrap} ${styles.section}`}>
          <div className={styles.reading}>
            <h2 className={styles.h2}>The details</h2>
            {p.sections.map((s) => {
              const bulletsFirst = s.paragraphs?.[0]?.startsWith("Filters combine");
              const paragraphs = s.paragraphs?.map((t) => <p key={t}>{t}</p>);
              const bullets = s.bullets && (
                <ul>
                  {s.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              );
              const figure = heroIsSectionFigure && s.figure === hero ? undefined : s.figure;
              return (
                <div key={s.h2} className={styles.dsec}>
                  <h2>{s.h2}</h2>
                  {bulletsFirst ? (
                    <>
                      {bullets}
                      {paragraphs}
                    </>
                  ) : (
                    <>
                      {paragraphs}
                      {bullets}
                    </>
                  )}
                  {figure && (
                    <figure className={`${styles.fig} ${figure.mobile ? styles.mobile : ""}`}>
                      <FigureImage figure={figure} />
                      <figcaption>{figure.caption}</figcaption>
                    </figure>
                  )}
                  {s.table && (
                    <div className={styles.tableWrap}>
                      <table className={styles.table}>
                        <caption>{s.table.caption}</caption>
                        <thead>
                          <tr>
                            {s.table.head.map((h, i) => (
                              <th key={i} scope="col">
                                {h}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {s.table.rows.map((row) => (
                            <tr key={row[0]}>
                              {row.map((cell, i) =>
                                i === 0 ? (
                                  <th key={i} scope="row">
                                    {cell}
                                  </th>
                                ) : (
                                  <td key={i}>{cell}</td>
                                ),
                              )}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        <section className={`${styles.wrap} ${styles.section}`}>
          <h2 className={styles.h2}>Questions</h2>
          <div className={styles.faq}>
            {p.faqs.map((f) => (
              <details key={f.q}>
                <summary>
                  <h3>{f.q}</h3>
                </summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        <section className={`${styles.wrap} ${styles.section}`}>
          <h2 className={styles.h2}>Related features</h2>
          <ul className={styles.related}>
            {related.map((r) => (
              <li key={r.slug}>
                <Link className={styles.card} href={`/features/${r.slug}`}>
                  <span className={styles.cardTitle}>{r.navLabel}</span>
                  <span className={styles.cardText}>{firstSentence(r.summary)}</span>
                </Link>
              </li>
            ))}
          </ul>
          <Link className={styles.all} href="/features">
            All features
          </Link>
        </section>

        <div className={styles.wrap}>
          <section className={styles.final}>
            <h2>See it on your next wedding.</h2>
            <a className={styles.primary} href={whatsapp} target="_blank" rel="noopener noreferrer">
              Chat on WhatsApp
            </a>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
}
