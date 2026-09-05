import Scene from "@/components/layout/Scene";
import Group from "@/components/motion/Group";
import Poster from "@/components/motion/Poster";
import ScrollStack, { ScrollStackItem } from "@/components/bits/ScrollStack";
import { process } from "@/lib/content";

/**
 * 06 — how we work. Four moves as cards that stack as you scroll (React
 * Bits ScrollStack): each pins under the last and settles slightly smaller.
 */
export default function Process() {
  return (
    <Scene tone="sky" tight>
      <Group>
        <Poster lines={["Brief to published", "in four moves."]} script="quickly" scriptLine={1} />
      </Group>
      <ScrollStack className="mt-12 md:mt-16" itemDistance={40} itemStackDistance={24} stackPosition="18%" scaleEndPosition="8%" baseScale={0.9} itemScale={0.025}>
        {process.map((step) => (
          <ScrollStackItem key={step.title} itemClassName="stack-card">
            <h3 className="poster poster--m">{step.title}</h3>
            <p className="lede mt-5 max-w-[46ch] text-ink-dim">{step.body}</p>
          </ScrollStackItem>
        ))}
      </ScrollStack>
    </Scene>
  );
}
