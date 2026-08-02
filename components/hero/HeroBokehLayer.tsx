"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, type RefObject } from "react";
import { useReducedMotion } from "framer-motion";
import HeroBokehCss from "./HeroBokehCss";

// Lazy, client-only: the three/R3F chunk never lands in the initial bundle and
// never renders on the server.
const HeroBokeh = dynamic(() => import("./HeroBokeh"), { ssr: false, loading: () => null });

function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (c.getContext("webgl") || c.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}

/**
 * Chooses the hero's ambient layer. The CSS bokeh renders by default (and on
 * the server); the R3F layer only upgrades it, after first paint, and only
 * when every gate passes:
 *   1. motion is allowed        2. viewport ≥ 901px (this codebase's breakpoint)
 *   3. more than 4 cores        4. WebGL is available
 * Gates are evaluated in an effect (never during render: they'd break
 * hydration) and re-checked on width change so a tablet rotation does the right
 * thing. Mounting waits for requestIdleCallback so the <h1> stays the LCP node.
 */
export default function HeroBokehLayer({
  sectionRef,
}: {
  sectionRef: RefObject<HTMLElement | null>;
}) {
  const reduced = useReducedMotion();
  const [useR3F, setUseR3F] = useState(false);

  useEffect(() => {
    const wideMq = window.matchMedia("(min-width: 901px)");
    let cancelled = false;

    // All setState happens inside decide (scheduled / event-driven), never
    // synchronously in the effect body. reduced is folded in here so a runtime
    // motion-preference change tears the R3F layer down.
    const decide = () => {
      if (cancelled) return;
      setUseR3F(
        !reduced &&
          wideMq.matches &&
          (navigator.hardwareConcurrency ?? 4) > 4 &&
          hasWebGL(),
      );
    };

    // typeof guard, not `in window`: the DOM lib types requestIdleCallback as
    // always present, so `in` narrows the else branch to never. Safari lacks it.
    const hasIdle = typeof window.requestIdleCallback === "function";
    const idleId: number = hasIdle
      ? window.requestIdleCallback(decide, { timeout: 500 })
      : window.setTimeout(decide, 200);

    wideMq.addEventListener("change", decide);

    return () => {
      cancelled = true;
      wideMq.removeEventListener("change", decide);
      if (hasIdle) window.cancelIdleCallback(idleId);
      else window.clearTimeout(idleId);
    };
  }, [reduced]);

  return useR3F ? <HeroBokeh sectionRef={sectionRef} /> : <HeroBokehCss />;
}
