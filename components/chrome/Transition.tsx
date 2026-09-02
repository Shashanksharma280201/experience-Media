"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/** Motion #15 — a 320ms cross-dissolve on route change, then scroll resets. */
const DISSOLVE_MS = 320;

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

    const node = veil.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // The incoming page is already painted; dissolve the veil off it.
    node.style.transition = "none";
    node.style.opacity = "1";
    // Force a reflow so the transition actually runs from opacity 1.
    void node.offsetHeight;
    node.style.transition = `opacity ${DISSOLVE_MS}ms linear`;
    node.style.opacity = "0";
  }, [pathname]);

  return (
    <div
      ref={veil}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-[70] bg-void opacity-0"
    />
  );
}
