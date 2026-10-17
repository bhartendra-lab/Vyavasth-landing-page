import { test } from "node:test";
import assert from "node:assert/strict";
import { FEATURE_PAGES } from "./feature-pages.ts";

test("slugs are unique and URL-safe", () => {
  const slugs = FEATURE_PAGES.map((p) => p.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const s of slugs) assert.match(s, /^[a-z0-9-]+$/);
});

test("related slugs exist and never point at the page itself", () => {
  const slugs = new Set(FEATURE_PAGES.map((p) => p.slug));
  for (const p of FEATURE_PAGES) {
    for (const r of p.related) {
      assert.ok(slugs.has(r), `${p.slug} relates to unknown slug ${r}`);
      assert.notEqual(r, p.slug, `${p.slug} relates to itself`);
    }
  }
});

test("every page has at least 3 steps and 2 FAQs", () => {
  for (const p of FEATURE_PAGES) {
    assert.ok(p.steps.length >= 3, `${p.slug} has too few steps`);
    assert.ok(p.faqs.length >= 2, `${p.slug} has too few FAQs`);
  }
});

test("every table row has as many cells as its header", () => {
  for (const p of FEATURE_PAGES) {
    for (const s of p.sections) {
      if (!s.table) continue;
      for (const row of s.table.rows) {
        assert.equal(row.length, s.table.head.length, `${p.slug}: "${s.h2}" has a ragged row`);
      }
    }
  }
});

test("copy has no em dashes and no prices", () => {
  const all = JSON.stringify(FEATURE_PAGES);
  assert.ok(!all.includes("—"), "em dash found");
  assert.ok(!all.includes("₹"), "rupee sign found; prices belong on /pricing");
});
