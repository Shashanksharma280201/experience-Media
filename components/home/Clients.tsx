"use client";

import { Fragment, useEffect, useRef } from "react";
import Image from "next/image";
import Scene from "@/components/layout/Scene";
import Group from "@/components/motion/Group";
import Poster from "@/components/motion/Poster";
import { brands, creatorPortraits } from "@/lib/content";
import { gsap, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";

// DRAFT COPY — flagged for review.
const CREATORS_LINE =
  "And nine creators, on their own channels, week after week.";

/**
 * 05 — who it was for. The roster is the billing block on a poster: every
 * client set in condensed caps, read as one paragraph of names rather than
 * a wall of logos, so nobody is a shape you have to squint at and nobody is
 * left out for having artwork that will not silhouette.
 *
 * Wide enough, the block reads itself: the scroll walks a beat down the
 * names and each one's logo comes up in the frame beside them, so the type
 * is the index and the logo is the evidence. Narrow, or under reduced
 * motion, the frame is simply the whole logo wall, flat black at 60% — no
 * state, nothing withheld.
 */
export default function Clients() {
  const roster = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = roster.current;
    if (!el || prefersReducedMotion()) return;

    // The travelling read needs a column beside the names to put the logo
    // in, so it is a wide-screen set piece. `matchMedia` sets it up and
    // tears it down across a resize, which a plain context cannot.
    const mm = gsap.matchMedia();
    mm.add("(min-width: 768px)", () => {
      const names = gsap.utils.toArray<HTMLElement>(".roster-name", el);
      const logos = gsap.utils.toArray<HTMLElement>(".roster-logo", el);
      if (names.length === 0) return;

      // The live layout is CSS's business; this only says it is on, so the
      // no-JS and reduced-motion rendering stays the honest default.
      el.dataset.live = "true";

      let at = -1;
      const show = (i: number) => {
        if (i === at) return;
        names[at]?.classList.remove("is-on");
        logos[at]?.classList.remove("is-on");
        names[i]?.classList.add("is-on");
        logos[i]?.classList.add("is-on");
        at = i;
      };
      show(0);

      // Pointing at a name wins over the scroll while the pointer is on the
      // block: reading ahead should not be overruled by a stray wheel tick.
      let held = false;
      const enter = (i: number) => () => {
        held = true;
        show(i);
      };
      const release = () => {
        held = false;
      };
      const bound = names.map((name, i) => {
        const on = enter(i);
        name.addEventListener("pointerenter", on);
        return () => name.removeEventListener("pointerenter", on);
      });
      el.addEventListener("pointerleave", release);

      const trigger = ScrollTrigger.create({
        trigger: el,
        start: "top 72%",
        end: "bottom 55%",
        onUpdate: (self) => {
          if (held) return;
          show(Math.min(names.length - 1, Math.floor(self.progress * names.length)));
        },
      });

      return () => {
        trigger.kill();
        bound.forEach((off) => off());
        el.removeEventListener("pointerleave", release);
        names.forEach((n) => n.classList.remove("is-on"));
        logos.forEach((l) => l.classList.remove("is-on"));
        delete el.dataset.live;
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <Scene id="clients">
      <Group>
        <Poster lines={["Who we made", "it for."]} script="so far" scriptLine={0} />
      </Group>

      <div ref={roster} className="roster mt-12 md:mt-16">
        <Group className="roster-names" stagger={0.03}>
          {brands.map((b, i) => (
            // Each name carries its own mask, so it has to be inline-block;
            // the `wbr` is then the block's only chance to wrap. The
            // separator sits outside the name so the marker rule under the
            // one being read stops at the last letter.
            <Fragment key={b.name}>
              <span className="roster-name">
                <span className="mask-line">
                  <span data-reveal="line">{b.name}</span>
                </span>
              </span>
              {i < brands.length - 1 && (
                <span aria-hidden className="roster-sep" data-reveal="fade">
                  ·
                </span>
              )}
              <wbr />
            </Fragment>
          ))}
        </Group>

        {/* Evidence, not information: every name is already above in type. */}
        <div className="roster-frame" aria-hidden>
          {brands.map((b) =>
            b.needsTransparentAsset ? (
              // Colour artwork on a solid ground silhouettes to a blank
              // shape, so this one is set rather than shown. A client is
              // never dropped from the roster for the state of its files.
              <span key={b.name} className="roster-logo roster-logo--set">
                {b.name}
              </span>
            ) : (
              <Image
                key={b.name}
                className="roster-logo"
                src={b.img}
                alt=""
                width={b.w}
                height={b.h}
                loading="lazy"
                sizes="(min-width: 768px) 28vw, 40vw"
              />
            )
          )}
        </div>
      </div>

      <Group className="mt-14 md:mt-20" stagger={0.04}>
        <p className="lede max-w-[46ch] text-ink-dim" data-reveal="fade">
          {CREATORS_LINE}
        </p>
        <ul className="faces mt-6">
          {creatorPortraits.map((src) => (
            <li key={src} className="face" data-reveal="fade">
              <Image src={src} alt="" width={520} height={520} loading="lazy" sizes="104px" />
            </li>
          ))}
        </ul>
      </Group>
    </Scene>
  );
}
