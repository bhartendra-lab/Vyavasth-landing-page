import { test } from "node:test";
import assert from "node:assert/strict";
import { vyavasthCompare } from "./compare-vyavasth.ts";
import type { Plan } from "./plans.ts";

const yearly = (gb: number, price: number, extra: Partial<Plan> = {}): Plan => ({
  _id: `y${gb}`,
  service_type: "Yearly",
  storage_limit: gb,
  price,
  price_with_gst: price,
  gst_inclusive: true,
  ...extra,
});

const eventPlan: Plan = {
  _id: "e",
  service_type: "Event-based",
  event_unit_price: 400,
  event_unit_price_with_gst: 472,
  gst_inclusive: false,
  photo_cap: 20000,
  photo_cap_addon_size: 5000,
  photo_cap_addon_price: 99,
};

test("no plans: nothing to show, nothing thrown", () => {
  const v = vyavasthCompare([]);
  assert.equal(v.event, null);
  assert.deepEqual(v.tiers, []);
  assert.equal(v.hubEntry, null);
  assert.equal(v.hubGst, null);
});

test("prices are shown as charged, GST included", () => {
  const v = vyavasthCompare([eventPlan, yearly(200, 12999), yearly(75, 7499)]);
  assert.equal(v.event?.price, "₹472 per event, GST included");
  assert.deepEqual(v.tiers.map((t) => t.size), ["75 GB", "200 GB"]);
  assert.equal(v.tiers[0].price, "₹7,499 a year, GST included");
  assert.equal(v.hubEntry, "₹472 per event (with GST), or ₹7,499 a year (75 GB)");
  assert.equal(v.hubGst, "Included in storage plan prices");
});

test("a before-GST plan with no with-GST figure is shown as plus GST", () => {
  const v = vyavasthCompare([yearly(75, 6355, { price_with_gst: null, gst_inclusive: false })]);
  assert.equal(v.tiers[0].price, "₹6,355 + GST a year");
  assert.equal(v.hubGst, "Extra");
});
