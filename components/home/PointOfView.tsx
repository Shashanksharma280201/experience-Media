import Timecode from "@/components/chrome/Timecode";
import Reveal from "@/components/Reveal";

// CONTENT STATUS: draft. This section is where the studio states the belief that
// makes it different — the equivalent of Direct's "AI-second policy". It is the
// one thing on this page that cannot be written from the codebase.
// Per spec, it ships with real copy or it does not ship at all.
const DRAFT = {
  statement: "Draft — the one belief that makes Experience Media different.",
  principles: [
    "Draft — principle one, stated as a commitment rather than a feature.",
    "Draft — principle two.",
    "Draft — principle three.",
  ],
};

export default function PointOfView({ index, total }: { index: number; total: number }) {
  return (
    <section
      id="point-of-view"
      className="bg-paper text-void"
      /* The single inversion on the page. */
    >
      <div className="mx-auto max-w-[1600px] px-5 py-24 md:px-10 md:py-36">
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-void/15 pb-6">
          <span className="eyebrow bg-void px-2 py-1 text-paper">Draft copy</span>
          <div className="[&_*]:!text-void/50">
            <Timecode index={index} total={total} label="Point of view" />
          </div>
        </div>

        <Reveal stagger>
          <p className="display mt-12 max-w-5xl text-[clamp(2rem,6vw,5rem)]">
            {DRAFT.statement}
          </p>

          <ol className="mt-16 grid gap-px border border-void/15 bg-void/15 md:grid-cols-3">
            {DRAFT.principles.map((p, i) => (
              <li key={i} className="bg-paper p-8">
                <span className="eyebrow text-void/50">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="mt-4 text-base leading-relaxed text-void/80">{p}</p>
              </li>
            ))}
          </ol>
        </Reveal>
      </div>
    </section>
  );
}
