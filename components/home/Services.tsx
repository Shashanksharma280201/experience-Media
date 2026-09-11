import Scene from "@/components/layout/Scene";
import Group from "@/components/motion/Group";
import Line from "@/components/motion/Line";
import Poster from "@/components/motion/Poster";
import { FlowingRow } from "@/components/bits/FlowingMenu";
import { disciplines, offers } from "@/lib/content";

/** A frame for each offer's marquee, from the work it most resembles. */
const FRAME: Record<string, string> = {
  strategy: disciplines[1].items[0].thumb,
  "content-engine": disciplines[0].items[0].thumb,
  "brand-films": disciplines[3].items[0].thumb,
  "post-vfx": disciplines[4].items[0].thumb,
};

/**
 * 06 — what we do. Four offers, strategy first. Each row is a React Bits
 * FlowingRow: hover slides a marquee of the offer's services across it.
 */
export default function Services() {
  return (
    <Scene id="services" tight>
      <Group>
        <Poster lines={["Four ways in,", "strategy first."]} script="always" scriptLine={1} />
      </Group>
      <Group className="mt-12 md:mt-16" stagger={0.05}>
        {offers.map((o) => (
          <FlowingRow key={o.id} link="/#contact" marquee={o.services.map((s) => s.title).join("  ·  ")} image={FRAME[o.id]}>
            <div className="row">
              <span className="row-rule" data-reveal="rule" />
              <Line as="h3" className="row-title poster">
                {o.title}
              </Line>
              <div className="row-body">
                <p className="lede max-w-[46ch] text-ink-dim" data-reveal="fade">{o.summary}</p>
                <p className="small mt-4 text-ink-faint" data-reveal="fade">{o.services.map((s) => s.title).join(" · ")}</p>
              </div>
            </div>
          </FlowingRow>
        ))}
        <span className="block h-px w-full bg-hairline" data-reveal="rule" />
      </Group>
    </Scene>
  );
}
