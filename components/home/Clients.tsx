"use client";

import Image from "next/image";
import { InfiniteMovingCards } from "@/components/aceternity/infinite-moving-cards";
import { brands, creators, testimonials } from "@/lib/content";
import Timecode from "@/components/chrome/Timecode";

export default function Clients({ index, total }: { index: number; total: number }) {
  const creatorCards = creators.map((src, i) => (
    <div
      key={i}
      className="h-24 w-24 overflow-hidden rounded-full border border-rule bg-surface md:h-32 md:w-32"
    >
      <Image
        src={src}
        alt={`Creator ${i + 1}`}
        width={128}
        height={128}
        className="h-full w-full object-cover"
      />
    </div>
  ));

  const testimonialCards = testimonials.map((t, i) => (
    <figure key={i} className="w-[260px] overflow-hidden border border-rule bg-surface md:w-[320px]">
      <Image src={t.img} alt={t.alt} width={320} height={430} className="h-auto w-full object-cover" />
    </figure>
  ));

  return (
    <section id="clients" className="py-20 md:py-28">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-rule pb-6">
          <h2 className="display text-[clamp(2rem,5vw,4rem)]">Clients</h2>
          <Timecode index={index} total={total} label="Clients" />
        </div>

        {/* Brand wall — hairline grid */}
        <div className="mt-12 grid grid-cols-2 border-l border-t border-rule sm:grid-cols-3 lg:grid-cols-5">
          {brands.map((b) => (
            <div
              key={b.name}
              className="group relative flex aspect-[3/2] items-center justify-center border-b border-r border-rule p-8"
              title={b.name}
            >
              <Image
                src={b.img}
                alt={b.name}
                width={180}
                height={90}
                className="max-h-[48px] w-auto object-contain opacity-50 brightness-0 invert transition-all duration-300 group-hover:scale-105 group-hover:opacity-100"
              />
              <span className="eyebrow pointer-events-none absolute bottom-3 left-3 text-[0.58rem] text-transparent transition-colors duration-300 group-hover:text-accent">
                {b.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-20">
        <p className="eyebrow mx-auto mb-8 max-w-[1600px] px-5 text-paper/40 md:px-10">
          Creator collaborations
        </p>
        <InfiniteMovingCards items={creatorCards} direction="left" speed="normal" />
      </div>

      <div className="mt-16 space-y-5">
        <p className="eyebrow mx-auto max-w-[1600px] px-5 text-paper/40 md:px-10">
          Kind words
        </p>
        <InfiniteMovingCards items={testimonialCards} direction="left" speed="slow" />
        <InfiniteMovingCards items={[...testimonialCards].reverse()} direction="right" speed="slow" />
      </div>
    </section>
  );
}
