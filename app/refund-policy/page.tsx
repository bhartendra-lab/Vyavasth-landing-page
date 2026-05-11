import type { Metadata } from "next";
import LegalPageShell from "@/components/LegalPageShell";
import { BUSINESS_NAME, SUPPORT_EMAIL } from "@/lib/site-legal";

export const metadata: Metadata = {
  title: "Refund & Cancellation Policy — Vyavasth",
  description:
    "Refund eligibility, timelines, cancellation, and non-refundable scenarios for Vyavasth subscriptions.",
  alternates: { canonical: "/refund-policy" },
};

const h2 = "text-xl font-semibold mt-2 mb-3 tracking-tight";
const h2Style = { fontFamily: "var(--font-syne)", color: "#1A1208" } as const;
const list = "list-disc pl-5 space-y-2 m-0";
const muted = { color: "#7A6F63" } as const;

export default function RefundPolicyPage() {
  return (
    <LegalPageShell title="Refund & Cancellation Policy">
      <p style={muted}>
        This policy explains how refunds and cancellations work for paid
        subscriptions to {BUSINESS_NAME}.
      </p>

      <section>
        <h2 className={h2} style={h2Style}>
          1. Subscription billing
        </h2>
        <p>
          Vyavasth is offered on a <strong>monthly subscription</strong> with{" "}
          <strong>automatic renewal</strong>. Unless you cancel before the renewal
          date, your subscription will continue and you will be charged for each
          billing cycle using your chosen payment method.
        </p>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          2. Refund eligibility
        </h2>
        <p>
          You may be eligible for a <strong>full refund</strong> only if{" "}
          <strong>all</strong> of the following are true:
        </p>
        <ul className={list}>
          <li>
            Your request is made within <strong>7 calendar days</strong> from the
            start of a new subscription period or from the date of a{" "}
            <strong>subscription renewal</strong>; and
          </li>
          <li>
            During that same 7-day window, your account shows{" "}
            <strong>no active usage</strong> of the platform (we determine active
            usage using reasonable account and product telemetry, such as
            meaningful logins, task or workflow activity, or material data
            changes attributable to your team).
          </li>
        </ul>
        <p>
          If either condition is not met—for example, the 7-day period has ended,
          or the account shows active usage—you are <strong>not</strong> eligible
          for a refund for that billing period.
        </p>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          3. Refund processing timeline and method
        </h2>
        <p>
          Approved refunds are initiated to your{" "}
          <strong>original payment method</strong> where technically possible.
          Once initiated, <strong>refunds are typically processed within 5–7
          business days</strong>; the exact time may depend on your bank, card
          issuer, or UPI provider.
        </p>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          4. Cancellation
        </h2>
        <p>
          You may <strong>cancel your subscription at any time</strong> from your
          account settings (or equivalent billing controls we provide).
          Cancellation stops <strong>future</strong> renewals; it does{" "}
          <strong>not</strong> automatically refund fees already charged for the
          current billing period, except where you qualify under the 7-day refund
          rule in Section 2.
        </p>
        <p>
          <strong>Notice period:</strong> Cancellation takes effect at the end of
          the current paid period unless we specify otherwise in-product. You
          continue to have access until that period ends.
        </p>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          5. Non-refundable scenarios (examples)
        </h2>
        <p>Without limiting the above, the following are generally non-refundable:</p>
        <ul className={list}>
          <li>Fees charged after the 7-day window from start or renewal.</li>
          <li>
            Any period where the account shows active usage during the 7-day
            window.
          </li>
          <li>
            Charges disputed directly with your bank or payment network in a way
            that bypasses our support process, where our policies or agreements
            prohibit double recovery.
          </li>
          <li>
            Taxes, government levies, or third-party fees that we are not
            permitted to refund.
          </li>
          <li>
            Add-ons or one-time purchases if expressly marked non-refundable at
            checkout.
          </li>
        </ul>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          6. How to request a refund
        </h2>
        <p>
          Email{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-[#4F46E5] underline">
            {SUPPORT_EMAIL}
          </a>{" "}
          from your registered account email, or submit a request through the{" "}
          <a href="/contact" className="text-[#4F46E5] underline">
            Contact
          </a>{" "}
          page with your account identifier and invoice details. We will confirm
          eligibility and respond in line with our published support timelines.
        </p>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          7. Changes
        </h2>
        <p>
          We may update this policy from time to time. The &ldquo;Last
          Updated&rdquo; date at the top of this page will change when we do.
          Continued use of paid services after changes may constitute acceptance
          of the revised policy where permitted by law.
        </p>
      </section>
    </LegalPageShell>
  );
}
