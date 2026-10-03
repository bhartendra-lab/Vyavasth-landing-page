"use client";

import { Fragment, useEffect, useRef, type CSSProperties } from "react";
import Image from "next/image";
import { LOGIN_URL } from "@/lib/app-url";
import { HERO_GUEST, HERO_TILES } from "@/lib/landing-content";
import { startHero } from "./hero-engine";
import styles from "./Hero.module.css";

const PAD = 6; // photo tile padding on the first screen, in px

// Decorative QR-looking code (not scannable). Seeded, so server and client agree.
const QR = (() => {
  const n = 25, m = 4;
  let s = 7;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  const inFinder = (x: number, y: number) =>
    [[0, 0], [n - 7, 0], [0, n - 7]].some(([a, b]) => x >= a && x < a + 7 && y >= b && y < b + 7);
  const cells: Array<[number, number]> = [];
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (inFinder(x, y)) continue;
      if (Math.abs(x - 12) < 3 && Math.abs(y - 12) < 3) continue;
      if (rnd() > 0.52) cells.push([x + m, y + m]);
    }
  }
  return { n, m, cells };
})();

function QrFinder({ x, y }: { x: number; y: number }) {
  const { m } = QR;
  return (
    <>
      <rect x={x + m} y={y + m} width="7" height="7" rx="2" fill="#2B140D" />
      <rect x={x + m + 1} y={y + m + 1} width="5" height="5" rx="1.3" fill="#fff" />
      <rect x={x + m + 2} y={y + m + 2} width="3" height="3" rx=".9" fill="#C25A3A" />
    </>
  );
}

const pct = (v: number) => `${+v.toFixed(3)}%`;
const cx = (...c: string[]) => c.join(" ");

