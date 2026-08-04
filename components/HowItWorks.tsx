"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  useReducedMotion,
} from "framer-motion";
import Eyebrow from "@/components/Eyebrow";

const STEPS = [
  {
    n: "01",
    title: "Photos leave the camera on their own",
    body: "Shoot as you always do: frames reach Vyavasth over FTP while the event runs. No end-of-night upload marathon.",
    img: "/how-step-1.png",
    alt: "Camera uploading photos to the Vyavasth cloud and onto a phone.",
  },
  {
    n: "02",
    title: "Every face is matched",
    body: "Guests register once with a selfie. Each frame is sorted to the people in it, and each one stays linked to its original.",
    img: "/how-step-2.png",
    alt: "A registered selfie being matched to the faces it appears alongside.",
  },
  {
    n: "03",
    title: "Guests open their own gallery",
    body: "One passcode-gated link, your branding on every screen, sorted by Haldi, Sangeet and Reception, not one flat dump.",
    img: "/how-step-3.png",
    alt: "A passcode-gated gallery of event photos opened in a browser.",
  },
];

const DURATION = 6000; // auto-advance interval (ms)

export default function HowItWorks() {
  const reduced = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.4 });

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);

  const autoplaying = inView && !paused && !reduced;

  // Auto-advance: drive the progress bar and flip to the next step at 6s.
  useEffect(() => {
    if (!autoplaying) return;
    const start = performance.now();
    const id = setInterval(() => {
      const p = Math.min((performance.now() - start) / DURATION, 1);
      setProgress(p);
      if (p >= 1) {
        setProgress(0);
        setActive((a) => (a + 1) % STEPS.length);
      }
    }, 50);
    return () => clearInterval(id);
  }, [active, autoplaying]);

  const goTo = (i: number) => {
    setActive(i);
    setProgress(0);
  };

  const step = STEPS[active];

  const swap = reduced
    ? { initial: false as const }
    : {
        initial: { opacity: 0, y: 14 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -14 },
        transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] as const },
      };

  const swapImg = reduced
    ? { initial: false as const }
    : {
        initial: { opacity: 0, scale: 0.98 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 1.02 },
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
      };

  return (
    <section
      ref={sectionRef}
      id="how"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      style={{
        padding: "clamp(72px, 12vh, 128px) 0",
        background: "var(--color-bg)",
      }}
    >
      <div
        className="mx-auto"
        style={{ maxWidth: "var(--max-w)", padding: "0 var(--gutter)" }}
      >
        <div className="grid grid-cols-1 items-center gap-11 min-[901px]:grid-cols-2 min-[901px]:gap-[clamp(40px,6vw,88px)]">
          {/* Copy + active step + progress tabs */}
          <div className="flex flex-col gap-7 min-[901px]:order-first order-last">
            <div className="flex flex-col gap-5">
              <Eyebrow>How it works</Eyebrow>
              <h2
                className="font-extrabold"
                style={{
                  fontSize: "clamp(1.9rem, 3.6vw, 2.9rem)",
                  lineHeight: 1.08,
                  letterSpacing: "-0.03em",
                  color: "var(--color-primary)",
                }}
              >
                From the shoot to the guest&apos;s phone, the same night.
              </h2>
            </div>

            {/* Active step — crossfades to the next */}
            <div
              className="relative"
              style={{ minHeight: "clamp(150px, 22vh, 176px)" }}
              aria-live="polite"
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  {...swap}
                  className="flex gap-4"
                >
                  <span
                    className="shrink-0 font-extrabold leading-none"
                    style={{
                      fontSize: "clamp(2.4rem, 4vw, 3rem)",
                      color: "var(--color-accent)",
                      letterSpacing: "-0.04em",
                    }}
                  >
                    {step.n}
                  </span>
                  <div className="pt-1">
                    <h3
                      className="mb-2 font-bold"
                      style={{
                        fontSize: "1.25rem",
                        letterSpacing: "-0.02em",
                        color: "var(--color-primary)",
                      }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className="max-w-[440px] text-[15px]"
                      style={{ lineHeight: 1.65, color: "var(--color-muted)" }}
                    >
                      {step.body}
                    </p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Progress tabs */}
            <div className="flex gap-3" role="tablist" aria-label="How it works steps">
              {STEPS.map((s, i) => {
                const isActive = i === active;
                // Active bar fills over the 6s timer (and freezes where it is on
                // hover-pause); reduced-motion users get a static full bar instead.
                const fill = isActive ? (reduced ? 100 : progress * 100) : 0;
                return (
                  <button
                    key={s.n}
                    role="tab"
                    aria-selected={isActive}
                    aria-label={`Step ${s.n}: ${s.title}`}
                    onClick={() => goTo(i)}
                    className="group flex flex-1 flex-col gap-2 pb-1 text-left"
                  >
                    <span
                      className="text-xs font-bold tracking-wide transition-colors"
                      style={{
                        color: isActive
                          ? "var(--color-accent)"
                          : "var(--color-muted)",
                      }}
                    >
                      {s.n}
                    </span>
                    <span
                      className="relative h-[3px] w-full overflow-hidden rounded-full"
                      style={{ background: "var(--color-line)" }}
                    >
                      <span
                        className="absolute inset-y-0 left-0 rounded-full"
                        style={{
                          width: `${fill}%`,
                          background: "var(--color-accent)",
                          transition: reduced
                            ? undefined
                            : "width 60ms linear",
                        }}
                      />
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Illustration — crossfades with the active step */}
          <div
            className="relative w-full overflow-hidden rounded-2xl"
            style={{
              height: "clamp(340px, 40vw, 460px)",
              background: "#fef5ec",
              border: "1px solid var(--color-line)",
              boxShadow: "var(--shadow-raised)",
            }}
            aria-hidden="true"
          >
            <AnimatePresence>
              <motion.div
                key={active}
                {...swapImg}
                className="absolute inset-0"
              >
                <Image
                  src={step.img}
                  alt={step.alt}
                  fill
                  sizes="(max-width: 900px) 100vw, 44vw"
                  className="object-contain p-2"
                  priority={active === 0}
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
