import { test } from "node:test";
import assert from "node:assert/strict";
import {
  sortFeatures,
  highlightsOf,
  groupByCategory,
  allIncludedInEveryPlan,
  CATEGORY_LABELS,
  type Feature,
  type FeatureCategory,
} from "./features.ts";

function feat(overrides: Partial<Feature> = {}): Feature {
  return {
    _id: overrides._id ?? `f-${overrides.key ?? overrides.sort_order ?? "x"}`,
    key: overrides.key ?? "k",
    name: overrides.name ?? "Name",
    description: overrides.description ?? "Desc",
    category: overrides.category ?? "discovery",
    included_in_all_plans: overrides.included_in_all_plans ?? true,
    ...overrides,
  };
}

test("sortFeatures: ascending by sort_order, nullish treated as 0", () => {
  const sorted = sortFeatures([
    feat({ key: "c", sort_order: 30 }),
    feat({ key: "a", sort_order: 10 }),
    feat({ key: "b", sort_order: 20 }),
  ]);
  assert.deepEqual(
    sorted.map((f) => f.key),
    ["a", "b", "c"],
  );
});

test("sortFeatures: does not mutate its input", () => {
  const input = [feat({ key: "b", sort_order: 20 }), feat({ key: "a", sort_order: 10 })];
  const before = input.map((f) => f.key);
  sortFeatures(input);
  assert.deepEqual(
    input.map((f) => f.key),
    before,
  );
});

test("highlightsOf: filters to highlights, sorted, respects limit", () => {
  const features = [
    feat({ key: "b", sort_order: 20, is_highlight: true }),
    feat({ key: "a", sort_order: 10, is_highlight: true }),
    feat({ key: "plain", sort_order: 15, is_highlight: false }),
    feat({ key: "c", sort_order: 30, is_highlight: true }),
  ];
  assert.deepEqual(
    highlightsOf(features).map((f) => f.key),
    ["a", "b", "c"],
  );
  assert.deepEqual(
    highlightsOf(features, 2).map((f) => f.key),
    ["a", "b"],
  );
});

test("groupByCategory: canonical category order, sorted within, empties omitted", () => {
  const features = [
    feat({ key: "grow", sort_order: 60, category: "growth" }),
    feat({ key: "disc2", sort_order: 40, category: "discovery" }),
    feat({ key: "disc1", sort_order: 10, category: "discovery" }),
    feat({ key: "del", sort_order: 20, category: "delivery" }),
  ];
  const groups = groupByCategory(features);
  // discovery, delivery, growth, in CATEGORY_LABELS order; brand/operations omitted.
  assert.deepEqual(
    groups.map((g) => g.category),
    ["discovery", "delivery", "growth"] satisfies FeatureCategory[],
  );
  assert.deepEqual(
    groups[0].features.map((f) => f.key),
    ["disc1", "disc2"],
  );
});

test("allIncludedInEveryPlan: true only when every feature is universal", () => {
  assert.equal(allIncludedInEveryPlan([feat(), feat()]), true);
  assert.equal(
    allIncludedInEveryPlan([feat(), feat({ included_in_all_plans: false })]),
    false,
  );
});

test("allIncludedInEveryPlan: false for an empty catalog (make no claim)", () => {
  assert.equal(allIncludedInEveryPlan([]), false);
});

test("CATEGORY_LABELS: covers all five categories", () => {
  assert.deepEqual(Object.keys(CATEGORY_LABELS), [
    "discovery",
    "delivery",
    "brand",
    "growth",
    "operations",
  ]);
});
