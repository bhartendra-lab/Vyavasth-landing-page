"use client";

import { useEffect, useRef } from "react";
import type { FeatureVideo } from "@/lib/feature-pages";

/**
 * The hero recording: muted, looping, autoplay. The only client code on the
 * feature page, here so a visitor who asks for reduced motion gets the poster
 * with native controls instead (a server component cannot read that setting).
 */
export default function HeroVideo({ video }: { video: FeatureVideo }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.pause();
    el.removeAttribute("autoplay");
    el.controls = true;
  }, []);

  const type = video.src.toLowerCase().endsWith(".webm") ? "video/webm" : "video/mp4";
  return (
    <video
      ref={ref}
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      poster={video.poster}
      width={video.width}
      height={video.height}
    >
      <source src={video.src} type={type} />
    </video>
  );
}
