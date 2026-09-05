import Link from "next/link";
import Shell from "@/components/layout/Shell";
import Group from "@/components/motion/Group";
import { contact, site, socials } from "@/lib/content";

const year = new Date().getFullYear();

/** The red block. The wordmark at full width, the script over it. */
export default function Footer() {
  return (
    <footer className="redblock relative overflow-hidden pt-[var(--section-y)]">
      <Shell>
        <Group>
          <div className="grid gap-10 md:grid-cols-12">
            <div className="md:col-span-7">
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

          <div className="relative mt-16 md:mt-24">
            <p className="wordmark mask-line">
              <span data-reveal="line" aria-hidden>
                Experience
              </span>
              <span className="sr-only">{site.name}</span>
            </p>
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
