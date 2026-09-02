import { EMBLEM_PATHS, EMBLEM_VIEWBOX } from "./emblem-paths";

/** The mark, filled. Inherits colour via `currentColor`. */
export default function Emblem({
  className = "",
  title,
}: {
  className?: string;
  title?: string;
}) {
  return (
    <svg
      viewBox={EMBLEM_VIEWBOX}
      className={className}
      fill="currentColor"
      fillRule="evenodd"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
    >
      {title && <title>{title}</title>}
      {EMBLEM_PATHS.map((p) => (
        <path key={p.id} d={p.d} />
      ))}
    </svg>
  );
}
