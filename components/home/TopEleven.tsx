import Image from "next/image";
import Link from "next/link";
import Scene from "@/components/layout/Scene";
import Group from "@/components/motion/Group";
import Poster from "@/components/motion/Poster";
import Magnet from "@/components/bits/Magnet";
import { featured } from "@/lib/content";

/**
 * 11 — the work. The featured pieces, in the client's order, as a poster
 * grid: landscape pieces two columns wide, portrait pieces one column and
 * two rows tall, each titled and linked to where it published. Frames
 * settle in with a stagger. No count anywhere: the portfolio is on /work.
 */
export default function TopEleven() {
  return (
    <Scene id="work">
      <Group>
        <Poster lines={["Work that speaks", "for itself."]} script="watch" scriptLine={1} />
        <p className="lede mt-8 max-w-[46ch] text-ink-dim" data-reveal="fade">
          A selection of the work we&rsquo;ve created across content, production and storytelling.
        </p>
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
              <span className="piece-play poster" aria-hidden>
                Watch ▶
              </span>
            </span>
            <span className="piece-cap" data-reveal="fade">
              <span className="piece-title">{f.title}</span>
              <span className="small text-ink-faint">{f.platform}</span>
            </span>
          </a>
        ))}
      </Group>
      <p className="mt-12 text-right">
        <Magnet padding={40} magnetStrength={3}>
          <Link href="/work" className="button">
            Explore the complete portfolio →
          </Link>
        </Magnet>
      </p>
    </Scene>
  );
}
