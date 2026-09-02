"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/** Hold black for two frames at 24fps. */
const HOLD_MS = 80;

/**
 * "The cut" — route changes hard-cut through black rather than crossfading.
 * A film cut, not a dissolve.
 */
export default function Transition() {
  const el = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const first = useRef(true);

  useEffect(() => {
    // Don't cut on first paint — there's nothing to cut from.
    if (first.current) {
      first.current = false;
      return;
    }
    const node = el.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    node.style.opacity = "1";
    const t = window.setTimeout(() => {
      node.style.opacity = "0";
    }, HOLD_MS);
    return () => window.clearTimeout(t);
  }, [pathname]);

  return (
    <div
      ref={el}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[70] bg-black opacity-0"
      style={{ transition: "opacity 60ms linear" }}
    />
  );
}
