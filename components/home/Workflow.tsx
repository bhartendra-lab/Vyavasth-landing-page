"use client";

import { useEffect, useRef } from "react";
import {
  WORKFLOW_AUTOPLAY_MS,
  WORKFLOW_IMAGES,
  WORKFLOW_MODE,
  WORKFLOW_PIN_SCROLL_VH,
  WORKFLOW_PIN_TOP_PX,
} from "@/lib/landing-content";
import { whatsappUrl } from "@/lib/site-legal";
import styles from "./Workflow.module.css";

const EARLY_ACCESS_MESSAGE = "Hi, I'd like early access to the Vyavasth upload app.";

const bg = (src: string) => ({ backgroundImage: `url(${src})` });
const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(" ");

// A 21×21 QR-looking pattern for the venue standee: three finder squares, a
// logo square in the middle and pseudo-random modules. Decorative, it encodes nothing.
const QR_PATH = (() => {
  const n = 21;
  const d: string[] = [];
  let s = 7;
  const reserved = (x: number, y: number) =>
    (x < 8 && y < 8) || (x > 12 && y < 8) || (x < 8 && y > 12) || (x > 7 && x < 13 && y > 7 && y < 13);
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      s = (Math.imul(s, 1103515245) + 12345) & 0x7fffffff;
      if (!reserved(x, y) && (s >>> 16) & 1) d.push(`M${x} ${y}h1v1h-1z`);
    }
  }
  for (const [x, y] of [[0, 0], [14, 0], [0, 14]]) {
    d.push(`M${x} ${y}h7v7h-7zM${x + 1} ${y + 1}v5h5v-5zM${x + 2} ${y + 2}h3v3h-3z`);
  }
  return d.join("");
})();

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <path fill="#25D366" d="M8 1a7 7 0 0 0-6.050 10.520L1 15l3.580-.930A7 7 0 1 0 8 1z" />
      <path fill="#fff" d="M5.700 4.500c.2-.2.500-.2.650.050l.750 1.250c.1.200.050.450-.1.600l-.4.400c.450.950 1.200 1.700 2.150 2.150l.4-.4c.150-.150.400-.2.600-.1l1.250.750c.250.150.250.450.050.650l-.5.550c-.4.400-1 .550-1.550.350A6.100 6.100 0 0 1 5 6.600c-.2-.550-.050-1.150.350-1.550z" />
    </svg>
  );
}

function FolderIcon({ fill = "#E2B98F" }: { fill?: string }) {
  return (
    <svg viewBox="0 0 16 14" aria-hidden="true">
      <path fill={fill} d="M1 2.500A1.500 1.500 0 0 1 2.500 1h3.300l1.600 1.700h6.100A1.500 1.500 0 0 1 15 4.200v7.300a1.500 1.500 0 0 1-1.500 1.500h-11A1.500 1.500 0 0 1 1 11.500z" />
    </svg>
  );
}

function Heart({ fill = "#C25A3A" }: { fill?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill={fill} aria-hidden="true">
      <path d="M12 21s-7.500-4.700-9.600-9.300C.9 8.300 2.700 4.500 6.300 4.500c2.100 0 3.700 1.200 5.700 3.500 2-2.300 3.600-3.500 5.700-3.500 3.600 0 5.400 3.800 3.900 7.200C19.500 16.300 12 21 12 21z" />
    </svg>
  );
}

function Check({ size, stroke = "#1f7a4d" }: { size?: number; stroke?: string }) {
  return (
    <svg viewBox="0 0 14 14" fill="none" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" width={size} height={size} aria-hidden="true">
      <path d="M2.500 7.400l2.800 2.800 6.200-6.600" />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg viewBox="0 0 18 18" fill="none" stroke="#C25A3A" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M9 13V4M5.500 7.200L9 3.700l3.500 3.500M3.500 14.500h11" />
    </svg>
  );
}

