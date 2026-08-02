// lib/features.ts, PURE. No React, no fetch, no env. Types + helpers for the
// marketing capability catalog served by GET /features. Mirrors the discipline
// of lib/plans.ts so it's unit-testable in isolation (lib/features.test.ts).

export type FeatureCategory = "discovery" | "delivery" | "brand" | "growth" | "operations";

export type Feature = {
  _id: string;
  key: string;
  name: string;
  description: string;
  icon?: string | null;
  category: FeatureCategory;
  is_highlight?: boolean;
  // Computed server-side. `service_ids` is never sent to the client; this
  // boolean is the only gating signal a public consumer sees.
  included_in_all_plans: boolean;
  sort_order?: number;
};

// Human labels for the optional category grouping on the pricing showcase.
// Declaration order is also the canonical display order (see groupByCategory).
export const CATEGORY_LABELS: Record<FeatureCategory, string> = {
  discovery: "Finding photos",
  delivery: "Getting them out",
  brand: "Your identity",
  growth: "Growing the studio",
  operations: "Running it day to day",
};

/** Ascending by sort_order (nullish → 0). Returns a new array; never mutates. */
export function sortFeatures(features: Feature[]): Feature[] {
  return [...features].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
}

/** The highlight subset, sorted, optionally capped at `limit`. */
export function highlightsOf(features: Feature[], limit?: number): Feature[] {
  const highlights = sortFeatures(features).filter((f) => f.is_highlight === true);
  return typeof limit === "number" ? highlights.slice(0, limit) : highlights;
}

/**
 * Group into { category, features } buckets in canonical category order,
 * features sorted within each. Categories with no features are omitted, so an
 * empty or partial catalog never renders an empty heading.
 */
export function groupByCategory(
  features: Feature[],
): Array<{ category: FeatureCategory; features: Feature[] }> {
  const sorted = sortFeatures(features);
  const order = Object.keys(CATEGORY_LABELS) as FeatureCategory[];
  return order
    .map((category) => ({
      category,
      features: sorted.filter((f) => f.category === category),
    }))
    .filter((group) => group.features.length > 0);
}

/**
 * True when there are features AND every one is universal; this drives the
 * "every feature, every plan" banner. Empty returns false: with no catalog we
 * make no claim, and the banner must stay honest the day gating turns on.
 */
export function allIncludedInEveryPlan(features: Feature[]): boolean {
  return features.length > 0 && features.every((f) => f.included_in_all_plans);
}