export default function Hero({ freeEvents }: { freeEvents: number }) {
  const heroRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const glRef = useRef<HTMLCanvasElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);
  const phoneRef = useRef<HTMLDivElement>(null);
  const slotBrandRef = useRef<HTMLDivElement>(null);
  const slotAvaRef = useRef<HTMLDivElement>(null);
  const slotChipRef = useRef<HTMLDivElement>(null);
  const objsRef = useRef<HTMLDivElement>(null);
  const liveNRef = useRef<HTMLElement>(null);
  const notifMsgRef = useRef<HTMLDivElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);
  const heartPPRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const copy2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const els = {
      hero: heroRef.current, stage: stageRef.current, canvas: glRef.current,
      objs: objsRef.current, copy: copyRef.current, copy2: copy2Ref.current,
      phone: phoneRef.current, halo: haloRef.current,
      slotBrand: slotBrandRef.current, slotAva: slotAvaRef.current, slotChip: slotChipRef.current,
      liveN: liveNRef.current, notifMsg: notifMsgRef.current, stars: starsRef.current,
      heartPP: heartPPRef.current,
    };
    if (Object.values(els).some((e) => !e)) return;
    return startHero(
      els as Parameters<typeof startHero>[0],
      styles,
      HERO_TILES.map((t) => t.id),
    );
  }, []);

  const trust =
    freeEvents === 1
      ? "First event free. Every feature included."
      : `First ${freeEvents} events free. Every feature included.`;

  return (
    <section className={styles.hero} ref={heroRef} id="hero">
      <div className={styles.stage} ref={stageRef}>
        <canvas className={styles.gl} ref={glRef} aria-hidden="true" />

        <div className={styles.halo} ref={haloRef} />
        <div className={styles.phone} ref={phoneRef} aria-hidden="true">
          <div className={styles.bezel} />
          <div className={styles.screen}>
            <div className={styles.island} />
            <div className={styles.hd}>
              <div className={styles.row}>
                <div className={styles["slot-brand"]} ref={slotBrandRef} />
                <div className={styles["slot-ava"]} ref={slotAvaRef} />
              </div>
              <div className={styles.ttl}>
                Riya <em>&amp;</em> Arjun
              </div>
              <div className={styles.st}>Haldi · Sangeet · Wedding</div>
              <div className={styles["slot-chip"]} ref={slotChipRef} />
              <div className={styles.tabs}>
                <span className={styles.on}>For you</span>
                <span>All photos</span>
                <span>Haldi</span>
                <span>Sangeet</span>
              </div>
            </div>
            <div className={styles.grid}>
              <div className={styles.col}>
                <div className={styles.slot} data-t="haldi" style={{ aspectRatio: "3/4" }} />
                <div className={styles.slot} data-t="dadi" style={{ aspectRatio: "1" }} />
                <div className={styles.slot} data-t="mehendi" style={{ aspectRatio: "4/3" }} />
              </div>
              <div className={styles.col}>
                <div className={styles.slot} data-t="sangeet" style={{ aspectRatio: "4/3" }} />
                <div className={styles.slot} data-t="varmala" style={{ aspectRatio: "3/4" }} />
                <div className={styles.slot} data-t="baraat" style={{ aspectRatio: "1" }} />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.objs} ref={objsRef} aria-hidden="true">
          {/* Photo tiles. Placeholder illustrations until real studio photos arrive (lib/landing-content.ts). */}
          {HERO_TILES.map((t) => (
            <div
              key={t.id}
              className={cx(styles.obj, styles.tile)}
              data-id={t.id}
              style={{ "--w": `${t.w}px`, "--h": `${t.h}px` } as CSSProperties}
            >
              <div className={styles.in}>
                <div className={styles.ph}>
                  <Image src={t.src} alt="" fill sizes={`${t.w}px`} unoptimized draggable={false} />
                  <span className={styles.fn}>{t.label}</span>
                </div>
                <div className={styles.ov} style={{ position: "absolute", inset: PAD }}>
                  {t.faces.map((f, i) => {
                    const L = (f.x / t.sceneW) * 100, T = (f.y / t.sceneH) * 100;
                    const Wd = (f.w / t.sceneW) * 100, Ht = (f.h / t.sceneH) * 100;
                    return (
                      <Fragment key={i}>
                        <div
                          className={styles.fbox}
                          data-mark=""
                          style={{ left: pct(L), top: pct(T), width: pct(Wd), height: pct(Ht), transitionDelay: `${i * 90}ms` }}
                        />
                        {f.tag && (
                          <div
                            className={styles.tag}
                            data-mark=""
                            style={{ left: pct(L + Wd * 0.93), bottom: pct(100 - T - Ht * 0.05), transitionDelay: `${200 + i * 90}ms` }}
                          >
                            {f.tag}
                          </div>
                        )}
                      </Fragment>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}

          <div className={cx(styles.obj, styles.live)} data-id="live">
            <div className={styles.in}>
              <div className={styles.card}>
                <span className={styles.lv}><i></i>LIVE</span>
                <span><b ref={liveNRef}>2,341</b> photos delivered tonight</span>
              </div>
            </div>
          </div>

          <div className={cx(styles.obj, styles.selfie)} data-id="selfie">
            <div className={styles.in}>
              <div className={styles.disc}>
                <Image src={HERO_GUEST.src} alt="" fill sizes="118px" unoptimized draggable={false} />
                <div className={styles.scan}></div>
              </div>
              <svg className={styles.ring} viewBox="0 0 150 150">
                <circle className={styles.r1} cx="75" cy="75" r="71" />
                <circle className={styles.r2} cx="75" cy="75" r="71" />
              </svg>
            </div>
          </div>

          <div className={cx(styles.obj, styles.chip128)} data-id="chip128">
            <div className={styles.in}>
              <div className={styles.card}>
                <span className={styles.ok}>
                  <svg viewBox="0 0 16 16" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M3.2 8.4l3.1 3.1 6.5-7" /></svg>
                </span>
                <span><b>128</b> photos of you</span>
              </div>
            </div>
          </div>

          <div className={cx(styles.obj, styles.notif)} data-id="notif">
            <div className={styles.in}>
              <div className={styles.card}>
                <div className={styles.top}>
                  <span className={styles.ico}>
                    <svg viewBox="0 0 16 16" fill="#fff"><path d="M3.2 2.6h9.6c.9 0 1.6.7 1.6 1.6v5.6c0 .9-.7 1.6-1.6 1.6H7.4l-3.3 2.5c-.3.2-.7 0-.7-.4v-2.1h-.2c-.9 0-1.6-.7-1.6-1.6V4.2c0-.9.7-1.6 1.6-1.6z" /></svg>
                  </span>
                  WhatsApp<em>now</em>
                </div>
                <div className={styles.msg} ref={notifMsgRef}></div>
              </div>
            </div>
          </div>

          <div className={cx(styles.obj, styles.review)} data-id="review">
            <div className={styles.in}>
              <div className={styles.card}>
                <div className={styles.stars} ref={starsRef}>
                  {Array.from({ length: 5 }, (_, i) => (
                    <svg key={i} viewBox="0 0 20 20"><path d="M10 1.500l2.600 5.400 5.900.8-4.300 4.100 1.100 5.900L10 14.900l-5.300 2.800 1.100-5.900L1.500 7.700l5.900-.8z" /></svg>
                  ))}
                </div>
                <q>Got my photos before dinner was served!</q>
                <small><i>G</i>Left from inside the gallery</small>
              </div>
            </div>
          </div>

          <div className={cx(styles.obj, styles.raw)} data-id="raw">
            <div className={styles.in}>
              <div className={styles.card}>
                <span className={styles.file}>RAW</span>
                <div>
                  <b>DSC_4521.CR3</b>
                  <div className={styles.bar}><i></i></div>
                  <div className={styles.st}><span>Locating original</span><span>Original located, 1 click</span></div>
                </div>
              </div>
            </div>
          </div>

          <div className={cx(styles.obj, styles.pass)} data-id="pass">
            <div className={styles.in}>
              <div className={styles.card}>
                <span className={styles.lk}>
                  <svg viewBox="0 0 16 16" fill="none" stroke="#FFD9C7" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="7" width="10" height="7" rx="2" /><path d="M5.200 7V5a2.800 2.800 0 0 1 5.600 0v2" /></svg>
                </span>
                <span className={styles.dots}>
                  {[0, 1, 2, 3].map((d) => (
                    <i key={d} style={{ "--d": d } as CSSProperties}></i>
                  ))}
                </span>
              </div>
            </div>
          </div>

          <div className={cx(styles.obj, styles.wm)} data-id="wm">
            <div className={styles.in}>
              <div className={styles.card}>
                <span className={styles.ap}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round"><circle cx="12" cy="12" r="9.200" /><path d="M12 2.800l4.600 8M21 10.400h-9.200M19.400 17.500l-4.600-8M12 21.200l-4.600-8M3 13.600h9.200M4.600 6.500l4.600 8" /></svg>
                </span>
                <span><b>Your Studio</b><span>Your logo on every screen</span></span>
              </div>
            </div>
          </div>

          <div className={cx(styles.obj, styles.heart)} data-id="heart">
            <div className={styles.in}>
              <div className={styles.sq}>
                <svg viewBox="0 0 24 24" fill="#C25A3A"><path d="M12 21s-7.500-4.700-9.600-9.300C.9 8.300 2.700 4.500 6.300 4.500c2.100 0 3.700 1.200 5.700 3.500 2-2.300 3.600-3.500 5.700-3.500 3.600 0 5.400 3.800 3.900 7.200C19.500 16.300 12 21 12 21z" /></svg>
              </div>
              <div className={styles.lbl}>Added to album</div>
              <div className={styles.pp} ref={heartPPRef}></div>
            </div>
          </div>

          <div className={cx(styles.obj, styles.qr)} data-id="qr">
            <div className={styles.in}>
              <div className={styles.card}>
                <div className={styles.code}>
                  <svg viewBox={`0 0 ${QR.n + 2 * QR.m} ${QR.n + 2 * QR.m}`}>
                    <rect width="100%" height="100%" fill="#fff" />
                    <g fill="#2B140D">
                      {QR.cells.map(([x, y]) => (
                        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" rx=".3" />
                      ))}
                    </g>
                    <QrFinder x={0} y={0} />
                    <QrFinder x={QR.n - 7} y={0} />
                    <QrFinder x={0} y={QR.n - 7} />
                    <rect x={QR.m + 10} y={QR.m + 10} width="5" height="5" rx="1.600" fill="#C25A3A" />
                  </svg>
                </div>
                <span>Scan at the venue</span>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.copy} ref={copyRef}>
          <h1 className={styles.h1}>
            <span className={cx(styles.ln, styles.ln1)}>Deliver more.</span>
            <span className={cx(styles.ln, styles.ln2)}>This wedding season.</span>
          </h1>
          <p className={styles.sub}>
            One link. One selfie. Every guest gets their own photos while the function is still on.
          </p>
          <div className={styles["cta-row"]}>
            <a className={styles.cta} href={LOGIN_URL}>
              <span>Start your first event free</span>
              <span className={styles.arr}>
                <svg viewBox="0 0 18 18" fill="none" stroke="#fff" strokeWidth="2.200" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3.500 9h11M10 4.500L14.500 9 10 13.500" /></svg>
              </span>
            </a>
            <div className={styles.trust}>{trust}</div>
          </div>
        </div>

        <div className={styles.copy2} ref={copy2Ref}>
          <h2>
            One selfie. <em>{"Every photo they're in."}</em>
          </h2>
          <p>
            Guests open your link, take one selfie, and see only their own photos. No scrolling through four thousand frames. No WhatsApp messages asking you to find them.
          </p>
          <div className={styles.steps}>
            <span><b>1</b>Open the link</span>
            <span><b>2</b>Take a selfie</span>
            <span><b>3</b>Get your photos</span>
          </div>
        </div>
      </div>
    </section>
  );
}
