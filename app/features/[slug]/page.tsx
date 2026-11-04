import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { whatsappUrl } from "@/lib/site-legal";
import { featureBySlug, sectionId, type Figure } from "@/lib/feature-pages";
import { competitorBySlug } from "@/lib/compare-data";
import HeroVideo from "../HeroVideo";
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

const absolute = (path: string) => (path.startsWith("/") ? `https://vyavasth.in${path}` : path);

/** "2026-10-28" -> "28 October 2026" */
const longDate = (iso: string) =>
  new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" }).format(
    new Date(`${iso}T00:00:00Z`),
  );

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
      ...(p.updated ? { dateModified: p.updated } : {}),
      isPartOf: { "@id": "https://vyavasth.in/#website" },
      about: { "@id": "https://vyavasth.in/#software" },
    },
    ...(p.video?.youtubeId
      ? [
          {
            "@context": "https://schema.org",
            "@type": "VideoObject",
            name: p.h1,
            description: p.metaDescription,
            thumbnailUrl: absolute(p.video.poster),
            contentUrl: absolute(p.video.src),
            embedUrl: `https://www.youtube.com/embed/${p.video.youtubeId}`,
            ...(p.updated ? { uploadDate: p.updated } : {}),
          },
        ]
      : []),
  ];

  const related = p.related
    .map((s) => featureBySlug(s))
    .filter((r): r is NonNullable<typeof r> => r !== undefined);

  // The hero shows `hero`, else the first figure from the details. In the
  // second case that figure is shown once, in the hero, not again below.
  // A video, when there is one, takes the hero's place.
  const video = p.video;
  const firstSectionFigure = p.sections.find((s) => s.figure)?.figure;
  const hero = video ? undefined : (p.hero ?? firstSectionFigure);
  const heroIsSectionFigure = !video && !p.hero && firstSectionFigure !== undefined;
  const hasMedia = Boolean(video || hero);
  const compare = (p.compare ?? [])
    .map((slug) => competitorBySlug(slug))
    .filter((c): c is NonNullable<typeof c> => c !== undefined);
  const changelog = [...(p.changelog ?? [])].sort((a, b) => (a.date < b.date ? 1 : -1)).slice(0, 5);
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
          <div className={`${styles.heroGrid} ${hasMedia ? "" : styles.solo}`}>
            <div>
              <p className={styles.crumb}>
                <Link href="/features">Features</Link>
              </p>
              <h1 className={styles.h1}>{p.h1}</h1>
              <p className={styles.lede}>{lede}</p>
              {p.updated && <p className={styles.updated}>Last updated {longDate(p.updated)}</p>}
              <div className={styles.actions}>
                <a className={styles.primary} href={whatsapp} target="_blank" rel="noopener noreferrer">
                  Chat on WhatsApp
                </a>
                <Link className={styles.secondary} href="/pricing">
                  See pricing
                </Link>
              </div>
            </div>
            {video && (
              <figure className={`${styles.frame} ${video.height > video.width ? styles.phone : ""}`}>
                <div className={styles.frameBox}>
                  <HeroVideo video={video} />
                </div>
                <figcaption className={styles.cap}>{video.caption}</figcaption>
                {video.youtubeId && (
                  <a
                    className={styles.capLink}
                    href={`https://www.youtube.com/watch?v=${video.youtubeId}`}
                    target="_blank"
                    rel="noopener"
                  >
                    Watch the full demo on YouTube
                  </a>
                )}
              </figure>
            )}
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

        {p.fit && (
          <section className={`${styles.wrap} ${styles.section}`} aria-label="Is it for you?">
            <div className={styles.fitGrid}>
              <div className={styles.fitCard}>
                <h2>Made for you if</h2>
                <ul>
                  {p.fit.forYou.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
              <div className={styles.fitCard}>
                <h2>Not the right fit if</h2>
                <ul>
                  {p.fit.notForYou.map((x) => (
                    <li key={x}>{x}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>
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
          <div className={styles.details}>
            <h2 className={`${styles.h2} ${styles.detailsHead}`}>The details</h2>
            <div className={styles.main}>
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
                  <section key={s.h2} id={sectionId(s.h2)} className={styles.dsec}>
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
                  </section>
                );
              })}
              {changelog.length > 0 && (
                <section className={`${styles.dsec} ${styles.updates}`}>
                  <h2>What&apos;s new</h2>
                  <ul>
                    {changelog.map((c) => (
                      <li key={`${c.date}-${c.text}`}>
                        <time dateTime={c.date}>{longDate(c.date)}</time>
                        <span>{c.text}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}
            </div>
            <aside className={styles.rail}>
              <nav className={styles.toc} aria-label="On this page">
                <h2>On this page</h2>
                <ul>
                  {p.sections.map((s) => (
                    <li key={s.h2}>
                      <a href={`#${sectionId(s.h2)}`}>{s.h2}</a>
                    </li>
                  ))}
                  <li>
                    <a href="#questions">Questions</a>
                  </li>
                </ul>
              </nav>
              <div className={styles.railCard}>
                <p>See it on your next wedding.</p>
                <a className={styles.primary} href={whatsapp} target="_blank" rel="noopener noreferrer">
                  Chat on WhatsApp
                </a>
                <p className={styles.railLink}>
                  <Link href="/pricing" style={{ color: "var(--terra)", fontWeight: 600, textDecoration: "underline" }}>
                    See pricing
                  </Link>
                </p>
              </div>
              {compare.length > 0 && (
                <div className={styles.railCard}>
                  <h2>Comparing tools?</h2>
                  <ul>
                    {compare.map((c) => (
                      <li key={c.slug}>
                        <Link href={`/compare/${c.slug}`}>Vyavasth vs {c.name}</Link>
                      </li>
                    ))}
                    <li>
                      <Link href="/compare">All comparisons</Link>
                    </li>
                  </ul>
                </div>
              )}
            </aside>
          </div>
        </section>

        <section id="questions" className={`${styles.wrap} ${styles.section}`} style={{ scrollMarginTop: 96 }}>
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
