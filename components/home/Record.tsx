"use client";

import { useEffect, useRef } from "react";
import Scene from "@/components/layout/Scene";
import Group from "@/components/motion/Group";
import Poster from "@/components/motion/Poster";
import { stat, telemetry } from "@/lib/content";
import { DUR, gsap, prefersReducedMotion } from "@/lib/gsap";

/** "300M+" → { n: 300, suffix: "M+" }. */
function parse(value: string) {
  const m = value.match(/^(\d+)(.*)$/);
  return m ? { n: Number(m[1]), suffix: m[2] } : { n: 0, suffix: value };
}

/**
 * 04 — the record, on the mint tint. One number leads at poster size and
 * rolls up from zero (motion #8); three more follow in a row. Who the
 * numbers were for is the next scene's job.
 */
export default function Record() {
  const root = useRef<HTMLDivElement>(null);
  const [lead, ...rest] = telemetry;
  const leadN = parse(lead.value);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".counter-value").forEach((node) => {
        const target = Number(node.dataset.n);
        const state = { v: 0 };
        gsap.to(state, {
          v: target,
          duration: DUR.reveal * 1.4,
          ease: "expo.out",
          snap: { v: 1 },
          onUpdate: () => {
            node.textContent = String(Math.round(state.v));
          },
          scrollTrigger: { trigger: node, start: "top 85%", once: true },
        });
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <Scene tone="mint">
      <div ref={root}>
        <Group>
          <Poster lines={["Numbers we'll", "put our name to."]} script="proof" scriptLine={0} />
        </Group>

        {/* The lead figure. */}
        <Group className="mt-12 grid items-end gap-6 md:mt-16 md:grid-cols-12">
          <p className="poster poster--xl md:col-span-8" data-reveal="fade">
            <span className="counter-value" data-n={leadN.n}>
              {leadN.n}
            </span>
            {leadN.suffix}
          </p>
          <p className="lede max-w-[22ch] text-ink-dim md:col-span-4 md:pb-[0.35em]" data-reveal="fade">
            {stat.label.charAt(0).toUpperCase() + stat.label.slice(1)}, across the work we
            posted for brands and creators.
          </p>
        </Group>

        {/* Three more. */}
        <Group className="mt-10 grid grid-cols-3 gap-6 border-y border-hairline py-8 md:mt-14 md:gap-10" stagger={0.08}>
          {rest.map((t) => {
            const { n, suffix } = parse(t.value);
            return (
              <div key={t.label} data-reveal="fade">
                <p className="poster poster--m">
                  <span className="counter-value" data-n={n}>
                    {n}
                  </span>
                  {suffix}
                </p>
                <p className="small mt-2 text-ink-dim">{t.label}</p>
              </div>
            );
          })}
        </Group>
      </div>
    </Scene>
  );
}
