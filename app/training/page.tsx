import type { Metadata } from "next";
import Scene from "@/components/layout/Scene";
import Group from "@/components/motion/Group";
import Poster from "@/components/motion/Poster";
import PlaybookForm from "@/components/training/PlaybookForm";
import { training } from "@/lib/content";

export const metadata: Metadata = {
  title: "Training",
  description: `${training.product}: ${training.body}`,
};

/** §9 of the brief — the training page, educational and practical. */
export default function TrainingPage() {
  return (
    <>
      <Scene className="pt-32 md:pt-40">
        <Group onLoad stagger={0.07}>
          <Poster as="h1" lines={training.headline} script="free" scriptLine={0} start="intro" />
          <p className="lede mt-10 max-w-[48ch] text-ink-dim" data-reveal="fade">
            Everything we do for clients runs on a system. Here is the system, written down, so you can run it yourself.
          </p>
        </Group>
      </Scene>

      <Scene tone="sun" tight>
        <Group className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="micro" data-reveal="fade">free resource</p>
            <h2 className="poster poster--l mt-4" data-reveal="fade">{training.product}</h2>
            <p className="lede mt-6 max-w-[40ch] text-ink-dim" data-reveal="fade">{training.body}</p>
            <ul className="mt-8 flex flex-col gap-2" data-reveal="fade">
              {["Week 1 — Positioning and pillars", "Week 2 — Ideas, hooks and scripts", "Week 3 — Shooting and editing in batches", "Week 4 — Publishing, reading the numbers, repeating"].map((w) => (
                <li key={w} className="small text-ink-dim">
                  {w}
                </li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-6 md:col-start-7" data-reveal="fade">
            <PlaybookForm />
          </div>
        </Group>
      </Scene>

      <Scene tight>
        <Group>
          <Poster lines={["Coming", "next."]} script="soon" scriptLine={1} />
          <ul className="mt-10 grid gap-6 border-t border-hairline pt-8 sm:grid-cols-2 md:grid-cols-4" data-reveal="fade">
            {training.future.map((f) => (
              <li key={f} className="poster poster--m">
                {f}
              </li>
            ))}
          </ul>
          <p className="lede mt-10 max-w-[46ch] text-ink-dim" data-reveal="fade">
            A one-to-two-hour structured course is in the works. The playbook list hears about it first.
          </p>
        </Group>
      </Scene>
    </>
  );
}
