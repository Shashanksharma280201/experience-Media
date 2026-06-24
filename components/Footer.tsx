import Link from "next/link";
import { contact, socials, site } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="bg-night text-paper">
      <div className="mx-auto max-w-[1600px] px-5 py-16 md:px-10 md:py-24">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-6">
            <p className="eyebrow text-accent">Get in touch</p>
            <h2 className="display mt-5 text-[clamp(2.5rem,7vw,6rem)]">
              Let&apos;s make
              <br />
              something
              <span className="text-accent"> people share.</span>
            </h2>
            <div className="mt-10 flex flex-col gap-3">
              <a
                href={`mailto:${contact.email}`}
                className="w-fit border-b border-paper/30 pb-1 text-lg transition-colors hover:border-accent hover:text-accent"
              >
                {contact.email}
              </a>
              <a
                href={contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-fit border-b border-paper/30 pb-1 text-lg transition-colors hover:border-accent hover:text-accent"
              >
                {contact.phone}
              </a>
            </div>
          </div>

          <div className="md:col-span-3 md:col-start-9">
            <p className="eyebrow text-paper/50">Social</p>
            <ul className="mt-5 flex flex-col gap-3">
              {socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-baseline justify-between gap-4 border-b border-paper/10 py-2 transition-colors hover:text-accent"
                  >
                    <span>{s.label}</span>
                    <span className="font-mono text-xs text-paper/40 group-hover:text-accent">
                      @{s.handle}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-start justify-between gap-4 border-t border-paper/15 pt-8 text-xs text-paper/50 md:flex-row md:items-center">
          <div className="flex items-center gap-2">
            <span className="display text-base text-paper">
              Experience<span className="text-accent">Media</span>
            </span>
          </div>
          <p className="font-mono">© 2025 {site.name}. All rights reserved.</p>
          <p className="font-mono">
            Site:{" "}
            <Link href="/" className="hover:text-accent">
              v1 redesign
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
