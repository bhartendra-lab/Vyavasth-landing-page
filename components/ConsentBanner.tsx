"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  GTM_ID,
  OPEN_CONSENT_EVENT,
  getStoredConsent,
  setConsent,
  type ConsentChoice,
} from "@/lib/analytics";
import styles from "./ConsentBanner.module.css";

/**
 * Cookie notice, shown until the visitor picks OK or Opt out. Renders nothing
 * unless analytics is configured. Tracking is on by default outside
 * CONSENT_REQUIRED_REGIONS (lib/analytics.ts); there it waits for OK.
 */
export default function ConsentBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!GTM_ID) return;
    // Defer so the first client render matches the server HTML.
    const t = window.setTimeout(() => setOpen(getStoredConsent() === null), 0);
    const reopen = () => setOpen(true);
    window.addEventListener(OPEN_CONSENT_EVENT, reopen);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener(OPEN_CONSENT_EVENT, reopen);
    };
  }, []);

  if (!GTM_ID || !open) return null;

  const choose = (choice: ConsentChoice) => {
    setConsent(choice);
    setOpen(false);
  };

  return (
    <div
      className={styles.banner}
      role="dialog"
      aria-live="polite"
      aria-label="Cookie notice"
    >
      <p className={styles.text}>
        We use cookies to measure how the site is used and to show Vyavasth ads
        on other platforms. Opting out changes nothing about how the site works.{" "}
        <Link href="/cookie-policy" className={styles.link}>
          Cookie Policy
        </Link>
      </p>
      <div className={styles.actions}>
        <button type="button" className={styles.btn} onClick={() => choose("denied")}>
          Opt out
        </button>
        <button
          type="button"
          className={`${styles.btn} ${styles.primary}`}
          onClick={() => choose("granted")}
        >
          OK
        </button>
      </div>
    </div>
  );
}
