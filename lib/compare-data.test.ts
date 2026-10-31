import { test } from "node:test";
import assert from "node:assert/strict";
import { COMPETITORS, HUB_ONLY, withGst, type CompetitorPlan } from "./compare-data.ts";

const plan = (overrides: Partial<CompetitorPlan>): CompetitorPlan => ({
  name: "P",
  limit: "x",
  listedPerYear: 1000,
  gstIncluded: true,
  ...overrides,
});

test("comparison slugs are unique and start with vyavasth-vs-", () => {
  const slugs = COMPETITORS.map((c) => c.slug);
  assert.equal(new Set(slugs).size, slugs.length);
  for (const s of slugs) assert.ok(s.startsWith("vyavasth-vs-"), `${s} must start with vyavasth-vs-`);
});

test("every tool has at least one https source", () => {
  for (const c of COMPETITORS) {
    assert.ok(c.sources.length > 0, `${c.slug} has no source`);
    for (const s of c.sources) assert.ok(s.url.startsWith("https://"), `${c.slug}: ${s.url}`);
  }
  for (const t of HUB_ONLY) assert.ok(t.source.url.startsWith("https://"), `${t.name}: ${t.source.url}`);
});

test("withGst adds 18% only to prices listed before GST", () => {
  assert.equal(withGst(plan({ listedPerYear: null })), null);
  assert.equal(withGst(plan({ listedPerYear: 0, gstIncluded: false })), 0);
  assert.equal(withGst(plan({ listedPerYear: 3490, gstIncluded: false })), Math.round(3490 * 1.18));
  assert.equal(withGst(plan({ listedPerYear: 3490, gstIncluded: true })), 3490);
  assert.equal(withGst(plan({ listedPerYear: 3490, gstIncluded: null })), 3490);
});

test("copy has no em dashes", () => {
  assert.ok(!JSON.stringify(COMPETITORS).includes("—"), "em dash in COMPETITORS");
  assert.ok(!JSON.stringify(HUB_ONLY).includes("—"), "em dash in HUB_ONLY");
});