export default function Workflow() {
  const pinRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const stepsRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLElement>(null);
  const riderRef = useRef<HTMLDivElement>(null);

  // The workflow line. One line connects the six step dots, and a small photo
  // rides its head; each step lights up when the photo reaches its dot.
  // Horizontal on desktop, vertical on phones. Four behaviours (`mode`):
  //   "pin"      desktop: the card sticks below the nav and page scroll drives the line.
  //   "autoplay" desktop: no scroll linkage; the line runs once by itself.
  //   "scroll"   phones: the line's length follows the section's position (as in the prototype).
  //   "complete" reduced motion: everything shown lit, no rider.
  // WORKFLOW_MODE (lib/landing-content.ts) picks "pin" or "autoplay" for desktop.
  useEffect(() => {
    const pin = pinRef.current, card = cardRef.current, steps = stepsRef.current;
    const track = trackRef.current, fill = fillRef.current, rider = riderRef.current;
    if (!pin || !card || !steps || !track || !fill || !rider) return;

    const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
    const REDUCED = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const PIN_BOTTOM_GAP = 16; // room kept under a pinned card
    const stepEls = Array.from(steps.querySelectorAll<HTMLElement>("[data-step]"));
    const dots = Array.from(steps.querySelectorAll<HTMLElement>("[data-dot]"));

    type Mode = "pin" | "autoplay" | "scroll" | "complete";
    let mode: Mode = "scroll";
    let disposed = false;
    let raf = 0;
    let rz = 0;
    let vertical = false;
    let pts: Array<{ x: number; y: number; t: number }> = [];
    let len = 1, cur = 0, shown = -1;
    let autoStart: number | null = null; // autoplay: when the run began
    let manual: number | null = null; // autoplay: a step the visitor jumped to

    // Autoplay only: steps become focusable, and clicking or focusing one jumps to it.
    function setInteractive(on: boolean) {
      stepEls.forEach((s) => {
        if (on) {
          s.tabIndex = 0;
          s.setAttribute("role", "button");
          s.setAttribute("data-interactive", "");
        } else {
          s.removeAttribute("tabindex");
          s.removeAttribute("role");
          s.removeAttribute("data-interactive");
        }
      });
    }
    const jumpHandlers = stepEls.map((_, i) => () => {
      if (mode === "autoplay") manual = i;
    });
    stepEls.forEach((s, i) => {
      s.addEventListener("click", jumpHandlers[i]);
      s.addEventListener("focus", jumpHandlers[i]);
    });

    function layout() {
      vertical = matchMedia("(max-width:980px)").matches;
      const fits = card!.offsetHeight <= innerHeight - WORKFLOW_PIN_TOP_PX - PIN_BOTTOM_GAP;
      mode = REDUCED
        ? "complete"
        : vertical
          ? "scroll"
          : WORKFLOW_MODE === "pin" && fits
            ? "pin"
            : "autoplay";
      pin!.dataset.mode = mode;
      // The pin wrapper is the card plus the extra scroll distance the card stays stuck for.
      pin!.style.height = mode === "pin" ? card!.offsetHeight + innerHeight * WORKFLOW_PIN_SCROLL_VH + "px" : "";
      setInteractive(mode === "autoplay");

      const base = steps!.getBoundingClientRect();
      pts = dots.map((d) => {
        const r = d.getBoundingClientRect();
        return { x: r.left + r.width / 2 - base.left, y: r.top + r.height / 2 - base.top, t: 0 };
      });
      const a = pts[0], b = pts[pts.length - 1];
      if (vertical) {
        len = b.y - a.y;
        Object.assign(track!.style, { left: a.x - 1 + "px", top: a.y + "px", width: "2px", height: len + "px" });
        Object.assign(fill!.style, { width: "2px", height: "0px" });
      } else {
        len = b.x - a.x;
        Object.assign(track!.style, { left: a.x + "px", top: a.y - 1 + "px", width: len + "px", height: "2px" });
        Object.assign(fill!.style, { height: "2px", width: "0px" });
      }
      pts.forEach((p) => { p.t = (vertical ? p.y - a.y : p.x - a.x) / len; });
      shown = -1;
    }

    function frame(now: number) {
      if (disposed) return;
      const vh = innerHeight;
      let target = 0;
      if (mode === "complete") {
        target = 1;
      } else if (mode === "pin") {
        // 0 when the card first sticks, 1 when the extra scroll distance is used up.
        const dist = Math.max(1, pin!.offsetHeight - card!.offsetHeight);
        target = clamp((WORKFLOW_PIN_TOP_PX - pin!.getBoundingClientRect().top) / dist);
      } else if (mode === "autoplay") {
        if (manual !== null) {
          target = pts[manual].t;
        } else {
          if (autoStart === null) {
            const r = card!.getBoundingClientRect();
            const visible = Math.min(r.bottom, vh) - Math.max(r.top, 0);
            if (visible >= 0.5 * Math.min(r.height, vh)) autoStart = now; // about half in view
          }
          target = autoStart === null ? 0 : clamp((now - autoStart) / WORKFLOW_AUTOPLAY_MS);
        }
      } else {
        // phones: 0 when the steps enter the lower part of the screen, 1 before they leave the top
        const r = steps!.getBoundingClientRect();
        target = clamp((vh * 0.78 - r.top) / (r.height + vh * (vertical ? -0.05 : 0.12)));
      }

      cur += (target - cur) * 0.12;
      if (Math.abs(target - cur) < 0.0005) cur = target;
      const d = cur * len, a = pts[0];
      if (vertical) {
        fill!.style.height = d + "px";
        rider!.style.transform = `translate3d(${a.x}px,${a.y + d}px,0)`;
      } else {
        fill!.style.width = d + "px";
        rider!.style.transform = `translate3d(${a.x + d}px,${a.y}px,0)`;
      }
      rider!.classList.toggle(styles.show, cur > 0.001 && !REDUCED);
      let n = -1;
      pts.forEach((p, i) => { if (cur >= p.t - 0.012 && cur > 0.0005) n = i; });
      // A step the visitor jumped to is lit once the rider gets there (step 1 sits at 0).
      if (manual !== null && Math.abs(cur - pts[manual].t) < 0.02) n = manual;
      if (n !== shown) {
        shown = n;
        stepEls.forEach((s, i) => s.classList.toggle(styles.on, i <= n));
      }
      raf = requestAnimationFrame(frame);
    }

    const onResize = () => { clearTimeout(rz); rz = window.setTimeout(layout, 80); };
    window.addEventListener("resize", onResize);
    (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => {
      if (disposed) return;
      layout();
      raf = requestAnimationFrame(frame);
    });

    return () => {
      disposed = true;
      cancelAnimationFrame(raf);
      clearTimeout(rz);
      window.removeEventListener("resize", onResize);
      stepEls.forEach((s, i) => {
        s.removeEventListener("click", jumpHandlers[i]);
        s.removeEventListener("focus", jumpHandlers[i]);
      });
      setInteractive(false);
      pin.style.height = "";
      delete pin.dataset.mode;
    };
  }, []);

  const [haldi, sangeet, varmala, dadi] = WORKFLOW_IMAGES.gallery;

  return (
    <section className={styles.wf} id="how">
      <header className={styles["wf-head"]}>
        <h2>From the first click to the final edit.</h2>
        <p>Nothing changes about how you shoot. What changes is when the family sees it.</p>
      </header>

      {/* Only the card pins (on desktop), never the heading. See the effect above. */}
      <div
        className={styles.pin}
        ref={pinRef}
        style={{ "--pin-top": `${WORKFLOW_PIN_TOP_PX}px` } as React.CSSProperties}
      >
      <div className={styles.card} ref={cardRef}>
        <div className={styles.steps} ref={stepsRef}>
          <div className={cx(styles.phase, styles.p1)}>Before the event</div>
          <div className={styles.step} data-step="">
            <div className={styles.vis}>
              <div className={styles.m}>
                <div className={styles.mc}>
                  <b>Riya &amp; Arjun</b>
                  <small>Haldi · Sangeet · Wedding</small>
                  <div className={styles.url}>
                    <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" aria-hidden="true"><path d="M5 7a2.300 2.300 0 0 0 3.300 0l1.700-1.700a2.300 2.300 0 0 0-3.300-3.300l-.5.5M7 5a2.300 2.300 0 0 0-3.300 0L2 6.700A2.300 2.300 0 0 0 5.300 10l.5-.5" /></svg>
                    vyavasth.in/riya-arjun
                  </div>
                  <div className={styles.btn}>Share with the couple</div>
                </div>
              </div>
            </div>
            <div className={styles.rail}><span className={styles.dot} data-dot=""></span></div>
            <h3>Create the event</h3>
            <p>Client will be informed on whatsapp with the event link and can share with their friends and family.</p>
          </div>

          <div className={cx(styles.phase, styles.p2)}>At the event</div>
          {/* Steps 2 to 6 animate in two layers: the tile's resting picture,
              and details that transition in (with delays) once the step is lit. */}
          <div className={styles.step} data-step="">
            <div className={styles.vis}>
              <div className={styles.art} aria-hidden="true">
                <div className={styles.stand}>
                  <small>Riya &amp; Arjun</small>
                  <b>Scan to get your photos</b>
                  <div className={styles.code}>
                    <svg viewBox="0 0 21 21" shapeRendering="crispEdges"><path d={QR_PATH} fill="#2B140D" fillRule="evenodd" /><rect x="8.500" y="8.500" width="4" height="4" rx="1" fill="#C25A3A" /></svg>
                    <i className={styles.scan}></i>
                  </div>
                </div>
                <span className={styles.reg}><i></i><b className={styles.n} style={{ "--to": 142 } as React.CSSProperties}></b> joined</span>
                <div className={styles.wa}>
                  <WhatsAppIcon />
                  <div><b>Your photos are live</b><small>vyavasth.in/riya-arjun</small></div>
                </div>
              </div>
            </div>
            <div className={styles.rail}><span className={styles.dot} data-dot=""></span></div>
            <h3>Place the event QR at the venue</h3>
            <p>More guests register, and every registered guest gets the gallery link on WhatsApp after your first upload.</p>
          </div>

          <div className={styles.step} data-step="">
            <div className={styles.vis}>
              <div className={styles.art} aria-hidden="true">
                <svg className={styles.cable} viewBox="0 0 100 100" preserveAspectRatio="none">
                  <path className={styles.wire} d="M22 49C22 86 74 100 74 83" />
                  <path className={styles.flow} d="M22 49C22 86 74 100 74 83" />
                </svg>
                <div className={styles.ucam}>
                  <svg viewBox="0 0 200 150"><rect x="70" y="8" width="60" height="26" rx="8" fill="#E9D8CF" /><rect x="10" y="28" width="180" height="104" rx="18" fill="#FFF4EC" /><rect x="10" y="28" width="180" height="26" rx="13" fill="#E9D8CF" /><rect x="24" y="16" width="30" height="16" rx="5" fill="#C25A3A" /><circle cx="100" cy="86" r="40" fill="#2B140D" /><circle cx="100" cy="86" r="30" fill="#4a2a20" /><circle cx="100" cy="86" r="19" fill="#1d0d08" /><circle cx="91" cy="77" r="6" fill="#fff" opacity=".55" /><circle cx="166" cy="42" r="5" fill="#C25A3A" /><rect x="24" y="66" width="16" height="44" rx="8" fill="#E9D8CF" /><rect x="60" y="130" width="22" height="18" rx="4" fill="#3a2a24" /></svg>
                </div>
                <div className={styles.uphone}>
                  <div>
                    <small><UploadIcon />Uploading</small>
                    <b className={styles.n} style={{ "--to": 248 } as React.CSSProperties}></b>
                    <em>photos</em>
                    <u><i></i></u>
                    <div className={styles.uthumbs}>
                      <span style={bg(haldi.src)}></span>
                      <span style={bg(sangeet.src)}></span>
                      <span style={bg(varmala.src)}></span>
                      <span style={bg(dadi.src)}></span>
                    </div>
                  </div>
                  <span className={styles.plug}></span>
                </div>
                <span className={styles.done}><Check stroke="#fff" />Done in 48s</span>
                <span className={styles.cc}>C-to-C</span>
              </div>
            </div>
            <div className={styles.rail}><span className={styles.dot} data-dot=""></span></div>
            <h3>Upload with ease while the event happens <span className={styles.ea}>Early access</span></h3>
            <p>Connect your camera to any phone with a C-to-C cable. Our optimised uploader app finishes the upload in under a minute.</p>
          </div>

          <div className={styles.step} data-step="">
            <div className={styles.vis}>
              <div className={styles.art} aria-hidden="true">
                <div className={styles.gphone}>
                  <div>
                    <div className={styles.gtop}>
                      <span className={styles.me} style={bg(WORKFLOW_IMAGES.selfie.src)}><Check size={8} stroke="#fff" /></span>
                      <div><b>Only you</b><small>128 photos found</small></div>
                    </div>
                    <div className={styles.gtabs}>
                      <span className={styles.on}>For you</span>
                      <span className={styles.uf}>
                        <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.400" strokeLinecap="round" aria-hidden="true"><path d="M1.500 2.500h9L7 6.500V10L5 9V6.500z" /></svg>
                        Unknown faces
                      </span>
                    </div>
                    <div className={styles.ggrid}>
                      {WORKFLOW_IMAGES.gallery.map((p, i) => (
                        <span key={p.src + i} style={bg(p.src)}>{i === 1 && <i className={styles.lk}><Heart fill="#fff" /></i>}</span>
                      ))}
                    </div>
                  </div>
                </div>
                <span className={styles.match}><i></i>Face match</span>
                <span className={styles.alb}><Heart />Liked for the album</span>
              </div>
            </div>
            <div className={styles.rail}><span className={styles.dot} data-dot=""></span></div>
            <h3>The most premium guest experience</h3>
            <p>Every guest gets only the photos they are in. Full-gallery guests can also filter photos with unknown faces, and every like helps pick the album.</p>
          </div>

          <div className={cx(styles.phase, styles.p3)}>After the event</div>
          <div className={styles.step} data-step="">
            <div className={styles.vis}>
              <div className={styles.art} aria-hidden="true">
                <div className={styles.lliked}>
                  <span style={bg(sangeet.src)}><Heart fill="#fff" /></span>
                  <span style={bg(varmala.src)}><Heart fill="#fff" /></span>
                  <span style={bg(dadi.src)}><Heart fill="#fff" /></span>
                  <b>86 liked by guests</b>
                </div>
                <div className={styles.lwin}>
                  <div className={styles.lbar}><i></i><i></i><i></i><span>Riya-Arjun / Wedding</span></div>
                  <div className={styles.lrow}><FolderIcon />RAW<em>6,240 files</em></div>
                  <div className={styles.lnew}><div>
                    <div className={styles.lrow}>
                      <FolderIcon fill="#C25A3A" />Liked by guests
                      <em><b className={styles.n} style={{ "--to": 86 } as React.CSSProperties}></b> / 86</em>
                    </div>
                    <u><i></i></u>
                    <div className={styles.lfile}><em>RAW</em>DSC_4521.CR3<Check /></div>
                    <div className={cx(styles.lfile, styles.x)}><em>RAW</em>DSC_4588.CR3<Check /></div>
                  </div></div>
                </div>
                <div className={styles.lbtn}>
                  <svg viewBox="0 0 12 12" fill="#fff" aria-hidden="true"><path d="M6 .5l1.200 3.300L10.500 5 7.200 6.200 6 9.500 4.800 6.200 1.500 5l3.300-1.200zM10 8.500l.5 1.300 1.300.5-1.300.5-.5 1.300-.5-1.300-1.300-.5 1.300-.5z" /></svg>
                  Locate originals
                  <svg className={styles.cursor} viewBox="0 0 16 16" aria-hidden="true"><path d="M2 1.500v11.200l3-2.800 2 4.600 2-.9-2-4.500h4.200z" fill="#fff" stroke="#2B140D" strokeWidth="1.200" strokeLinejoin="round" /></svg>
                </div>
              </div>
            </div>
            <div className={styles.rail}><span className={styles.dot} data-dot=""></span></div>
            <h3>Locate originals in one click</h3>
            <p>No more searching filenames for the photos guests liked. Pick the folder your originals live in, click once, and our AI copies them into a new subfolder.</p>
          </div>

          <div className={styles.step} data-step="">
            <div className={styles.vis}>
              <div className={styles.art} aria-hidden="true">
                <span className={styles.cal}>
                  <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.300" strokeLinecap="round" aria-hidden="true"><rect x="1.500" y="2.500" width="9" height="8" rx="1.500" /><path d="M1.500 5h9M4 1.300v2M8 1.300v2" /></svg>
                  2 months later
                </span>
                <div className={styles.fan}>
                  <span style={bg(varmala.src)}></span>
                  <span style={bg(dadi.src)}></span>
                  <span style={bg(haldi.src)}></span>
                </div>
                <div className={styles.note}>
                  <b>Thank you, Riya &amp; Arjun <Heart /></b>
                  <small>Your memory lane is here</small>
                  <div className={styles.stars}><i>★</i><i>★</i><i>★</i><i>★</i><i>★</i></div>
                  <div className={styles.rv}>Review us on Google</div>
                </div>
              </div>
            </div>
            <div className={styles.rail}><span className={styles.dot} data-dot=""></span></div>
            <h3>Automatic client retention</h3>
            <p>Two months later, your client gets a personalised memory lane with a thank-you note and a Google review ask, so they think of you for the next shoot.</p>
          </div>

          <div className={styles.track} ref={trackRef}><i ref={fillRef}></i></div>
          <div className={styles.rider} ref={riderRef} style={bg(WORKFLOW_IMAGES.rider.src)}></div>
        </div>

        <div className={styles.foot}>
          <div>
            <span className={styles.ea}>Early access</span>
            The phone upload app is rolling out to select studios this season. Everyone else plugs the card, camera or hard drive into a laptop and uploads from the web app.
          </div>
          <a href={whatsappUrl(EARLY_ACCESS_MESSAGE)} target="_blank" rel="noopener noreferrer">
            Ask to join{" "}
            <svg width="14" height="14" viewBox="0 0 18 18" fill="none" stroke="#fff" strokeWidth="2.200" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M3.500 9h11M10 4.500L14.500 9 10 13.500" /></svg>
          </a>
        </div>
      </div>
      </div>
    </section>
  );
}
