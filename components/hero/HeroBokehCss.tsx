// CSS-only bokeh, the fallback whenever the R3F layer is gated out (mobile,
// reduced motion, low-core, no WebGL). Blurred radial-gradient discs in the
// same palette, drifting via the existing `floaty` keyframe (globals.css),
// which is already disabled under prefers-reduced-motion. Zero JS.
//
// Palette only: shades above --color-surface, --color-accent-soft, low-sat
// terracotta, and one rare faint --color-accent. No new colours enter here.
const ORBS = [
  { top: "6%", left: "10%", size: 200, color: "#FBF3E6", opacity: 0.5, blur: 26, dur: "9s", delay: "0s" },
  { top: "20%", left: "62%", size: 260, color: "#F7E8E3", opacity: 0.42, blur: 34, dur: "12s", delay: "-3s" },
  { top: "52%", left: "28%", size: 150, color: "#E8C4B4", opacity: 0.32, blur: 24, dur: "8s", delay: "-1.5s" },
  { top: "68%", left: "78%", size: 220, color: "#FBF3E6", opacity: 0.4, blur: 30, dur: "13s", delay: "-5s" },
  { top: "38%", left: "84%", size: 130, color: "#F7E8E3", opacity: 0.36, blur: 22, dur: "10s", delay: "-2s" },
  { top: "80%", left: "16%", size: 180, color: "#E8C4B4", opacity: 0.28, blur: 28, dur: "11s", delay: "-6s" },
  { top: "44%", left: "48%", size: 110, color: "#C25A3A", opacity: 0.12, blur: 20, dur: "7s", delay: "-4s" },
];

export default function HeroBokehCss() {
  return (
    <div
      className="pointer-events-none absolute inset-0 -z-10 overflow-hidden"
      aria-hidden
    >
      {ORBS.map((o, i) => (
        <div
          key={i}
          className="floaty absolute rounded-full"
          style={{
            top: o.top,
            left: o.left,
            width: o.size,
            height: o.size,
            opacity: o.opacity,
            background: `radial-gradient(circle at 50% 45%, ${o.color} 0%, ${o.color} 40%, transparent 62%)`,
            filter: `blur(${o.blur}px)`,
            animationDuration: o.dur,
            animationDelay: o.delay,
          }}
        />
      ))}
    </div>
  );
}
