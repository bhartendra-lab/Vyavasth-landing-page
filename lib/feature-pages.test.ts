import { test } from "node:test";
import assert from "node:assert/strict";
import { FEATURE_PAGES, sectionId } from "./feature-pages.ts";
import { COMPETITORS } from "./compare-data.ts";

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

test("sectionId makes a lowercase anchor from a heading", () => {
  assert.equal(sectionId("Filters made for Indian weddings"), "filters-made-for-indian-weddings");
  assert.equal(sectionId("Pen drive, Google Drive or a delivery gallery"), "pen-drive-google-drive-or-a-delivery-gallery");
  assert.equal(sectionId("  What's new? "), "what-s-new");
});

test("section ids are unique on each page and never collide with the Questions anchor", () => {
  for (const p of FEATURE_PAGES) {
    const ids = p.sections.map((s) => sectionId(s.h2));
    assert.equal(new Set(ids).size, ids.length, `${p.slug} repeats a section id`);
    assert.ok(!ids.includes("questions"), `${p.slug} has a section that takes the questions anchor`);
  }
});

test("updated and changelog dates are ISO dates", () => {
  const iso = /^\d{4}-\d{2}-\d{2}$/;
  for (const p of FEATURE_PAGES) {
    if (p.updated) assert.match(p.updated, iso, `${p.slug}: updated`);
    for (const c of p.changelog ?? []) assert.match(c.date, iso, `${p.slug}: changelog ${c.text}`);
  }
});

test("compare slugs point at real comparison pages", () => {
  const known = new Set(COMPETITORS.map((c) => c.slug));
  for (const p of FEATURE_PAGES) {
    for (const s of p.compare ?? []) assert.ok(known.has(s), `${p.slug} links to unknown comparison ${s}`);
  }
});
