"use client";

/**
 * React Bits — ImageTrail, in its first variant, rebuilt small on GSAP: as
 * the pointer moves, every `threshold` px the next image pops in under it,
 * lands with a little overshoot, and falls away. Off on touch and under
 * reduced motion.
 */
import { useEffect, useRef } from "react";
import { gsap } from "gsap";

interface ImageTrailProps {
  items: string[];
  threshold?: number;
  size?: number;
  className?: string;
}

export default function ImageTrail({ items, threshold = 90, size = 200, className = "" }: ImageTrailProps) {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || !items.length) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (window.matchMedia("(pointer: coarse)").matches) return;

    const imgs = Array.from(el.querySelectorAll<HTMLElement>(".trail-img"));
    let last = { x: 0, y: 0 };
    let started = false;
    let i = 0;
    let z = 1;

    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      if (!started) {
        last = { x, y };
        started = true;
        return;
      }
      if (Math.hypot(x - last.x, y - last.y) < threshold) return;
      last = { x, y };
      const img = imgs[i % imgs.length];
      i++;
      gsap.killTweensOf(img);
      gsap
        .timeline()
        .set(img, { x, y, xPercent: -50, yPercent: -50, zIndex: z++, rotation: gsap.utils.random(-14, 14), opacity: 1, scale: 0.3 })
        .to(img, { scale: 1, duration: 0.5, ease: "back.out(1.8)" })
        .to(img, { y: y + 90, scale: 0.6, opacity: 0, duration: 0.7, ease: "power2.in" }, 0.55);
    };
    // The layer itself ignores the pointer, so listen on what contains it.
    const host = el.parentElement ?? el;
    host.addEventListener("pointermove", onMove);
    return () => {
      host.removeEventListener("pointermove", onMove);
      imgs.forEach((img) => gsap.killTweensOf(img));
    };
  }, [items, threshold]);

  return (
    <div ref={root} className={`trail absolute inset-0 overflow-hidden ${className}`} aria-hidden>
      {items.map((src, k) => (
        <div key={`${src}-${k}`} className="trail-img" style={{ width: size, backgroundImage: `url(${src})` }} />
      ))}
    </div>
  );
}
