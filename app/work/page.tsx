import type { Metadata } from "next";
import Image from "next/image";
import Scene from "@/components/layout/Scene";
import Group from "@/components/motion/Group";
import FlowingMenu from "@/components/bits/FlowingMenu";
import Poster from "@/components/motion/Poster";
import { disciplines, rest, totalPieces } from "@/lib/content";

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
            The top eleven are on the home page. Everything else is here, and every piece links to where it actually published.
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
          <Poster lines={["Everything else,", "all live."]} script={`${rest.length} more`} scriptLine={1} />
        </Group>
        <Group className="eleven mt-12 md:mt-16" stagger={0.04}>
          {rest.map((item) => (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`piece group ${item.discipline.layout === "short" ? "piece--portrait" : "piece--landscape"}`}
            >
              <span className="piece-frame">
                <Image
                  src={item.thumb}
                  alt={`${item.discipline.title} on ${item.platform}`}
                  fill
                  loading="lazy"
                  sizes={item.discipline.layout === "short" ? "(min-width: 768px) 16vw, 50vw" : "(min-width: 768px) 33vw, 100vw"}
                  className="object-cover saturate-[0.85] transition-[filter,transform] duration-[var(--dur-slow)] ease-[var(--ease-out)] group-hover:scale-[1.04] group-hover:saturate-100"
                  data-reveal="frame"
                />
              </span>
              <span className="piece-cap" data-reveal="fade">
                <span className="piece-title">{item.discipline.title}</span>
                <span className="small text-ink-faint">{item.platform}</span>
              </span>
            </a>
          ))}
        </Group>
      </Scene>
    </>
  );
}
