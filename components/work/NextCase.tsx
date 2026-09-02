import Image from "next/image";
import Link from "next/link";
import { caseStudies } from "@/lib/content";
import FrameMarks from "@/components/chrome/FrameMarks";

export default function NextCase({ slug }: { slug: string }) {
  const i = caseStudies.findIndex((c) => c.slug === slug);
  const next = caseStudies[(i + 1) % caseStudies.length];
  if (!next || next.slug === slug) return null;

  return (
    <section className="border-t border-rule">
      <Link
        href={`/work/${next.slug}`}
        className="group mx-auto flex max-w-[1600px] flex-col gap-8 px-5 py-20 md:flex-row md:items-center md:justify-between md:px-10 md:py-28"
      >
        <div>
          <p className="eyebrow text-paper/45">Next case</p>
          <h2 className="display mt-4 text-[clamp(2.2rem,7vw,5.5rem)]">
            {next.client}
            <span className="text-accent">.</span>
          </h2>
          <p className="eyebrow mt-4 text-accent">{next.category}</p>
        </div>

        <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface md:w-[38%]">
          <Image
            src={next.media[0].src}
            alt=""
            fill
            sizes="(min-width: 768px) 38vw, 100vw"
            className="object-cover opacity-70 transition-all duration-700 group-hover:scale-[1.03] group-hover:opacity-100"
          />
          <FrameMarks className="m-3" />
        </div>
      </Link>
    </section>
  );
}
