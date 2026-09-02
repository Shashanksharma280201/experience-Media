"use client";

import { useRef } from "react";
import { runtimeTimecode } from "@/lib/timecode";
import { useScrollEffect } from "@/hooks/useScrollProgress";

const TICKS = 7;

/** The page as a reel: a timeline, a playhead, and a live timecode. */
export default function Scrubber() {
  const playhead = useRef<HTMLSpanElement>(null);
  const readout = useRef<HTMLSpanElement>(null);

  useScrollEffect(({ page }) => {
    if (playhead.current) {
      playhead.current.style.transform = `scaleX(${page})`;
    }
    if (readout.current) {
      readout.current.textContent = runtimeTimecode(page);
    }
  });

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex items-center gap-4 px-5 pb-3 text-paper md:px-10"
    >
      <span className="eyebrow hidden text-[0.6rem] opacity-45 sm:block">Reel</span>

      <div className="relative h-3 flex-1">
        {/* Track */}
        <span className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-current opacity-20" />

        {/* Section ticks */}
        {Array.from({ length: TICKS }, (_, i) => (
          <span
            key={i}
            className="absolute top-0 h-2 w-px bg-current opacity-25"
            style={{ left: `${(i / (TICKS - 1)) * 100}%` }}
          />
        ))}

        {/* Playhead */}
        <span
          ref={playhead}
          className="absolute inset-x-0 top-1/2 h-px origin-left -translate-y-1/2 bg-accent"
          style={{ transform: "scaleX(0)" }}
        />
      </div>

      <span
        ref={readout}
        className="eyebrow text-[0.6rem] tabular-nums opacity-55"
      >
        00:00:00:00
      </span>
    </div>
  );
}
