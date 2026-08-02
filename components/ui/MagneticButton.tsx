"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";

// Cursor within RADIUS px of the button's centre pulls it toward the pointer by
// (delta * STRENGTH), clamped to ±MAX. The small clamp is deliberate: a button
// that runs more than ~10px from its layout position desyncs from its own hit
// area and starts to feel broken rather than alive.
const RADIUS = 90;
const STRENGTH = 0.28;
const MAX = 10;

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}

/**
 * Generic magnetic wrapper. Pulls its child toward the cursor on true pointer
 * devices only; on touch or under reduced motion it is a pass-through that
 * renders the child with no transform and no listeners. It never touches the
 * child's semantics, onClick, focus ring or size; keyboard focus resets the
 * transform to 0 so focus always lands on the child's true layout position.
 */
export default function MagneticButton({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);
  const [enabled, setEnabled] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  // Spring, not tween: a tween on cursor input feels rubbery.
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    // reduced folded in; setEnabled only fires from a callback/event, never
    // synchronously in the effect body (the initial read is deferred a frame).
    const update = () => setEnabled(!reduced && mq.matches);
    mq.addEventListener("change", update);
    const id = requestAnimationFrame(update);
    return () => {
      mq.removeEventListener("change", update);
      cancelAnimationFrame(id);
    };
  }, [reduced]);

  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      if (Math.hypot(dx, dy) < RADIUS) {
        x.set(clamp(dx * STRENGTH, -MAX, MAX));
        y.set(clamp(dy * STRENGTH, -MAX, MAX));
      } else {
        x.set(0);
        y.set(0);
      }
    };
    const reset = () => {
      x.set(0);
      y.set(0);
    };

    window.addEventListener("pointermove", onMove);
    // Keyboard focus (focusin bubbles from the child) snaps back to 0.
    el.addEventListener("focusin", reset);
    window.addEventListener("blur", reset);
    return () => {
      window.removeEventListener("pointermove", onMove);
      el.removeEventListener("focusin", reset);
      window.removeEventListener("blur", reset);
      reset();
    };
  }, [enabled, x, y]);

  if (reduced || !enabled) {
    return (
      <span ref={ref} className={className}>
        {children}
      </span>
    );
  }

  return (
    <motion.span ref={ref} className={className} style={{ x: springX, y: springY }}>
      {children}
    </motion.span>
  );
}
