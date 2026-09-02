import Image from "next/image";
import Link from "next/link";
import Section from "@/components/layout/Section";
import { disciplines } from "@/lib/content";

/**
 * Motion #10 — the cards pin and stack as you scroll past them.
 * Native `position: sticky`, so without JS they simply flow normally.
 */
export default function SelectedWork() {
  return (
    <Section id="work" label="selected work">
      <div className="work-stack">
        {disciplines.map((d, i) => (
          <article
            key={d.slug}
            className="work-card bg-void"
            style={{ top: `calc(5rem + ${i * 14}px)` }}
          >
            <Link
              href={`/work/${d.slug}`}
              className="group block border-t border-hairline pt-8 md:pt-10"
            >
              <div className="grid gap-8 md:grid-cols-12 md:gap-10">
                <div className="md:col-span-5">
                  <h3 className="display-m link-underline inline-block">{d.title}</h3>
                  <p className="lede mt-5 max-w-[34ch] text-bone-dim">{d.blurb}</p>
                  <p className="small mt-6 text-bone-faint">
                    {d.items.length} pieces · {d.period}
                  </p>
                </div>

                <div className="md:col-span-6 md:col-start-7">
                  <div
                    className={`relative overflow-hidden bg-[#131315] ${
                      d.layout === "short"
                        ? "mx-auto aspect-[9/16] max-w-[300px]"
                        : "aspect-video"
                    }`}
                  >
                    <Image
                      src={d.items[0].thumb}
                      alt={`${d.title} — sample frame`}
                      fill
                      loading="lazy"
                      sizes="(min-width: 768px) 46vw, 100vw"
                      className="object-cover opacity-85 transition-[opacity,transform] duration-[var(--dur-slow)] ease-[var(--ease-out)] group-hover:scale-[1.02] group-hover:opacity-100"
                    />
                  </div>
                </div>
              </div>
              <div className="h-16 md:h-24" />
            </Link>
          </article>
        ))}
      </div>
    </Section>
  );
}
