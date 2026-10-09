import type { Metadata } from "next";
import Image from "next/image";
import Scene from "@/components/layout/Scene";
import Group from "@/components/motion/Group";
import FlowingMenu from "@/components/bits/FlowingMenu";
import Poster from "@/components/motion/Poster";
import { disciplines, featured, rest } from "@/lib/content";

export const metadata: Metadata = {
  title: "Work",
  description: "A selection of the work we've created across content, production and storytelling — short-form, long-form, podcasts, motion graphics, VFX and CGI.",
};

/** The featured pieces lead, then everything else; every one links to where it published. */
const ALL = [
  ...featured.map((f) => ({ key: f.href, href: f.href, thumb: f.thumb, title: f.title, platform: f.platform, portrait: f.orientation === "portrait" })),
  ...rest.map((r) => ({ key: r.href, href: r.href, thumb: r.thumb, title: r.discipline.title, platform: r.platform, portrait: r.discipline.layout === "short" })),
];

export default function WorkPage() {
  return (
    <>
      <Scene className="pt-32 md:pt-40">
        <Group onLoad stagger={0.07}>
          <Poster as="h1" lines={["Work that speaks", "for itself."]} script="all live" scriptLine={1} start="intro" />
          <p className="lede mt-10 max-w-[46ch] text-ink-dim" data-reveal="fade">
            A selection of the work we&rsquo;ve created across content, production and storytelling. Every piece links to where it actually published.
          </p>
        </Group>
      </Scene>

      <Scene tight>
        {/* React Bits FlowingMenu: hover a discipline and its line runs across. Click to explore it. */}
        <FlowingMenu
          items={disciplines.map((d) => ({ link: `/work/${d.slug}`, text: d.title, marquee: `${d.blurb}  ·  ${d.outcome}  ·  click to explore`, image: d.items[0].thumb }))}
        />
      </Scene>

      <Scene tight>
        <Group>
          <Poster lines={["The complete", "portfolio."]} script="watch" scriptLine={1} />
        </Group>
        <Group className="eleven mt-12 md:mt-16" stagger={0.04}>
          {ALL.map((item) => (
            <a key={item.key} href={item.href} target="_blank" rel="noopener noreferrer" className={`piece group ${item.portrait ? "piece--portrait" : "piece--landscape"}`}>
              <span className="piece-frame">
                <Image
                  src={item.thumb}
                  alt={`${item.title} on ${item.platform}`}
                  fill
                  loading="lazy"
                  sizes={item.portrait ? "(min-width: 768px) 16vw, 50vw" : "(min-width: 768px) 33vw, 100vw"}
                  className="object-cover saturate-[0.85] transition-[filter,transform] duration-[var(--dur-slow)] ease-[var(--ease-out)] group-hover:scale-[1.04] group-hover:saturate-100"
                  data-reveal="frame"
                />
                <span className="piece-play poster" aria-hidden>
                  Watch ▶
                </span>
              </span>
              <span className="piece-cap" data-reveal="fade">
                <span className="piece-title">{item.title}</span>
                <span className="small text-ink-faint">{item.platform}</span>
              </span>
            </a>
          ))}
        </Group>
      </Scene>
    </>
  );
}
