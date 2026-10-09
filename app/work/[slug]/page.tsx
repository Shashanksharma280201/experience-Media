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
  const short = d.layout === "short";

  return (
    <article>
      <Scene className="pt-32 md:pt-40">
        <Group onLoad stagger={0.06}>
          <Poster as="h1" lines={d.title.split(" ")} script="explore" scriptLine={d.title.split(" ").length - 1} start="intro" />
          <p className="display-m mt-10 max-w-[30ch]" data-reveal="fade">{d.blurb}</p>
          <div className="mt-12 h-px w-full bg-hairline" data-reveal="rule" />
          <dl className="grid gap-8 pt-8 sm:grid-cols-3">
            {[["Reach", d.outcome], ["Platforms", d.platforms], ["Period", d.period]].map(([k, v]) => (
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
        <Group className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <p className="lede max-w-[48ch] text-ink-dim" data-reveal="fade">{d.context}</p>
          </div>
          <div className="md:col-span-4 md:col-start-9 md:self-end" data-reveal="fade">
            <Link href="/contact" className="button">
              Start a Project →
            </Link>
          </div>
        </Group>
      </Scene>

      <Scene tight>
        <Group>
          <Poster lines={["The pieces,", "all live."]} script="watch" scriptLine={1} />
        </Group>
        <Group className={`mt-12 grid gap-5 md:mt-16 ${short ? "grid-cols-2 md:grid-cols-4 lg:grid-cols-5" : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"}`} stagger={0.04}>
          {d.items.map((item, i) => (
            <a key={item.href} href={item.href} target="_blank" rel="noopener noreferrer" className={`group relative block overflow-hidden bg-paper-deep ${short ? "aspect-[9/16]" : "aspect-video"}`} data-reveal="fade">
              <Image src={item.thumb} alt={`${d.title} piece ${i + 1} on ${item.platform}`} fill loading="lazy" sizes={short ? "(min-width: 768px) 22vw, 50vw" : "(min-width: 768px) 32vw, 100vw"} className="object-cover saturate-[0.82] transition-[filter,transform] duration-[var(--dur-slow)] group-hover:scale-[1.03] group-hover:saturate-100" />
              <span className="piece-play poster" aria-hidden>
                Watch ▶
              </span>
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
