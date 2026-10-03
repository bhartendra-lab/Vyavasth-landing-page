"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { FEATURE_IMAGES } from "@/lib/landing-content";
import styles from "./Features.module.css";

const HEART_PATH =
  "M12 21s-7.5-4.7-9.6-9.3C.9 8.3 2.7 4.5 6.3 4.5c2.1 0 3.7 1.2 5.7 3.5 2-2.300 3.6-3.5 5.700-3.500 3.600 0 5.400 3.800 3.900 7.200C19.500 16.300 12 21 12 21z";

const bg = (src: string, position?: string): React.CSSProperties => ({
  backgroundImage: `url(${src})`,
  ...(position ? { backgroundPosition: position } : {}),
});
const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(" ");

const Heart = ({ fill = "#C25A3A" }: { fill?: string }) => (
  <svg viewBox="0 0 24 24" fill={fill} aria-hidden="true"><path d={HEART_PATH} /></svg>
);
const Check = () => (
  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M2.5 7.4l2.8 2.8 6.200-6.600" /></svg>
);
const Star = () => (
  <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 1.5l2.600 5.400 5.900.8-4.300 4.100 1.100 5.900L10 14.900l-5.300 2.800 1.100-5.900L1.500 7.700l5.900-.8z" /></svg>
);
const Arrow = () => (
  <svg viewBox="0 0 22 22" aria-hidden="true"><path d="M3 2.500l15.500 6.300-6.700 2.300-2.500 6.900z" fill="#2B140D" stroke="#fff" strokeWidth="1.800" strokeLinejoin="round" /></svg>
);

const SMART_SELECT_LIKES = [48, 41, 37, 29, 22, 18, 15, 11];
// The last two grid cells crop the same photo differently.
const SMART_SELECT_CROPS: Record<number, string> = { 6: "20% 60%", 7: "50% 90%" };

const ALSO = [
  { label: "Live delivery", icon: <><path d="M2.5 13.5V6.2a1.2 1.2 0 0 1 1.2-1.2h1.800l1-1.500h5l1 1.500h1.800a1.200 1.200 0 0 1 1.200 1.200v7.300" /><circle cx="9" cy="9.500" r="2.600" /></> },
  { label: "Passcode gallery", icon: <><rect x="3.500" y="8" width="11" height="7" rx="2" /><path d="M6 8V6a3 3 0 0 1 6 0v2" /></> },
  { label: "One reusable QR", icon: <><rect x="2.500" y="2.500" width="5" height="5" rx="1" /><rect x="10.500" y="2.500" width="5" height="5" rx="1" /><rect x="2.500" y="10.500" width="5" height="5" rx="1" /><path d="M10.500 10.500h2v2M15.500 10.500v5h-5v-1" /></> },
  { label: "WhatsApp and email alerts", icon: <path d="M3.500 3.500h11a1 1 0 0 1 1 1v7a1 1 0 0 1-1 1H8l-3.500 2.700V12.500h-1a1 1 0 0 1-1-1v-7a1 1 0 0 1 1-1z" /> },
  { label: "Sorted by function", icon: <path d="M2.500 5.500a1 1 0 0 1 1-1h3l1.500 1.800h6.500a1 1 0 0 1 1 1v6.200a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1z" /> },
];

