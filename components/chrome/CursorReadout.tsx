"use client";

import { useEffect, useRef } from "react";

/**
 * A mono label that tracks the pointer over media. Elements opt in with
 * `data-cursor="PLAY ▸ 16:9"`. Fine pointers only — the same coarse-pointer
 * check the WebGL tier detection uses.
 */
export default function CursorReadout() {
  const el = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduced) return;

    const node = el.current;
    if (!node) return;

    let raf = 0;
    let x = 0;
    let y = 0;
    let label: string | null = null;

    const paint = () => {
      raf = 0;
      node.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      if (label) {
        node.textContent = label;
        node.style.opacity = "1";
      } else {
        node.style.opacity = "0";
      }
    };

    const onMove = (e: PointerEvent) => {
      x = e.clientX + 16;
      y = e.clientY + 16;
      const target = (e.target as Element | null)?.closest?.("[data-cursor]");
      label = target?.getAttribute("data-cursor") ?? null;
      if (!raf) raf = requestAnimationFrame(paint);
    };

    const onLeave = () => {
      label = null;
      if (!raf) raf = requestAnimationFrame(paint);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={el}
      aria-hidden
      className="eyebrow pointer-events-none fixed left-0 top-0 z-[65] bg-accent px-2 py-1 text-[0.6rem] text-void opacity-0"
      style={{ transition: "opacity 150ms ease" }}
    />
  );
}
