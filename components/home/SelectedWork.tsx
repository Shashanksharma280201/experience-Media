"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Scene from "@/components/layout/Scene";
import Group from "@/components/motion/Group";
import Poster from "@/components/motion/Poster";
import { disciplines, totalPieces } from "@/lib/content";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/**
 * 07 — selected work, as a fold gallery (motion #10). Five panels on a strip,
 * each folded up on its top edge and laid flat as it scrolls into view.
 * Without JS or under reduced motion the panels are simply flat.
 */
export default function SelectedWork() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".fold-panel").forEach((panel) => {
        gsap.fromTo(
          panel,
          { rotateX: -64 },
          { rotateX: 0, ease: "power2.out", scrollTrigger: { trigger: panel, start: "top 95%", end: "top 45%", scrub: 0.5 } }
        );
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <Scene id="work">
      <Group>
        <Poster lines={["Five disciplines,", `${totalPieces} pieces.`]} script="see it" scriptLine={1} />
      </Group>
      <div ref={root} className="fold mt-12 md:mt-16">
        {disciplines.map((d) => (
          <Link key={d.slug} href={`/work/${d.slug}`} className="fold-panel group">
            <Image
              src={d.items[0].thumb}
              alt={`${d.title} — sample frame`}
              fill
              loading="lazy"
              sizes="(min-width: 1200px) 1120px, 100vw"
            />
            <div className="fold-caption">
              <span className="poster poster--m">{d.title}</span>
              <span className="small whitespace-nowrap">{d.items.length} pieces · {d.period}</span>
            </div>
          </Link>
        ))}
      </div>
      <p className="mt-8 text-right">
        <Link href="/work" className="link-underline small text-ink">
          See all the work
        </Link>
      </p>
    </Scene>
  );
}
