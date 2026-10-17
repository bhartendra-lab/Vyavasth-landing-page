import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { whatsappUrl } from "@/lib/site-legal";
import { authorById } from "@/lib/blog/authors";
import {
  CATEGORY_LABELS,
  formatPostDate,
  pageTitle,
  postBySlug,
  relatedPosts,
  todayInIndia,
} from "@/lib/blog";
import styles from "../blog.module.css";

// Rendered per request so a post appears on its own date without a redeploy.
export const dynamic = "force-dynamic";

const SITE = "https://vyavasth.in";
const FAQ_HEADING = "Frequently asked questions";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = postBySlug(slug, todayInIndia());
  if (!post) return { robots: { index: false } };
  const title = pageTitle(post);
  const url = `/blog/${post.slug}`;
  const image = { url: post.image, width: 1200, height: 630, alt: post.title };
  return {
    title,
    description: post.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description: post.description,
      url,
      publishedTime: post.date,
      modifiedTime: post.updated ?? post.date,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: post.description,
      images: [post.image],
    },
  };
}

const muted = "#7A6F63";
const h2 = "text-xl font-semibold mt-2 mb-3 tracking-tight";
const h2Style = { fontFamily: "var(--font-syne)", color: "#1A1208" } as const;
const link = "text-[#C25A3A] underline";

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const today = todayInIndia();
  const post = postBySlug(slug, today);
  if (!post) notFound();
  const author = authorById(post.author);
  if (!author) notFound();
  const authorUrl = `${SITE}/blog/author/${author.id}`;

  const url = `${SITE}/blog/${post.slug}`;
  const category = CATEGORY_LABELS[post.category];
  const more = relatedPosts(post, today);
  const toc = post.headings.filter((h) => h.text !== FAQ_HEADING);

  const jsonLd: object[] = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: post.date,
      dateModified: post.updated ?? post.date,
      author: { "@id": `${authorUrl}#person`, "@type": "Person", name: author.name },
      publisher: { "@id": `${SITE}/#organization` },
      mainEntityOfPage: url,
      image: `${SITE}${post.image}`,
      inLanguage: "en-IN",
      wordCount: post.wordCount,
      articleSection: category,
      isPartOf: { "@id": `${SITE}/blog#blog` },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: "Blog", item: `${SITE}/blog` },
        { "@type": "ListItem", position: 3, name: post.title, item: url },
      ],
    },
  ];
  if (post.faqs.length > 0) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: post.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--color-bg)" }}>
      <Nav />
      <main className="flex-1 pt-24 pb-16 px-6 lg:px-8">
        <article
          className="max-w-[680px] mx-auto w-full"
          style={{ fontFamily: "var(--font-dm-sans)", color: "#1A1208" }}
        >
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          />

          <nav aria-label="Breadcrumb" className="text-sm mb-4" style={{ color: muted }}>
            <Link href="/" className="hover:underline">
              Home
            </Link>{" "}
            /{" "}
            <Link href="/blog" className="hover:underline">
              Blog
            </Link>{" "}
            / {category}
          </nav>

          <h1
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-4"
            style={{
              fontFamily: "var(--font-syne)",
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
            }}
          >
            {post.title}
          </h1>

          <p className="text-sm m-0 mb-8" style={{ color: muted }}>
            By{" "}
            <Link href={`/blog/author/${author.id}`} className="hover:underline">
              {author.name}
            </Link>{" "}
            · {formatPostDate(post.date)}
            {post.updated ? ` · Updated ${formatPostDate(post.updated)}` : ""} ·{" "}
            {post.readingMinutes} min read
          </p>

          {toc.length >= 4 && (
            <nav aria-label="In this guide" className="mb-8 text-sm">
              <p className="m-0 mb-2 font-semibold">In this guide</p>
              <ul className="list-disc pl-5 space-y-1 m-0">
                {toc.map((h) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`} className={link}>
                      {h.text}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}

          <div className={styles.prose} dangerouslySetInnerHTML={{ __html: post.html }} />

          <aside
            className="mt-12 rounded-xl p-5 text-sm bg-white border border-[rgba(26,18,8,0.08)]"
            aria-label="About the author"
          >
            <p className="m-0 font-semibold">{author.name}</p>
            <p className="m-0 mt-0.5" style={{ color: muted }}>
              {author.role}
            </p>
            <p className="m-0 mt-2">{author.bio}</p>
            <p className="m-0 mt-2">
              <Link href={`/blog/author/${author.id}`} className={link}>
                More from {author.name}
              </Link>
            </p>
          </aside>

          <section className="mt-12 flex flex-col gap-3">
            <p className="m-0 text-lg font-semibold">Deliver your next wedding on Vyavasth.</p>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <a
                href={whatsappUrl("Hi, I read your blog post: " + post.title)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-semibold text-white transition-all duration-200 hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C25A3A]/50 no-underline w-full sm:w-auto text-center"
                style={{ backgroundColor: "#C25A3A", fontFamily: "var(--font-dm-sans)" }}
              >
                Chat on WhatsApp
              </a>
              <Link href="/features" className={link}>
                See features
              </Link>
            </div>
          </section>

          {more.length > 0 && (
            <section className="mt-12">
              <h2 className={h2} style={h2Style}>
                More guides
              </h2>
              <ul className="list-none p-0 m-0 flex flex-col gap-4">
                {more.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/blog/${r.slug}`} className={link}>
                      {r.title}
                    </Link>
                    <p className="m-0 mt-1">{r.description}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </article>
      </main>
      <Footer />
    </div>
  );
}
