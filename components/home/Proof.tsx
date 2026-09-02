"use client";

import { useEffect, useRef } from "react";
import { stat, telemetry } from "@/lib/content";
import Timecode from "@/components/chrome/Timecode";

const formatIN = (n: number) => n.toLocaleString("en-IN");

export default function Proof({ index, total }: { index: number; total: number }) {
  const ref = useRef<HTMLElement>(null);
  const out = useRef<HTMLSpanElement>(null);

  // The figure is written straight to the DOM: no re-render per frame, and the
  // server-rendered markup already carries the final value for no-JS and
  // reduced-motion visitors.
  useEffect(() => {
    const section = ref.current;
    const node = out.current;
    if (!section || !node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    node.textContent = formatIN(0);
    let done = false;

    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting || done) continue;
          done = true;
          const duration = 2000;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            node.textContent = formatIN(
              Math.round(stat.value * (1 - Math.pow(1 - p, 3)))
            );
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.4 }
    );
    obs.observe(section);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="proof"
      ref={ref}
      className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 md:py-28"
    >
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-rule pb-6">
        <h2 className="display text-[clamp(2rem,5vw,4rem)]">Proof</h2>
        <Timecode index={index} total={total} label="Proof" />
      </div>

      <p className="display mt-12 text-[clamp(3rem,15vw,14rem)] tabular-nums leading-none">
        <span ref={out}>{formatIN(stat.value)}</span>
        <span className="text-accent">+</span>
      </p>
      <p className="mt-4 text-base text-paper/60 md:text-lg">{stat.label}</p>

      {/* Ledger — derived readouts, hairline grid */}
      <dl className="mt-16 grid gap-px border border-rule bg-rule sm:grid-cols-2 lg:grid-cols-4">
        {telemetry.map((t) => (
          <div key={t.label} className="bg-void p-8">
            <dt className="eyebrow text-paper/45">{t.label}</dt>
            <dd className="display mt-4 text-[clamp(2rem,4vw,3.2rem)] tabular-nums text-accent">
              {t.value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
