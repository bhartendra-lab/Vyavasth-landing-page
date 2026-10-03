import { whatsappUrl } from "@/lib/site-legal";
import styles from "./pricing.module.css";

/**
 * Quiet fallback when the plans API fails (or returns no catalog). The rest of
 * the page still renders; this is never a blank section. Its one action is
 * WhatsApp (the old "Book a demo" button is gone site-wide).
 */
export default function PricingErrorFallback({
  title = "We're having trouble loading prices right now.",
  body,
}: {
  title?: string;
  body?: string;
}) {
  return (
    <div className={styles.fallback}>
      <h2>{title}</h2>
      {body && <p>{body}</p>}
      <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer">
        Chat with us on WhatsApp
      </a>
    </div>
  );
}
