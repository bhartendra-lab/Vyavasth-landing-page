import type { Metadata } from "next";
import LegalPageShell from "@/components/LegalPageShell";
import { publishedPosts, todayInIndia } from "@/lib/blog";
import PostList from "./PostList";

// Rendered per request so a post appears on its own date without a redeploy.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog: wedding photo delivery and studio business guides | Vyavasth",
  description:
    "Practical guides for Indian wedding and event photography studios: delivering photos, album selection, guest galleries, pricing and growing the studio.",
  alternates: {
    canonical: "/blog",
    types: { "application/rss+xml": "/blog/rss.xml" },
  },
};

export default function BlogIndexPage() {
  const posts = publishedPosts(todayInIndia());

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Blog",
      "@id": "https://vyavasth.in/blog#blog",
      url: "https://vyavasth.in/blog",
      name: "Vyavasth Blog",
      publisher: { "@id": "https://vyavasth.in/#organization" },
      blogPost: posts.slice(0, 10).map((p) => ({
        "@type": "BlogPosting",
        headline: p.title,
        url: `https://vyavasth.in/blog/${p.slug}`,
        datePublished: p.date,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: "https://vyavasth.in/" },
        { "@type": "ListItem", position: 2, name: "Blog", item: "https://vyavasth.in/blog" },
      ],
    },
  ];

  return (
    <LegalPageShell title="Blog">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <p className="m-0">
        Practical guides for wedding and event photography studios in India, from
        delivery and album selection to pricing and getting more bookings.
      </p>

      <PostList posts={posts} />
    </LegalPageShell>
  );
}
