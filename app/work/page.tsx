import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import Shell from "@/components/layout/Shell";
import Section from "@/components/layout/Section";
import { disciplines, totalPieces } from "@/lib/content";

export const metadata: Metadata = {
  title: "Work",
  description:
    "Short format, long-form, podcast, motion graphics, VFX and CGI — the body of work from Experience Media.",
};

export default function WorkPage() {
  return (
    <>
      <Shell as="header" className="pb-16 pt-40 md:pb-24 md:pt-48">
        <p className="micro">the work</p>
        <h1 className="display-l mt-8 max-w-[14ch]">
          Five disciplines, {totalPieces} pieces.
        </h1>
        <p className="lede mt-8 max-w-[46ch] text-bone-dim">
          Everything below is live. Each piece links to where it actually
          published.
        </p>
      </Shell>

      <Section bleed>
        <Shell>
          <div className="border-t border-hairline">
            {disciplines.map((d) => (
              <Link
                key={d.slug}
                href={`/work/${d.slug}`}
                className="group grid items-center gap-6 border-b border-hairline py-10 md:grid-cols-12 md:py-14"
              >
                <h2 className="display-m link-underline inline-block md:col-span-4">
                  {d.title}
                </h2>
                <p className="lede text-bone-dim md:col-span-5">{d.blurb}</p>
                <p className="small text-bone-faint md:col-span-2 md:col-start-11 md:text-right">
                  {d.items.length} pieces
                </p>
              </Link>
            ))}
          </div>
        </Shell>
      </Section>

      <Section label="a sample">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-6">
          {disciplines.flatMap((d) =>
            d.items.slice(0, 3).map((item) => (
              <a
                key={item.href}
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative block overflow-hidden bg-[#131315] ${
                  d.layout === "short" ? "aspect-[9/16]" : "aspect-video"
                }`}
              >
                <Image
                  src={item.thumb}
                  alt={`${d.title} on ${item.platform}`}
                  fill
                  loading="lazy"
                  sizes="(min-width: 1024px) 16vw, (min-width: 768px) 25vw, 50vw"
                  className="object-cover opacity-75 transition-[opacity,transform] duration-[var(--dur-slow)] group-hover:scale-[1.03] group-hover:opacity-100"
                />
              </a>
            ))
          )}
        </div>
      </Section>
    </>
  );
}
