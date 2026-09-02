import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { caseStudies, getCaseStudy } from "@/lib/content";
import CaseStudyHero from "@/components/work/CaseStudyHero";
import TrackStack from "@/components/work/TrackStack";
import MetricLedger from "@/components/work/MetricLedger";
import NextCase from "@/components/work/NextCase";
import FrameMarks from "@/components/chrome/FrameMarks";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return caseStudies.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) return {};
  return {
    title: `${study.client} — Experience Media`,
    description: study.headline,
    openGraph: {
      title: `${study.client} — Experience Media`,
      description: study.headline,
      images: [study.media[0].src],
    },
  };
}

export default async function CaseStudyPage({ params }: Params) {
  const { slug } = await params;
  const study = getCaseStudy(slug);
  if (!study) notFound();

  return (
    <article className="bg-void text-paper">
      <CaseStudyHero study={study} />

      {/* Lead media */}
      <div className="mx-auto max-w-[1600px] px-5 md:px-10">
        <div className="group relative aspect-[16/9] overflow-hidden bg-surface">
          <Image
            src={study.media[0].src}
            alt={`${study.client} — ${study.category}`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <FrameMarks className="m-4" />
        </div>
      </div>

      {/* The narrative */}
      <section className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 md:py-28">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <h2 className="eyebrow text-accent">The brief</h2>
            <p className="mt-6 text-lg leading-relaxed text-paper/75">
              {study.challenge}
            </p>
          </div>
          <div className="md:col-span-6">
            <h2 className="eyebrow text-accent">The approach</h2>
            <p className="mt-6 text-lg leading-relaxed text-paper/75">
              {study.approach}
            </p>
          </div>
        </div>
      </section>

      {/* Deliverables + metrics */}
      <section className="mx-auto max-w-[1600px] px-5 pb-20 md:px-10 md:pb-28">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-7">
            <h2 className="eyebrow mb-6 text-paper/45">Deliverables</h2>
            <TrackStack deliverables={study.deliverables} />
          </div>
          <div className="md:col-span-5">
            <h2 className="eyebrow mb-6 text-paper/45">Results</h2>
            <MetricLedger metrics={study.metrics} />
          </div>
        </div>
      </section>

      {/* Supporting media */}
      {study.media.length > 1 && (
        <section className="mx-auto max-w-[1600px] px-5 pb-20 md:px-10 md:pb-28">
          <div className="grid gap-6 md:grid-cols-2">
            {study.media.slice(1).map((m) => (
              <div
                key={m.src}
                className={`group relative overflow-hidden bg-surface ${
                  m.aspect === "9:16" ? "aspect-[9/16]" : "aspect-video"
                }`}
              >
                <Image
                  src={m.src}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
                <FrameMarks className="m-3" />
                <span className="eyebrow absolute bottom-3 right-3 tabular-nums text-paper/60">
                  {m.aspect}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {study.testimonial && (
        <section className="mx-auto max-w-[1600px] px-5 pb-20 md:px-10 md:pb-28">
          <blockquote className="border-t border-rule pt-10">
            <p className="display max-w-4xl text-[clamp(1.6rem,4vw,3rem)]">
              “{study.testimonial.quote}”
            </p>
            <footer className="eyebrow mt-8 text-paper/50">
              {study.testimonial.author} · {study.testimonial.role}
            </footer>
          </blockquote>
        </section>
      )}

      {/* Outbound — secondary by design */}
      {study.links.length > 0 && (
        <section className="mx-auto max-w-[1600px] px-5 pb-20 md:px-10 md:pb-28">
          <div className="flex flex-wrap gap-4 border-t border-rule pt-8">
            {study.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="eyebrow group flex items-center gap-2 border border-rule px-5 py-3 transition-colors hover:border-accent hover:text-accent"
              >
                {l.label}
                <span className="transition-transform group-hover:translate-x-1">↗</span>
              </a>
            ))}
          </div>
        </section>
      )}

      <NextCase slug={study.slug} />
    </article>
  );
}
