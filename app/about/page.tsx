import type { Metadata } from "next";
import Link from "next/link";
import Scene from "@/components/layout/Scene";
import Group from "@/components/motion/Group";
import Poster from "@/components/motion/Poster";
import Magnet from "@/components/bits/Magnet";
import { founder, site, socials, statement } from "@/lib/content";

export const metadata: Metadata = {
  title: "About",
  description: "Parth Malhotra started creating with ₹5,000, a phone and an obsession with figuring out how videos worked. This is how that became Experience Media.",
};

/** §5 of the brief — the founder story, in full. */
export default function AboutPage() {
  return (
    <>
      <Scene className="pt-32 md:pt-40">
        <Group onLoad stagger={0.07}>
          <Poster as="h1" lines={founder.headline} script="the story" scriptLine={1} start="intro" />
          <p className="mt-10 font-display text-ink [font-variation-settings:'wdth'_104,'wght'_600]" data-reveal="fade">
            {site.founder}
          </p>
          <p className="small mt-1 text-ink-dim" data-reveal="fade">
            {site.founderRole}
          </p>
        </Group>
      </Scene>

      <Scene tight>
        <Group className="grid gap-10 md:grid-cols-12" stagger={0.05}>
          <div className="md:col-span-7 md:col-start-3">
            {founder.story.map((p, i) => (
              <p key={i} className={`lede max-w-[52ch] text-ink-dim ${i > 0 ? "mt-6" : ""}`} data-reveal="fade">
                {p}
              </p>
            ))}
          </div>
        </Group>
      </Scene>

      <Scene tone="sky" tight>
        <Group>
          <Poster as="p" size="l" lines={["What if we could", "create such a good", "experience for our", "clients that they", "never wanted to work", "with anyone else?"]} script="the question" scriptLine={0} />
        </Group>
      </Scene>

      <Scene tight>
        <Group className="grid gap-10 md:grid-cols-12" stagger={0.06}>
          <div className="md:col-span-7 md:col-start-3">
            <p className="lede max-w-[52ch] text-ink-dim" data-reveal="fade">{founder.after}</p>
            <ul className="mt-10">
              {founder.principle.map((line) => (
                <li key={line} className="display-m border-t border-hairline py-5" data-reveal="fade">
                  {line}
                </li>
              ))}
            </ul>
            <ul className="mt-12 flex flex-wrap gap-6" data-reveal="fade">
              {socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className="link-underline small text-ink-dim transition-colors hover:text-ink">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </Group>
      </Scene>

      <Scene tone="signal" className="redblock" tight>
        <Group stagger={0.1}>
          <p className="micro" data-reveal="fade">{site.name} · {site.tagline}</p>
          <div className="mt-8">
            {statement.map((line) => (
              <p key={line} className="display-m max-w-[30ch]" data-reveal="fade">
                {line}
              </p>
            ))}
          </div>
          <p className="mt-12" data-reveal="fade">
            <Magnet padding={40} magnetStrength={3}>
              <Link href="/contact" className="button">
                Start a Project →
              </Link>
            </Magnet>
          </p>
        </Group>
      </Scene>
    </>
  );
}
