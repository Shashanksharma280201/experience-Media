/**
 * Deliverables as timeline tracks. `V` for picture, `A` for the audio bed —
 * the clearest way to show what actually shipped.
 */
export default function TrackStack({ deliverables }: { deliverables: string[] }) {
  return (
    <ul className="border-t border-rule">
      {deliverables.map((d, i) => (
        <li
          key={d}
          className="flex items-center gap-5 border-b border-rule py-4"
        >
          <span className="eyebrow w-8 shrink-0 tabular-nums text-accent">
            V{i + 1}
          </span>
          <span
            aria-hidden
            className="h-2 shrink-0 bg-accent/25"
            style={{ width: `${28 + ((i * 37) % 44)}%` }}
          />
          <span className="text-sm text-paper/70">{d}</span>
        </li>
      ))}
    </ul>
  );
}
