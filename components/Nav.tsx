"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const btnOutline =
  "px-4 py-2 text-sm font-medium rounded-lg border border-[#4F46E5] text-[#4F46E5] transition-all duration-200 hover:bg-[#4F46E5] hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4F46E5]/50";
const btnPrimary =
  "px-4 py-2 text-sm font-semibold rounded-lg text-[#0A0A0A] transition-all duration-200 hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#F59E0B]/50";

export default function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const scrollTo = (id: string) => {
    setDrawerOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const logoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isHome) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    setDrawerOpen(false);
  };

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "backdrop-blur-md border-b" : "bg-transparent"
        }`}
        style={
          scrolled
            ? {
                backgroundColor: "rgba(250,248,245,0.9)",
                borderBottomColor: "rgba(26,18,8,0.06)",
              }
            : undefined
        }
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            onClick={logoClick}
            className="flex items-center gap-2.5 focus:outline-none"
            aria-label="Vyavasth home"
          >
            <span
              className="flex items-center justify-center w-8 h-8 rounded-[10px] text-white font-bold text-sm select-none"
              style={{ backgroundColor: "#4F46E5" }}
            >
              V
            </span>
            <span
              className="text-lg font-semibold tracking-tight"
              style={{ fontFamily: "var(--font-syne)", color: "#1A1208" }}
            >
              Vyavasth
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-3">
            {isHome ? (
              <button
                type="button"
                onClick={() => scrollTo("feature")}
                className={btnOutline}
              >
                See How It Works
              </button>
            ) : (
              <Link href="/#feature" className={btnOutline}>
                See How It Works
              </Link>
            )}
            <Link
              href="/contact"
              className={btnPrimary}
              style={{ backgroundColor: "#F59E0B" }}
            >
              Contact Us
            </Link>
          </nav>

          <button
            className="md:hidden p-1 focus:outline-none"
            style={{ color: "#1A1208" }}
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={22} />
          </button>
        </div>
      </header>

      {drawerOpen && (
        <div
          className="fixed inset-0 z-50 backdrop-blur-sm md:hidden"
          style={{ backgroundColor: "rgba(26,18,8,0.3)" }}
          onClick={() => setDrawerOpen(false)}
        />
      )}

      <div
        className={`fixed top-0 right-0 bottom-0 z-50 w-72 flex flex-col transition-transform duration-300 ease-in-out md:hidden ${
          drawerOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          backgroundColor: "#FAF8F5",
          borderLeft: "1px solid rgba(26,18,8,0.07)",
        }}
      >
        <div
          className="flex items-center justify-between px-6 h-16"
          style={{ borderBottom: "1px solid rgba(26,18,8,0.07)" }}
        >
          <span
            className="text-lg font-semibold"
            style={{ fontFamily: "var(--font-syne)", color: "#1A1208" }}
          >
            Vyavasth
          </span>
          <button
            onClick={() => setDrawerOpen(false)}
            className="transition-colors focus:outline-none"
            style={{ color: "#7A6F63" }}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>
        <div className="flex flex-col gap-3 p-6">
          {isHome ? (
            <button
              type="button"
              onClick={() => scrollTo("feature")}
              className={`w-full py-3 text-sm ${btnOutline}`}
            >
              See How It Works
            </button>
          ) : (
            <Link
              href="/#feature"
              onClick={() => setDrawerOpen(false)}
              className={`w-full text-center py-3 text-sm ${btnOutline}`}
            >
              See How It Works
            </Link>
          )}
          <Link
            href="/contact"
            onClick={() => setDrawerOpen(false)}
            className={`w-full text-center py-3 text-sm ${btnPrimary}`}
            style={{ backgroundColor: "#F59E0B" }}
          >
            Contact Us
          </Link>
        </div>
      </div>
    </>
  );
}
