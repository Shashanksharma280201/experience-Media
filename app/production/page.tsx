import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Scene from "@/components/layout/Scene";
import Group from "@/components/motion/Group";
import Line from "@/components/motion/Line";
import Poster from "@/components/motion/Poster";
import Magnet from "@/components/bits/Magnet";
import { disciplines, production } from "@/lib/content";

export const metadata: Metadata = {
  title: "Production",
  description: production.body,
};

/** A frame for the page, from the long-form work. */
const FRAME = disciplines[1].items[0].thumb;

/**
 * §8 of the brief — production, wherever the story needs to happen. No
 * studio is claimed: the environment is built around the story, which is
 * the whole point of the page.
 */
export default function ProductionPage() {
  return (
    <>
      <Scene className="pt-32 md:pt-40">
        <Group onLoad stagger={0.07}>
          <Poster as="h1" lines={production.headline} script="anywhere" scriptLine={1} start="intro" />
          <p className="lede mt-10 max-w-[52ch] text-ink-dim" data-reveal="fade">
            {production.body}
          </p>
          <div className="relative mt-14 aspect-video overflow-hidden bg-paper-deep md:mt-20">
            <Image src={FRAME} alt="On set with Experience Media" fill priority sizes="(min-width: 768px) 90vw, 100vw" className="object-cover" data-reveal="frame" />
          </div>
        </Group>
      </Scene>

      <Scene tight>
        <Group>
          <Poster lines={["What we", "shoot."]} script="and finish" scriptLine={1} />
        </Group>
        <Group className="mt-12 grid md:mt-16 md:grid-cols-2 md:gap-x-16" stagger={0.05}>
          {production.kinds.map((k, i) => (
            <div key={k} className="row">
              <span className="row-rule" data-reveal="rule" />
              <Line as="h3" className="row-title poster">
                <span className="num mr-4">{String(i + 1).padStart(2, "0")}</span>
                {k}
              </Line>
            </div>
          ))}
        </Group>
        <span className="mt-0 block h-px w-full bg-hairline" />
        <Group className="mt-12 flex flex-wrap items-center justify-between gap-8 md:mt-16">
          <p className="lede max-w-[40ch] text-ink-dim" data-reveal="fade">
            Tell us where the story is. We&rsquo;ll bring the right crew, kit and room to it.
          </p>
          <p data-reveal="fade">
            <Magnet padding={40} magnetStrength={3}>
              <Link href="/contact" className="button">
                Plan a Shoot →
              </Link>
            </Magnet>
          </p>
        </Group>
      </Scene>
    </>
  );
}
