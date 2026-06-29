import Link from "next/link";

const linkClass =
  "text-xs sm:text-sm transition-colors hover:text-[#2B1F17] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D4500A]/40 rounded";

export default function Footer() {
  return (
    <footer
      className="py-8"
      style={{ borderTop: "1px solid rgba(43,31,23,0.08)", background: "#F5F0E8" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col gap-6">
        <nav
          className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:gap-x-8"
          aria-label="Legal and company"
        >
          <Link
            href="/privacy-policy"
            className={linkClass}
            style={{ color: "#6B5240", fontFamily: "var(--font-inter)" }}
          >
            Privacy Policy
          </Link>
          <Link
            href="/cookie-policy"
            className={linkClass}
            style={{ color: "#6B5240", fontFamily: "var(--font-inter)" }}
          >
            Cookie Policy
          </Link>
          <Link
            href="/refund-policy"
            className={linkClass}
            style={{ color: "#6B5240", fontFamily: "var(--font-inter)" }}
          >
            Refund &amp; Cancellation
          </Link>
          <Link
            href="/terms"
            className={linkClass}
            style={{ color: "#6B5240", fontFamily: "var(--font-inter)" }}
          >
            Terms &amp; Conditions
          </Link>
          <Link
            href="/contact"
            className={linkClass}
            style={{ color: "#6B5240", fontFamily: "var(--font-inter)" }}
          >
            Contact Us
          </Link>
          <Link
            href="/about"
            className={linkClass}
            style={{ color: "#6B5240", fontFamily: "var(--font-inter)" }}
          >
            About Us
          </Link>
        </nav>

        <div
          className="w-full max-w-full overflow-x-hidden py-1 sm:py-2 pointer-events-none select-none"
          aria-hidden="true"
        >
          <p
            className="text-center leading-none whitespace-nowrap mx-auto max-w-full"
            style={{
              fontFamily: "var(--font-inter)",
              fontWeight: 800,
              fontSize: "clamp(2.75rem, 18vw, 8.75rem)",
              letterSpacing: "-0.02em",
              color: "rgba(43, 31, 23, 0.07)",
            }}
          >
            Vyavasth
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-[rgba(43,31,23,0.06)]">
          <div className="flex items-center gap-2">
            <span
              className="flex items-center justify-center w-7 h-7 rounded-[8px] text-white font-bold text-xs select-none"
              style={{ backgroundColor: "#D4500A" }}
            >
              V
            </span>
            <span
              className="text-sm font-semibold"
              style={{
                fontFamily: "var(--font-playfair)",
                color: "#2B1F17",
              }}
            >
              Vyavasth
            </span>
          </div>

          <p
            className="text-xs text-center"
            style={{
              color: "#6B5240",
              fontFamily: "var(--font-inter)",
            }}
          >
            © 2026 Vyavasth. All rights reserved.
          </p>

          <p
            className="text-xs"
            style={{
              color: "#6B5240",
              fontFamily: "var(--font-inter)",
            }}
          >
            Made in India 🇮🇳
          </p>
        </div>
      </div>
    </footer>
  );
}
