"use client";

import { useEffect, useRef, useState } from "react";
import { EMBLEM_PATHS, EMBLEM_VIEWBOX } from "@/components/brand/emblem-paths";
import { site } from "@/lib/content";
import { gsap } from "@/lib/gsap";

/**
 * Mirrors the CSS timeline in globals.css — change both together.
 * The panel starts wiping at LIFT_AT; the mark flies to the nav over FLY_MS.
 */
const LIFT_AT = 2500;
const FLY_MS = 900;
const HANDOFF_IN = 300;
const REDUCED_HOLD = 2000;

const WORD = "Experience";
const SCRIPT = "Media";

/**
 * Motion #1 — the poster loader. The emblem draws itself stroke-first, core
 * to wingtips, and fills; the wordmark sets itself in condensed caps, letter
 * by letter; the script writes itself in red across it. It holds for at
 * least two seconds. Then the letters lift, the panel wipes up, and the mark
 * flies to its place in the nav, so the logo you watched draw is the logo
 * in the corner. Escape skips on the same choreography.
 */
export default function Intro() {
  const [gone, setGone] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const mark = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("intro-lock");

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const started = performance.now();
    const timers: number[] = [];
    let leaving = false;
    let flight: gsap.core.Tween | undefined;

    const handoff = () => {
      root.classList.remove("intro-lock");
      root.classList.add("intro-done");
    };

    // The mark's flight: from where it sits to where the nav's mark sits.
    const fly = (ms: number) => {
      const m = mark.current;
      const target = document.querySelector<HTMLElement>(".nav-mark");
      if (!m || !target) return;
      const from = m.getBoundingClientRect();
      const to = target.getBoundingClientRect();
      root.classList.add("mark-flying");
      gsap.set(m, { left: from.left, top: from.top, width: from.width, height: from.height, xPercent: 0, yPercent: 0, x: 0, y: 0 });
      flight = gsap.to(m, {
        left: to.left,
        top: to.top,
        width: to.width,
        height: to.height,
        duration: ms / 1000,
        ease: "expo.inOut",
        onComplete: () => root.classList.remove("mark-flying"),
      });
    };

    const leave = (liftAt: number, flyMs = FLY_MS) => {
      leaving = true;
      timers.forEach((t) => window.clearTimeout(t));
      timers.length = 0;
      if (reduced) {
        timers.push(window.setTimeout(handoff, liftAt));
        timers.push(window.setTimeout(() => setGone(true), liftAt + 50));
        return;
      }
      timers.push(window.setTimeout(() => fly(flyMs), liftAt));
      timers.push(window.setTimeout(handoff, liftAt + HANDOFF_IN));
      // Removal follows the panel's own animation (below); this is a fallback.
      timers.push(window.setTimeout(() => setGone(true), liftAt + flyMs + 1500));
    };

    const el = panel.current;
    const onEnd = (e: AnimationEvent) => {
      if (e.target === el && /^intro-lift/.test(e.animationName)) setGone(true);
    };
    el?.addEventListener("animationend", onEnd);

    leave(LIFT_AT);

    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      const elapsed = performance.now() - started;
      if (leaving && elapsed >= (reduced ? REDUCED_HOLD : LIFT_AT)) return;
      panel.current?.classList.add("intro--skip");
      mark.current?.classList.add("intro-mark--skip");
      leave(200, 600);
    };
    window.addEventListener("keydown", onKey);

    return () => {
      timers.forEach((t) => window.clearTimeout(t));
      window.removeEventListener("keydown", onKey);
      el?.removeEventListener("animationend", onEnd);
      flight?.kill();
      root.classList.remove("intro-lock", "mark-flying");
    };
  }, []);

  if (gone) return null;

  return (
    <>
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

      {/* The mark lives outside the panel, so it can stay while the panel goes. */}
      <svg ref={mark} viewBox={EMBLEM_VIEWBOX} className="intro-mark" aria-hidden>
        <g fillRule="evenodd">
          {EMBLEM_PATHS.map((p) => (
            <path key={p.id} className="draw" data-p={p.id} d={p.d} pathLength={1} />
          ))}
        </g>
        <g className="solid" fillRule="evenodd">
          {EMBLEM_PATHS.map((p) => (
            <path key={p.id} d={p.d} />
          ))}
        </g>
      </svg>
    </>
  );
}
