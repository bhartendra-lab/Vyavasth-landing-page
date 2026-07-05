"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import Eyebrow from "@/components/Eyebrow";

const STEPS = [
  {
    n: "01",
    title: "Your team keeps shooting",
    body: "Photos flow into Vyavasth as the event unfolds — no export ritual, no end-of-night upload marathon.",
  },
  {
    n: "02",
    title: "AI matches every face",
    body: "Guests register once. Face-matching sorts every frame to the right people and tags the moments worth keeping.",
  },
  {
    n: "03",
    title: "Guests get their photos — live",
    body: "Each guest opens a branded gallery the same evening. Behind it, the studio already has every original matched and ready.",
  },
];

// Mixed event photos — weddings, birthdays, receptions (all events, not one kind).
const GALLERY_PHOTOS = [
  "photo-1528360983277-13d401cdc186",
  "photo-1587271407850-8d438ca9fdf2",
  "photo-1524863479829-916d8e77f114",
  "photo-1465495976277-4387d4b0b4c6",
  "photo-1460978812857-470ed1c77af0",
].map((id) => `https://images.unsplash.com/${id}?w=800&q=80`);

export default function HowItWorks() {
  const reduced = useReducedMotion();

  const fadeUp = (delay = 0) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 18 },
          whileInView: { opacity: 1, y: 0 },
          viewport: { once: true },
          transition: { duration: 0.5, ease: "easeOut" as const, delay },
        };

  return (
    <section
      id="how"
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
          {/* Copy + steps */}
          <motion.div {...fadeUp(0)} className="flex flex-col gap-5 min-[901px]:order-first order-last">
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
              From the shoot to the guest&apos;s phone — the same night.
            </h2>
            <ol className="mt-1.5 flex flex-col">
              {STEPS.map((s, i) => (
                <li
                  key={s.n}
                  className="flex gap-5 py-5"
                  style={{
                    borderTop: "1px solid var(--color-line)",
                    borderBottom:
                      i === STEPS.length - 1
                        ? "1px solid var(--color-line)"
                        : undefined,
                  }}
                >
                  <span
                    className="shrink-0 pt-0.5 text-sm font-bold tracking-wide"
                    style={{ color: "var(--color-accent)" }}
                  >
                    {s.n}
                  </span>
                  <div>
                    <h3
                      className="mb-1.5 font-bold"
                      style={{
                        fontSize: "1.08rem",
                        letterSpacing: "-0.02em",
                        color: "var(--color-primary)",
                      }}
                    >
                      {s.title}
                    </h3>
                    <p
                      className="max-w-[420px] text-[15px]"
                      style={{ lineHeight: 1.6, color: "var(--color-muted)" }}
                    >
                      {s.body}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </motion.div>

          {/* Photo grid visual */}
          <motion.div {...fadeUp(0.1)} className="w-full" aria-hidden="true">
            <div
              className="grid gap-3"
              style={{
                gridTemplateColumns: "1.35fr 1fr",
                height: "clamp(400px, 44vw, 500px)",
              }}
            >
              <div
                className="relative h-full overflow-hidden rounded-xl"
                style={{ background: "var(--color-surface-2)" }}
              >
                <Image
                  src={GALLERY_PHOTOS[0]}
                  alt=""
                  fill
                  sizes="(max-width: 900px) 100vw, 40vw"
                  className="object-cover transition-transform duration-1000 ease-out hover:scale-105"
                />
                <span
                  className="absolute left-3.5 bottom-3.5 inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold"
                  style={{
                    background: "rgba(251, 248, 241, 0.94)",
                    backdropFilter: "blur(8px)",
                    color: "var(--color-success)",
                    boxShadow: "var(--shadow-raised)",
                  }}
                >
                  <span
                    className="h-[7px] w-[7px] rounded-full"
                    style={{
                      background: "var(--color-success)",
                      boxShadow: "0 0 0 4px rgba(46, 125, 82, 0.16)",
                    }}
                  />
                  Delivered live
                </span>
              </div>
              <div className="grid grid-cols-2 grid-rows-2 gap-3">
                {GALLERY_PHOTOS.slice(1, 5).map((src) => (
                  <div
                    key={src}
                    className="relative overflow-hidden rounded-xl"
                    style={{ background: "var(--color-surface-2)" }}
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes="(max-width: 900px) 50vw, 20vw"
                      className="object-cover transition-transform duration-1000 ease-out hover:scale-105"
                    />
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
