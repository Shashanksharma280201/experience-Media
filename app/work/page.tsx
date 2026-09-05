import type { Metadata } from "next";
import Image from "next/image";
import Scene from "@/components/layout/Scene";
import Group from "@/components/motion/Group";
import FlowingMenu from "@/components/bits/FlowingMenu";
import Poster from "@/components/motion/Poster";
import { disciplines, totalPieces } from "@/lib/content";

export const metadata: Metadata = {
  title: "Work",
  description: "Short format, long-form, podcast, motion graphics, VFX and CGI — the body of work from Experience Media.",
};

export default function WorkPage() {
  return (
    <>
      <Scene className="pt-32 md:pt-40">
        <Group onLoad stagger={0.07}>
          <Poster as="h1" lines={["Five disciplines,", `${totalPieces} pieces.`]} script="all live" scriptLine={1} />
          <p className="lede mt-10 max-w-[46ch] text-ink-dim" data-reveal="fade">
            Everything below is live. Each piece links to where it actually published.
          </p>
        </Group>
      </Scene>

      <Scene tight>
        {/* React Bits FlowingMenu: hover a discipline and its blurb runs across. */}
        <FlowingMenu
          items={disciplines.map((d) => ({ link: `/work/${d.slug}`, text: d.title, marquee: `${d.blurb}  ·  ${d.items.length} pieces`, image: d.items[0].thumb }))}
        />
      </Scene>

      <Scene tight>
        <Group>
          <Poster lines={["Three frames", "from each."]} script="look" scriptLine={0} />
        </Group>
        <Group className="mt-12 grid grid-cols-2 gap-4 md:mt-16 md:grid-cols-4 lg:grid-cols-6" stagger={0.04}>
          {disciplines.flatMap((d) =>
            d.items.slice(0, 3).map((item) => (
              <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" className={`group relative block overflow-hidden bg-paper-deep ${d.layout === "short" ? "aspect-[9/16]" : "aspect-video"}`} data-reveal="fade">
                <Image src={item.thumb} alt={`${d.title} on ${item.platform}`} fill loading="lazy" sizes="(min-width: 1024px) 16vw, (min-width: 768px) 25vw, 50vw" className="object-cover saturate-[0.82] transition-[filter,transform] duration-[var(--dur-slow)] group-hover:scale-[1.03] group-hover:saturate-100" />
              </a>
            ))
          )}
        </Group>
      </Scene>
    </>
  );
}
