export default function Footer() {
  return (
    <footer
      className="py-6"
      style={{ borderTop: "1px solid rgba(26,18,8,0.08)", background: "#FAF8F5" }}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Logo + wordmark */}
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

          {/* Copyright */}
          <p
            className="text-xs text-center"
            style={{
              color: "#7A6F63",
              fontFamily: "var(--font-dm-sans)",
            }}
          >
            © 2026 Vyavasth. All rights reserved.
          </p>

          {/* Made in India */}
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
