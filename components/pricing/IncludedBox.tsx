import Link from "next/link";
import { formatStorage } from "@/lib/plans";
import { ORIGINAL_TIER_MIN_STORAGE_GB } from "@/lib/pricing-display";
import styles from "./pricing.module.css";

// The ten capabilities every plan includes. Static marketing copy from the
// pricing prototype (it is no longer read from the features API).
const INCLUDED = [
  "AI face search",
  "Smart Select",
  "Locate originals",
  "Live delivery",
  "Your branding and watermark",
  "Google reviews in the gallery",
  "Passcode gallery",
  "One reusable QR",
  "WhatsApp and email alerts",
  "Sorted by function",
];

export default function IncludedBox() {
  return (
    <section className={styles.inc}>
      {/* id="features" is where the home page's four "Explore ..." buttons land. */}
      <div className={styles.box} id="features">
        <h2>Every feature, on every plan.</h2>
        <div className={styles.g}>
          {INCLUDED.map((name) => (
            <span key={name}>
              <svg viewBox="0 0 18 18" fill="none" stroke="#C25A3A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M3.5 9.4l3.4 3.400 7.600-8" />
              </svg>
              {name}
            </span>
          ))}
        </div>
        <div className={styles.note}>
          <span>
            <b>One exception:</b> original-quality delivery needs a {formatStorage(ORIGINAL_TIER_MIN_STORAGE_GB)} storage plan or larger. Everything else is the same on pay per event and storage.
          </span>
          <Link href="/#features">See what each one does →</Link>
        </div>
      </div>
    </section>
  );
}
