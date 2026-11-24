import { test } from "node:test";
import assert from "node:assert/strict";
import {
  DESCRIPTION_MAX,
  DESCRIPTION_MIN,
  PAGE_META,
  TITLE_MAX,
  pricingDescription,
} from "./page-meta.ts";
import { FEATURE_PAGES } from "./feature-pages.ts";
import { COMPETITORS } from "./compare-data.ts";
import { gstFeesPhrase } from "./pricing-display.ts";

const titleOk = (label: string, t: string) =>
  assert.ok(t.length <= TITLE_MAX, `${label}: title is ${t.length} characters (max ${TITLE_MAX}): ${t}`);
const descOk = (label: string, d: string) =>
  assert.ok(
    d.length >= DESCRIPTION_MIN && d.length <= DESCRIPTION_MAX,
    `${label}: description is ${d.length} characters (want ${DESCRIPTION_MIN} to ${DESCRIPTION_MAX}): ${d}`,
  );

test("static pages have a short title and a description of 110 to 155 characters", () => {
  for (const [name, m] of Object.entries(PAGE_META)) {
    titleOk(name, m.title);
    if ("description" in m) descOk(name, m.description);
  }
});

test("every feature page fits the snippet limits", () => {
  for (const p of FEATURE_PAGES) {
    titleOk(p.slug, p.title);
    descOk(p.slug, p.metaDescription);
  }
});

test("every comparison page fits the snippet limits", () => {
  for (const c of COMPETITORS) {
    titleOk(c.slug, c.title);
    descOk(c.slug, c.metaDescription);
  }
});

test("the pricing description fits with and without the offer, whatever the GST wording", () => {
  const pictures = [
    { event: true, storage: true },
    { event: false, storage: false },
    { event: false, storage: true },
    { event: null, storage: null },
  ] as const;
  for (const picture of pictures) {
    for (const bonus of [null, 1, 2, 10]) {
      descOk(
        `pricing (bonus ${bonus}, ${JSON.stringify(picture)})`,
        pricingDescription(bonus, gstFeesPhrase({ ...picture })),
      );
    }
  }
});

test("no em dashes in titles or descriptions", () => {
  assert.ok(!JSON.stringify(PAGE_META).includes("—"));
});
