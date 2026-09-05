import Scene from "@/components/layout/Scene";
import Group from "@/components/motion/Group";
import Line from "@/components/motion/Line";
import Poster from "@/components/motion/Poster";
import { offers } from "@/lib/content";

/** 05 — what we do. Four offers, strategy first, as poster rows. */
export default function Services() {
  return (
    <Scene id="services" tight>
      <Group>
        <Poster lines={["Four ways in,", "strategy first."]} script="always" scriptLine={1} />
      </Group>
      <Group className="mt-12 md:mt-16" stagger={0.05}>
        {offers.map((o) => (
          <div key={o.id} className="row">
            <span className="row-rule" data-reveal="rule" />
            <Line as="h3" className="row-title poster">
              {o.title}
            </Line>
            <div className="row-body">
              <p className="lede max-w-[46ch] text-ink-dim" data-reveal="fade">{o.summary}</p>
              <p className="small mt-4 text-ink-faint" data-reveal="fade">{o.services.map((s) => s.title).join(" · ")}</p>
            </div>
          </div>
        ))}
        <span className="block h-px w-full bg-hairline" data-reveal="rule" />
      </Group>
    </Scene>
  );
}
