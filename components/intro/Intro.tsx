"use client";

import { useEffect, useState } from "react";
import { EMBLEM_PATHS, EMBLEM_VIEWBOX } from "@/components/brand/emblem-paths";
import { site } from "@/lib/content";

/** Matches the CSS timeline in globals.css (lift ends at 2.45s). */
const DURATION_MS = 2450;
const SEEN_KEY = "em-intro-seen";

/**
 * Motion #1 — the load sequence. Server-rendered so its CSS animation begins
 * the moment the HTML paints. Plays once per session and is skippable.
 */
export default function Intro() {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const alreadySeen = root.classList.contains("intro-done");
    const prevOverflow = root.style.overflow;

    if (!alreadySeen) {
      try {
        sessionStorage.setItem(SEEN_KEY, "1");
      } catch {
        // Blocked storage: the sequence simply plays every visit.
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
    const delay = alreadySeen ? 0 : reduced ? 600 : DURATION_MS;
    timer = window.setTimeout(finish, delay);

    const events = ["pointerdown", "keydown", "wheel", "touchstart"] as const;
    events.forEach((e) =>
      window.addEventListener(e, finish, { once: true, passive: true })
    );

    return () => {
      window.clearTimeout(timer);
      events.forEach((e) => window.removeEventListener(e, finish));
      root.style.overflow = prevOverflow;
    };
  }, []);

  if (gone) return null;

  return (
    <div className="intro" role="status" aria-label={`${site.name} — loading`}>
      <div aria-hidden className="intro-glow" />

      <div className="intro-stack">
        <svg viewBox={EMBLEM_VIEWBOX} className="intro-mark" aria-hidden>
          {/* Stroke layer — draws centre outward */}
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
