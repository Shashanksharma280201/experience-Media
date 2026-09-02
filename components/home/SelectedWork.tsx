import Image from "next/image";
import Link from "next/link";
import { caseStudies } from "@/lib/content";
import Timecode from "@/components/chrome/Timecode";
import FrameMarks from "@/components/chrome/FrameMarks";
import Reveal from "@/components/Reveal";

export default function SelectedWork({ index, total }: { index: number; total: number }) {
  return (
    <section id="work" className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 md:py-28">
      <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-rule pb-6">
        <h2 className="display text-[clamp(2rem,5vw,4rem)]">Selected work</h2>
        <Timecode index={index} total={total} label="Selected work" />
      </div>

      <Reveal className="mt-12 grid gap-x-8 gap-y-14 md:grid-cols-2" stagger>
        {caseStudies.map((c) => (
          <Link
            key={c.slug}
            href={`/work/${c.slug}`}
            data-cursor={`Case ▸ ${c.client}`}
            className="group block"
          >
            <div className="relative aspect-[16/10] overflow-hidden bg-surface">
              <Image
                src={c.media[0].src}
                alt={`${c.client} — ${c.category}`}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover opacity-80 transition-all duration-700 group-hover:scale-[1.03] group-hover:opacity-100"
              />
              <FrameMarks className="m-3" />
              {c.contentStatus === "draft" && (
                <span className="eyebrow absolute left-4 top-4 bg-accent px-2 py-1 text-[0.6rem] text-void">
                  Draft copy
                </span>
              )}
            </div>

            <div className="mt-5 flex items-start justify-between gap-6 border-t border-rule pt-4">
              <div>
                <h3 className="display text-[clamp(1.5rem,3vw,2.4rem)]">{c.client}</h3>
                <p className="mt-2 max-w-md text-sm text-paper/60">{c.headline}</p>
              </div>
              <div className="shrink-0 text-right">
                <p className="eyebrow text-accent">{c.category}</p>
                <p className="eyebrow mt-2 tabular-nums text-paper/40">{c.year}</p>
              </div>
            </div>
          </Link>
        ))}
      </Reveal>

      <Link
        href="/work"
        className="group mt-14 inline-flex items-center gap-3 border-b border-rule pb-2 transition-colors hover:border-accent"
      >
        <span className="eyebrow">All work</span>
        <span className="transition-transform group-hover:translate-x-1">↗</span>
      </Link>
    </section>
  );
}
