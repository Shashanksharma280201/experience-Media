import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";
import { caseStudies, portfolio } from "@/lib/content";
import WorkIndexGrid from "@/components/work/WorkIndexGrid";
import FrameMarks from "@/components/chrome/FrameMarks";

// The constellation — every piece of work floating in the void, flown through.
const WebGLScene = dynamic(() => import("@/components/webgl/WebGLScene"));

export const metadata: Metadata = {
  title: "Work — Experience Media",
  description:
    "Case studies and the full body of work: short format, long-form, podcast, motion graphics, VFX and CGI.",
};

const totalPieces = portfolio.reduce((n, c) => n + c.items.length, 0);

export default function WorkPage() {
  return (
    <div className="relative text-paper">
      <div aria-hidden className="fixed inset-0 -z-20 bg-void" />
      <WebGLScene mode="constellation" anchorId="constellation" />

      {/* Transparent fly-through region; the title sits over the scene. */}
      <div id="constellation" className="relative h-[160vh]">
        <header className="sticky top-0 flex h-svh flex-col justify-end px-5 pb-20 md:px-10">
          <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-rule pb-6">
            <h1 className="display text-[clamp(2.8rem,10vw,8rem)] drop-shadow-[0_2px_30px_rgba(0,0,0,0.7)]">
              Work<span className="text-accent">.</span>
            </h1>
            <span className="eyebrow tabular-nums text-paper/60">
              [ {caseStudies.length} cases · {totalPieces} pieces ]
            </span>
          </div>
          <p className="eyebrow mt-6 text-paper/45">
            Scroll to fly through · click any screen to open it
          </p>
        </header>
      </div>

      {/* Dissolve the void into the opaque page. */}
      <div
        aria-hidden
        className="pointer-events-none h-[40vh] bg-gradient-to-b from-transparent to-void"
      />

      <div className="bg-void">
        {/* Flagship case studies */}
        <section className="mx-auto max-w-[1600px] px-5 pb-6 md:px-10">
          <div className="grid gap-x-8 gap-y-14 md:grid-cols-2">
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
                  <h2 className="display text-[clamp(1.5rem,3vw,2.4rem)]">{c.client}</h2>
                  <p className="eyebrow shrink-0 text-accent">{c.category}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* The full index */}
        <div className="mt-10 border-t border-rule">
          {portfolio.map((cat, i) => (
            <WorkIndexGrid key={cat.title} category={cat} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
