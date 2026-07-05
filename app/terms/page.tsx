import type { Metadata } from "next";
import LegalPageShell from "@/components/LegalPageShell";
import {
  BUSINESS_NAME,
  REGISTERED_ADDRESS,
  SUPPORT_EMAIL,
} from "@/lib/site-legal";

export const metadata: Metadata = {
  title: "Terms & Conditions — Vyavasth",
  description:
    "Terms of use for the Vyavasth SaaS platform, including billing, IP, and governing law in India.",
  alternates: { canonical: "/terms" },
};

const h2 = "text-xl font-semibold mt-2 mb-3 tracking-tight";
const h2Style = { fontFamily: "var(--font-syne)", color: "#1A1208" } as const;
const list = "list-disc pl-5 space-y-2 m-0";
const muted = { color: "#7A6F63" } as const;

export default function TermsPage() {
  return (
    <LegalPageShell title="Terms & Conditions">
      <p style={muted}>
        These Terms &amp; Conditions (&ldquo;Terms&rdquo;) govern your access to
        and use of {BUSINESS_NAME}&rsquo;s website and SaaS services.
      </p>

      <section>
        <h2 className={h2} style={h2Style}>
          1. Acceptance of terms
        </h2>
        <p>
          By creating an account, subscribing, or using our services, you agree
          to these Terms and our Privacy Policy. If you are using Vyavasth on
          behalf of a company or other legal entity, you represent that you have
          authority to bind that entity. If you do not agree, do not use the
          service.
        </p>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          2. Description of services
        </h2>
        <p>
          Vyavasth provides a subscription-based{" "}
          <strong>SaaS platform for business operations management</strong>,
          including features to help small and medium businesses and their teams
          in India manage internal operations, tasks, workflows, and day-to-day
          business activity in one place. We may add, modify, or discontinue
          features to improve the product or comply with law.
        </p>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          3. Accounts and eligibility
        </h2>
        <p>
          You must provide accurate registration information and keep it updated.
          You are responsible for safeguarding passwords and for all activity
          under your account. Notify us promptly at{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-[#C25A3A] underline">
            {SUPPORT_EMAIL}
          </a>{" "}
          if you suspect unauthorized access.
        </p>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          4. User obligations
        </h2>
        <p>You agree not to:</p>
        <ul className={list}>
          <li>
            Use the service in violation of applicable law or third-party rights.
          </li>
          <li>
            Upload malware, attempt to breach security, or probe or scan systems
            without authorization.
          </li>
          <li>
            Reverse engineer, resell, or sublicense the service except as
            expressly permitted.
          </li>
          <li>
            Use the service to send spam, harvest data without consent, or
            harass others.
          </li>
          <li>
            Misrepresent your identity or affiliation, or misuse payment methods.
          </li>
        </ul>
        <p>
          You retain rights in content you upload; you grant us a limited license
          to host, process, and display that content solely to provide the
          service.
        </p>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          5. Payment terms and billing
        </h2>
        <p>
          Paid plans are billed on a <strong>monthly</strong> cycle with{" "}
          <strong>automatic renewal</strong> until you cancel. Fees are charged in
          advance for each billing period using the payment method on file. You
          authorize us and our payment partners (such as Razorpay) to charge
          applicable amounts. Taxes may be added as required by law. Failure to
          pay may result in suspension or termination of access. Refunds and
          cancellations are governed by our{" "}
          <a href="/refund-policy" className="text-[#C25A3A] underline">
            Refund &amp; Cancellation Policy
          </a>
          .
        </p>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          6. Intellectual property
        </h2>
        <p>
          Vyavasth, its branding, software, documentation, and related materials
          are owned by us or our licensors and are protected by intellectual
          property laws. Except for the limited right to use the service during
          your subscription, no rights are granted to you.
        </p>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          7. Third-party services
        </h2>
        <p>
          The service may integrate with third-party tools or payment processors.
          Your use of those services may be subject to separate terms. We are not
          responsible for third-party services outside our reasonable control.
        </p>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          8. Disclaimer of warranties
        </h2>
        <p>
          To the maximum extent permitted by law, the service is provided on an
          &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis without
          warranties of any kind, whether express or implied, including
          merchantability, fitness for a particular purpose, or non-infringement.
        </p>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          9. Limitation of liability
        </h2>
        <p>
          To the maximum extent permitted by applicable law in India,{" "}
          {BUSINESS_NAME} and its directors, employees, and affiliates will not be
          liable for any indirect, incidental, special, consequential, or
          punitive damages, or for loss of profits, data, or goodwill. Our
          aggregate liability arising out of or relating to the service or these
          Terms will not exceed the greater of (a) the fees you paid to us for the
          service in the three (3) months preceding the claim, or (b) INR 5,000,
          except where liability cannot be limited by law (including death or
          personal injury caused by negligence, fraud, or willful misconduct).
        </p>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          10. Indemnity
        </h2>
        <p>
          You will defend and indemnify us against claims arising from your
          content, your misuse of the service, or your violation of these Terms,
          subject to applicable law.
        </p>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          11. Suspension and termination
        </h2>
        <p>
          We may suspend or terminate access for non-payment, risk of harm, legal
          requirements, or material breach of these Terms. You may stop using
          the service at any time. Provisions that by their nature should survive
          will survive termination.
        </p>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          12. Governing law and jurisdiction
        </h2>
        <p>
          These Terms are governed by the <strong>laws of India</strong>. Subject
          to applicable law, you agree that the courts at{" "}
          <strong>Bengaluru, Karnataka</strong> shall have{" "}
          <strong>exclusive jurisdiction</strong> over any dispute arising out of
          or relating to these Terms or the service.
        </p>
        <p>
          Registered address for notices (where not emailed): {REGISTERED_ADDRESS}.
        </p>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          13. Contact
        </h2>
        <p>
          Questions about these Terms:{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-[#C25A3A] underline">
            {SUPPORT_EMAIL}
          </a>{" "}
          or{" "}
          <a href="/contact" className="text-[#C25A3A] underline">
            /contact
          </a>
          .
        </p>
      </section>
    </LegalPageShell>
  );
}
