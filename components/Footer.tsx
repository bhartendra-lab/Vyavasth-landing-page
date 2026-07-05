"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useEnquiry } from "@/components/EnquiryProvider";
import {
  REGISTERED_ADDRESS,
  SUPPORT_EMAIL,
  WHATSAPP_NUMBER,
} from "@/lib/site-legal";

const SOCIALS = [
  { label: "Instagram", href: "https://www.instagram.com/vyavasth" },
  { label: "LinkedIn", href: "https://www.linkedin.com/company/vyavasth" },
  { label: "X (Twitter)", href: "https://twitter.com/vyavasth" },
];

const LEGAL_LINKS = [
  { label: "Privacy Policy", href: "/privacy-policy" },
  { label: "Refund & Cancellation", href: "/refund-policy" },
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Contact Us", href: "/contact" },
  { label: "About Us", href: "/about" },
];

const colHeading =
  "text-[11px] font-bold uppercase tracking-[0.1em] mb-4";
const colLink =
  "inline-flex items-center gap-1.5 text-sm transition-colors hover:text-[var(--color-accent)]";

export default function Footer() {
  const { openEnquiry } = useEnquiry();
  const year = new Date().getFullYear();

  return (
    <footer
      style={{
        background: "var(--color-surface)",
        borderTop: "1px solid var(--color-line)",
      }}
    >
      <div
        className="mx-auto grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]"
        style={{ maxWidth: "var(--max-w)", padding: "56px var(--gutter) 40px" }}
      >
        {/* Brand */}
        <div className="flex flex-col items-start gap-4">
          <Image
            src="/vyavasth-full-logo.svg"
            alt="Vyavasth"
            width={160}
            height={28}
            className="h-6 w-auto"
          />
          <p
            className="max-w-[280px] text-sm"
            style={{ lineHeight: 1.6, color: "var(--color-muted)" }}
          >
            The AI Companion for photography studios.
          </p>
          <p
            className="text-sm font-medium"
            style={{ color: "var(--color-primary)" }}
          >
            Made in India 🙏
          </p>
        </div>

        {/* Product */}
        <div>
          <h4 className={colHeading} style={{ color: "var(--color-faint)" }}>
            Product
          </h4>
          <nav className="flex flex-col gap-2.5" aria-label="Product">
            <Link href="/#features" className={colLink} style={{ color: "var(--color-primary)" }}>
              Features
            </Link>
            <Link href="/#how" className={colLink} style={{ color: "var(--color-primary)" }}>
              How it works
            </Link>
            <Link href="/#why" className={colLink} style={{ color: "var(--color-primary)" }}>
              Why Vyavasth
            </Link>
          </nav>
        </div>

        {/* Company */}
        <div>
          <h4 className={colHeading} style={{ color: "var(--color-faint)" }}>
            Company
          </h4>
          <div className="flex flex-col items-start gap-2.5">
            <button
              type="button"
              onClick={openEnquiry}
              className={colLink}
              style={{ color: "var(--color-primary)" }}
            >
              Book a demo
            </button>
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={colLink}
                style={{ color: "var(--color-primary)" }}
              >
                {s.label}
                <ArrowUpRight size={12} aria-hidden />
              </a>
            ))}
          </div>
        </div>

        {/* Talk to us */}
        <div>
          <h4 className={colHeading} style={{ color: "var(--color-faint)" }}>
            Talk to us
          </h4>
          <div className="flex flex-col items-start gap-2.5">
            <a
              href={`mailto:${SUPPORT_EMAIL}`}
              className={colLink}
              style={{ color: "var(--color-primary)" }}
            >
              {SUPPORT_EMAIL}
            </a>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className={colLink}
              style={{ color: "var(--color-primary)" }}
            >
              WhatsApp us
            </a>
            <p
              className="max-w-[260px] text-sm"
              style={{ lineHeight: 1.6, color: "var(--color-muted)" }}
            >
              {REGISTERED_ADDRESS}
            </p>
          </div>
        </div>
      </div>

      {/* Legal + bottom bar */}
      <div style={{ borderTop: "1px solid var(--color-line)" }}>
        <div
          className="mx-auto flex flex-col items-center justify-between gap-4 py-6 sm:flex-row"
          style={{ maxWidth: "var(--max-w)", padding: "24px var(--gutter)" }}
        >
          <span className="text-xs" style={{ color: "var(--color-muted)" }}>
            &copy; {year} Vyavasth. All rights reserved.
          </span>
          <nav
            className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
            aria-label="Legal"
          >
            {LEGAL_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-xs transition-colors hover:text-[var(--color-accent)]"
                style={{ color: "var(--color-muted)" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </footer>
  );
}
