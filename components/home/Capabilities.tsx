import Scene from "@/components/layout/Scene";
import Group from "@/components/motion/Group";
import Poster from "@/components/motion/Poster";
import Ticker from "@/components/home/Ticker";
import { capabilities } from "@/lib/content";

/** 09 — every layer of the content engine, as the band that rides the scroll. */
export default function Capabilities() {
  return (
    <Scene tight bleed>
      <div className="px-[var(--gutter)]">
        <Group>
          <Poster lines={["One team.", "Every layer of the content engine."]} script="all in" scriptLine={0} />
        </Group>
      </div>
      <Ticker items={capabilities} label="Capabilities" className="mt-12 md:mt-16" />
    </Scene>
  );
}
