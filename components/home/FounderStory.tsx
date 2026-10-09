import Link from "next/link";
import Scene from "@/components/layout/Scene";
import Group from "@/components/motion/Group";
import Poster from "@/components/motion/Poster";
import Magnet from "@/components/bits/Magnet";
import { founder } from "@/lib/content";

/** 04 — the founder story, in short. The whole of it is on /about. */
export default function FounderStory() {
  return (
    <Scene tight>
      <Group>
        <Poster lines={founder.headline} script="the story" scriptLine={1} />
      </Group>
      <Group className="mt-12 grid gap-10 md:mt-16 md:grid-cols-12">
        <div className="md:col-span-7">
          {founder.story.slice(0, 3).map((p, i) => (
            <p key={i} className={`lede max-w-[48ch] text-ink-dim ${i > 0 ? "mt-6" : ""}`} data-reveal="fade">
              {p}
            </p>
          ))}
        </div>
        <div className="md:col-span-4 md:col-start-9 md:self-end" data-reveal="fade">
          <Magnet padding={40} magnetStrength={3}>
            <Link href="/about" className="button">
              Meet Parth →
            </Link>
          </Magnet>
        </div>
      </Group>
    </Scene>
  );
}
