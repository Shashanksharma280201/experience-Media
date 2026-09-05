"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { EASE, gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";

/**
 * Motion #15 — the veil dissolves off the incoming page on route change, on
 * the same ease as everything else, then scroll and scroll-triggers reset.
 */
const DISSOLVE_S = 0.45;

export default function Transition() {
  const veil = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }

    window.scrollTo(0, 0);
    // Route content changed under the triggers; re-measure everything.
    ScrollTrigger.refresh();

    const node = veil.current;
    if (!node || prefersReducedMotion()) return;

    const tween = gsap.fromTo(
      node,
      { opacity: 1 },
      { opacity: 0, duration: DISSOLVE_S, ease: EASE.out, overwrite: true }
    );
    return () => {
      tween.kill();
    };
  }, [pathname]);

  return (
    <div
      ref={veil}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[70] bg-paper opacity-0"
    />
  );
}
