"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Scene from "@/components/layout/Scene";
import Group from "@/components/motion/Group";
import Poster from "@/components/motion/Poster";
import Magnet from "@/components/bits/Magnet";
import StickerPeel from "@/components/bits/StickerPeel";
import { brands, creators, stat, telemetry, type Brand } from "@/lib/content";
import { DUR, gsap, prefersReducedMotion } from "@/lib/gsap";

/** Logo caps by proportion: a wordmark and a square mark need different boxes. */
function cap(b: Brand): string {
  const ratio = b.w / b.h;
  if (ratio >= 3) return "h-[clamp(18px,1.6vw,24px)] w-auto";
  if (ratio >= 1.6) return "h-[clamp(28px,2.4vw,36px)] w-auto";
  return "h-[clamp(40px,3.4vw,52px)] w-auto";
}

/**
 * The hand: each sticker's angle and a drift rate, in a fixed order so the
 * board is the same on every visit. Faces are interleaved among the logos.
 */
const HAND = [-5, 3, -2, 6, -4, 2, 5, -3, 1, -6, 4, -1, 3, -5, 2, -3, 6, -2, 4, -4, 1, -6, 5, -1];
/** Slight size variation, so the stickers were not cut from one template. */
const SIZE = [1, 0.92, 1.08, 0.96, 1.04, 0.9, 1.1, 1, 0.94, 1.06, 0.98, 1.02, 0.92, 1.08, 1, 0.96, 1.04, 0.9, 1.06, 0.98, 1.02, 0.94, 1.1, 1];
const DRIFT = [-18, 12, -8, 22, -14, 6, 16, -10, 4, -20, 14, -6, 10, -16, 8, -12, 20, -4, 12, -14, 6, -18, 16, -8];

/** "300M+" → { n: 300, suffix: "M+" }. */
function parse(value: string) {
  const m = value.match(/^(\d+)(.*)$/);
  return m ? { n: Number(m[1]), suffix: m[2] } : { n: 0, suffix: value };
}

/**
 * 04 — the record, on the mint tint. One number leads at poster size and
 * rolls up from zero (motion #8); three more follow in a row; then the
 * sticker board: brands and creators as die-cut paper stickers, hand-placed.
 */
export default function Record() {
  const root = useRef<HTMLDivElement>(null);
  const [lead, ...rest] = telemetry;
  const leadN = parse(lead.value);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      // Motion #11 — the stickers slap onto the board one after another,
      // overshooting a little, then the inline transform is cleared so the
      // CSS angle and the hover straighten take over.
      const board = el.querySelector<HTMLElement>(".board");
      if (board) {
        const stickers = gsap.utils.toArray<HTMLElement>(".sticker", board);
        gsap.fromTo(
          stickers,
          { scale: 1.35, opacity: 0, rotation: (i) => HAND[i % HAND.length] + 14 },
          {
            scale: 1,
            opacity: 1,
            rotation: (i) => HAND[i % HAND.length],
            duration: 0.7,
            ease: "back.out(1.7)",
            stagger: 0.07,
            clearProps: "transform",
            scrollTrigger: { trigger: board, start: "top 80%", once: true },
          }
        );
        gsap.utils.toArray<HTMLElement>(".slot", board).forEach((slot, i) => {
          gsap.fromTo(
            slot,
            { y: -DRIFT[i % DRIFT.length] },
            { y: DRIFT[i % DRIFT.length], ease: "none", scrollTrigger: { trigger: board, start: "top bottom", end: "bottom top", scrub: 0.8 } }
          );
        });
      }

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

  const usable = brands.filter((b) => !b.needsTransparentAsset);
  // Interleave by hand: an uneven run of brands between faces, so no column
  // ends up "the face column".
  type Item = { kind: "brand"; key: string; brand: Brand } | { kind: "face"; key: string; src: string; n: number };
  const RUNS = [1, 3, 2, 1, 2, 3, 1, 2, 2];
  const board: Item[] = [];
  let bi = 0;
  let fi = 0;
  let r = 0;
  while (bi < usable.length || fi < creators.length) {
    for (let k = 0; k < RUNS[r % RUNS.length] && bi < usable.length; k++, bi++) board.push({ kind: "brand", key: usable[bi].name, brand: usable[bi] });
    if (fi < creators.length) {
      board.push({ kind: "face", key: creators[fi], src: creators[fi], n: fi + 1 });
      fi++;
    }
    r++;
  }

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

        {/* The board: brands and creators as stickers, mixed by hand. */}
        <Group className="mt-14 md:mt-20">
          <p className="lede text-ink-dim" data-reveal="fade">
            Brands and creators we have worked with
          </p>
          <ul className="board mt-6">
            {board.map((item, i) => (
              <li key={item.key} className="slot">
                {item.kind === "brand" ? (
                  <Magnet padding={30} magnetStrength={5}>
                    <span className="sticker" style={{ "--r": `${HAND[i % HAND.length]}deg`, "--s": SIZE[i % SIZE.length] } as React.CSSProperties} title={item.brand.name}>
                      <Image
                        src={item.brand.img}
                        alt={item.brand.name}
                        width={item.brand.w}
                        height={item.brand.h}
                        loading="lazy"
                        sizes="200px"
                        className={`${cap(item.brand)} object-contain brightness-0`}
                      />
                    </span>
                  </Magnet>
                ) : (
                  /* React Bits StickerPeel: a photo sticker that peels at a corner and can be dragged. */
                  <span className="sticker-peel-slot" style={{ "--r": `${HAND[i % HAND.length]}deg` } as React.CSSProperties}>
                    <StickerPeel imageSrc={item.src.replace("/creators/", "/creators/round/")} rotate={HAND[i % HAND.length]} width={84} peelBackHoverPct={22} peelBackActivePct={36} shadowIntensity={0.35} lightingIntensity={0.05} initialPosition="center" />
                  </span>
                )}
              </li>
            ))}
          </ul>
        </Group>
      </div>
    </Scene>
  );
}
