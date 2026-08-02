"use client";

import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Out-of-focus venue light on a CREAM canvas, never a tech particle field.
// The background is light, so AdditiveBlending would blow to white; we use
// NormalBlending at low opacity. Colours sample only the existing palette.
const CREAM = new THREE.Color("#fbf3e6");

function pickColor(): THREE.Color {
  const r = Math.random();
  if (r < 0.4) return new THREE.Color("#fbf3e6"); // a shade above --color-surface (~40%)
  if (r < 0.75) return new THREE.Color("#f7e8e3"); // --color-accent-soft (~35%)
  if (r < 0.95) return new THREE.Color("#e8c4b4"); // low-sat terracotta (~20%)
  return new THREE.Color("#c25a3a").lerp(CREAM, 0.55); // rare "hot" bokeh, kept faint (~5%)
}

// Three depth groups. Each is its own Points so it can carry its own opacity
// (a stand-in for per-orb alpha without a custom shader) and parallax factor.
// count sums to 22 orbs, within the 18-26 ceiling.
const GROUP_DEFS = [
  { count: 8, z: -1.6, parallax: 0.4, opacity: 0.5, size: 0.5 },
  { count: 8, z: 0.0, parallax: 0.8, opacity: 0.36, size: 0.85 },
  { count: 6, z: 1.2, parallax: 1.4, opacity: 0.26, size: 1.45 },
] as const;

type Group = {
  parallax: number;
  opacity: number;
  size: number;
  count: number;
  positions: Float32Array;
  colors: Float32Array;
  base: Array<{ x: number; y: number }>;
};

// Built once at module load (client-only: this file is a dynamic ssr:false
// import). Kept out of render so the Math.random layout is stable and pure from
// React's perspective.
const GROUPS: Group[] = GROUP_DEFS.map((def) => {
  const positions = new Float32Array(def.count * 3);
  const colors = new Float32Array(def.count * 3);
  const base: Array<{ x: number; y: number }> = [];
  for (let i = 0; i < def.count; i++) {
    const x = (Math.random() * 2 - 1) * 4.6;
    const y = (Math.random() * 2 - 1) * 2.9;
    const z = def.z + (Math.random() * 2 - 1) * 0.3;
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
    base.push({ x, y });
    const c = pickColor();
    colors[i * 3] = c.r;
    colors[i * 3 + 1] = c.g;
    colors[i * 3 + 2] = c.b;
  }
  return { parallax: def.parallax, opacity: def.opacity, size: def.size, count: def.count, positions, colors, base };
});

// Radial sprite drawn once into an offscreen canvas, no texture file to fetch.
// The falloff holds until ~0.62 then tapers, so orbs read as defocused lens
// circles rather than gaussian blobs.
function makeSprite(): THREE.CanvasTexture {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const ctx = canvas.getContext("2d")!;
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.62, "rgba(255,255,255,0.92)");
  g.addColorStop(0.82, "rgba(255,255,255,0.28)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function BokehField({ pointer }: { pointer: RefObject<{ x: number; y: number }> }) {
  const sprite = useMemo(() => makeSprite(), []);
  useEffect(() => () => sprite.dispose(), [sprite]);

  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const grp = groupRef.current;
    if (!grp) return;
    // Time-based (not frame-count) so drift looks identical at 60 or 120 Hz.
    const t = state.clock.elapsedTime;
    GROUPS.forEach((g, gi) => {
      const pts = grp.children[gi] as THREE.Points | undefined;
      if (!pts) return;
      // Cursor nudges each depth group toward the pointer, damped. Camera never
      // moves; that would wobble the whole field.
      const tx = (pointer.current?.x ?? 0) * 0.35 * g.parallax;
      const ty = (pointer.current?.y ?? 0) * 0.35 * g.parallax;
      pts.position.x += (tx - pts.position.x) * 0.04;
      pts.position.y += (ty - pts.position.y) * 0.04;
      // Slow per-orb drift: a full excursion takes ~40-55s.
      const posAttr = pts.geometry.getAttribute("position") as THREE.BufferAttribute;
      const arr = posAttr.array as Float32Array;
      for (let i = 0; i < g.count; i++) {
        arr[i * 3] = g.base[i].x + Math.cos(t * 0.11 + i * 1.3) * 0.14;
        arr[i * 3 + 1] = g.base[i].y + Math.sin(t * 0.14 + i) * 0.16;
      }
      posAttr.needsUpdate = true;
    });
  });

  return (
    <group ref={groupRef}>
      {GROUPS.map((g, gi) => (
        <points key={gi} frustumCulled={false}>
          <bufferGeometry>
            <bufferAttribute attach="attributes-position" args={[g.positions, 3]} />
            <bufferAttribute attach="attributes-color" args={[g.colors, 3]} />
          </bufferGeometry>
          <pointsMaterial
            map={sprite}
            size={g.size}
            sizeAttenuation
            transparent
            depthWrite={false}
            opacity={g.opacity}
            vertexColors
            blending={THREE.NormalBlending}
          />
        </points>
      ))}
    </group>
  );
}

export default function HeroBokeh({
  sectionRef,
}: {
  sectionRef: RefObject<HTMLElement | null>;
}) {
  const pointer = useRef({ x: 0, y: 0 });
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    // Pointer is read from the hero <section> (which receives events); the
    // bokeh layer itself is pointer-events:none.
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      pointer.current.x = ((e.clientX - r.left) / r.width) * 2 - 1;
      pointer.current.y = -(((e.clientY - r.top) / r.height) * 2 - 1);
    };
    el.addEventListener("pointermove", onMove);
    // Pause the render loop entirely when the hero scrolls out of view.
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0,
    });
    io.observe(el);
    return () => {
      el.removeEventListener("pointermove", onMove);
      io.disconnect();
    };
  }, [sectionRef]);

  return (
    <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ antialias: false, alpha: true, powerPreference: "low-power" }}
        camera={{ fov: 50, position: [0, 0, 6] }}
        frameloop={visible ? "always" : "never"}
        style={{ background: "transparent" }}
      >
        <BokehField pointer={pointer} />
      </Canvas>
    </div>
  );
}
