"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Scene from "@/components/layout/Scene";
import Group from "@/components/motion/Group";
import Poster from "@/components/motion/Poster";
import { disciplines, site } from "@/lib/content";
import { gsap, prefersReducedMotion, whenIntroDone } from "@/lib/gsap";
import { openReel } from "@/lib/reel";

/** The 5×5 wall minus the 3×3 centre: sixteen frames, mixed across disciplines. */
const FRAMES = Array.from({ length: 4 }, (_, k) =>
  disciplines.map((d) => ({ ...d.items[k % d.items.length], title: d.title }))
)
  .flat()
  .slice(0, 16);

/** Grid coordinates for the sixteen edge cells, row-major, centre excluded. */
const CELLS = [
  [-2, -2], [-1, -2], [0, -2], [1, -2], [2, -2],
  [-2, -1], [2, -1],
  [-2, 0], [2, 0],
  [-2, 1], [2, 1],
  [-2, 2], [-1, 2], [0, 2], [1, 2], [2, 2],
];

/**
 * 02 — the reel, as a mirror wall. Sixteen frames recede around the loop at
 * the centre; the wall turns a few degrees with the scroll (motion #18).
 */
export default function Reel() {
  const root = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const v = video.current;
    let io: IntersectionObserver | undefined;
    const stop = whenIntroDone(() => {
      if (!v) return;
      v.preload = "auto";
      io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), {
        threshold: 0.2,
      });
      io.observe(v);
    });

    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".wall-grid",
        { rotateY: -6, rotateX: 4 },
        { rotateY: 6, rotateX: -4, ease: "none", scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 0.8 } }
      );
    }, el);
    return () => {
      stop();
      io?.disconnect();
      ctx.revert();
    };
  }, []);

  return (
    <Scene>
      <Group>
        <Poster lines={["Thirty-five pieces,", "one reel."]} script="watch" scriptLine={1} />
      </Group>
      <div ref={root} className="wall mt-10 md:mt-14">
        <Group className="wall-grid" stagger={0.04}>
          {(() => {
            const cells: React.ReactNode[] = [];
            let f = 0;
            for (let row = -2; row <= 2; row++) {
              for (let col = -2; col <= 2; col++) {
                if (row === -1 && col === -1) {
                  cells.push(
                    <div key="centre" className="wall-cell wall-centre" data-reveal="fade">
                      <video ref={video} src={site.showreel} poster={site.showreelPoster} muted loop playsInline preload="none" />
                      <button type="button" onClick={openReel} className="wall-centre-cta link-underline small">
                        Watch the full reel
                      </button>
                    </div>
                  );
                  continue;
                }
                if (Math.abs(row) <= 1 && Math.abs(col) <= 1) continue;
                const frame = FRAMES[f++];
                const wide = Math.abs(col) === 2 || row === -2 || row === 2;
                cells.push(
                  <div
                    key={`${row}-${col}`}
                    className={`wall-cell ${wide && Math.abs(col) === 2 ? "wall-cell--wide" : ""}`}
                    style={{ "--cx": col, "--cy": row } as React.CSSProperties}
                    data-reveal="fade"
                  >
                    <Image src={frame.thumb} alt="" fill loading="lazy" sizes="20vw" className="object-cover" />
                  </div>
                );
              }
            }
            void CELLS;
            return cells;
          })()}
        </Group>
      </div>
    </Scene>
  );
}
