"use client";

import { useEffect, useRef, useState } from "react";
import { site } from "@/lib/content";

/**
 * Mirrors the CSS timeline in globals.css — change both together.
 * The panel starts wiping at LIFT_AT and has cleared by LIFT_AT + LIFT_MS.
 */
const LIFT_AT = 2500;
const LIFT_MS = 900;
const HANDOFF_IN = 300;
const REDUCED_HOLD = 2000;

const WORD = "Experience";
const SCRIPT = "Media";

/**
 * Motion #1 — the poster loader. The wordmark sets itself in condensed caps,
 * letter by letter; the script writes itself in red across it; it holds for
 * at least two seconds; then everything lifts and the panel wipes away.
 * Escape skips on the same choreography.
 */
export default function Intro() {
  const [gone, setGone] = useState(false);
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("intro-lock");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const started = performance.now();
    const timers: number[] = [];
    let leaving = false;

    const handoff = () => {
      root.classList.remove("intro-lock");
      root.classList.add("intro-done");
    };

    const leave = (liftAt: number) => {
      leaving = true;
      timers.forEach((t) => window.clearTimeout(t));
      timers.length = 0;
      if (reduced) {
        timers.push(window.setTimeout(handoff, liftAt));
        timers.push(window.setTimeout(() => setGone(true), liftAt + 50));
        return;
      }
      timers.push(window.setTimeout(handoff, liftAt + HANDOFF_IN));
      // Removal follows the animation itself (below); this is a fallback.
      timers.push(window.setTimeout(() => setGone(true), liftAt + LIFT_MS + 1500));
    };

    const el = panel.current;
    const onEnd = (e: AnimationEvent) => {
      if (e.target === el && /^intro-lift/.test(e.animationName)) setGone(true);
    };
    el?.addEventListener("animationend", onEnd);

    leave(reduced ? REDUCED_HOLD : LIFT_AT);

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const elapsed = performance.now() - started;
      if (leaving && elapsed >= (reduced ? REDUCED_HOLD : LIFT_AT)) return;
      panel.current?.classList.add("intro--skip");
      leave(200);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      window.removeEventListener("keydown", onKey);
      el?.removeEventListener("animationend", onEnd);
      root.classList.remove("intro-lock");
    };
  }, []);

  if (gone) return null;

  return (
    <div ref={panel} className="intro" role="status" aria-label={`${site.name} — loading`}>
      <div className="intro-stack">
        <div className="intro-word" aria-hidden>
          {WORD.split("").map((ch, i) => (
            <span key={i} style={{ "--i": i } as React.CSSProperties}>
              {ch}
            </span>
          ))}
        </div>
        <span className="intro-script" aria-hidden>
          {SCRIPT}
        </span>
      </div>
    </div>
  );
}
