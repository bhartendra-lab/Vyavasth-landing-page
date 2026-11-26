import type { Metadata } from "next";
import LegalPageShell from "@/components/LegalPageShell";
import {
  BUSINESS_NAME,
  REGISTERED_ADDRESS,
  SUPPORT_EMAIL,
} from "@/lib/site-legal";

export const metadata: Metadata = {
  title: "Privacy Policy: Vyavasth",
  description:
    "How Vyavasth collects, uses, and protects personal data, including payments, face embeddings, the Vyavasth guest app, the Vyavasth Studio app, and cookies.",
  alternates: { canonical: "/privacy-policy" },
};

const h2 =
  "text-xl font-semibold mt-2 mb-3 tracking-tight";
const h2Style = { fontFamily: "var(--font-syne)", color: "#1A1208" } as const;
const list = "list-disc pl-5 space-y-2 m-0";
const muted = { color: "#7A6F63" } as const;

export default function PrivacyPolicyPage() {
  return (
    <LegalPageShell showUpdated title="Privacy Policy">
      <p style={muted}>
        This Privacy Policy describes how {BUSINESS_NAME} (&ldquo;we&rdquo;,
        &ldquo;us&rdquo;, or &ldquo;our&rdquo;) handles personal information when
        you use our website and SaaS services, the Vyavasth guest app and the
        Vyavasth Studio app for Android and iOS. By using our services, you agree to this policy.
      </p>

      <section>
        <h2 className={h2} style={h2Style}>
          1. Who we are
        </h2>
        <p>
          <strong>{BUSINESS_NAME}</strong> operates subscription-based
          wedding and event photo delivery software for photography studios.
          Registered address: {REGISTERED_ADDRESS}. For privacy-related requests, contact{" "}
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
            service. If you signed up after opening a link in a Vyavasth WhatsApp
            message, we also record which message it was.
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
            selfie on the web gallery is processed in-session and not stored. In
            the Vyavasth app, a Guest can choose to keep a face template in their
            account (see &ldquo;The Vyavasth guest app&rdquo; below).
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
          find their own photos: within a specific published gallery, or, for a
          Guest who chooses to save a face template in the Vyavasth app, within
          the events that Guest adds to their own account. They are never used
          for profiling or advertising, and never to identify anyone across
          events without that Guest&rsquo;s consent.
        </p>
        <ul className={list}>
          <li>
            <strong>Legal basis:</strong> consent, recorded when a Guest accepts
            the Terms and submits a selfie for face search, or, in the app, when
            the Guest ticks the face consent box before taking a selfie.
          </li>
          <li>
            <strong>Selfies:</strong> on the web gallery, converted to an
            embedding in-session, matched, then discarded; the selfie is not
            stored. In the app, the selfie image is deleted as soon as the face
            template has been created from it.
          </li>
          <li>
            <strong>Embeddings:</strong> those derived from event media are
            retained for the lifetime of the published gallery. An app
            Guest&rsquo;s saved face template is retained until the Guest deletes
            it or their account, or after 12 months without using the app (we
            notify the Guest about 14 days before).
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
          <li>
            Guests who use a gallery in a web browser are not registered
            Members; they access galleries via share links. Guests who use the
            Vyavasth app have an app account, described in the next section.
          </li>
          <li>Images of Guests may appear in media uploaded by a Studio.</li>
          <li>
            On the web gallery, face search produces a temporary embedding only.
            Guests who do not use face search, on the web or in the app, have no
            embedding stored against them.
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
          5. The Vyavasth guest app
        </h2>
        <p>
          The Vyavasth app for Android and iOS lets Guests of events covered by
          Studios using Vyavasth find and save their photos. It is intended for
          people aged 18 and over. In addition to the rest of this policy:
        </p>
        <ul className={list}>
          <li>
            <strong>Account:</strong> you sign in with your WhatsApp number (we
            send a one-time code by WhatsApp), your Google account, or your
            Apple ID. We keep your name, the phone number or email address that
            comes with the sign-in method you choose, an account identifier, and
            your sign-in sessions.
          </li>
          <li>
            <strong>Selfie and face template (biometric data):</strong> face
            matching is optional and happens only after you agree on the consent
            screen. You take one selfie; we create a face template (a numerical
            representation of your face) from it and then delete the selfie
            image. We keep the face template in your account to find you in the
            photos of the events you add, and only those events. You can delete
            it at any time in Settings (&ldquo;Delete my face data&rdquo;).
          </li>
          <li>
            <strong>Events and activity:</strong> the events you join, the photos
            matched to you, your likes, and your notification settings.
          </li>
          <li>
            <strong>Consent records:</strong> when you gave or withdrew consent
            to face matching, kept as proof of consent. They contain no photos or
            face data.
          </li>
          <li>
            <strong>Notifications:</strong> if you allow notifications, we keep a
            push token for your device so we can tell you when new photos are
            ready. You can turn notifications off in the app or in your
            phone&rsquo;s settings.
          </li>
          <li>
            <strong>Camera and photos:</strong> the camera is used only for the
            selfie and to scan gallery QR codes. Photos you save go to your
            phone; the app cannot read your photo library.
          </li>
          <li>
            <strong>Service providers:</strong> face matching, hosting, message
            delivery (WhatsApp) and push notification delivery are carried out
            by service providers acting on our instructions, as described in
            &ldquo;Sharing with third parties&rdquo;. The app has no advertising
            and no third-party tracking.
          </li>
          <li>
            <strong>Deleting only some of your data:</strong> in the app, go to
            Settings &rarr; Delete my face data to delete your face template, and
            everything made from it, without deleting your account. Without the
            app, email{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-[#C25A3A] underline">
              {SUPPORT_EMAIL}
            </a>{" "}
            and ask us to delete your face data. More detail is at{" "}
            <a
              href="https://deliver.vyavasth.in/delete-account"
              className="text-[#C25A3A] underline"
            >
              deliver.vyavasth.in/delete-account
            </a>
            .
          </li>
          <li>
            <strong>Deleting your account:</strong> in the app, go to Settings
            &rarr; Delete account, or, without the app, visit{" "}
            <a
              href="https://deliver.vyavasth.in/delete-account"
              className="text-[#C25A3A] underline"
            >
              deliver.vyavasth.in/delete-account
            </a>
            . Within 24 hours we delete your account, face template, matched
            photos, likes and event memberships. We keep the consent record
            (legal proof) and records of WhatsApp sign-in messages we sent you
            (billing); neither contains photos or face data. Studios that added
            you to their guest list keep your name on that list.
          </li>
        </ul>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          6. The Vyavasth Studio app
        </h2>
        <p>
          The Vyavasth Studio app for Android and iOS is for Studios: it uploads
          photos from a camera connected by USB-C or from the phone, and manages
          events, sharing, QR codes, selections and Studio settings. It uses the
          same account as the Vyavasth dashboard. In addition to the rest of
          this policy:
        </p>
        <ul className={list}>
          <li>
            <strong>What it collects:</strong> account details (name, email
            address, WhatsApp number, Studio name, address, website, social
            links and logo); billing details you enter (legal name, GSTIN,
            billing address) for tax invoices; the names, phone numbers and
            email addresses of clients you add to an event; the photos you
            upload, with the information the camera stores inside them (EXIF),
            which can include the date, camera settings and the location where
            a photo was taken; and crash reports (what went wrong, device model
            and system version, without your name, email, IP address or
            photos).
          </li>
          <li>
            <strong>What it does not do:</strong> it does not read your contacts
            or your photo library (you choose photos with the system&apos;s
            picker), does not use your location, microphone or the phone&apos;s
            camera, shows no ads and does not track you across other
            companies&apos; apps or websites. A camera connected by cable is read
            only when you choose to upload from it. Payments are not made in the
            app.
          </li>
          <li>
            <strong>Service providers:</strong> photos are stored with our cloud
            storage providers; when you search for your Studio&apos;s address,
            the text you type is sent to Google Places; crash reports go to our
            crash-reporting provider. They process this data only on our behalf.
          </li>
          <li>
            <strong>Deleting your account:</strong> in the app, Studio › Delete
            account, or at{" "}
            <a
              href="https://deliver.vyavasth.in/delete-studio-account"
              className="text-[#C25A3A] underline"
            >
              deliver.vyavasth.in/delete-studio-account
            </a>
            . Access ends at once. After 30 days we delete the Studio, its
            events, photos, galleries, QR codes and the people on them; within
            those 30 days you can ask us to restore it. We keep, as the law
            requires or for disputes: invoices, payment, renewal and accounting
            records, the billing audit trail, consent logs and records of
            WhatsApp messages sent.
          </li>
        </ul>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          7. Why we collect information and how we use it
        </h2>
        <p>We use personal information for purposes including:</p>
        <ul className={list}>
          <li>Creating and managing your account and subscription.</li>
          <li>
            Providing, maintaining, and improving the Vyavasth platform
            (including event photos, guest selfies used for face search, photo
            selections and related event details).
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
          8. Legal bases (where applicable)
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
          9. Sharing with third parties
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
            logging, email, WhatsApp and push notification delivery, media
            storage, face-embedding computation,
            or customer support tools that help us run the platform, strictly
            under confidentiality and data-processing arrangements where
            appropriate.
          </li>
          <li>
            <strong>Analytics and advertising providers:</strong> Google
            (Google Analytics, Google Ads) and Meta (Meta Pixel), on our
            marketing website and the Studio dashboard, unless you opt out
            (in the EEA, the UK and Switzerland, only after you click OK).
            They receive pseudonymous
            identifiers and page and click events, never your name, contact
            details or event photos.
          </li>
          <li>
            <strong>Product analytics (PostHog):</strong> on the Studio
            dashboard only, unless you opt out (in the EEA, the UK and
            Switzerland, only after you click OK). PostHog receives the pages
            you open, key steps such as signing up, creating an event or
            uploading, and screen recordings in which everything you type, all
            text and all images are hidden. You are identified only by an
            internal studio ID, never by name, phone number or email. The data
            is sent through our own domain.
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
          10. Data retention
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
          11. Your rights and choices
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
          12. Cookies and similar technologies
        </h2>
        <p>
          We use cookies and similar technologies (such as local storage) to
          operate the website and application—for example, to keep you signed in,
          remember preferences, measure basic performance, and improve security.
          On our marketing website and the Studio dashboard, analytics and
          advertising cookies (Google Analytics, Google Ads and Meta Pixel) are
          on unless you opt out on the cookie banner (in the EEA, the UK and
          Switzerland, only after you click OK); you can change your choice at
          any time from
          &ldquo;Cookie settings&rdquo; in the footer. You can control cookies through your browser settings; blocking
          essential cookies may affect how the service functions. Guest gallery pages use no cookies and no advertising or
          analytics scripts; we only count page views in aggregate, through our
          own server, without any identifier or gallery address. For a full
          breakdown, see our{" "}
          <a href="/cookie-policy" className="text-[#C25A3A] underline">
            Cookie Policy
          </a>
          .
        </p>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          13. Security
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
          14. International transfers
        </h2>
        <p>
          Your information may be processed in India and, where we use service
          providers outside India, we take steps consistent with applicable law to
          ensure appropriate safeguards.
        </p>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          15. Children
        </h2>
        <p>
          Our services are intended for businesses and are not directed at
          children. The Vyavasth guest app is intended for people aged 18 and
          over, who confirm their age before face matching. If you believe we
          have collected information from a child, please contact us and we
          will take appropriate steps.
        </p>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          16. Changes to this policy
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
          17. Contact
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
