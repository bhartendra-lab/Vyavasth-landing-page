import Link from "next/link";

const linkClass =
  "text-xs sm:text-sm transition-colors hover:text-[#1A1208] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]/40 rounded";

export default function Footer() {
  return (
    <footer
      className="py-8"
      style={{ borderTop: "1px solid rgba(26,18,8,0.08)", background: "#FAF8F5" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col gap-6">
        <nav
          className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 sm:gap-x-8"
          aria-label="Legal and company"
        >
          <Link
            href="/privacy-policy"
            className={linkClass}
            style={{ color: "#7A6F63", fontFamily: "var(--font-dm-sans)" }}
          >
            Privacy Policy
          </Link>
          <Link
            href="/refund-policy"
            className={linkClass}
            style={{ color: "#7A6F63", fontFamily: "var(--font-dm-sans)" }}
          >
            Refund &amp; Cancellation
          </Link>
          <Link
            href="/terms"
            className={linkClass}
            style={{ color: "#7A6F63", fontFamily: "var(--font-dm-sans)" }}
          >
            Terms &amp; Conditions
          </Link>
          <Link
            href="/contact"
            className={linkClass}
            style={{ color: "#7A6F63", fontFamily: "var(--font-dm-sans)" }}
          >
            Contact Us
          </Link>
          <Link
            href="/about"
            className={linkClass}
            style={{ color: "#7A6F63", fontFamily: "var(--font-dm-sans)" }}
          >
            About Us
          </Link>
        </nav>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-[rgba(26,18,8,0.06)]">
          <div className="flex items-center gap-2">
            <span
              className="flex items-center justify-center w-7 h-7 rounded-[8px] text-white font-bold text-xs select-none"
              style={{ backgroundColor: "#4F46E5" }}
            >
              V
            </span>
            <span
              className="text-sm font-semibold"
              style={{
                fontFamily: "var(--font-syne)",
                color: "#1A1208",
              }}
            >
              Vyavasth
            </span>
          </div>

          <p
            className="text-xs text-center"
            style={{
              color: "#7A6F63",
              fontFamily: "var(--font-dm-sans)",
            }}
          >
            © 2026 Vyavasth. All rights reserved.
          </p>

          <p
            className="text-xs"
            style={{
              color: "#7A6F63",
              fontFamily: "var(--font-dm-sans)",
            }}
          >
            Made in India 🇮🇳
          </p>
        </div>
      </div>
    </footer>
  );
}
