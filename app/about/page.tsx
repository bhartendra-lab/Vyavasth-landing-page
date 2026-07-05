import type { Metadata } from "next";
import Link from "next/link";
import LegalPageShell from "@/components/LegalPageShell";
import {
  BUSINESS_NAME,
  REGISTERED_ADDRESS,
  SERVICE_DESCRIPTION_SHORT,
} from "@/lib/site-legal";

export const metadata: Metadata = {
  title: "About Us — Vyavasth",
  description:
    "Learn about Vyavasth, our SaaS platform for business operations management in India.",
  alternates: { canonical: "/about" },
};

const h2 = "text-xl font-semibold mt-2 mb-3 tracking-tight";
const h2Style = { fontFamily: "var(--font-syne)", color: "#1A1208" } as const;
const list = "list-disc pl-5 space-y-2 m-0";

export default function AboutPage() {
  return (
    <LegalPageShell title="About Us">
      <section>
        <h2 className={h2} style={h2Style}>
          What we do
        </h2>
        <p>
          <strong>{BUSINESS_NAME}</strong> is a SaaS platform that helps
          businesses manage their internal operations and tasks—team workflows,
          task tracking, and day-to-day business management—in one place. We focus
          on small and medium business owners and their teams in India who need a
          clear system instead of scattered chats and spreadsheets.
        </p>
        <p>
          In short: <strong>{SERVICE_DESCRIPTION_SHORT}</strong>.
        </p>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          Our Services
        </h2>
        <div className="flex flex-col gap-3 rounded-xl p-5 sm:p-6 bg-white border border-[rgba(26,18,8,0.08)]">
          <p className="m-0">
            Vyavasth offers subscription-based access to businesses of all sizes.
          </p>
          <p className="m-0">
            Our platform is designed to simplify operations and improve efficiency.
          </p>
          <p className="m-0">
            Plans are tailored to your needs — contact us for pricing.
          </p>
        </div>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          Business entity
        </h2>
        <p>
          <strong>{BUSINESS_NAME}</strong>
        </p>
        <p className="m-0">Registered address:</p>
        <p className="mt-1 mb-0">{REGISTERED_ADDRESS}</p>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          Trust and responsibility
        </h2>
        <ul className={list}>
          <li>
            We design Vyavasth as a <strong>secure platform</strong> for
            day-to-day business operations, with sensible access and hosting
            practices.
          </li>
          <li>
            We are committed to <strong>data privacy</strong> and transparent
            handling of personal and business information—see our{" "}
            <Link href="/privacy-policy" className="text-[#C25A3A] underline">
              Privacy Policy
            </Link>
            .
          </li>
          <li>
            Billing, refunds, and cancellations are explained in our{" "}
            <Link href="/refund-policy" className="text-[#C25A3A] underline">
              Refund &amp; Cancellation Policy
            </Link>{" "}
            and{" "}
            <Link href="/terms" className="text-[#C25A3A] underline">
              Terms &amp; Conditions
            </Link>
            .
          </li>
        </ul>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          Get in touch
        </h2>
        <p>
          For pricing, demos, or partnership enquiries, reach out via our contact
          page—we will be glad to help.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-semibold text-white transition-all duration-200 hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C25A3A]/50 no-underline w-full sm:w-auto text-center"
          style={{ backgroundColor: "#C25A3A", fontFamily: "var(--font-dm-sans)" }}
        >
          Contact us for pricing
        </Link>
      </section>
    </LegalPageShell>
  );
}
