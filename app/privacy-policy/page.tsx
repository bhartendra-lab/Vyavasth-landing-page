import type { Metadata } from "next";
import LegalPageShell from "@/components/LegalPageShell";
import {
  BUSINESS_NAME,
  REGISTERED_ADDRESS,
  SUPPORT_EMAIL,
} from "@/lib/site-legal";

export const metadata: Metadata = {
  title: "Privacy Policy — Vyavasth",
  description:
    "How Vyavasth collects, uses, and protects personal data, including payments, face embeddings, and cookies.",
  alternates: { canonical: "/privacy-policy" },
};

const h2 =
  "text-xl font-semibold mt-2 mb-3 tracking-tight";
const h2Style = { fontFamily: "var(--font-syne)", color: "#1A1208" } as const;
const list = "list-disc pl-5 space-y-2 m-0";
const muted = { color: "#7A6F63" } as const;

export default function PrivacyPolicyPage() {
  return (
    <LegalPageShell title="Privacy Policy">
      <p style={muted}>
        This Privacy Policy describes how {BUSINESS_NAME} (&ldquo;we&rdquo;,
        &ldquo;us&rdquo;, or &ldquo;our&rdquo;) handles personal information when
        you use our website and SaaS services. By using our services, you agree
        to this policy.
      </p>

      <section>
        <h2 className={h2} style={h2Style}>
          1. Who we are
        </h2>
        <p>
          <strong>{BUSINESS_NAME}</strong> operates a subscription-based SaaS
          platform for business operations management. Registered address:{" "}
          {REGISTERED_ADDRESS}. For privacy-related requests, contact{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-[#C25A3A] underline">
            {SUPPORT_EMAIL}
          </a>
          .
        </p>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          2. Information we collect
        </h2>
        <p>We may collect and process the following categories of information:</p>
        <ul className={list}>
          <li>
            <strong>Identity and contact:</strong> full name, email address, and
            phone number.
          </li>
          <li>
            <strong>Business details:</strong> business name and business address
            associated with your account.
          </li>
          <li>
            <strong>Account and usage data:</strong> login activity, device and
            browser type, IP address, pages or features accessed, timestamps, and
            diagnostic or performance data needed to operate and secure the
            service.
          </li>
          <li>
            <strong>Content you upload:</strong> documents, files, or other
            materials you choose to store in the platform as part of your use of
            the service.
          </li>
          <li>
            <strong>Event media and derived data:</strong> Studios upload photos
            and videos that may contain identifiable individuals; automated
            processing generates face embeddings; a Guest&rsquo;s face-search
            selfie is processed in-session and not stored.
          </li>
          <li>
            <strong>Payment and billing information:</strong> when you subscribe,
            payment-related data is collected and processed by our payment
            partners (for example, card or UPI identifiers and transaction
            status). We do not store full card numbers on our servers; our
            payment processor handles card data in line with applicable rules.
          </li>
          <li>
            <strong>Communications:</strong> messages you send to us (for example,
            support tickets or emails).
          </li>
        </ul>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          3. Biometric and facial data
        </h2>
        <p>
          Face embeddings derived from event media are treated as sensitive
          personal data. Their purpose is strictly limited to letting a Guest
          find their own photos within a specific published gallery. They are
          never used for cross-event identification, profiling, or advertising.
        </p>
        <ul className={list}>
          <li>
            <strong>Legal basis:</strong> consent, recorded when a Guest accepts
            the Terms and submits a selfie for face search.
          </li>
          <li>
            <strong>Selfies:</strong> converted to an embedding in-session,
            matched, then discarded. The selfie is not stored.
          </li>
          <li>
            <strong>Embeddings:</strong> retained for the lifetime of the
            published gallery.
          </li>
          <li>
            <strong>Sub-processors:</strong> the providers that compute and
            store embeddings are disclosed in &ldquo;Sharing with third
            parties&rdquo; below.
          </li>
        </ul>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          4. Guest data
        </h2>
        <ul className={list}>
          <li>Guests are not registered Members; they access galleries via share links.</li>
          <li>Images of Guests may appear in media uploaded by a Studio.</li>
          <li>
            Face search produces a temporary embedding only. Guests who do not
            use face search have no embedding stored against them.
          </li>
          <li>
            A Guest may request deletion of their face embedding by emailing{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-[#C25A3A] underline">
              {SUPPORT_EMAIL}
            </a>
            ; requests are handled manually and the relevant Studio is notified.
          </li>
        </ul>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          5. Why we collect information and how we use it
        </h2>
        <p>We use personal information for purposes including:</p>
        <ul className={list}>
          <li>Creating and managing your account and subscription.</li>
          <li>
            Providing, maintaining, and improving the Vyavasth platform
            (including workflows, task tracking, and day-to-day business
            management features).
          </li>
          <li>
            Processing payments, renewals, refunds, and billing inquiries in line
            with our Refund &amp; Cancellation Policy.
          </li>
          <li>
            Security, fraud prevention, abuse detection, and compliance with legal
            and regulatory obligations (including know-your-customer and
            anti-money laundering requirements where applicable, and directions
            from regulators such as the Reserve Bank of India when required).
          </li>
          <li>
            Sending service-related notices (for example, billing receipts,
            policy updates, or security alerts).
          </li>
          <li>
            Responding to your requests and providing customer support, including
            grievance handling.
          </li>
        </ul>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          6. Legal bases (where applicable)
        </h2>
        <p>
          Depending on the context, we rely on performance of a contract,
          legitimate interests (such as securing and improving the service),
          consent where required, and compliance with legal obligations. For
          individuals located in India, we process personal data in accordance
          with applicable Indian law, including the Digital Personal Data
          Protection Act, 2023 (DPDPA).
        </p>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          7. Sharing with third parties
        </h2>
        <p>
          We do not sell your personal information. We may share information with:
        </p>
        <ul className={list}>
          <li>
            <strong>Payment processors:</strong> for example{" "}
            <strong>Razorpay</strong> (or other providers we may use) to
            authorize, process, and reconcile payments. These providers process
            data under their own terms and privacy policies and are required to
            protect payment data in accordance with applicable standards.
          </li>
          <li>
            <strong>Infrastructure and service providers:</strong> hosting,
            logging, email delivery, media storage, face-embedding computation,
            or customer support tools that help us run the platform, strictly
            under confidentiality and data-processing arrangements where
            appropriate.
          </li>
          <li>
            <strong>Professional advisers:</strong> lawyers, auditors, or
            accountants when required.
          </li>
          <li>
            <strong>Authorities:</strong> when disclosure is required by law,
            court order, or a lawful request from a regulator or law enforcement
            agency in India or elsewhere, including for RBI or other financial
            compliance purposes.
          </li>
          <li>
            <strong>Business transfers:</strong> in connection with a merger,
            acquisition, or sale of assets, subject to appropriate safeguards.
          </li>
        </ul>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          8. Data retention
        </h2>
        <p>
          We retain personal information only as long as necessary for the purposes
          described in this policy, including to meet legal, accounting, and
          regulatory requirements (for example, tax or payment record retention).
          When retention is no longer required, we delete or anonymize data where
          feasible.
        </p>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          9. Your rights and choices
        </h2>
        <p>
          Subject to applicable law, you may request access, correction, or
          deletion of certain personal information, withdraw consent where
          processing is consent-based, or object to certain processing. You may
          also be able to export or delete content you have uploaded through
          in-product controls where available. To exercise these rights, contact{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-[#C25A3A] underline">
            {SUPPORT_EMAIL}
          </a>
          . We may need to verify your identity before fulfilling a request.
        </p>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          10. Cookies and similar technologies
        </h2>
        <p>
          We use cookies and similar technologies (such as local storage) to
          operate the website and application—for example, to keep you signed in,
          remember preferences, measure basic performance, and improve security.
          You can control cookies through your browser settings; blocking
          essential cookies may affect how the service functions. For a full
          breakdown, see our{" "}
          <a href="/cookie-policy" className="text-[#C25A3A] underline">
            Cookie Policy
          </a>
          .
        </p>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          11. Security
        </h2>
        <p>
          We implement technical and organizational measures designed to protect
          personal information against unauthorized access, alteration, or loss.
          No method of transmission over the Internet is completely secure; we
          encourage you to use strong passwords and protect your account
          credentials.
        </p>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          12. International transfers
        </h2>
        <p>
          Your information may be processed in India and, where we use service
          providers outside India, we take steps consistent with applicable law to
          ensure appropriate safeguards.
        </p>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          13. Children
        </h2>
        <p>
          Our services are intended for businesses and are not directed at
          children. If you believe we have collected information from a child,
          please contact us and we will take appropriate steps.
        </p>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          14. Changes to this policy
        </h2>
        <p>
          We may update this Privacy Policy from time to time. We will post the
          updated version on this page and revise the &ldquo;Last Updated&rdquo;
          date. Where changes are material, we will provide notice as required by
          law or through the service.
        </p>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          15. Contact
        </h2>
        <p>
          For questions or concerns about privacy or this policy, write to{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-[#C25A3A] underline">
            {SUPPORT_EMAIL}
          </a>{" "}
          or use the contact form on our{" "}
          <a href="/contact" className="text-[#C25A3A] underline">
            Contact
          </a>{" "}
          page.
        </p>
      </section>
    </LegalPageShell>
  );
}
