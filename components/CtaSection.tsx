import Image from "next/image";
import { LOGIN_URL } from "@/lib/app-url";
import { whatsappUrl } from "@/lib/site-legal";
import styles from "./CtaSection.module.css";

/**
 * The closing band, shared by the home and pricing pages. `freeEvents` is the
 * free plan's allowance from the plans API (see lib/pricing-display.ts).
 */
export default function CtaSection({ freeEvents }: { freeEvents: number }) {
  return (
    <section className={styles.cta5}>
      <div className={styles.band}>
        <h2>
          Start delivering with{" "}
          <span className={styles.lg}>
            <Image
              src="/vyavasth-full-logo.svg"
              alt="Vyavasth"
              width={124}
              height={26}
            />
          </span>
        </h2>
        <p>
          {freeEvents === 1
            ? "Your first event is free."
            : `Your first ${freeEvents} events are free.`}{" "}
          Every feature included.
        </p>
        <a className={styles.btn} href={LOGIN_URL}>
          Start your first event free
          <span>
            <svg
              viewBox="0 0 18 18"
              fill="none"
              stroke="#fff"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M3.5 9h11M10 4.5L14.5 9 10 13.5" />
            </svg>
          </span>
        </a>
        <div className={styles.alt}>
          or{" "}
          <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
            chat with us on WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
