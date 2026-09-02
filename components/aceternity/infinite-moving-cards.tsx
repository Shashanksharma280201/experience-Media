"use client";
// Adapted from Aceternity UI — Infinite Moving Cards
// https://ui.aceternity.com/components/infinite-moving-cards

import { cn } from "@/lib/utils";
import React, { useEffect, useRef } from "react";

const DURATION = { fast: "30s", normal: "55s", slow: "90s" } as const;

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "slow",
  pauseOnHover = true,
  className,
}: {
  items: React.ReactNode[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const scroller = scrollerRef.current;
    if (!container || !scroller) return;

    container.style.setProperty(
      "--animation-direction",
      direction === "left" ? "forwards" : "reverse"
    );
    container.style.setProperty("--animation-duration", DURATION[speed]);

    // Duplicate once so the track can loop seamlessly.
    if (scroller.dataset.duplicated !== "true") {
      for (const item of Array.from(scroller.children)) {
        scroller.appendChild(item.cloneNode(true));
      }
      scroller.dataset.duplicated = "true";
    }

    scroller.classList.add("animate-infinite-scroll");
  }, [direction, speed]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_12%,white_88%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-5",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {items.map((item, idx) => (
          <li key={idx} className="shrink-0">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};
