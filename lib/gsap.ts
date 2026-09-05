"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/** Motion tokens from DESIGN.md §4, in seconds for GSAP. */
export const DUR = {
  quick: 0.24,
  base: 0.6,
  slow: 1.0,
  reveal: 1.2,
} as const;

export const EASE = {
  out: "expo.out",
  inOut: "power4.inOut",
} as const;

/**
 * True when the visitor has asked for less motion. Callers must still render
 * content — reduced motion means it arrives, not that it is withheld.
 */
export function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

/**
 * Runs `cb` once the load sequence has handed off (or immediately if it
 * already has, or if motion is reduced). Returns a cleanup that cancels the
 * wait and reverts whatever `cb` returned.
 */
export function whenIntroDone(cb: () => gsap.Context | void): () => void {
  const root = document.documentElement;
  let ctx: gsap.Context | void;

  if (root.classList.contains("intro-done") || prefersReducedMotion()) {
    ctx = cb();
    return () => ctx?.revert();
  }

  const obs = new MutationObserver(() => {
    if (root.classList.contains("intro-done")) {
      obs.disconnect();
      ctx = cb();
    }
  });
  obs.observe(root, { attributes: true, attributeFilter: ["class"] });
  return () => {
    obs.disconnect();
    ctx?.revert();
  };
}

export { gsap, ScrollTrigger };
