"use client";

import { useEffect, useRef } from "react";
import Scene from "@/components/layout/Scene";
import Group from "@/components/motion/Group";
import Poster from "@/components/motion/Poster";
import { metrics } from "@/lib/content";
import { DUR, gsap, prefersReducedMotion } from "@/lib/gsap";

/** "500M+" → { n: 500, suffix: "M+" }. */
function parse(value: string) {
  const m = value.match(/^([\d,]+)(.*)$/);
  return m ? { n: Number(m[1].replace(/,/g, "")), suffix: m[2] } : { n: 0, suffix: value };
}

/**
 * 05 — the numbers behind the work, on the mint tint. The lead figure rolls
 * up from zero at poster size (motion #8); four more follow in a row. Every
 * figure is from §3 of the brief and nothing else.
 */
export default function Record() {
  const root = useRef<HTMLDivElement>(null);
  const [lead, ...rest] = metrics;
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
          <Poster lines={["The numbers", "behind the work."]} script="verified" scriptLine={1} />
        </Group>

        <Group className="mt-12 grid items-end gap-6 md:mt-16 md:grid-cols-12">
          <p className="poster poster--xl md:col-span-8" data-reveal="fade">
            <span className="counter-value" data-n={leadN.n}>
              {leadN.n}
            </span>
            {leadN.suffix}
          </p>
          <p className="lede max-w-[22ch] text-ink-dim md:col-span-4 md:pb-[0.35em]" data-reveal="fade">
            {lead.label}, across the work we have posted for businesses, creators and brands.
          </p>
        </Group>

        <Group className="mt-10 grid grid-cols-2 gap-6 border-y border-hairline py-8 md:mt-14 md:grid-cols-4 md:gap-10" stagger={0.08}>
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
