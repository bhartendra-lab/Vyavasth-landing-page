"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, X } from "lucide-react";
import { LOGIN_URL } from "@/lib/app-url";
import styles from "./Nav.module.css";

const NAV_LINKS = [
  { label: "Pricing", href: "/pricing" },
  { label: "How it works", href: "/#how" },
];

export type FeatureLink = { label: string; href: string };

export default function NavClient({ featureLinks }: { featureLinks: FeatureLink[] }) {
  const pathname = usePathname();
  const isHome = pathname === "/";
  // The drawer is open only for the path it was opened on, so navigating
  // closes it without an effect.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const drawerOpen = openOn === pathname;
  const setDrawerOpen = (open: boolean) => setOpenOn(open ? pathname : null);

  // The Features menu works the same way. Its links are always in the HTML
  // (CSS hides the panel when closed), so crawlers and keyboards both find them.
  const [menuOn, setMenuOn] = useState<string | null>(null);
  const menuOpen = menuOn === pathname;
  const setMenuOpen = (open: boolean) => setMenuOn(open ? pathname : null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMenuOn(null);
        menuButtonRef.current?.focus();
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOn(null);
    };
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!drawerOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpenOn(null);
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [drawerOpen]);

  const isActive = (href: string) => href === pathname;
  const onFeatures = pathname === "/features" || pathname.startsWith("/features/");

  return (
    <>
      <nav
        className={`${styles.nav} ${isHome ? styles.intro : ""}`}
        aria-label="Main"
      >
        <Link href="/" className={styles.logo} aria-label="Vyavasth home">
          <Image
            src="/vyavasth-full-logo.svg"
            alt="Vyavasth"
            width={124}
            height={26}
            priority
          />
        </Link>
        <div className={styles.links}>
          <div
            ref={menuRef}
            className={styles.dd}
            onPointerEnter={(e) => e.pointerType === "mouse" && setMenuOpen(true)}
            onPointerLeave={(e) => e.pointerType === "mouse" && setMenuOpen(false)}
          >
            <button
              ref={menuButtonRef}
              type="button"
              className={`${styles.ddBtn} ${onFeatures ? styles.on : ""}`}
              aria-expanded={menuOpen}
              aria-controls="features-menu"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              Features
              <ChevronDown size={15} aria-hidden className={styles.caret} />
            </button>
            <div
              id="features-menu"
              className={`${styles.ddPanel} ${menuOpen ? styles.ddOpen : ""}`}
            >
              <div className={styles.ddBox}>
                {featureLinks.map((l) => (
                  <Link
                    key={l.href}
                    href={l.href}
                    aria-current={isActive(l.href) ? "page" : undefined}
                    onClick={() => setMenuOpen(false)}
                  >
                    {l.label}
                  </Link>
                ))}
                <Link
                  href="/features"
                  className={styles.ddAll}
                  aria-current={isActive("/features") ? "page" : undefined}
                  onClick={() => setMenuOpen(false)}
                >
                  All features
                </Link>
              </div>
            </div>
          </div>
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={isActive(l.href) ? styles.on : undefined}
              aria-current={isActive(l.href) ? "page" : undefined}
            >
              {l.label}
            </Link>
          ))}
        </div>
        <span className={styles.sp} />
        {/* The only action in the bar, so it takes the primary button style. */}
        <a className={styles.go} href={LOGIN_URL}>
          Log in
        </a>
        <button
          type="button"
          className={styles.burger}
          aria-label="Open menu"
          aria-expanded={drawerOpen}
          aria-controls="mobile-menu"
          onClick={() => setDrawerOpen(true)}
        >
          <i />
        </button>
      </nav>

      {drawerOpen && (
        <div className={styles.scrim} onClick={() => setDrawerOpen(false)} />
      )}
      <div
        id="mobile-menu"
        className={`${styles.drawer} ${drawerOpen ? styles.open : ""}`}
        inert={!drawerOpen}
      >
        <div className={styles.drawerHead}>
          <Image
            src="/vyavasth-full-logo.svg"
            alt="Vyavasth"
            width={124}
            height={26}
          />
          <button
            type="button"
            className={styles.close}
            aria-label="Close menu"
            onClick={() => setDrawerOpen(false)}
          >
            <X size={20} />
          </button>
        </div>
        <nav className={styles.drawerNav} aria-label="Mobile navigation">
          <Link
            href="/features"
            className={`${styles.item} ${isActive("/features") ? styles.on : ""}`}
            onClick={() => setDrawerOpen(false)}
          >
            Features
          </Link>
          <div className={styles.sub}>
            {featureLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`${styles.item} ${isActive(l.href) ? styles.on : ""}`}
                onClick={() => setDrawerOpen(false)}
              >
                {l.label}
              </Link>
            ))}
          </div>
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`${styles.item} ${isActive(l.href) ? styles.on : ""}`}
              onClick={() => setDrawerOpen(false)}
            >
              {l.label}
            </Link>
          ))}
          <a className={styles.drawerGo} href={LOGIN_URL}>
            Log in
          </a>
        </nav>
      </div>
    </>
  );
}
