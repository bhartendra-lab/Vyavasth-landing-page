import { test } from "node:test";
import assert from "node:assert/strict";
import { WHATSAPP_NUMBER } from "./site-legal.ts";
import { WELCOME_EVENT, buildWhatsAppUrl, buildSignupUrl, isLinkReady } from "./welcome.ts";

test("buildWhatsAppUrl uses the site-legal number and a decodable message", () => {
  const url = buildWhatsAppUrl("Bhopal Photo Fair 2026");
  assert.ok(url.startsWith("https://wa.me/"));
  assert.ok(url.startsWith(`https://wa.me/${WHATSAPP_NUMBER}?text=`));
  const text = decodeURIComponent(url.split("?text=")[1]);
  assert.equal(text, "Hi, I visited the Vyavasth booth at Bhopal Photo Fair 2026.");
});

test("buildSignupUrl tags the source", () => {
  assert.ok(buildSignupUrl().endsWith("/login?src=welcome"));
});

test("isLinkReady only accepts non-empty https URLs", () => {
  assert.equal(isLinkReady(""), false);
  assert.equal(isLinkReady("   "), false);
  assert.equal(isLinkReady("http://x"), false);
  assert.equal(isLinkReady("youtube.com"), false);
  assert.equal(isLinkReady("https://x.com"), true);
});

test("WELCOME_EVENT gallery and offer links are live, and the offer is campaign tagged", () => {
  assert.equal(isLinkReady(WELCOME_EVENT.galleryUrl), true);
  assert.equal(isLinkReady(WELCOME_EVENT.offerUrl), true);
  assert.ok(WELCOME_EVENT.offerUrl.includes("utm_campaign=bhopal-photo-fair-2026"));
});
