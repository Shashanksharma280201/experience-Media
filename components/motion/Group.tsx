"use client";

import { useEffect, useRef } from "react";
import { DUR, EASE, gsap, prefersReducedMotion, whenIntroDone } from "@/lib/gsap";

/**
 * Reveals its descendants marked with `data-reveal`, in DOM order, staggered.
 * Server components can use it: they mark elements, this does the motion.
 *
 *   line  — rises out of a `.mask-line` (see `Line`)
 *   rule  — a hairline draws left to right
 *   fade  — settles in with a 12px lift, as the hero lede does
 *   frame — an image scales 1.08 → 1 inside its clipped parent
 *   script — the red script word writes itself in, left to right
 *
 * `onLoad` plays after the load sequence instead of on scroll-enter, for
 * page headers that sit in the first viewport. Under reduced motion nothing
 * moves and everything is simply there.
 */
export default function Group({
  as: Tag = "div",
  className,
  children,
  onLoad = false,
  stagger = 0.08,
  start = "top 85%",
}: {
  as?: "div" | "section" | "header" | "footer" | "ul" | "nav";
  className?: string;
  children: React.ReactNode;
  onLoad?: boolean;
  stagger?: number;
  start?: string;
}) {
  const root = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;

    const build = () =>
      gsap.context(() => {
        const tl = gsap.timeline({
          defaults: { ease: EASE.out },
          scrollTrigger: onLoad ? undefined : { trigger: el, start, once: true },
        });
        const items = Array.from(el.querySelectorAll<HTMLElement>("[data-reveal]"));
        items.forEach((item, i) => {
          const at = i * stagger;
          switch (item.dataset.reveal) {
            case "line":
              tl.from(item, { yPercent: 110, duration: DUR.reveal }, at);
              break;
            case "rule":
              tl.from(
                item,
                { scaleX: 0, transformOrigin: "left center", duration: DUR.base },
                at
              );
              break;
            case "frame":
              tl.from(item, { scale: 1.08, duration: DUR.reveal * 1.2 }, at);
              break;
            case "script":
              tl.fromTo(
                item,
                { clipPath: "inset(-30% 100% -30% -10%)" },
                { clipPath: "inset(-30% -10% -30% -10%)", duration: DUR.slow, ease: "power2.inOut" },
                at + 0.25
              );
              break;
            default:
              tl.from(item, { opacity: 0, y: 12, duration: DUR.slow }, at);
          }
        });
      }, el);

    if (onLoad) return whenIntroDone(build);
    const ctx = build();
    return () => ctx.revert();
  }, [onLoad, stagger, start]);

  // The ref type is the union's supertype; each tag narrows it at runtime.
  const Any = Tag as "div";
  return (
    <Any ref={root as React.RefObject<HTMLDivElement>} className={className}>
      {children}
    </Any>
  );
}
