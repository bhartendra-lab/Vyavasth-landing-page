"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import { LOGIN_URL } from "@/lib/app-url";
import styles from "./Nav.module.css";

const NAV_LINKS = [
  { label: "Features", href: "/#features" },
  { label: "Pricing", href: "/pricing" },
  { label: "How it works", href: "/#how" },
];

export default function Nav() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  // The drawer is open only for the path it was opened on, so navigating
  // closes it without an effect.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const drawerOpen = openOn === pathname;
  const setDrawerOpen = (open: boolean) => setOpenOn(open ? pathname : null);

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
