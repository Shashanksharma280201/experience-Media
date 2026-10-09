import Link from "next/link";
import Scene from "@/components/layout/Scene";
import Group from "@/components/motion/Group";
import Line from "@/components/motion/Line";
import Poster from "@/components/motion/Poster";
import Magnet from "@/components/bits/Magnet";
import { offer } from "@/lib/content";

/**
 * 07 — the offer. Two days from you, everything else from us: the two days
 * as a pair of rows, then the chain of what happens next as one line that
 * reveals link by link.
 */
export default function Offer() {
  return (
    <Scene id="offer">
      <Group>
        <Poster lines={offer.headline} script="your time" scriptLine={0} />
        <p className="lede mt-8 max-w-[40ch] text-ink" data-reveal="fade">{offer.subhead}</p>
        <p className="lede mt-4 max-w-[52ch] text-ink-dim" data-reveal="fade">{offer.proposition}</p>
      </Group>

      <Group className="mt-16 md:mt-24">
        <Poster as="p" size="l" lines={offer.visual} />
      </Group>

      <Group className="mt-12 md:mt-16" stagger={0.06}>
        {offer.days.map((d) => (
          <div key={d.n} className="row">
            <span className="row-rule" data-reveal="rule" />
            <Line as="h3" className="row-title poster">
              <span className="num mr-4">{d.n}</span>
              {d.title}
            </Line>
            <div className="row-body">
              <p className="lede max-w-[46ch] text-ink-dim" data-reveal="fade">{d.body}</p>
            </div>
          </div>
        ))}
        <span className="block h-px w-full bg-hairline" data-reveal="rule" />
      </Group>

      <Group className="chain mt-12 md:mt-16" stagger={0.05}>
        <p className="micro" data-reveal="fade">then</p>
        <ol className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-2">
          {offer.chain.map((c, i) => (
            <li key={c} className="poster poster--m flex items-baseline gap-x-4">
              <Line>{c}</Line>
              {i < offer.chain.length - 1 && (
                <span aria-hidden className="text-signal" data-reveal="fade">
                  →
                </span>
              )}
            </li>
          ))}
        </ol>
      </Group>

      <Group className="mt-16 flex flex-wrap items-center justify-between gap-8 md:mt-20">
        <p className="display-m max-w-[22ch]" data-reveal="fade">{offer.close}</p>
        <div data-reveal="fade">
          <Magnet padding={40} magnetStrength={3}>
            <Link href="/contact" className="button">
              {offer.cta} →
            </Link>
          </Magnet>
        </div>
      </Group>
    </Scene>
  );
}
