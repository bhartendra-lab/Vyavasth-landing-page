// Photography studios already onboarded with Vyavasth. A slim, always-moving
// marquee that sits right under the hero as quiet social proof.
const STUDIOS = [
  "Golden Hour Studio",
  "Frame Stories",
  "Studio Aperture",
  "Candid Clicks",
  "Lens & Light",
  "Momentous Studio",
  "Pixel Bloom",
  "Shutter Tales",
  "Iris Photography",
  "Studio Kohinoor",
  "Focal Point",
  "Everlight Studios",
];

function Track({ ariaHidden = false }: { ariaHidden?: boolean }) {
  return (
    <ul
      className="flex shrink-0 items-center"
      aria-hidden={ariaHidden || undefined}
      role="list"
    >
      {STUDIOS.map((name, i) => (
        <li
          key={`${name}-${i}`}
          className="inline-flex items-center gap-3.5 whitespace-nowrap text-[15px] font-semibold"
          style={{
            padding: "0 clamp(18px, 2.4vw, 34px)",
            letterSpacing: "-0.01em",
            color: "var(--color-primary)",
          }}
        >
          <span
            className="h-[5px] w-[5px] shrink-0 rounded-full"
            style={{ background: "var(--color-accent)" }}
            aria-hidden
          />
          {name}
        </li>
      ))}
    </ul>
  );
}

export default function StudioMarquee() {
  return (
    <section
      className="flex flex-col items-start gap-2.5 overflow-hidden sm:flex-row sm:items-center sm:gap-[clamp(16px,3vw,40px)]"
      style={{
        padding: "18px var(--gutter)",
        background: "var(--color-surface)",
        borderTop: "1px solid var(--color-line)",
        borderBottom: "1px solid var(--color-line)",
      }}
      aria-label="Studios onboarded with Vyavasth"
    >
      <span
        className="shrink-0 whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.12em]"
        style={{ color: "var(--color-faint)" }}
      >
        Studios using Vyavasth
      </span>
      <div
        className="marquee-paused-on-hover relative w-full min-w-0 flex-1 overflow-hidden"
        style={{
          maskImage:
            "linear-gradient(to right, transparent 0, #000 7%, #000 93%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, transparent 0, #000 7%, #000 93%, transparent 100%)",
        }}
      >
        <div className="marquee-track">
          {/* Two identical tracks give a seamless, gap-free loop. */}
          <Track />
          <Track ariaHidden />
        </div>
      </div>
    </section>
  );
}
