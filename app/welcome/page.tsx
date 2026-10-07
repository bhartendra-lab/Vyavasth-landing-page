import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  CirclePlay,
  Images,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import LogoPill from "@/components/LogoPill";
import WelcomePhone from "@/components/welcome/WelcomePhone";
import { WELCOME_POSTER } from "@/lib/landing-content";
import {
  WELCOME_EVENT,
  buildSignupUrl,
  buildWhatsAppUrl,
  isLinkReady,
} from "@/lib/welcome";
import styles from "./welcome.module.css";

const TITLE = `Welcome: Vyavasth at ${WELCOME_EVENT.name}`;
// Same string as the Footer tagline (Footer is a client component, so it
// can't export this; keep the two in sync).
const TAGLINE = "AI event galleries, delivered during the event.";
const DESCRIPTION =
  "Get your event photos, chat with the Vyavasth team, and watch our 60-second feature explainers.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/welcome" },
  robots: { index: false, follow: false },
};

type Card = { Icon: LucideIcon; title: string; subtitle: string; href: string };

// Link targets are unchanged from the original page. A card is live when its
// link is ready (isLinkReady); otherwise it renders closed, as a quiet badge.
const GET_PHOTOS: Card = {
  Icon: Images,
  title: "Get your photos",
  subtitle: "Take a selfie, see every photo you're in.",
  href: WELCOME_EVENT.galleryUrl,
};
const SECONDARY: Card[] = [
  {
    Icon: CirclePlay,
    title: "Watch it work",
    subtitle: "60-second feature explainers.",
    href: WELCOME_EVENT.shortsUrl,
  },
  {
    Icon: MessageCircle,
    title: "Chat with us",
    subtitle: "Questions, pricing, a demo. We reply on WhatsApp.",
    href: buildWhatsAppUrl(WELCOME_EVENT.name),
  },
];

const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(" ");

function WelcomeCard({ card, primary = false }: { card: Card; primary?: boolean }) {
  const { Icon, title, subtitle, href } = card;
  const ready = isLinkReady(href);
  const body = (
    <>
      <span className={styles.icon} aria-hidden>
        <Icon size={primary ? 26 : 22} aria-hidden />
      </span>
      <span className={styles.text}>
        <span className={styles.title}>{title}</span>
        <span className={styles.subtitle}>{subtitle}</span>
      </span>
      <span className={styles.go} aria-hidden>
        {primary ? <ArrowRight size={22} /> : <ArrowUpRight size={18} />}
      </span>
      {!ready && <span className={styles.soon}>Opening soon</span>}
    </>
  );

  return ready ? (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cx(styles.card, primary && styles.primary)}
    >
      {body}
    </a>
  ) : (
    <div aria-disabled="true" className={cx(styles.card, primary && styles.primary, styles.closed)}>
      {body}
    </div>
  );
}

export default function WelcomePage() {
  return (
    <>
      <LogoPill />
      <main className={styles.page}>
        <div className={styles.bg} aria-hidden="true">
          <Image src={WELCOME_POSTER} alt="" fill priority unoptimized sizes="100vw" />
          <div className={styles.fade} />
        </div>

        <div className={styles.col}>
          <header className={styles.head}>
            <h1>
              <span className={styles.pre}>Welcome to</span>
              <span className={styles.name}>{WELCOME_EVENT.name}</span>
            </h1>
            <p className={styles.sub}>{TAGLINE}</p>
          </header>

          <div className={styles.cards}>
            <WelcomeCard card={GET_PHOTOS} primary />
            <div className={styles.pair}>
              {SECONDARY.map((card) => (
                <WelcomeCard key={card.title} card={card} />
              ))}
            </div>
          </div>

          <p className={styles.signup}>
            New here? <a href={buildSignupUrl()}>Log in to get started</a>{" "}
            <span className={styles.arrow}>→</span>
          </p>

          <section className={styles.look}>
            <div className={styles.steps}>
              <span><b>1</b>Open the link</span>
              <span><b>2</b>Take a selfie</span>
              <span><b>3</b>Get your photos</span>
            </div>
            <WelcomePhone />
            <Link className={styles.site} href="/" prefetch={false}>
              See the full website
              <ArrowRight size={16} aria-hidden />
            </Link>
          </section>

          <p className={styles.foot}>
            <Link href="/" prefetch={false}>www.vyavasth.in</Link>
          </p>
        </div>
      </main>
    </>
  );
}
