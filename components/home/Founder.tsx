import Section from "@/components/layout/Section";
import { site, socials } from "@/lib/content";

// DRAFT COPY — flagged for review.
// No portrait exists in the repo. Rather than pad with stock imagery, this is
// typographic. Drop a photo into /public/assets/founder.jpg and it can take
// the left column.
const STORY = [
  "Experience Media is founder-led. Parth was a creator before he was a studio, which is the whole reason the work is built the way it is.",
  "He got tired of briefing editors who had never posted anything, waited on a feedback loop, and watched the timing that made a video work disappear. So the studio was built to close that gap.",
];

export default function Founder() {
  const yt = socials.find((s) => s.label === "YouTube");
  const ig = socials.find((s) => s.label === "Instagram");

  return (
    <Section label="who runs it">
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-4">
          <h2 className="display-m">{site.founder}</h2>
          <p className="small mt-3 text-bone-faint">Founder</p>

          <ul className="mt-8 flex gap-8">
            {[yt, ig].map(
              (s) =>
                s && (
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
                )
            )}
          </ul>
        </div>

        <div className="md:col-span-7 md:col-start-6">
          {STORY.map((p, i) => (
            <p key={i} className={`lede text-bone-dim ${i > 0 ? "mt-7" : ""}`}>
              {p}
            </p>
          ))}
        </div>
      </div>
    </Section>
  );
}
