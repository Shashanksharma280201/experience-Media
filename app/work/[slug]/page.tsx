import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Shell from "@/components/layout/Shell";
import Section from "@/components/layout/Section";
import { adjacentDisciplines, disciplines, getDiscipline } from "@/lib/content";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return disciplines.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const d = getDiscipline(slug);
  if (!d) return {};
  return {
    title: d.title,
    description: d.blurb,
    openGraph: { title: d.title, description: d.blurb, images: [d.items[0].thumb] },
  };
}

export default async function DisciplinePage({ params }: Params) {
  const { slug } = await params;
  const d = getDiscipline(slug);
  if (!d) notFound();

  const { prev, next } = adjacentDisciplines(d.slug);
  const platforms = [...new Set(d.items.map((i) => i.platform))].join(", ");
  const short = d.layout === "short";

  return (
    <article>
      <Shell as="header" className="pb-14 pt-40 md:pb-20 md:pt-48">
        <p className="micro">discipline</p>
        <h1 className="display-l mt-8 max-w-[12ch]">{d.title}</h1>

        <dl className="mt-16 grid gap-8 border-t border-hairline pt-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Scope", d.blurb.split(",")[0]],
            ["Platform", platforms],
            ["Pieces", String(d.items.length)],
            ["Period", d.period],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="small text-bone-faint">{k}</dt>
              <dd className="mt-2">{v}</dd>
            </div>
          ))}
        </dl>
      </Shell>

      {/* Lead frame */}
      <Shell>
        <div
          className={`relative overflow-hidden bg-[#131315] ${
            short ? "mx-auto aspect-[9/16] max-w-[420px]" : "aspect-video"
          }`}
        >
          <Image
            src={d.items[0].thumb}
            alt={`${d.title} — lead frame`}
            fill
            priority
            sizes="(min-width: 768px) 90vw, 100vw"
            className="object-cover"
          />
        </div>
      </Shell>

      <Section>
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="micro">context</p>
            <p className="lede mt-6 max-w-[44ch] text-bone-dim">{d.context}</p>
          </div>
          <div className="md:col-span-6">
            <p className="micro">approach</p>
            <p className="lede mt-6 max-w-[44ch] text-bone-dim">{d.approach}</p>
          </div>
        </div>

        {d.outcome ? (
          <div className="mt-20 border-t border-hairline pt-10">
            <p className="micro">outcome</p>
            <p className="display-m mt-6 max-w-[20ch]">{d.outcome}</p>
          </div>
        ) : null}
      </Section>

      <Section label="the pieces">
        <div
          className={`grid gap-5 ${
            short
              ? "grid-cols-2 md:grid-cols-4 lg:grid-cols-5"
              : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
          }`}
        >
          {d.items.map((item, i) => (
            <a
              key={item.href}
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`group relative block overflow-hidden bg-[#131315] ${
                short ? "aspect-[9/16]" : "aspect-video"
              }`}
            >
              <Image
                src={item.thumb}
                alt={`${d.title} piece ${i + 1} on ${item.platform}`}
                fill
                loading="lazy"
                sizes={short ? "(min-width: 768px) 22vw, 50vw" : "(min-width: 768px) 32vw, 100vw"}
                className="object-cover opacity-80 transition-[opacity,transform] duration-[var(--dur-slow)] group-hover:scale-[1.03] group-hover:opacity-100"
              />
              <span className="sr-only">Watch on {item.platform}</span>
            </a>
          ))}
        </div>
      </Section>

      <nav aria-label="More disciplines" className="border-t border-hairline">
        <Shell className="grid gap-8 py-14 md:grid-cols-2 md:py-20">
          <Link href={`/work/${prev.slug}`} className="group">
            <span className="micro">previous</span>
            <span className="heading link-underline mt-4 block w-fit">{prev.title}</span>
          </Link>
          <Link href={`/work/${next.slug}`} className="group md:text-right">
            <span className="micro">next</span>
            <span className="heading link-underline mt-4 block w-fit md:ml-auto">
              {next.title}
            </span>
          </Link>
        </Shell>
      </nav>
    </article>
  );
}
