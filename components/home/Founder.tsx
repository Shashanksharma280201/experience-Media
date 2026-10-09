import Link from "next/link";
import Scene from "@/components/layout/Scene";
import Group from "@/components/motion/Group";
import Poster from "@/components/motion/Poster";
import Magnet from "@/components/bits/Magnet";
import { founder, site, socials } from "@/lib/content";

/** 13 — Founder's Corner. Parth, in his own words; the whole story is on /about. */
export default function Founder() {
  const links = ["YouTube", "Instagram", "LinkedIn"]
    .map((l) => socials.find((s) => s.label === l))
    .filter((s): s is (typeof socials)[number] => !!s);

  return (
    <Scene tight>
      <Group>
        <Poster lines={["Founder's", "Corner"]} script="Parth" scriptLine={1} />
      </Group>
      <Group className="mt-12 grid gap-10 md:mt-16 md:grid-cols-12">
        <div className="md:col-span-3">
          <p className="font-display text-ink [font-variation-settings:'wdth'_104,'wght'_600]" data-reveal="fade">
            {site.founder}
          </p>
          <p className="small mt-1 text-ink-dim" data-reveal="fade">
            {site.founderRole}
          </p>
          <ul className="mt-6 flex gap-6 md:flex-col md:gap-2" data-reveal="fade">
            {links.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="link-underline small text-ink-dim transition-colors hover:text-ink">
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-8 md:col-start-5">
          {founder.corner.map((p, i) => (
            <p key={i} className={`lede max-w-[48ch] text-ink-dim ${i > 0 ? "mt-7" : ""}`} data-reveal="fade">
              {p}
            </p>
          ))}
          <p className="mt-10" data-reveal="fade">
            <Magnet padding={40} magnetStrength={3}>
              <Link href="/about" className="link-underline small text-ink">
                Read Parth&rsquo;s Story →
              </Link>
            </Magnet>
          </p>
        </div>
      </Group>
    </Scene>
  );
}
