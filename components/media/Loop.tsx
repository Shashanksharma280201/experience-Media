"use client";

import { useEffect, useRef } from "react";
import type { Clip } from "@/lib/content";
import { prefersReducedMotion } from "@/lib/gsap";

/**
 * A silent loop that only spends decode while on screen and never plays
 * under reduced motion, where the poster is the frame. Decorative: it
 * carries no information the copy beside it does not.
 */
export default function Loop({ clip, className = "", label }: { clip: Clip; className?: string; label: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v || prefersReducedMotion()) return;
    v.preload = "auto";
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.2 });
    io.observe(v);
    return () => io.disconnect();
  }, []);

  return (
    <figure className={`loop ${className}`}>
      <video ref={ref} src={clip.src} poster={clip.poster} muted loop playsInline preload="none" aria-hidden />
      <figcaption className="sr-only">{label}</figcaption>
    </figure>
  );
}
