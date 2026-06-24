import Reveal from "./Reveal";
import { site, socials } from "@/lib/content";

const yt = socials.find((s) => s.label === "YouTube");
const ig = socials.find((s) => s.label === "Instagram");

export default function Founder() {
  return (
    <section className="mx-auto max-w-[1600px] px-5 py-20 md:px-10 md:py-28">
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-3">
          <p className="eyebrow text-accent">Founder-led</p>
          <p className="eyebrow mt-4 text-ink-faint">[ The studio ]</p>
        </div>

        <Reveal className="md:col-span-9" stagger>
          <p className="display text-[clamp(1.6rem,4.2vw,3.2rem)] leading-[1.05]">
            {site.name} is a founder-led digital marketing &amp; content studio,
            built by <span className="text-accent">{site.founder}</span> — a digital
            creator turned founder.
          </p>
          <p className="mt-8 max-w-2xl text-base text-ink-soft md:text-lg">
            We work the way a creator thinks and an agency delivers: strategy,
            storytelling and edit-craft under one roof — from short-form that travels
            to long-form that builds authority, plus full YouTube and social
            management for brands and creators alike.
          </p>
          <div className="mt-10 flex flex-wrap gap-x-10 gap-y-4">
            <a
              href={yt?.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 border-b border-line pb-1 transition-colors hover:border-accent"
            >
              <span className="eyebrow">YouTube</span>
              <span className="font-mono text-xs text-ink-faint group-hover:text-accent">@{yt?.handle}</span>
            </a>
            <a
              href={ig?.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 border-b border-line pb-1 transition-colors hover:border-accent"
            >
              <span className="eyebrow">Instagram</span>
              <span className="font-mono text-xs text-ink-faint group-hover:text-accent">@{ig?.handle}</span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
