import Link from "next/link";
import Scene from "@/components/layout/Scene";
import Group from "@/components/motion/Group";
import Poster from "@/components/motion/Poster";
import Magnet from "@/components/bits/Magnet";
import PlaybookCover from "@/components/training/PlaybookCover";
import { training } from "@/lib/content";

/** 14 — training. The free playbook, with the page behind it. */
export default function Training() {
  return (
    <Scene id="training" tight>
      <Group>
        <Poster lines={training.headline} script="free" scriptLine={0} />
      </Group>
      <Group className="mt-12 grid gap-10 md:mt-16 md:grid-cols-12">
        <div className="md:col-span-7">
          <p className="micro" data-reveal="fade">free resource</p>
          <h3 className="poster poster--m mt-4" data-reveal="fade">{training.product}</h3>
          <p className="lede mt-5 max-w-[46ch] text-ink-dim" data-reveal="fade">{training.body}</p>
          <div className="mt-10" data-reveal="fade">
            <Magnet padding={40} magnetStrength={3}>
              <Link href="/training" className="button">
                {training.cta} →
              </Link>
            </Magnet>
          </div>
        </div>
        <div className="md:col-span-4 md:col-start-9" data-reveal="fade">
          <PlaybookCover />
          <p className="small mt-8 text-ink-dim">Coming next</p>
          <p className="small mt-2 text-ink-dim">{training.future.join(" · ")}</p>
        </div>
      </Group>
    </Scene>
  );
}
