"use client";

import { useEffect, useRef, useState } from "react";
import { stat } from "@/lib/content";

function formatIN(n: number) {
  return n.toLocaleString("en-IN");
}

export default function StatCounter() {
  const ref = useRef<HTMLDivElement>(null);
  const [val, setVal] = useState(0);
  const done = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setVal(stat.value);
      return;
    }

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting && !done.current) {
            done.current = true;
            const duration = 2000;
            const start = performance.now();
            const tick = (now: number) => {
              const p = Math.min((now - start) / duration, 1);
              const eased = 1 - Math.pow(1 - p, 3);
              setVal(Math.round(stat.value * eased));
              if (p < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section ref={ref} className="border-y border-line bg-paper-dim">
      <div className="mx-auto max-w-[1600px] px-5 py-24 text-center md:px-10 md:py-36">
        <p className="eyebrow text-accent">Impact</p>
        <p className="display mt-6 text-[clamp(3.5rem,16vw,15rem)] tabular-nums leading-none">
          {formatIN(val)}
          <span className="text-accent">+</span>
        </p>
        <p className="mt-6 text-base text-ink-soft md:text-lg">{stat.label}</p>
      </div>
    </section>
  );
}
