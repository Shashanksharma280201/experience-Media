"use client";

import { useEffect, useState } from "react";
import { EMBLEM_PATHS, EMBLEM_VIEWBOX } from "@/components/brand/emblem-paths";
import { site } from "@/lib/content";

/** Matches the CSS timeline in globals.css (exit ends at 2.40s). */
const DURATION_MS = 2450;
const SEEN_KEY = "em-intro-seen";

/**
 * The loading screen. Server-rendered so its CSS animation begins the moment
 * the HTML paints — it never waits for hydration. Plays once per session.
 */
export default function Intro() {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    // The inline head script already hid it if it played earlier this session.
    const alreadySeen = root.classList.contains("intro-done");

    const prevOverflow = root.style.overflow;

    if (!alreadySeen) {
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        // Private mode or blocked storage: the intro simply plays every time.
      }
      root.style.overflow = "hidden";
    }

    let timer = 0;
    const finish = () => {
      window.clearTimeout(timer);
      root.classList.add("intro-done");
      root.style.overflow = prevOverflow;
      setGone(true);
    };

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Already seen → unmount on the next tick; the CSS has hidden it already.
    const delay = alreadySeen ? 0 : reduced ? 800 : DURATION_MS;
    timer = window.setTimeout(finish, delay);

    // Any deliberate input cuts it short.
    const events = ["pointerdown", "keydown", "wheel", "touchstart"] as const;
    events.forEach((e) => window.addEventListener(e, finish, { once: true, passive: true }));

    return () => {
      window.clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, finish));
      root.style.overflow = prevOverflow;
    };
  }, []);

  if (gone) return null;

  return (
    <div className="intro" role="status" aria-label={`${site.name} — loading`}>
      <div aria-hidden className="intro-aurora" />

      <div className="intro-stack">
        <svg viewBox={EMBLEM_VIEWBOX} className="intro-mark" aria-hidden>
          <defs>
            <linearGradient id="intro-ramp" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--color-violet)" />
              <stop offset="55%" stopColor="var(--color-fuchsia)" />
              <stop offset="100%" stopColor="var(--color-accent)" />
            </linearGradient>
          </defs>

          {/* Stroke layer — draws itself, centre outward */}
          <g fillRule="evenodd">
            {EMBLEM_PATHS.map((p) => (
              <path key={p.id} className="draw" data-p={p.id} d={p.d} pathLength={1} />
            ))}
          </g>

          {/* Fill layer — takes over once the draw completes */}
          <g className="solid" fillRule="evenodd">
            {EMBLEM_PATHS.map((p) => (
              <path key={p.id} d={p.d} />
            ))}
          </g>
        </svg>

        <div className="intro-word">
          <span>{site.name}</span>
        </div>
      </div>
    </div>
  );
}
