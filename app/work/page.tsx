import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Scene from "@/components/layout/Scene";
import Group from "@/components/motion/Group";
import Line from "@/components/motion/Line";
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
        <Group start="top 88%" stagger={0.05}>
          {disciplines.map((d) => (
            <Link key={d.slug} href={`/work/${d.slug}`} className="group row">
              <span className="row-rule" data-reveal="rule" />
              <Line as="h2" className="row-title poster">
                <span className="link-underline inline-block">{d.title}</span>
              </Line>
              <div className="row-body grid gap-4 md:grid-cols-6">
                <p className="lede text-ink-dim md:col-span-5" data-reveal="fade">{d.blurb}</p>
                <p className="small text-ink-faint md:text-right" data-reveal="fade">{d.items.length} pieces</p>
              </div>
            </Link>
          ))}
          <span className="block h-px w-full bg-hairline" data-reveal="rule" />
        </Group>
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
