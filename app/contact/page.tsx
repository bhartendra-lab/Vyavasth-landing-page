import type { Metadata } from "next";
import LegalPageShell from "@/components/LegalPageShell";
import ContactPageForm from "@/components/ContactPageForm";
import {
  BUSINESS_NAME,
  BUSINESS_HOURS,
  GRIEVANCE_OFFICER_EMAIL,
  GRIEVANCE_OFFICER_NAME,
  GRIEVANCE_OFFICER_PHONE_DISPLAY,
  GRIEVANCE_OFFICER_PHONE_TEL,
  REGISTERED_ADDRESS,
  RESPONSE_TIME_BUSINESS_HOURS,
  SUPPORT_EMAIL,
  SUPPORT_PHONE_DISPLAY,
  SUPPORT_PHONE_TEL,
} from "@/lib/site-legal";

export const metadata: Metadata = {
  title: "Contact Us — Vyavasth",
  description:
    "Contact Vyavasth for support, billing, and grievances. Registered address, hours, and support form.",
  alternates: { canonical: "/contact" },
};

const h2 = "text-xl font-semibold mt-2 mb-3 tracking-tight";
const h2Style = { fontFamily: "var(--font-syne)", color: "#1A1208" } as const;
const muted = { color: "#7A6F63" } as const;

export default function ContactPage() {
  return (
    <LegalPageShell title="Contact Us">
      <p style={muted}>{RESPONSE_TIME_BUSINESS_HOURS}</p>

      <section>
        <h2 className={h2} style={h2Style}>
          {BUSINESS_NAME}
        </h2>
        <p className="mb-2">
          <strong>Registered address</strong>
        </p>
        <p className="m-0">{REGISTERED_ADDRESS}</p>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          General support
        </h2>
        <ul className="list-none pl-0 space-y-2 m-0">
          <li>
            <strong>Email:</strong>{" "}
            <a href={`mailto:${SUPPORT_EMAIL}`} className="text-[#4F46E5] underline">
              {SUPPORT_EMAIL}
            </a>
          </li>
          <li>
            <strong>Phone:</strong>{" "}
            <a
              href={`tel:${SUPPORT_PHONE_TEL}`}
              className="text-[#4F46E5] underline"
            >
              {SUPPORT_PHONE_DISPLAY}
            </a>
          </li>
          <li>
            <strong>Business hours:</strong> {BUSINESS_HOURS}
          </li>
        </ul>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          Grievance officer
        </h2>
        <p style={muted} className="text-sm mb-3">
          As required under the Consumer Protection (E-Commerce) Rules, 2020, the
          following grievance officer is designated for consumer grievances.
        </p>
        <ul className="list-none pl-0 space-y-2 m-0">
          <li>
            <strong>Name:</strong> {GRIEVANCE_OFFICER_NAME}
          </li>
          <li>
            <strong>Email:</strong>{" "}
            <a
              href={`mailto:${GRIEVANCE_OFFICER_EMAIL}`}
              className="text-[#4F46E5] underline"
            >
              {GRIEVANCE_OFFICER_EMAIL}
            </a>
          </li>
          <li>
            <strong>Phone:</strong>{" "}
            <a
              href={`tel:${GRIEVANCE_OFFICER_PHONE_TEL}`}
              className="text-[#4F46E5] underline"
            >
              {GRIEVANCE_OFFICER_PHONE_DISPLAY}
            </a>
          </li>
        </ul>
      </section>

      <section className="mt-4">
        <ContactPageForm />
      </section>
    </LegalPageShell>
  );
}
