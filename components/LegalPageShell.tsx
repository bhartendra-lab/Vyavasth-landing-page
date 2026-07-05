import Link from "next/link";
import { LAST_UPDATED } from "@/lib/site-legal";
import Footer from "@/components/Footer";
import Nav from "@/components/Nav";

const muted = "#7A6F63";
const text = "#1A1208";

export default function LegalPageShell({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--color-bg)" }}>
      <Nav />
      <main className="flex-1 pt-24 pb-16 px-6 lg:px-8">
        <article className="max-w-3xl mx-auto w-full">
          <div
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8 pb-6"
            style={{ borderBottom: "1px solid rgba(26,18,8,0.08)" }}
          >
            <p className="text-sm m-0" style={{ color: muted, fontFamily: "var(--font-dm-sans)" }}>
              Last Updated: {LAST_UPDATED}
            </p>
            <Link
              href="/"
              className="text-sm font-medium shrink-0 transition-colors hover:opacity-80"
              style={{ color: "#C25A3A", fontFamily: "var(--font-dm-sans)" }}
            >
              ← Back to home
            </Link>
          </div>

          <h1
            className="text-3xl sm:text-4xl font-bold tracking-tight mb-10"
            style={{
              fontFamily: "var(--font-syne)",
              color: text,
              letterSpacing: "-0.02em",
              lineHeight: 1.15,
            }}
          >
            {title}
          </h1>

          <div
            className="flex flex-col gap-8 text-[15px] sm:text-base leading-relaxed"
            style={{
              color: text,
              fontFamily: "var(--font-dm-sans)",
            }}
          >
            {children}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
