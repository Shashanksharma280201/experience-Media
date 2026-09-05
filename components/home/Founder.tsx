import Scene from "@/components/layout/Scene";
import Group from "@/components/motion/Group";
import Poster from "@/components/motion/Poster";
import { site, socials } from "@/lib/content";

// DRAFT COPY — flagged for review.
const STORY = [
  "Parth was a creator before he ran an agency, which is why the work here starts with the audience rather than the brief.",
  "He got tired of watching agencies hand briefs to editors who had never posted anything, and of waiting weeks to learn what a piece had done. Experience Media exists to close both gaps: strategy, production and distribution in one room, with the numbers read every week.",
];

/** 09 — who runs it. */
export default function Founder() {
  const links = ["YouTube", "Instagram", "LinkedIn"]
    .map((l) => socials.find((s) => s.label === l))
    .filter((s): s is (typeof socials)[number] => !!s);
  const [first, last] = site.founder.split(" ");

  return (
    <Scene tight>
      <Group>
        <Poster lines={[first, last]} script="founder" scriptLine={1} />
      </Group>
      <Group className="mt-12 grid gap-10 md:mt-16 md:grid-cols-12">
        <ul className="flex gap-6 md:col-span-3 md:flex-col md:gap-2" data-reveal="fade">
          {links.map((s) => (
            <li key={s.label}>
              <a href={s.href} target="_blank" rel="noopener noreferrer" className="link-underline small text-ink-dim transition-colors hover:text-ink">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="md:col-span-8 md:col-start-5">
          {STORY.map((p, i) => (
            <p key={i} className={`lede max-w-[48ch] text-ink-dim ${i > 0 ? "mt-7" : ""}`} data-reveal="fade">
              {p}
            </p>
          ))}
        </div>
      </Group>
    </Scene>
  );
}
