import type { MetadataRoute } from "next";
import { FEATURE_PAGES } from "@/lib/feature-pages";
import { publishedPosts, todayInIndia } from "@/lib/blog";
import { CHECKED_ON, COMPETITORS } from "@/lib/compare-data";

// Rendered per request so posts appear in the sitemap on their publish date.
export const dynamic = "force-dynamic";

// Fixed on purpose: a lastmod that changes on every build is a false freshness signal.
const SITE_UPDATED = new Date("2026-10-16");
const BASE = "https://vyavasth.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = publishedPosts(todayInIndia());
  // Authors with at least one published post (posts are newest first).
  const authorIds = [...new Set(posts.map((p) => p.author))];
  const blogUpdated = posts.length > 0 ? new Date(posts[0].date) : SITE_UPDATED;
  return [
    { url: `${BASE}/`, lastModified: SITE_UPDATED, changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE}/pricing`, lastModified: SITE_UPDATED, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/pricing/pay-per-event`, lastModified: SITE_UPDATED, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/about`, lastModified: SITE_UPDATED, changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE}/features`, lastModified: SITE_UPDATED, changeFrequency: "monthly", priority: 0.8 },
    ...FEATURE_PAGES.map((p) => ({
      url: `${BASE}/features/${p.slug}`,
      lastModified: SITE_UPDATED,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${BASE}/compare`, lastModified: new Date(CHECKED_ON), changeFrequency: "monthly", priority: 0.8 },
    ...COMPETITORS.map((c) => ({
      url: `${BASE}/compare/${c.slug}`,
      lastModified: new Date(CHECKED_ON),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${BASE}/blog`, lastModified: blogUpdated, changeFrequency: "weekly", priority: 0.8 },
    ...posts.map((p) => ({
      url: `${BASE}/blog/${p.slug}`,
      lastModified: new Date(p.updated ?? p.date),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...authorIds.map((id) => ({
      url: `${BASE}/blog/author/${id}`,
      lastModified: new Date(posts.find((p) => p.author === id)!.date),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
    { url: `${BASE}/contact`, lastModified: SITE_UPDATED, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE}/privacy-policy`, lastModified: SITE_UPDATED, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE}/terms`, lastModified: SITE_UPDATED, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE}/refund-policy`, lastModified: SITE_UPDATED, changeFrequency: "yearly", priority: 0.2 },
    { url: `${BASE}/cookie-policy`, lastModified: SITE_UPDATED, changeFrequency: "yearly", priority: 0.2 },
  ];
}
