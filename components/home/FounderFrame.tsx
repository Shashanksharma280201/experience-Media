// components/home/FounderFrame.tsx — server component: reads the founder
// asset at build time. With no file it is a labelled paper slot, never a
// stock image, so the page is honest about what is missing.
import Image from "next/image";
import Loop from "@/components/media/Loop";
import { site } from "@/lib/content";
import { founderMedia } from "@/lib/content/founder-media";

export default function FounderFrame({ className = "" }: { className?: string }) {
  if (!founderMedia) {
    return (
      <div className={`founder-frame founder-frame--slot ${className}`} aria-hidden>
        <span className="micro">{site.founder}</span>
        <span className="small text-ink-faint">photo to follow</span>
      </div>
    );
  }
  if (founderMedia.video) {
    return <Loop clip={{ src: founderMedia.video, poster: founderMedia.image }} className={`founder-frame ${className}`} label={`${site.founder}, ${site.founderRole}`} />;
  }
  return (
    <div className={`founder-frame ${className}`}>
      <Image src={founderMedia.image} alt={`${site.founder}, ${site.founderRole}`} fill sizes="(min-width: 768px) 33vw, 100vw" loading="lazy" className="object-cover" data-reveal="frame" />
    </div>
  );
}
