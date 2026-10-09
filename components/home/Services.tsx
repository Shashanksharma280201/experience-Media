import Link from "next/link";
import Scene from "@/components/layout/Scene";
import Group from "@/components/motion/Group";
import Line from "@/components/motion/Line";
import Poster from "@/components/motion/Poster";
import { FlowingRow } from "@/components/bits/FlowingMenu";
import { disciplines, legs, servicesLine } from "@/lib/content";

/** A frame for each leg's marquee, from the work it most resembles. */
const FRAME: Record<string, string> = {
  social: disciplines[0].items[0].thumb,
  podcast: disciplines[2].items[0].thumb,
  events: disciplines[1].items[0].thumb,
};

/**
 * 08 — what we do. Three legs, each a React Bits FlowingRow: hover slides a
 * marquee of what the engagement includes across it, and every row ends in
 * its own inquiry. Plans are customisable, so the inquiry is the product.
 */
export default function Services() {
  return (
    <Scene id="services" tight>
      <Group>
        <Poster lines={["Everything your content needs.", "Under one roof."]} script="all of it" scriptLine={1} />
        <p className="lede mt-8 max-w-[48ch] text-ink-dim" data-reveal="fade">{servicesLine}</p>
      </Group>
      <Group className="mt-12 md:mt-16" stagger={0.05}>
        {legs.map((l) => (
          <FlowingRow key={l.id} link="/contact" marquee={l.includes.join("  ·  ")} image={FRAME[l.id]}>
            <div className="row">
              <span className="row-rule" data-reveal="rule" />
              <Line as="h3" className="row-title poster">
                {l.title}
              </Line>
              <div className="row-body">
                <p className="lede max-w-[46ch] text-ink-dim" data-reveal="fade">{l.positioning}</p>
                <p className="small mt-4 text-ink-faint" data-reveal="fade">{l.audience}</p>
                <p className="mt-6" data-reveal="fade">
                  <Link href="/contact" className="link-underline small text-ink">
                    {l.cta} →
                  </Link>
                </p>
              </div>
            </div>
          </FlowingRow>
        ))}
        <span className="block h-px w-full bg-hairline" data-reveal="rule" />
      </Group>
      <p className="small mt-8 text-ink-faint">Every plan is customisable. Start with what you need; we build around it.</p>
    </Scene>
  );
}
