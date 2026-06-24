"use client";

import Image from "next/image";
import { InfiniteMovingCards } from "@/components/aceternity/infinite-moving-cards";
import { testimonials } from "@/lib/content";

export default function Testimonials() {
  const cards = testimonials.map((t, i) => (
    <figure
      key={i}
      className="w-[280px] overflow-hidden rounded-sm border border-line bg-paper-dim md:w-[340px]"
    >
      <Image
        src={t.img}
        alt={t.alt}
        width={340}
        height={460}
        className="h-auto w-full object-cover"
      />
    </figure>
  ));

  return (
    <section className="border-t border-line py-20 md:py-28">
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="flex items-baseline justify-between border-b border-line pb-6">
          <h2 className="display text-[clamp(2rem,5vw,4rem)]">Kind words</h2>
          <span className="eyebrow text-ink-faint">[ Testimonials ]</span>
        </div>
      </div>

      <div className="mt-12 space-y-5">
        <InfiniteMovingCards items={cards} direction="left" speed="slow" />
        <InfiniteMovingCards items={[...cards].reverse()} direction="right" speed="slow" />
      </div>
    </section>
  );
}
