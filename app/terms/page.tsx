import type { Metadata } from "next";
import LegalPageShell from "@/components/LegalPageShell";
import {
  BUSINESS_NAME,
  REGISTERED_ADDRESS,
  SUPPORT_EMAIL,
} from "@/lib/site-legal";
import { getPlans } from "@/lib/vyavasth-api";
import {
  baseLifetimeLabel,
  eventPlanOf,
  formatCount,
  formatPrice,
  gstInclusiveOf,
  gstNote,
  photoCapTermsOf,
  validityBaseDaysOf,
  validityOptionsOf,
  validityOptionsSentence,
} from "@/lib/plans";

export const metadata: Metadata = {
  title: "Terms & Conditions: Vyavasth",
  description:
    "Terms of use for the Vyavasth SaaS platform, including billing, IP, face recognition, and governing law in India.",
  alternates: { canonical: "/terms" },
};

const h2 = "text-xl font-semibold mt-2 mb-3 tracking-tight";
const h2Style = { fontFamily: "var(--font-syne)", color: "#1A1208" } as const;
const list = "list-disc pl-5 space-y-2 m-0";
const muted = { color: "#7A6F63" } as const;

export default async function TermsPage() {
  // The pay per event figures (photo limit, the size and price of extra
  // capacity, the validity periods and their prices, and whether GST is in
  // those prices) are read from the plans API, the same cached request the
  // pricing page makes. They live on the Event-based Service in the database:
  // change them there and this page follows within minutes, with no deploy.
  // Nothing is typed in here. If the request fails, each sentence falls back
  // to pointing at the pricing page rather than quoting a figure.
  const plansResult = await getPlans();
  const eventPlan = plansResult.ok ? eventPlanOf(plansResult.data.plans) : null;
  const capTerms = photoCapTermsOf(eventPlan);
  const validityOptions = validityOptionsOf(eventPlan);
  const gst = gstNote(gstInclusiveOf(eventPlan));
  const lifetime = baseLifetimeLabel(validityBaseDaysOf(eventPlan));
  const pricingLink = (
    <a href="/pricing#photo-terms" className="text-[#C25A3A] underline">
      pricing page
    </a>
  );

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
          <strong>
            wedding and event photo delivery software for photography studios
          </strong>
          , which helps studios in India upload, deliver and share event photos
          with their clients and guests, and manage photo selection. We may add, modify, or discontinue
          features to improve the product or comply with law.
        </p>
        <p>
          The platform also includes a <strong>Delivery Hub</strong> that lets
          Studios host event media, publish face-searchable galleries, and
          deliver them to Hosts. Face search processes uploaded photos via
          automated image recognition to produce numerical face embeddings, and a
          Guest may optionally submit a selfie to locate their own photos within
          a published gallery. These features are described further in the
          section &ldquo;Face Recognition and Face Embeddings&rdquo; below and in
          our Privacy Policy.
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
        {/* Pay per event. Every figure is from the plans API (see the top of
            this component). The 36 months is VALIDITY_EXTENSION_MAX_AHEAD_MONTHS,
            a constant in the backend's own code. When a figure changes in the
            database this text changes with it: update LAST_UPDATED in
            lib/site-legal.ts by hand when that happens. */}
        <p>
          <strong>Pay per event.</strong> Events bought one at a time are paid
          for once and do not renew.{" "}
          {capTerms ? (
            <>
              Each such event can hold up to{" "}
              <strong>{formatCount(capTerms.cap)} photos at a time</strong>.
              Deleting photos from an event frees room in it, and only what is
              in the event at that moment counts toward the limit. You may add
              capacity to an event in blocks of{" "}
              <strong>
                {formatCount(capTerms.addonSize)} photos for {formatPrice(capTerms.addonPrice)} per block
              </strong>{" "}
              ({gst}).
            </>
          ) : (
            <>
              Each such event can hold a limited number of photos at a time.
              Deleting photos from an event frees room in it, and only what is
              in the event at that moment counts toward the limit. You may add
              capacity to an event in paid blocks. The limit, the size of a
              block and its price are shown on our {pricingLink}.
            </>
          )}{" "}
          Extra capacity applies to the one event it was bought for, cannot be
          moved to another event, and is non-refundable once applied. Where we
          run a first-purchase offer, it gives a studio that is buying events
          for the first time additional event credit, once per studio whatever
          number of events is bought, and we may change or withdraw the offer
          for future purchases at any time. Credit already granted under the
          offer is not affected.
        </p>
        <p>
          <strong>Event validity and extension.</strong> An event bought one at
          a time stays live for <strong>{lifetime}</strong> from the day it is
          created. Before it closes, the studio, or a client the studio has
          added to that event, may pay to keep it live for longer
          {validityOptions.length > 0 ? (
            <>
              : <strong>{validityOptionsSentence(validityOptions)}</strong> ({gst}).
            </>
          ) : (
            <>, for the periods and prices shown on our {pricingLink}.</>
          )}{" "}
          The time is added to the date the event was due to close, and an
          event may be extended more than once, up to 36 months ahead. Seven
          days before an event closes we email the studio and message the
          clients it added on WhatsApp, each with their own link to extend it.
          A client who pays is asked for an email address and a state so that a
          GST invoice can be issued to them. When an event closes, guests can
          no longer open it, it can no longer be extended, and its photos and
          videos are permanently deleted about a day later. A validity
          extension applies to the one event it was bought for, cannot be moved
          to another event, and is non-refundable once applied.
        </p>
        <p>
          The photo limit, the price of extra capacity and the prices of
          validity extensions stated above are the ones in force today. We may
          change them for future purchases. What applies to a purchase is what
          is shown on our {pricingLink} and at checkout when it is made.
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
        <p>
          In addition, for individuals located in India, personal data processing
          is also carried out in accordance with applicable Indian law, including
          the Digital Personal Data Protection Act, 2023 (DPDPA), as described in
          our Privacy Policy.
        </p>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          13. Face recognition and face embeddings
        </h2>
        <p>
          When a Studio publishes a gallery, an automated pipeline processes the
          uploaded photos to extract face embeddings (numerical representations
          of facial geometry). Original photos are not sent to any third party in
          original form for this purpose; only the derived embedding is stored.
        </p>
        <ul className={list}>
          <li>Embeddings are stored for the lifetime of the published gallery.</li>
          <li>
            When a Guest uses face search, the submitted selfie is converted to
            an embedding in-session, matched, then discarded. The selfie is not
            stored.
          </li>
          <li>
            Embeddings are never used for profiling, advertising, retargeting, or
            cross-event or cross-platform identification.
          </li>
          <li>
            Vyavasth does not set advertising or retargeting cookies on gallery
            pages, and a Guest&rsquo;s presence in a gallery is never used for ad
            targeting.
          </li>
        </ul>
        <p>
          A Guest may request deletion of their face embedding by emailing{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="text-[#C25A3A] underline">
            {SUPPORT_EMAIL}
          </a>
          ; requests are handled manually and the relevant Studio is notified.
        </p>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          14. Studio responsibilities for uploaded content
        </h2>
        <ul className={list}>
          <li>
            The Studio warrants that it holds the rights to all media it uploads
            and that relevant Hosts and Guests have been informed the media is
            hosted on a platform that includes face recognition functionality.
          </li>
          <li>
            The Studio is the data controller for uploaded media and the personal
            data of identifiable individuals within it; Vyavasth acts as data
            processor on the Studio&rsquo;s instruction. Obtaining Guest consent
            rests with the Studio.
          </li>
        </ul>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          15. Contact
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
