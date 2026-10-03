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

const EARLY_ACCESS_MESSAGE = "Hi, I'd like early access to the Vyavasth Android upload app.";

const bg = (src: string) => ({ backgroundImage: `url(${src})` });
const cx = (...c: Array<string | false | undefined>) => c.filter(Boolean).join(" ");

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
            <p>Set it up in a minute and send the couple their link.</p>
          </div>

          <div className={cx(styles.phase, styles.p2)}>At the event</div>
          <div className={styles.step} data-step="">
            <div className={styles.vis}>
              <div className={styles.cam}>
                <svg viewBox="0 0 200 140" aria-hidden="true"><rect x="70" y="8" width="60" height="26" rx="8" fill="#E9D8CF" /><rect x="10" y="28" width="180" height="104" rx="18" fill="#FFF4EC" /><rect x="10" y="28" width="180" height="26" rx="13" fill="#E9D8CF" /><rect x="24" y="16" width="30" height="16" rx="5" fill="#C25A3A" /><circle cx="100" cy="86" r="40" fill="#2B140D" /><circle cx="100" cy="86" r="30" fill="#4a2a20" /><circle cx="100" cy="86" r="19" fill="#1d0d08" /><circle cx="91" cy="77" r="6" fill="#fff" opacity=".55" /><circle cx="166" cy="42" r="5" fill="#C25A3A" /><rect x="24" y="66" width="16" height="44" rx="8" fill="#E9D8CF" /></svg>
              </div>
              <span className={styles.count}>DSC_4521</span>
            </div>
            <div className={styles.rail}><span className={styles.dot} data-dot=""></span></div>
            <h3>Shoot as you always do</h3>
            <p>No new camera settings. No change to how your team works.</p>
          </div>

          <div className={styles.step} data-step="">
            <div className={styles.vis}>
              <div className={styles.ph2}>
                <div className={styles.pm}><div><UploadIcon /><b>84 / 150</b><small>Phone 1</small><u><i style={{ width: "56%" }}></i></u></div></div>
                <div className={styles.pm} style={{ marginBottom: 14 }}><div><UploadIcon /><b>96 / 120</b><small>Phone 2</small><u><i style={{ width: "80%" }}></i></u></div></div>
                <div className={cx(styles.pm, styles.x)}><div><UploadIcon /><b>41 / 260</b><small>Phone 3</small><u><i style={{ width: "16%" }}></i></u></div></div>
              </div>
              <span className={styles.usb}>
                <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true"><path d="M7 13V3M7 3L5 5M7 3l2 2M4 8v1.500l3 1.500M10 6.500v1.500L7 9.500" /><rect x="3" y="6.500" width="2" height="1.500" fill="currentColor" /><circle cx="10" cy="6" r="1" fill="currentColor" /></svg>
                OVER USB
              </span>
            </div>
            <div className={styles.rail}><span className={styles.dot} data-dot=""></span></div>
            <h3>Plug in and upload <span className={styles.ea}>Early access</span></h3>
            <p>USB from the camera to any Android phone. As many phones, as many times as you like.</p>
          </div>

          <div className={styles.step} data-step="">
            <div className={styles.vis}>
              <div className={styles.m}>
                <div className={styles.mc}>
                  <div className={styles.q}><span>HD</span><span className={styles.on}>4K</span><span>Original</span></div>
                  <div className={styles.row}><Check />Resumes if the network drops</div>
                  <div className={cx(styles.row, styles.x)} style={{ marginTop: 10 }}>Reusable storage</div>
                  <div className={cx(styles.bar, styles.x)}><i></i></div>
                </div>
              </div>
            </div>
            <div className={styles.rail}><span className={styles.dot} data-dot=""></span></div>
            <h3>Safe in the cloud</h3>
            <p>Three quality levels to pick from. Uploads pick up where they stopped.</p>
          </div>

          <div className={styles.step} data-step="">
            <div className={styles.vis}>
              <div className={styles.gal}>
                <div className={styles.sc}>
                  <span style={bg(haldi.src)}></span>
                  <span className={styles.new} style={bg(sangeet.src)}></span>
                  <span style={bg(varmala.src)}></span>
                  <span style={bg(dadi.src)}></span>
                </div>
              </div>
              <span className={styles.likes}>
                <svg viewBox="0 0 24 24" fill="#C25A3A" aria-hidden="true"><path d="M12 21s-7.500-4.700-9.600-9.300C.9 8.300 2.700 4.500 6.300 4.500c2.100 0 3.700 1.200 5.700 3.500 2-2.300 3.600-3.500 5.700-3.500 3.600 0 5.400 3.800 3.900 7.200C19.500 16.300 12 21 12 21z" /></svg>
                24
              </span>
            </div>
            <div className={styles.rail}><span className={styles.dot} data-dot=""></span></div>
            <h3>Live in their gallery</h3>
            <p>Photos appear as they land. The family likes their favourites.</p>
          </div>

          <div className={cx(styles.phase, styles.p3)}>After the event</div>
          <div className={styles.step} data-step="">
            <div className={styles.vis}>
              <div className={styles.m}>
                <div className={styles.mc}>
                  <div className={styles.chips}><span className={styles.on}>Most liked</span><span>Bride&apos;s side</span><span className={styles.x}>Groom&apos;s side</span></div>
                  <div className={styles.file}><em>RAW</em>DSC_4521.CR3</div>
                  <div className={styles.ok}><Check />Original located</div>
                  <div className={cx(styles.btn, styles.x)} style={{ background: "var(--brown)" }}>Send to editor</div>
                </div>
              </div>
            </div>
            <div className={styles.rail}><span className={styles.dot} data-dot=""></span></div>
            <h3>Select and locate</h3>
            <p>The couple picks their album photos with Smart Select. You find the RAWs in one click and send them to your editor.</p>
          </div>

          <div className={styles.track} ref={trackRef}><i ref={fillRef}></i></div>
          <div className={styles.rider} ref={riderRef} style={bg(WORKFLOW_IMAGES.rider.src)}></div>
        </div>

        <div className={styles.foot}>
          <div>
            <span className={styles.ea}>Early access</span>
            The Android upload app is rolling out to select studios this season. Everyone else plugs the card, camera or hard drive into a laptop and uploads from the web app.
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
