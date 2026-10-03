import Image from "next/image";
import Link from "next/link";
import styles from "./Nav.module.css";

/**
 * The logo in the same cream pill as the main nav, without the menu. A server
 * component, used by /welcome. The link does not prefetch, so the booth's slow
 * network never downloads the home page unasked.
 */
export default function LogoPill() {
  return (
    <nav className={`${styles.nav} ${styles.mini}`} aria-label="Vyavasth">
      <Link href="/" prefetch={false} className={styles.logo} aria-label="Vyavasth home">
        <Image src="/vyavasth-full-logo.svg" alt="Vyavasth" width={124} height={26} priority />
      </Link>
    </nav>
  );
}
