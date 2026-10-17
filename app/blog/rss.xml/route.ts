import { publishedPosts, rssDate, todayInIndia } from "@/lib/blog";

// Rendered per request so new posts show up on their date without a redeploy.
export const dynamic = "force-dynamic";

const SITE = "https://vyavasth.in";

const esc = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export function GET() {
  const posts = publishedPosts(todayInIndia());
  const items = posts
    .map((p) => {
      const link = `${SITE}/blog/${p.slug}`;
      return `    <item>
      <title>${esc(p.title)}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <pubDate>${rssDate(p.date)}</pubDate>
      <description>${esc(p.description)}</description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Vyavasth Blog</title>
    <link>${SITE}/blog</link>
    <description>Practical guides for wedding and event photography studios in India.</description>
    <language>en-IN</language>
    <atom:link href="${SITE}/blog/rss.xml" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
