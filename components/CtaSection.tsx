import Image from "next/image";
import Link from "next/link";
import { offerLine, type FirstPurchaseOffer } from "@/lib/plans";
import { whatsappUrl } from "@/lib/site-legal";
import styles from "./CtaSection.module.css";

/**
 * The closing band, shared by the home and pricing pages. `offer` is the
 * first-purchase offer from the plans API (see lib/pricing-display.ts), null
 * whenever it is not live, in which case nothing here mentions anything free.
 */
export default function CtaSection({ offer }: { offer: FirstPurchaseOffer | null }) {
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
          {offer
            ? `Buy your first event and get ${offer.bonus_events} more free. Every feature included.`
            : "Every feature included from your first event."}
        </p>
        <Link className={styles.btn} href="/pricing#events">
          {offer ? offerLine(offer) : "See pricing"}
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
        </Link>
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
