"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEnquiry } from "@/components/EnquiryProvider";

const NAV_LINKS = [
  { label: "Features", href: "/#features" },
  { label: "How it works", href: "/#how" },
  { label: "Why Vyavasth", href: "/#why" },
];

export default function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const { openEnquiry } = useEnquiry();

  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setDrawerOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDrawerOpen(false);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  // Cream hero → nav is always ink-on-cream; it just gains a frosted backdrop
  // once the page scrolls under it (and on subpages).
  const frosted = scrolled || !isHome;

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          frosted ? "backdrop-blur-md border-b" : "bg-transparent"
        }`}
        style={
          frosted
            ? {
                backgroundColor: "rgba(245, 237, 224, 0.88)",
                borderBottomColor: "var(--color-line)",
              }
            : undefined
        }
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <Link
            href="/"
            className="flex items-center focus:outline-none"
            aria-label="Vyavasth home"
          >
            <Image
              src="/vyavasth-full-logo.svg"
              alt="Vyavasth"
              width={148}
              height={26}
              priority
              className="h-6 w-auto"
            />
          </Link>

          <nav
            className="hidden md:flex items-center gap-8"
            aria-label="Main navigation"
          >
            {NAV_LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="text-sm font-medium transition-colors hover:text-[var(--color-accent)]"
                style={{ color: "var(--color-primary)" }}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={openEnquiry}
              className="hidden md:inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-deep)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/50"
              style={{ background: "var(--color-accent)" }}
            >
              Book a demo
            </button>

            <button
              className="md:hidden p-1 focus:outline-none"
              style={{ color: "var(--color-primary)" }}
              onClick={() => setDrawerOpen(true)}
              aria-label="Open menu"
              aria-expanded={drawerOpen}
              aria-controls="mobile-menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </header>

      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 backdrop-blur-sm md:hidden"
          style={{ backgroundColor: "rgba(42, 34, 24, 0.35)" }}
          onClick={() => setDrawerOpen(false)}
        />
      )}

      <div
        id="mobile-menu"
        aria-hidden={!drawerOpen}
        className={`fixed top-0 right-0 bottom-0 z-50 w-72 flex flex-col transition-transform duration-300 ease-in-out md:hidden ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          backgroundColor: "var(--color-bg)",
          borderLeft: "1px solid var(--color-line)",
        }}
      >
        <div
          className="flex items-center justify-between px-6 h-16"
          style={{ borderBottom: "1px solid var(--color-line)" }}
        >
          <Image
            src="/vyavasth-full-logo.svg"
            alt="Vyavasth"
            width={148}
            height={26}
            className="h-6 w-auto"
          />
          <button
            onClick={() => setDrawerOpen(false)}
            className="transition-colors focus:outline-none"
            style={{ color: "var(--color-muted)" }}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>
        <nav className="flex flex-col gap-1 p-6" aria-label="Mobile navigation">
          {NAV_LINKS.map((l, i) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setDrawerOpen(false)}
              className="flex items-baseline gap-3 rounded-lg px-2 py-3 text-lg font-semibold transition-colors hover:bg-[var(--color-surface-2)]"
              style={{ color: "var(--color-primary)" }}
            >
              <span
                className="text-xs font-bold"
                style={{ color: "var(--color-accent)" }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              {l.label}
            </Link>
          ))}
          <button
            type="button"
            onClick={() => {
              setDrawerOpen(false);
              openEnquiry();
            }}
            className="mt-4 w-full rounded-full py-3 text-sm font-semibold text-white transition-colors hover:bg-[var(--color-accent-deep)]"
            style={{ background: "var(--color-accent)" }}
          >
            Book a demo
          </button>
        </nav>
      </div>
    </>
  );
}
