import { test } from "node:test";
import assert from "node:assert/strict";
import {
  todayInIndia,
  isPublished,
  postBySlug,
  publishedPosts,
  relatedPosts,
  formatPostDate,
  pageTitle,
  type BlogPost,
} from "./index.ts";

function post(overrides: Partial<BlogPost> & { slug: string }): BlogPost {
  return {
    title: overrides.slug,
    description: "d",
    author: "bharat",
    date: "2026-10-01",
    category: "delivery",
    image: "/og-image.png",
    html: "",
    faqs: [],
    readingMinutes: 1,
    wordCount: 100,
    headings: [],
    ...overrides,
  };
}

const POSTS: BlogPost[] = [
  post({ slug: "a", date: "2026-10-01", category: "delivery" }),
  post({ slug: "b", date: "2026-10-05", category: "delivery" }),
  post({ slug: "c", date: "2026-10-03", category: "events" }),
  post({ slug: "future", date: "2026-10-20", category: "delivery" }),
];

test("todayInIndia is ahead of UTC", () => {
  assert.equal(todayInIndia(new Date("2026-10-19T19:00:00Z")), "2026-10-20");
});

test("isPublished is true on the same date and false a day before", () => {
  assert.equal(isPublished({ date: "2026-10-20" }, "2026-10-20"), true);
  assert.equal(isPublished({ date: "2026-10-20" }, "2026-10-19"), false);
});

test("postBySlug hides future-dated posts", () => {
  assert.equal(postBySlug("future", "2026-10-10", POSTS), undefined);
  assert.equal(postBySlug("future", "2026-10-20", POSTS)?.slug, "future");
  assert.equal(postBySlug("missing", "2026-10-20", POSTS), undefined);
});

test("publishedPosts is newest first and excludes unpublished", () => {
  assert.deepEqual(publishedPosts("2026-10-10", POSTS).map((p) => p.slug), ["b", "c", "a"]);
});

test("relatedPosts never returns the post itself or unpublished posts", () => {
  const rel = relatedPosts(POSTS[0], "2026-10-10", 3, POSTS);
  const slugs = rel.map((p) => p.slug);
  assert.ok(!slugs.includes("a"));
  assert.ok(!slugs.includes("future"));
  // Same category first, then topped up with other recent posts.
  assert.deepEqual(slugs, ["b", "c"]);
});

test("formatPostDate", () => {
  assert.equal(formatPostDate("2026-10-20"), "20 Oct 2026");
});

test("pageTitle appends the brand only when it fits in 65 characters", () => {
  assert.equal(pageTitle({ title: "Short title" }), "Short title | Vyavasth");
  const long = "x".repeat(60);
  assert.equal(pageTitle({ title: long }), long);
  assert.equal(pageTitle({ title: long, seoTitle: "Short" }), "Short | Vyavasth");
});
