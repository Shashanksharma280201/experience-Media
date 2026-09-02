import Link from "next/link";
import Shell from "@/components/layout/Shell";
import Rule from "@/components/layout/Rule";
import { contact, site, socials } from "@/lib/content";

const year = new Date().getFullYear();

export default function Footer() {
  return (
    <footer className="relative overflow-hidden pt-[var(--section-y)]">
      {/* Accent use #1 of 5 — the second and last ambient glow on the page.
          Kept fully inside the clip box so its falloff never shows an edge. */}
      <div
        aria-hidden
        className="ambient left-1/2 top-0 h-[420px] w-[min(860px,120vw)] -translate-x-1/2"
      />

      <Shell className="relative">
        {/* The contact form directly above is the ask. This closes rather than
            repeating it — the address itself carries the weight. */}
        <p className="micro">or just email us</p>

        <div className="mt-8 grid gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            {/* Fluid rather than `heading`: the address is long and must not
                overflow at 360px. */}
            <a
              href={`mailto:${contact.email}`}
              className="link-underline font-display inline-block text-[clamp(1.35rem,4.6vw,3rem)] leading-tight tracking-[-0.028em] [font-variation-settings:'wdth'_108,'wght'_600]"
            >
              {contact.email}
            </a>
            <p className="mt-5">
              <a href={contact.whatsapp} className="link-underline lede text-bone-dim">
                {contact.phone}
              </a>
            </p>
          </div>

          <nav aria-label="Social" className="md:col-span-4 md:col-start-9">
            <ul className="grid grid-cols-2 gap-x-8 gap-y-3">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="link-underline small text-bone-dim transition-colors hover:text-bone"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <Rule className="mt-20" />

        <div className="flex flex-col gap-2 py-8 text-bone-faint md:flex-row md:items-center md:justify-between">
          <p className="small">
            © {year} {site.name}
          </p>
          <p className="small">New Delhi, India</p>
          <p className="small">
            <Link href="/work" className="link-underline">
              See the work
            </Link>
          </p>
        </div>
      </Shell>
    </footer>
  );
}
