import { sectionTimecode } from "@/lib/timecode";

/**
 * A section's slate. The timecode is deterministic from the section's place on
 * the reel — it does not tick with scroll; only the scrubber's readout does.
 */
export default function Timecode({
  index,
  total,
  label,
}: {
  index: number;
  total: number;
  label: string;
}) {
  return (
    <div className="eyebrow flex items-center gap-3 text-paper/40">
      <span className="tabular-nums">{sectionTimecode(index, total)}</span>
      <span aria-hidden className="h-px w-6 bg-rule" />
      <span className="text-paper/60">
        Reel {String(index + 1).padStart(2, "0")} — {label}
      </span>
    </div>
  );
}
