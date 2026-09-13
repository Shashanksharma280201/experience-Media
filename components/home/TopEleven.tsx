import Image from "next/image";
import Link from "next/link";
import Scene from "@/components/layout/Scene";
import Group from "@/components/motion/Group";
import Poster from "@/components/motion/Poster";
import { featured, totalPieces } from "@/lib/content";

/**
 * 07 — the work. The top eleven, in the client's order, as a poster grid:
 * landscape pieces two columns wide, portrait pieces one column and two rows
 * tall, each ranked, titled, and linked to where it published. Frames settle
 * in with a stagger. Everything else lives on /work.
 */
export default function TopEleven() {
  return (
    <Scene id="work">
      <Group>
        <Poster lines={["The top eleven,", "all live."]} script="watch" scriptLine={1} />
      </Group>
      <Group className="eleven mt-12 md:mt-16" stagger={0.06}>
        {featured.map((f) => (
          <a
            key={f.href}
            href={f.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`piece group ${f.orientation === "portrait" ? "piece--portrait" : "piece--landscape"}`}
          >
            <span className="piece-frame">
              <Image
                src={f.thumb}
                alt={f.title}
                fill
                loading="lazy"
                sizes={f.orientation === "portrait" ? "(min-width: 768px) 16vw, 50vw" : "(min-width: 768px) 33vw, 100vw"}
                className="object-cover saturate-[0.85] transition-[filter,transform] duration-[var(--dur-slow)] ease-[var(--ease-out)] group-hover:scale-[1.04] group-hover:saturate-100"
                data-reveal="frame"
              />
              <span className="piece-rank poster">{String(f.rank).padStart(2, "0")}</span>
            </span>
            <span className="piece-cap" data-reveal="fade">
              <span className="piece-title">{f.title}</span>
              <span className="small text-ink-faint">{f.platform}</span>
            </span>
          </a>
        ))}
      </Group>
      <p className="mt-10 text-right">
        <Link href="/work" className="link-underline small text-ink">
          The other {totalPieces - featured.length} pieces
        </Link>
      </p>
    </Scene>
  );
}
