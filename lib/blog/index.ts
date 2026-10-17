// Pure blog helpers. Posts are compiled from content/blog/*.md into
// posts.generated.ts by scripts/build-blog.mjs; a post is visible once its
// date (in India) has arrived, so routes must be rendered per request.
import { BLOG_POSTS } from "./posts.generated.ts";

export type BlogCategory =
  | "delivery"
  | "album-selection"
  | "guest-experience"
  | "studio-business"
  | "events"
  | "industry";

export type BlogPost = {
  slug: string;
  title: string;
  seoTitle?: string;
  description: string;
  /** Author id, from lib/blog/authors.ts. */
  author: string;
  /** YYYY-MM-DD */
  date: string;
  /** YYYY-MM-DD */
  updated?: string;
  category: BlogCategory;
  /** Share image path, per-post if public/blog/og/{slug}.png exists. */
  image: string;
  html: string;
  faqs: { q: string; a: string }[];
  readingMinutes: number;
  wordCount: number;
  /** h2 headings, for anchor links. */
  headings: { id: string; text: string }[];
};

export const CATEGORY_LABELS: Record<BlogCategory, string> = {
  delivery: "Delivery",
  "album-selection": "Album selection",
  "guest-experience": "Guest experience",
  "studio-business": "Studio business",
  events: "Events",
  industry: "Industry",
};

/** Today's date in India as YYYY-MM-DD. */
export function todayInIndia(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(now);
}

export function isPublished(post: Pick<BlogPost, "date">, today: string): boolean {
  return post.date <= today;
}

const newestFirst = (a: BlogPost, b: BlogPost) =>
  a.date === b.date ? a.slug.localeCompare(b.slug) : a.date < b.date ? 1 : -1;

export function publishedPosts(today: string, posts: BlogPost[] = BLOG_POSTS): BlogPost[] {
  return posts.filter((p) => isPublished(p, today)).sort(newestFirst);
}

export function postBySlug(
  slug: string,
  today: string,
  posts: BlogPost[] = BLOG_POSTS,
): BlogPost | undefined {
  const post = posts.find((p) => p.slug === slug);
  return post && isPublished(post, today) ? post : undefined;
}

/** Same-category posts first, topped up with other recent posts. */
export function relatedPosts(
  post: BlogPost,
  today: string,
  n = 3,
  posts: BlogPost[] = BLOG_POSTS,
): BlogPost[] {
  const others = publishedPosts(today, posts).filter((p) => p.slug !== post.slug);
  const same = others.filter((p) => p.category === post.category);
  const rest = others.filter((p) => p.category !== post.category);
  return [...same, ...rest].slice(0, n);
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-10-20" -> "20 Oct 2026" */
export function formatPostDate(date: string): string {
  const [y, m, d] = date.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y}`;
}

/** Page title: seoTitle or title, with " | Vyavasth" only if it stays within 65 characters. */
export function pageTitle(post: Pick<BlogPost, "title" | "seoTitle">): string {
  const base = post.seoTitle || post.title;
  const branded = `${base} | Vyavasth`;
  return branded.length <= 65 ? branded : base;
}

/** RFC-822 date for RSS, at midnight IST. */
export function rssDate(date: string): string {
  return new Date(`${date}T00:00:00+05:30`).toUTCString();
}
