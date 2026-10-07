"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { OWNER_PHOTOS, STUDIOS, type ImageSlot } from "@/lib/landing-content";
import { formatInr, formatStorage } from "@/lib/plans";
import { type HomeFigures } from "@/lib/pricing-display";
import { whatsappUrl } from "@/lib/site-legal";
import styles from "./Proof.module.css";

const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(" ");

/** An image position: the striped "empty slot" until `slot.src` is set. */
function Slot({ slot }: { slot: ImageSlot }) {
  if (slot.src && slot.fit === "logo" && slot.width && slot.height) {
    return (
      <span className={styles.logoChip}>
        <Image src={slot.src} alt={slot.alt} width={slot.width} height={slot.height} unoptimized />
      </span>
    );
  }
  if (slot.src) {
    return (
      <span className={cx(styles.slot, styles.filled)}>
        <Image src={slot.src} alt={slot.alt} fill sizes="64px" unoptimized />
      </span>
    );
  }
  const lines = slot.emptyLabel.split("\n");
  return (
    <span className={styles.slot}>
      {lines.map((line, i) => (
        <Fragment key={i}>
          {i > 0 && <br />}
          {line}
        </Fragment>
      ))}
    </span>
  );
}

const TurnIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M13.5 8a5.500 5.500 0 0 1-9.700 3.500M2.500 8a5.500 5.500 0 0 1 9.700-3.500M12.500 1.800v2.900H9.600M3.500 14.200v-2.900h2.900" />
  </svg>
);

/**
 * Flip card: the front is the one line worth remembering, the back is the full
 * quote. A button for assistive tech: click, Enter or Space flips it.
 */
function FlipCard({
  ariaLabel,
  short,
  front,
  back,
}: {
  ariaLabel: string;
  short?: boolean;
  front: React.ReactNode;
  back: React.ReactNode;
}) {
  const [on, setOn] = useState(false);
  const toggle = (el: HTMLElement) => {
    el.style.transitionDelay = "0ms";
    setOn((v) => !v);
  };
  return (
    <article
      className={cx(styles.flip, short && styles.short, on && styles.on)}
      data-card=""
      role="button"
      tabIndex={0}
      aria-pressed={on}
      aria-label={ariaLabel}
      onClick={(e) => toggle(e.currentTarget)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle(e.currentTarget);
        }
      }}
    >
      <div className={styles.inner}>
        <div className={cx(styles.face, styles.front, short ? styles["f-terra"] : styles["f-brown"])}>{front}</div>
        <div className={cx(styles.face, styles.back)}>{back}</div>
      </div>
    </article>
  );
}

