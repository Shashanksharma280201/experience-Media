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

export { gsap, ScrollTrigger };