export default function Features() {
  const rootRef = useRef<HTMLElement>(null);

  // Cards fade up once as they enter. Nothing else moves on its own; the art
  // scales slightly on hover (CSS).
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-card]"));
    if (!("IntersectionObserver" in window)) {
      cards.forEach((c) => c.classList.add(styles.in));
      return;
    }
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add(styles.in);
            io.unobserve(e.target);
          }
        }),
      { threshold: 0.18 },
    );
    cards.forEach((c, i) => {
      c.style.transitionDelay = (i % 2) * 90 + "ms";
      io.observe(c);
    });
    return () => io.disconnect();
  }, []);

  const { smartSelect, people, uploads, brandShot } = FEATURE_IMAGES;

  return (
    <section className={styles.ft} id="features" ref={rootRef}>
      <h2>Why studios switch to Vyavasth.</h2>
      <div className={styles.bento}>
        {/* 1 · Smart Select */}
        <article className={cx(styles.c, styles.wide, styles.c1)} data-card="">
          <div className={styles.txt} style={{ maxWidth: 720 }}>
            <h3 style={{ textWrap: "wrap" }}>
              Album selection in hours, not months.<br className={styles.dbr} /> Originals in one click.
            </h3>
            <Link className={styles.go} href="/pricing#features">Explore Smart Select</Link>
          </div>
          <div className={styles.art}>
            <div className={cx(styles.panel, styles.ss)}>
              <div className={styles.chips}>
                <span className={styles.on}><Heart fill="#fff" />Couple&apos;s picks</span>
                <span>Bride&apos;s side</span>
                <span>Groom&apos;s side</span>
                <span>By person</span>
              </div>
              <div className={styles.grid}>
                {smartSelect.map((img, i) => (
                  <i key={i} className={i === 0 ? styles.pick : undefined} style={bg(img.src, SMART_SELECT_CROPS[i])}>
                    <b><Heart />{SMART_SELECT_LIKES[i]}</b>
                  </i>
                ))}
              </div>
            </div>
            <div className={cx(styles.panel, styles.rawc)}>
              <div className={styles.f}>
                <span className={styles.ic}>RAW</span>
                <div><b>DSC_4521.CR3</b><small><Check />Original located</small></div>
              </div>
              <div className={styles.send}>Send to editor</div>
            </div>
            <div className={cx(styles.cursor, styles.c1c)} style={{ right: 60, bottom: 22 }}><Arrow /><span>Your editor</span></div>
          </div>
        </article>

        {/* 2 · My People */}
        <article className={cx(styles.c, styles.c2)} data-card="">
          <div className={styles.txt}>
            <h3>Every guest gets their own circle.</h3>
            <Link className={styles.go} href="/pricing#features">Explore My People</Link>
          </div>
          <div className={styles.art}>
            <div className={styles.orbit}>
              <div className={styles.ring}></div><div className={cx(styles.ring, styles.r2)}></div>
              <div className={cx(styles.av, styles.me)} style={{ left: "50%", top: "50%", ...bg(people.guest.src) }}></div>
              <span className={cx(styles.lbl, styles.you)} style={{ left: "50%", top: "calc(50% + 58px)" }}>You</span>
              <div className={cx(styles.av, styles.s)} style={{ left: "50%", top: 86, ...bg(people.dadi.src) }}></div>
              <span className={styles.lbl} style={{ left: "50%", top: 116 }}>Dadi</span>
              <div className={cx(styles.av, styles.s)} style={{ left: 95, top: 150, ...bg(people.bride.src) }}></div>
              <div className={cx(styles.av, styles.s)} style={{ left: 345, top: 150, ...bg(people.groom.src) }}></div>
              <div className={cx(styles.av, styles.xs)} style={{ left: 22, top: 150, ...bg(people.f0.src) }}></div>
              <div className={cx(styles.av, styles.xs)} style={{ left: 120, top: 28, ...bg(people.f1.src) }}></div>
              <div className={cx(styles.av, styles.xs)} style={{ left: 320, top: 28, ...bg(people.f2.src) }}></div>
              <div className={cx(styles.av, styles.xs)} style={{ left: 418, top: 150, ...bg(people.f3.src) }}></div>
              <div className={cx(styles.av, styles.xs)} style={{ left: 220, top: 0, ...bg(people.dhol.src) }}></div>
            </div>
          </div>
        </article>

        {/* 3 · Uploads */}
        <article className={cx(styles.c, styles.c3)} data-card="">
          <div className={styles.txt}>
            <h3>Uploads you never have to babysit.</h3>
            <Link className={styles.go} href="/pricing#features">Explore uploads</Link>
          </div>
          <div className={styles.art}>
            <div className={cx(styles.panel, styles.up)}>
              <div className={styles.seg}><span>HD</span><span className={styles.on}>4K</span><span>Original</span></div>
              <div className={styles.r}>
                <span className={styles.th} style={bg(uploads[0].src)}></span>
                <div style={{ flex: 1 }}><b>Sangeet · 380 photos</b><small><Check />Resumed on its own</small><div className={styles.bar}><i style={{ width: "72%" }}></i></div></div>
              </div>
              <div className={styles.r}>
                <span className={styles.th} style={bg(uploads[1].src)}></span>
                <div style={{ flex: 1 }}><b>Haldi · 214 photos</b><small><Check />Uploaded</small></div>
              </div>
              <div className={styles.r}>
                <span className={styles.th} style={bg(uploads[2].src)}></span>
                <div style={{ flex: 1 }}><b>Wedding · 612 photos</b><small><Check />Uploaded</small></div>
              </div>
              <div className={styles.st}>
                <svg viewBox="0 0 30 30" fill="none" aria-hidden="true"><circle cx="15" cy="15" r="15" fill="#f6ebe5" /><path d="M9 14a6 6 0 0 1 10.300-4.100L21 11.500M21 16a6 6 0 0 1-10.300 4.100L9 18.500M21 8v3.500h-3.500M9 22v-3.500h3.500" stroke="#C25A3A" strokeWidth="1.800" strokeLinecap="round" strokeLinejoin="round" /></svg>
                <div>Reusable storage<small>Delete an event, use the space again</small></div>
              </div>
            </div>
          </div>
        </article>

        {/* 4 · Brand */}
        <article className={cx(styles.c, styles.wide, styles.c4)} data-card="">
          <div className={styles.txt}>
            <h3>Your name on every screen. Your reviews too.</h3>
            <Link className={styles.go} href="/pricing#features">Explore branding</Link>
          </div>
          <div className={styles.art}>
            <div className={styles.shot} style={bg(brandShot.src)}></div>
            <div className={cx(styles.panel, styles.rev)}>
              <div className={styles.stars}><Star /><Star /><Star /><Star /><Star /></div>
              <b>Loved your photos? Leave Your Studio a review.</b>
              <small>Asked inside the gallery, posted on Google</small>
            </div>
            <div className={cx(styles.cursor, styles.t)} style={{ left: 452, bottom: 86 }}><Arrow /><span>Riya&apos;s cousin</span></div>
            <div className={cx(styles.panel, styles.kit)}>
              <h4>
                <span><svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 3l4.500 8M21 10.500h-9M19.400 17.500l-4.500-8M12 21l-4.500-8M3 13.500h9M4.600 6.500l4.500 8" /></svg></span>
                Your Studio brand kit
              </h4>
              <label>Logo</label>
              <div className={styles.logos}>
                <i style={{ background: "var(--brown)", color: "#fff" }}>YS</i>
                <i style={{ background: "var(--peach)", color: "var(--terra-dk)" }}>YS</i>
                <i style={{ background: "#fff", color: "var(--brown)", border: "1px solid #eadbd3" }}>YS</i>
              </div>
              <label>Colours</label>
              <div className={styles.sw}>
                <i style={{ background: "#2B140D" }}></i><i style={{ background: "#C25A3A" }}></i><i style={{ background: "#F3DED8" }}></i><i style={{ background: "#EECEEC" }}></i>
              </div>
              <div className={styles.tg}>Watermark on every photo<u></u></div>
            </div>
          </div>
        </article>
      </div>

      <div className={styles.also}>
        <b>Also on every plan</b>
        {ALSO.map((a) => (
          <span key={a.label}>
            <svg viewBox="0 0 18 18" fill="none" stroke="#C25A3A" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{a.icon}</svg>
            {a.label}
          </span>
        ))}
        <Link href="/pricing">See all →</Link>
      </div>
    </section>
  );
}