export default function Proof({ figures }: { figures: HomeFigures }) {
  const rootRef = useRef<HTMLElement>(null);

  // Fade up once on entry.
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-card]"));
    // Revealed cards get a data attribute, not a class: FlipCard's className is
    // driven by React state, and React rewrites the whole class attribute when
    // it changes, which would strip a class added here and hide the card.
    const reveal = (el: Element) => el.setAttribute("data-in", "");
    if (!("IntersectionObserver" in window)) {
      cards.forEach(reveal);
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            reveal(e.target);
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.15 },
    );
    cards.forEach((c, i) => {
      c.style.transitionDelay = (i % 3) * 80 + "ms";
      io.observe(c);
    });
    return () => io.disconnect();
  }, []);

  const { firstPurchaseOffer: offer, eventPrice, lowestStorage } = figures;
  const hasWays = eventPrice !== null || lowestStorage !== null;

  return (
    <section className={styles.pf} id="proof" ref={rootRef}>
      <h2>Studios already delivering more.</h2>
      <div className={styles.grid}>
        <FlipCard
          ariaLabel="Kamal Productions: 2 months to 2 hours. Press to read the full quote."
          front={
            <>
              <div className={styles.eb}>Album selection with Smart Select</div>
              <div className={styles.was}>2 months</div>
              <div className={styles.now}>2 hours</div>
              <div className={styles.foot}>
                <span className={styles.src}><b>Kamal Productions</b>, Gwalior</span>
                <span className={styles.turn}><TurnIcon />Read their words</span>
              </div>
            </>
          }
          back={
            <>
              <blockquote>
                Main 10 saal se industry mein hoon, aur Google Drive aur pendrive se hi delivery sahi lagti thi. Par Vyavasth ki branded gallery se <mark>Google reviews aur Instagram followers seedhe badhe hain</mark>. Aur photo selection ka kaam, jisme <mark>2 mahine tak lag jaate the, wo ab 2 ghante mein</mark> hone laga hai. Album selection feature ne kaam bahut hi aasan kar diya hai.
              </blockquote>
              <div className={styles.foot}>
                <div className={styles.who}>
                  <Slot slot={OWNER_PHOTOS.kamal} />
                  <span className={styles.src}><b>Kamal Productions</b><br />Gwalior</span>
                </div>
                <span className={styles.turn}><TurnIcon />Back</span>
              </div>
            </>
          }
        />

        <FlipCard
          short
          ariaLabel="The Wedding Booth: magic jaisi hi hai. Press to read the full quote."
          front={
            <>
              <div className={styles.eb}>On helping couples choose</div>
              <div className={styles.pull}>Magic jaisi hi hai.</div>
              <div className={styles.foot}>
                <span className={styles.src}><b>The Wedding Booth</b>, Bhopal</span>
                <span className={styles.turn}><TurnIcon />Read their words</span>
              </div>
            </>
          }
          back={
            <>
              <blockquote>
                Kaafi saari companies AI features ki baat karti thi, par Vyavasth ka platform aur photo selection feature, jo couples ka selection aasan karta hai, usse jo madad mili hai, <mark>wo magic jaisi hi hai</mark>.
              </blockquote>
              <div className={styles.foot}>
                <div className={styles.who}>
                  <Slot slot={OWNER_PHOTOS.weddingBooth} />
                  <span className={styles.src}><b>The Wedding Booth</b><br />Bhopal</span>
                </div>
                <span className={styles.turn}><TurnIcon />Back</span>
              </div>
            </>
          }
        />

        {/* The first-purchase offer while the plans API says it is live;
            otherwise the plain pay-per-event price. Nothing here is free at
            signup, so nothing here says "start free". */}
        <article className={cx(styles.c, styles.t, styles.price)} data-card="">
          {offer ? (
            <>
              <h3>First purchase offer</h3>
              <div className={styles.big}>
                {offer.bonus_events === 1 ? "1 event free" : `${offer.bonus_events} events free`}
              </div>
              <p>
                Buy your first event and we add {offer.bonus_events} more. Every feature unlocked.
              </p>
            </>
          ) : (
            <>
              <h3>Pay per event</h3>
              {eventPrice !== null && <div className={styles.big}>{formatInr(eventPrice)}</div>}
              <p>One wedding at a time. Every feature unlocked.</p>
            </>
          )}
          <span className={styles.sp}></span>
          <Link className={styles.go} href="/pricing#events">See pricing</Link>
        </article>

        <article className={cx(styles.c, styles.t, styles.sw)} data-card="">
          <h3>Then pay the way you work.</h3>
          {hasWays && (
            <div className={styles.ways}>
              {eventPrice !== null && (
                <div><b>{formatInr(eventPrice)}</b><span>per event, unlimited photos*</span></div>
              )}
              {lowestStorage && (
                <div>
                  <b>{formatInr(lowestStorage.perMonth)}</b>
                  <span>a month, billed yearly. {formatStorage(lowestStorage.storage_limit)}, reusable, unlimited events</span>
                </div>
              )}
            </div>
          )}
          <p className={styles.fine}>
            GST included. Every feature on every plan.
            {eventPrice !== null && (
              <>
                {" "}
                <Link href="/pricing#photo-terms" style={{ textDecoration: "underline", textUnderlineOffset: 3 }}>
                  *T&amp;C apply
                </Link>
              </>
            )}
          </p>
          <span className={styles.sp}></span>
          <Link className={styles.go} href="/pricing">See all plans</Link>
        </article>

        <article className={cx(styles.c, styles.t, styles.su)} data-card="">
          <h3>A person answers, 24×7.</h3>
          <span className={styles.sp}></span>
          <a className={styles.go} href={whatsappUrl()} target="_blank" rel="noopener noreferrer">Chat on WhatsApp</a>
        </article>

        <div className={cx(styles.c, styles.logos)} data-card="">
          <b>Studios delivering on Vyavasth</b>
          <div className={styles.row}>
            {STUDIOS.map(({ name, logo }) => (
              <span key={name} className={styles.name}>
                {logo ? <Image src={logo.src} alt={name} width={logo.width} height={logo.height} unoptimized /> : name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
