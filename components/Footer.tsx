import Link from "next/link";
import Emblem from "@/components/brand/Emblem";
import Shell from "@/components/layout/Shell";
import Group from "@/components/motion/Group";
import TextPressure from "@/components/bits/TextPressure";
import CurvedLoop from "@/components/bits/CurvedLoop";
import { contact, site, socials } from "@/lib/content";

const year = new Date().getFullYear();

/** The red block. The wordmark at full width, the script over it. */
export default function Footer() {
  return (
    <footer className="redblock relative overflow-hidden pt-[var(--section-y)]">
      <Emblem className="footer-mark" />
      {/* React Bits CurvedLoop: the line, curved and draggable. */}
      <div className="curve -mt-6 mb-10 md:-mt-10">
        <CurvedLoop marqueeText="We make things people finish watching ✦" speed={1.4} curveAmount={220} />
      </div>
      <Shell>
        <Group>
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-7">
              <Emblem className="mb-8 h-14 w-auto md:h-16" title={site.name} />
              <p className="micro" data-reveal="fade">or just email us</p>
              <p className="mt-4">
                <a href={`mailto:${contact.email}`} className="link-underline inline-block font-display text-[clamp(1.1rem,4.4vw,2rem)] leading-tight [font-variation-settings:'wdth'_104,'wght'_600]" data-reveal="fade">
                  {contact.email}
                </a>
              </p>
              <p className="mt-3" data-reveal="fade">
                <a href={contact.whatsapp} className="link-underline lede">{contact.phone}</a>
              </p>
            </div>
            <nav aria-label="Social" className="md:col-span-4 md:col-start-9">
              <ul className="grid grid-cols-2 gap-x-8 gap-y-3">
                {socials.map((s) => (
                  <li key={s.label} data-reveal="fade">
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="link-underline small">{s.label}</a>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* React Bits TextPressure: the wordmark's width axis follows the cursor. */}
          <div className="relative mt-16 md:mt-24" data-reveal="fade">
            <TextPressure text="Experience" label={site.name} className="wordmark-live" />
            <span aria-hidden className="poster-script wordmark-script" data-reveal="script">
              Media
            </span>
          </div>
        </Group>

        <div className="mt-8 flex flex-col gap-2 border-t py-6 md:flex-row md:items-center md:justify-between" style={{ borderColor: "rgba(10,10,11,0.35)" }}>
          <p className="small">© {year} {site.name}</p>
          <p className="small">{site.tagline}</p>
          <p className="small">
            <Link href="/work" className="link-underline">See the work</Link>
          </p>
        </div>
      </Shell>
    </footer>
  );
}
