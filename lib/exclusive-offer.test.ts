import { test } from "node:test";
import assert from "node:assert/strict";
import {
  daysLeft,
  formatEndDate,
  urgencyLabel,
  isShowableOffer,
  EXCLUSIVE_CLAIM_URL,
  bannerDismissKey,
  popupSeenKey,
  type ExclusiveCoupon,
} from "./exclusive-offer.ts";

// 13 Dec 2026, 23:59:59.999 IST.
const END = Date.parse("2026-12-13T23:59:59.999+05:30");
const DAY = 24 * 60 * 60 * 1000;
const offer = (over: Partial<ExclusiveCoupon> = {}): ExclusiveCoupon => ({
  code: "FIRSTFREE",
  valid_until: END,
  headline: "Your first event, free",
  subline: null,
  cta_label: null,
  exclusive: true,
  ...over,
});

test("formatEndDate reads the IST date, not the server's", () => {
  assert.equal(formatEndDate(END), "13 Dec");
});

test("daysLeft and urgencyLabel sharpen as the end nears", () => {
  assert.equal(urgencyLabel(END, END - 60 * DAY), "Ends 13 Dec");
  assert.equal(urgencyLabel(END, END - 18 * DAY), "Only 18 days left");
  assert.equal(daysLeft(END, END - 5 * DAY), 5);
  assert.equal(urgencyLabel(END, END - 5 * DAY), "Only 5 days left");
  assert.equal(urgencyLabel(END, END - 60_000), "Last day today");
  assert.equal(daysLeft(END, END + 1), 0);
  assert.equal(urgencyLabel(null, END), null);
  for (const d of [30, 7, 2, 0.5]) assert.doesNotMatch(urgencyLabel(END, END - d * DAY) ?? "", /[–—]/);
});

test("isShowableOffer: needs a code and a headline, and must not have ended", () => {
  assert.equal(isShowableOffer(offer(), END - DAY), true);
  assert.equal(isShowableOffer(offer(), END + 1), false, "the page may be cached past the end");
  assert.equal(isShowableOffer(offer({ headline: null }), END - DAY), false);
  assert.equal(isShowableOffer(null, END), false);
  assert.equal(isShowableOffer(offer({ valid_until: null }), END), true);
});

test("claim link and storage keys", () => {
  assert.ok(EXCLUSIVE_CLAIM_URL.endsWith("/login?src=exclusive"));
  assert.notEqual(bannerDismissKey("A"), bannerDismissKey("B"), "a new offer is shown afresh");
  assert.notEqual(bannerDismissKey("A"), popupSeenKey("A"));
});
