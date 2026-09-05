import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import Scene from "@/components/layout/Scene";
import Group from "@/components/motion/Group";
import Poster from "@/components/motion/Poster";
import { adjacentDisciplines, disciplines, getDiscipline } from "@/lib/content";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return disciplines.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const d = getDiscipline(slug);
  if (!d) return {};
  return { title: d.title, description: d.blurb, openGraph: { title: d.title, description: d.blurb, images: [d.items[0].thumb] } };
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
      <Scene className="pt-32 md:pt-40">
        <Group onLoad stagger={0.06}>
          <Poster as="h1" lines={d.title.split(" ")} script={`${d.items.length} pieces`} scriptLine={d.title.split(" ").length - 1} />
          <div className="mt-12 h-px w-full bg-hairline" data-reveal="rule" />
          <dl className="grid gap-8 pt-8 sm:grid-cols-2 lg:grid-cols-4">
            {[["Scope", d.blurb.split(",")[0]], ["Platform", platforms], ["Pieces", String(d.items.length)], ["Period", d.period]].map(([k, v]) => (
              <div key={k} data-reveal="fade">
                <dt className="small text-ink-faint">{k}</dt>
                <dd className="mt-2">{v}</dd>
              </div>
            ))}
          </dl>
          <div className={`relative mt-14 overflow-hidden bg-paper-deep md:mt-20 ${short ? "mx-auto aspect-[9/16] max-w-[420px]" : "aspect-video"}`}>
            <Image src={d.items[0].thumb} alt={`${d.title} — lead frame`} fill priority sizes="(min-width: 768px) 90vw, 100vw" className="object-cover" data-reveal="frame" />
          </div>
        </Group>
      </Scene>

      <Scene tight>
        <Group>
          <Poster lines={(d.outcome ?? "How we cut it.").split(" ").length > 3 ? [d.outcome ?? "How we cut it."] : ["How we", "cut it."]} script="why" scriptLine={0} />
        </Group>
        <Group className="mt-12 grid gap-12 md:mt-16 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="micro" data-reveal="fade">context</p>
            <p className="lede mt-6 max-w-[44ch] text-ink-dim" data-reveal="fade">{d.context}</p>
          </div>
          <div className="md:col-span-6">
            <p className="micro" data-reveal="fade">approach</p>
            <p className="lede mt-6 max-w-[44ch] text-ink-dim" data-reveal="fade">{d.approach}</p>
          </div>
        </Group>
      </Scene>

      <Scene tight>
        <Group>
          <Poster lines={[`${d.items.length} pieces,`, "all live."]} script="watch" scriptLine={1} />
        </Group>
        <Group className={`mt-12 grid gap-5 md:mt-16 ${short ? "grid-cols-2 md:grid-cols-4 lg:grid-cols-5" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`} stagger={0.04}>
          {d.items.map((item, i) => (
            <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" className={`group relative block overflow-hidden bg-paper-deep ${short ? "aspect-[9/16]" : "aspect-video"}`} data-reveal="fade">
              <Image src={item.thumb} alt={`${d.title} piece ${i + 1} on ${item.platform}`} fill loading="lazy" sizes={short ? "(min-width: 768px) 22vw, 50vw" : "(min-width: 768px) 32vw, 100vw"} className="object-cover saturate-[0.82] transition-[filter,transform] duration-[var(--dur-slow)] group-hover:scale-[1.03] group-hover:saturate-100" />
              <span className="sr-only">Watch on {item.platform}</span>
            </a>
          ))}
        </Group>
      </Scene>

      <Scene tight>
        <nav aria-label="More disciplines">
          <Group className="grid gap-8 border-t border-hairline pt-10 md:grid-cols-2">
            <Link href={`/work/${prev.slug}`} className="group" data-reveal="fade">
              <span className="micro">previous</span>
              <span className="poster poster--m link-underline mt-4 block w-fit">{prev.title}</span>
            </Link>
            <Link href={`/work/${next.slug}`} className="group md:text-right" data-reveal="fade">
              <span className="micro">next</span>
              <span className="poster poster--m link-underline mt-4 block w-fit md:ml-auto">{next.title}</span>
            </Link>
          </Group>
        </nav>
      </Scene>
    </article>
  );
}
