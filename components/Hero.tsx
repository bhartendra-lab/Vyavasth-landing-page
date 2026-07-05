"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, Check, Sparkles } from "lucide-react";
import { useEnquiry } from "@/components/EnquiryProvider";

// Curated event photos for the live-gallery collage — a deliberate mix of
// weddings, concerts, conferences and parties (Vyavasth serves all events).
const HERO_PHOTOS = [
  "photo-1519741497674-611481863552",
  "photo-1492684223066-81342ee5ff30",
  "photo-1606216794074-735e91aa2c92",
  "photo-1540575467063-178a50c2df87",
  "photo-1583939003579-730e3918a45a",
  "photo-1533174072545-7a4b6ad7a6c3",
  "photo-1591604466107-ec97de577aff",
  "photo-1511578314322-379afb476865",
  "photo-1530023367847-a683933f4172",
  "photo-1531058020387-3be344556be6",
  "photo-1621184455862-c163dfb30e0f",
  "photo-1537633552985-df8429e8048b",
].map((id) => `https://images.unsplash.com/${id}?w=800&q=80`);

const TRUST_PILLS = [
  "AI face-matching",
  "Same-evening delivery",
  "One place for the studio",
];

function CollageColumn({
  photos,
  columnIndex,
}: {
  photos: string[];
  columnIndex: number;
}) {
  const directionUp = columnIndex % 2 === 0;
  const duration = 38 + columnIndex * 8;
  const delay = -columnIndex * 5;
  // Two copies of the column give a seamless, gap-free loop.
  const loopList = [...photos, ...photos];

  return (
    <div
      className={`collage-column flex flex-col gap-2 ${
        directionUp ? "collage-column-up" : "collage-column-down"
      }`}
      style={{
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
      }}
      aria-hidden="true"
    >
      {loopList.map((src, i) => (
        <div
          key={`${columnIndex}-${i}`}
          className="relative w-full shrink-0 overflow-hidden rounded-lg"
          style={{
            aspectRatio: "4 / 5",
            background: "rgba(42, 34, 24, 0.05)",
          }}
        >
          <Image
            src={src}
            alt=""
            fill
            sizes="(max-width: 900px) 45vw, 240px"
            priority={i === 0 && columnIndex === 0}
            loading={i === 0 && columnIndex === 0 ? "eager" : "lazy"}
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}

export default function Hero() {
  const { openEnquiry } = useEnquiry();
  const reduced = useReducedMotion();

  const fadeUp = (delay = 0) =>
    reduced
      ? {}
      : {
          initial: { opacity: 0, y: 22 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, ease: "easeOut" as const, delay },
        };

  const columns = [
    HERO_PHOTOS.filter((_, i) => i % 2 === 0),
    HERO_PHOTOS.filter((_, i) => i % 2 === 1),
  ];

  return (
    <section
      className="relative overflow-hidden"
      style={{
        background: "var(--color-bg)",
        padding:
          "clamp(112px, 15vh, 168px) var(--gutter) clamp(56px, 8vh, 96px)",
        isolation: "isolate",
      }}
      aria-label="Hero"
    >
      {/* Warm terracotta glow — subtle, never a gradient background */}
      <div
        className="pointer-events-none absolute -top-[20%] -right-[10%] -z-10"
        style={{
          width: "55vw",
          height: "55vw",
          maxWidth: 720,
          maxHeight: 720,
          background:
            "radial-gradient(circle at 60% 40%, rgba(194,90,58,0.14) 0%, rgba(194,90,58,0.05) 42%, transparent 70%)",
        }}
        aria-hidden
      />

      <div
        className="mx-auto grid items-center gap-11 max-[900px]:grid-cols-1 min-[901px]:grid-cols-2 min-[901px]:gap-[clamp(40px,6vw,88px)]"
        style={{ maxWidth: "var(--max-w)" }}
      >
        {/* ---------- Copy ---------- */}
        <div className="flex max-w-[620px] flex-col items-start">
          <motion.h1
            {...fadeUp(0)}
            className="font-extrabold"
            style={{
              fontSize: "clamp(2.5rem, 5.6vw, 4.4rem)",
              lineHeight: 1.03,
              letterSpacing: "-0.035em",
              color: "var(--color-primary)",
            }}
          >
            The{" "}
            <span style={{ color: "var(--color-accent)" }}>AI Companion</span>{" "}
            for photography studios.
          </motion.h1>

          <motion.p
            {...fadeUp(0.08)}
            className="mt-5 max-w-[520px]"
            style={{
              fontSize: "clamp(1rem, 1.35vw, 1.18rem)",
              lineHeight: 1.6,
              color: "var(--color-muted)",
            }}
          >
            Leads, shoots, payments and thousands of photos — scattered across
            WhatsApp, spreadsheets and Drive links. Vyavasth brings it into one
            place, and an AI-powered gallery delivers photos to guests{" "}
            <em className="italic" style={{ color: "var(--color-primary)" }}>
              during
            </em>{" "}
            the event.
          </motion.p>

          <motion.div {...fadeUp(0.16)} className="mt-8">
            <button
              type="button"
              onClick={openEnquiry}
              className="group inline-flex items-center gap-2.5 rounded-full px-7 py-4 text-[15px] font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:bg-[var(--color-accent-deep)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/50"
              style={{
                background: "var(--color-accent)",
                boxShadow: "0 6px 18px rgba(194, 90, 58, 0.28)",
              }}
            >
              Book a demo
              <ArrowRight
                size={18}
                className="transition-transform duration-200 group-hover:translate-x-1"
              />
            </button>
          </motion.div>

          <motion.ul
            {...fadeUp(0.24)}
            className="mt-7 flex flex-wrap gap-x-4 gap-y-2.5"
            role="list"
          >
            {TRUST_PILLS.map((t) => (
              <li
                key={t}
                className="inline-flex items-center gap-2 text-[13px] font-medium"
                style={{ color: "var(--color-muted)" }}
              >
                <span
                  className="inline-flex h-[18px] w-[18px] items-center justify-center rounded-full"
                  style={{
                    background: "var(--color-success-soft)",
                    color: "var(--color-success)",
                  }}
                  aria-hidden
                >
                  <Check size={11} strokeWidth={2.4} />
                </span>
                {t}
              </li>
            ))}
          </motion.ul>
        </div>

        {/* ---------- Live-gallery visual ---------- */}
        <motion.div
          {...fadeUp(0.2)}
          className="flex w-full flex-col items-center gap-4"
        >
          <div
            className="relative w-full max-w-[440px] overflow-hidden rounded-[20px]"
            style={{
              background: "var(--color-surface)",
              border: "1px solid var(--color-line)",
              boxShadow: "var(--shadow-floating)",
            }}
          >
            {/* Browser bar */}
            <div
              className="flex items-center gap-3 px-4 py-3"
              style={{
                borderBottom: "1px solid var(--color-line)",
                background: "var(--color-surface)",
              }}
            >
              <span className="flex shrink-0 gap-1.5" aria-hidden>
                {[0, 1, 2].map((i) => (
                  <i
                    key={i}
                    className="h-[9px] w-[9px] rounded-full"
                    style={{ background: "var(--color-line-strong)" }}
                  />
                ))}
              </span>
              <span
                className="min-w-0 flex-1 truncate text-center text-xs font-medium"
                style={{ color: "var(--color-muted)" }}
              >
                the annual gala · live gallery
              </span>
              <span
                className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide"
                style={{
                  background: "var(--color-success-soft)",
                  color: "var(--color-success)",
                }}
              >
                <span
                  className="brand-pulse h-1.5 w-1.5 rounded-full"
                  style={{ background: "var(--color-success)" }}
                  aria-hidden
                />
                Live
              </span>
            </div>

            {/* Scrolling collage */}
            <div
              className="relative overflow-hidden"
              style={{
                height: "clamp(360px, 46vw, 440px)",
                background: "var(--color-surface-2)",
              }}
            >
              <div
                className="absolute inset-0 grid grid-cols-2 gap-2 p-2"
                style={{
                  maskImage:
                    "linear-gradient(to bottom, transparent 0%, #000 9%, #000 82%, transparent 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, transparent 0%, #000 9%, #000 82%, transparent 100%)",
                }}
                aria-hidden
              >
                {columns.map((col, i) => (
                  <CollageColumn key={i} photos={col} columnIndex={i} />
                ))}
              </div>

              {/* Inner vignette so chips read against photos */}
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(42,34,24,0.22) 0%, transparent 34%)",
                }}
                aria-hidden
              />

              {/* Face-match chip — AI galleries */}
              <div
                className="floaty absolute left-3.5 bottom-14 inline-flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-[13px] font-medium"
                style={{
                  background: "rgba(251, 248, 241, 0.94)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid var(--color-line)",
                  boxShadow: "var(--shadow-raised)",
                  color: "var(--color-primary)",
                }}
              >
                <span
                  className="inline-flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[7px] text-white"
                  style={{ background: "var(--color-accent)" }}
                >
                  <Sparkles size={13} />
                </span>
                <span>
                  <strong className="font-bold">128 photos</strong> matched to
                  your face
                </span>
              </div>

              {/* Live-delivery chip */}
              <div
                className="floaty absolute right-3.5 bottom-4 inline-flex items-center gap-2 whitespace-nowrap rounded-xl px-3 py-2 text-[13px] font-semibold"
                style={{
                  background: "rgba(251, 248, 241, 0.94)",
                  backdropFilter: "blur(8px)",
                  border: "1px solid var(--color-line)",
                  boxShadow: "var(--shadow-raised)",
                  color: "var(--color-success)",
                  animationDelay: "0.6s",
                }}
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{
                    background: "var(--color-success)",
                    boxShadow: "0 0 0 4px rgba(46, 125, 82, 0.16)",
                  }}
                  aria-hidden
                />
                Delivered live · tonight
              </div>
            </div>
          </div>

          <p
            className="hidden max-w-[320px] text-center text-[13px] min-[901px]:block"
            style={{ color: "var(--color-faint)" }}
          >
            A branded, guest-facing gallery — photos land the same evening.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
