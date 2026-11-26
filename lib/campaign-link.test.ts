import { test } from "node:test";
import assert from "node:assert/strict";
import { acqCookie, campaignLanding, isRecipientToken } from "./campaign-link.ts";

const RID = "01KAXQ6Z3V8M9N2P4R5S6T7W8X";

test("recipient tokens are CRM ULIDs only, so a phone number is refused", () => {
  assert.equal(isRecipientToken(RID), true);
  assert.equal(isRecipientToken("919876543210"), false);
  assert.equal(isRecipientToken(RID.toLowerCase()), false);
  assert.equal(isRecipientToken(undefined), false);
});

test("a tap lands on the home page with utm tags, slug sanitised", () => {
  assert.equal(campaignLanding("free-event-b1"), "/?utm_source=whatsapp&utm_medium=campaign&utm_campaign=free-event-b1");
  assert.match(campaignLanding("Bad Slug<script>"), /utm_campaign=whatsapp-campaign$/);
});

test("on vyavasth.in the cookie reaches the dashboard; elsewhere it stays on the host", () => {
  assert.match(acqCookie(RID, "vyavasth.in"), /Domain=vyavasth\.in;/);
  assert.match(acqCookie(RID, "www.vyavasth.in"), /Domain=vyavasth\.in;/);
  assert.doesNotMatch(acqCookie(RID, "localhost"), /Domain=/);
  assert.doesNotMatch(acqCookie(RID, "evilvyavasth.in"), /Domain=/);
  assert.match(acqCookie(RID, "vyavasth.in"), /^vy_acq=01KAXQ6Z3V8M9N2P4R5S6T7W8X; Max-Age=2592000; Path=\/;/);
});
