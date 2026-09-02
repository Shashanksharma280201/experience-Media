import Image from "next/image";
import type { CaseStudy } from "@/lib/content";

export default function CaseStudyHero({ study }: { study: CaseStudy }) {
  return (
    <header className="mx-auto max-w-[1600px] px-5 pb-16 pt-36 md:px-10 md:pb-24 md:pt-44">
      <div className="flex flex-wrap items-center gap-4 border-b border-rule pb-6">
        <span className="eyebrow text-accent">{study.category}</span>
        <span aria-hidden className="h-px flex-1 bg-rule" />
        <span className="eyebrow tabular-nums text-paper/45">{study.year}</span>
        {study.contentStatus === "draft" && (
          <span className="eyebrow bg-accent px-2 py-1 text-[0.6rem] text-void">
            Draft copy
          </span>
        )}
      </div>

      <div className="mt-12 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <h1 className="display text-[clamp(3rem,11vw,9rem)]">
            {study.client}
            <span className="text-accent">.</span>
          </h1>
          <p className="mt-8 max-w-2xl text-[clamp(1.1rem,2.2vw,1.6rem)] leading-snug text-paper/75">
            {study.headline}
          </p>
        </div>

        <div className="flex items-start lg:col-span-3 lg:col-start-10 lg:justify-end">
          <Image
            src={study.logo}
            alt={study.client}
            width={200}
            height={100}
            className="max-h-[64px] w-auto object-contain brightness-0 invert"
          />
        </div>
      </div>
    </header>
  );
}
