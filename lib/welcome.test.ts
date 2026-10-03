import { test } from "node:test";
import assert from "node:assert/strict";
import { WHATSAPP_NUMBER } from "./site-legal.ts";
import { buildWhatsAppUrl, buildSignupUrl, isLinkReady } from "./welcome.ts";

test("buildWhatsAppUrl uses the site-legal number and a decodable message", () => {
  const url = buildWhatsAppUrl("Imagic Expo Photofair 2026");
  assert.ok(url.startsWith("https://wa.me/"));
  assert.ok(url.startsWith(`https://wa.me/${WHATSAPP_NUMBER}?text=`));
  const text = decodeURIComponent(url.split("?text=")[1]);
  assert.equal(text, "Hi, I visited the Vyavasth booth at Imagic Expo Photofair 2026.");
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
