import Image from "next/image";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import LegalPageShell from "@/components/LegalPageShell";
import { whatsappUrl } from "@/lib/site-legal";
import { FEATURE_PAGES, featureBySlug } from "@/lib/feature-pages";

export const dynamicParams = false;

export function generateStaticParams() {
  return FEATURE_PAGES.map((p) => ({ slug: p.slug }));
}

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

const h2 = "text-xl font-semibold mt-2 mb-3 tracking-tight";
const h2Style = { fontFamily: "var(--font-syne)", color: "#1A1208" } as const;
const list = "list-disc pl-5 space-y-2 m-0";
const quote = "border-l-2 border-[#C25A3A] pl-4 italic m-0";
const link = "text-[#C25A3A] underline";

const firstSentence = (s: string) => s.split(/(?<=\.)\s/)[0];

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

  return (
    <LegalPageShell title={p.h1}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <p className="text-lg m-0">{p.summary}</p>

      <section>
        <h2 className={h2} style={h2Style}>
          {p.stepsHeading}
        </h2>
        <ol className="list-none p-0 m-0 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {p.steps.map((step, i) => (
            <li key={step.title} className="flex gap-3">
              <span
                className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold text-white"
                style={{ backgroundColor: "#C25A3A" }}
                aria-hidden
              >
                {i + 1}
              </span>
              <div>
                <strong>{step.title}</strong>
                <p className="mt-1 mb-0">{step.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {p.sections.map((s) => {
        const bulletsFirst = s.paragraphs?.[0]?.startsWith("Filters combine");
        const paragraphs = s.paragraphs?.map((t) => <p key={t}>{t}</p>);
        const bullets = s.bullets && (
          <ul className={list}>
            {s.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        );
        return (
          <section key={s.h2} className="flex flex-col gap-3">
            <h2 className={h2} style={h2Style}>
              {s.h2}
            </h2>
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
            {s.figure && (
              <figure className={s.figure.mobile ? "mx-auto w-full max-w-[320px] my-2" : "w-full my-2"}>
                <Image
                  src={s.figure.src}
                  alt={s.figure.alt}
                  width={s.figure.width}
                  height={s.figure.height}
                  unoptimized
                  className="w-full h-auto rounded-xl border border-[rgba(26,18,8,0.08)]"
                />
                <figcaption className="text-sm text-center mt-2" style={{ color: "#7A6F63" }}>
                  {s.figure.caption}
                </figcaption>
              </figure>
            )}
            {s.table && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <caption className="text-left font-semibold mb-2">{s.table.caption}</caption>
                  <thead>
                    <tr>
                      {s.table.head.map((h, i) => (
                        <th
                          key={i}
                          scope="col"
                          className="text-left font-bold py-2.5 px-3 align-top border-b border-[rgba(26,18,8,0.08)]"
                        >
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
                            <th
                              key={i}
                              scope="row"
                              className="text-left font-medium py-2.5 px-3 align-top border-b border-[rgba(26,18,8,0.08)]"
                            >
                              {cell}
                            </th>
                          ) : (
                            <td
                              key={i}
                              className="py-2.5 px-3 align-top border-b border-[rgba(26,18,8,0.08)]"
                            >
                              {cell}
                            </td>
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

      {p.quote && (
        <section className="flex flex-col gap-3">
          <h2 className={h2} style={h2Style}>
            What studios say
          </h2>
          <blockquote className={quote}>{p.quote.text}</blockquote>
          <p className="m-0">
            <strong>{p.quote.studio}</strong>, {p.quote.city}
          </p>
        </section>
      )}

      <section className="flex flex-col gap-4">
        <h2 className={h2} style={h2Style}>
          Questions
        </h2>
        {p.faqs.map((f) => (
          <div key={f.q}>
            <h3 className="text-base font-semibold m-0 mb-1">{f.q}</h3>
            <p className="m-0">{f.a}</p>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-3">
        <p className="m-0">See it on your next wedding.</p>
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <a
            href={whatsappUrl(p.whatsappText)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-semibold text-white transition-all duration-200 hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C25A3A]/50 no-underline w-full sm:w-auto text-center"
            style={{ backgroundColor: "#C25A3A", fontFamily: "var(--font-dm-sans)" }}
          >
            Chat on WhatsApp
          </a>
          <Link href="/pricing" className={link}>
            See pricing
          </Link>
        </div>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          Related features
        </h2>
        <ul className={list}>
          {related.map((r) => (
            <li key={r.slug}>
              <Link href={`/features/${r.slug}`} className={link}>
                {r.navLabel}
              </Link>
              <p className="m-0">{firstSentence(r.summary)}</p>
            </li>
          ))}
        </ul>
        <p className="mt-4 mb-0">
          <Link href="/features" className={link}>
            All features
          </Link>
        </p>
      </section>
    </LegalPageShell>
  );
}
