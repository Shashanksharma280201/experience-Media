"use client";

import Image from "next/image";
import { InfiniteMovingCards } from "@/components/aceternity/infinite-moving-cards";
import { creators } from "@/lib/content";

export default function CreatorsStrip() {
  const cards = creators.map((src, i) => (
    <div
      key={i}
      className="h-28 w-28 overflow-hidden rounded-full border border-line bg-paper-dim md:h-36 md:w-36"
    >
      <Image
        src={src}
        alt={`Creator ${i + 1}`}
        width={144}
        height={144}
        className="h-full w-full object-cover"
      />
    </div>
  ));

  return (
    <section className="border-y border-line py-16 md:py-20">
      <div className="mx-auto mb-10 flex max-w-[1600px] items-baseline justify-between px-5 md:px-10">
        <h2 className="display text-[clamp(1.6rem,4vw,3rem)]">Creator collaborations</h2>
        <span className="eyebrow text-ink-faint">[ Trusted by creators ]</span>
      </div>

      <InfiniteMovingCards items={cards} direction="left" speed="normal" />
    </section>
  );
}
