import Image from "next/image";
import Scene from "@/components/layout/Scene";
import Group from "@/components/motion/Group";
import Poster from "@/components/motion/Poster";
import ScrollStack, { ScrollStackItem } from "@/components/bits/ScrollStack";
import { process, processClose, processFrames } from "@/lib/content";

/**
 * 10 — how we work. Four moves as cards that stack as you scroll (React
 * Bits ScrollStack): each pins under the last and settles slightly smaller.
 */
export default function Process() {
  return (
    <Scene tone="dark" tight>
      <Group>
        <Poster lines={["From idea to impact.", "Without the usual", "agency chaos."]} script="calmly" scriptLine={2} />
      </Group>
      <ScrollStack className="mt-12 md:mt-16" itemDistance={40} itemStackDistance={24} stackPosition="18%" scaleEndPosition="8%" baseScale={0.9} itemScale={0.025}>
        {process.map((step, i) => (
          <ScrollStackItem key={step.title} itemClassName="stack-card">
            <div className="md:grid md:grid-cols-12 md:gap-8">
              <div className="md:col-span-7">
                <p className="num">{step.n}</p>
                <h3 className="poster poster--m mt-3">{step.title}</h3>
                <p className="lede mt-5 max-w-[46ch] text-ink-dim">{step.body}</p>
              </div>
              <div className="stack-frame mt-6 md:col-span-4 md:col-start-9 md:mt-0" aria-hidden>
                <Image src={processFrames[i]} alt="" fill sizes="(min-width: 768px) 28vw, 100vw" loading="lazy" className="object-cover" />
              </div>
            </div>
          </ScrollStackItem>
        ))}
      </ScrollStack>
      <Group className="mt-12 md:mt-16">
        <p className="display-m max-w-[24ch]" data-reveal="fade">{processClose}</p>
      </Group>
    </Scene>
  );
}
