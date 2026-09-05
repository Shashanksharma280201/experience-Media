import Scene from "@/components/layout/Scene";
import Group from "@/components/motion/Group";
import Line from "@/components/motion/Line";
import Poster from "@/components/motion/Poster";
import { process } from "@/lib/content";

/** 06 — how we work. Four moves, as poster rows. */
export default function Process() {
  return (
    <Scene tone="sky" tight>
      <Group>
        <Poster lines={["Brief to published", "in four moves."]} script="quickly" scriptLine={1} />
      </Group>
      <Group className="mt-12 md:mt-16" stagger={0.05}>
        {process.map((step) => (
          <div key={step.title} className="row">
            <span className="row-rule" data-reveal="rule" />
            <Line as="h3" className="row-title poster">
              {step.title}
            </Line>
            <p className="row-body lede max-w-[46ch] text-ink-dim" data-reveal="fade">{step.body}</p>
          </div>
        ))}
        <span className="block h-px w-full bg-hairline" data-reveal="rule" />
      </Group>
    </Scene>
  );
}
