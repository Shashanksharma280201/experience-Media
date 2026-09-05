"use client";

import { useState } from "react";
import Scene from "@/components/layout/Scene";
import Group from "@/components/motion/Group";
import ScrollReveal from "@/components/bits/ScrollReveal";
import Poster from "@/components/motion/Poster";
import { featuredVoices, testimonials, type Testimonial } from "@/lib/content";

function Voice({ t }: { t: Testimonial }) {
  return (
    <figure className="row">
      <span className="row-rule" data-reveal="rule" />
      <ScrollReveal as="blockquote" containerClassName="row-title quote-mark md:col-span-8" textClassName="display-m" baseRotation={2} blurStrength={5} rotationEnd="center center" wordAnimationEnd="center center">
        {t.quote}
      </ScrollReveal>
      <figcaption className="md:col-span-3 md:col-start-10 md:pt-[0.6em]" data-reveal="fade">
        <span className="block font-display text-ink [font-variation-settings:'wdth'_104,'wght'_600]">{t.author}</span>
        {t.role && <span className="small mt-1 block text-ink-faint">{t.role}</span>}
      </figcaption>
    </figure>
  );
}

/** 08 — what people say. Three voices at full size; the rest one click away. */
export default function Testimonials() {
  const [more, setMore] = useState(false);
  const featured = featuredVoices
    .map((name) => testimonials.find((t) => t.author === name))
    .filter((t): t is Testimonial => !!t);
  const rest = testimonials.filter((t) => !featuredVoices.includes(t.author));

  return (
    <Scene tone="rose" tight>
      <Group>
        <Poster lines={["In their", "words."]} script="really" scriptLine={0} />
      </Group>
      <Group className="mt-12 md:mt-16" stagger={0.06}>
        {featured.map((t) => (
          <Voice key={t.author} t={t} />
        ))}
        <span className="block h-px w-full bg-hairline" data-reveal="rule" />
      </Group>
      <div className="mt-10">
        <button type="button" onClick={() => setMore((v) => !v)} aria-expanded={more} aria-controls="more-voices" className="link-underline small text-ink">
          {more ? "Fewer voices" : `More voices (${rest.length})`}
        </button>
        <div id="more-voices" hidden={!more} className="mt-10 grid gap-x-12 gap-y-2 md:grid-cols-2">
          {rest.map((t) => (
            <figure key={t.author} className="border-t border-hairline py-8">
              <blockquote className="text-ink-dim">{t.quote}</blockquote>
              <figcaption className="mt-5">
                <span className="block font-display text-ink [font-variation-settings:'wdth'_104,'wght'_600]">{t.author}</span>
                {t.role && <span className="small mt-1 block text-ink-faint">{t.role}</span>}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </Scene>
  );
}
