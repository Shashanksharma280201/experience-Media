/**
 * The poster headline: condensed caps, one line per entry, with a red script
 * word tucked over the end of one line. Server-safe markup; `Group` reveals
 * the lines (mask rise) and writes the script in.
 */
export default function Poster({
  as: Tag = "h2",
  lines,
  script,
  scriptLine = lines.length - 1,
  size = "l",
  className = "",
}: {
  as?: "h1" | "h2" | "p";
  lines: string[];
  script?: string;
  scriptLine?: number;
  size?: "xl" | "l" | "m";
  className?: string;
}) {
  return (
    <Tag className={`poster poster--${size} ${className}`}>
      {lines.map((line, i) => (
        <span key={`${line}-${i}`} className="poster-row">
          {/* The anchor is as wide as the text, so the script sits at the
              line's end whatever the width of the screen. */}
          <span className="poster-anchor">
            <span className="poster-line mask-line">
              <span data-reveal="line">{line}</span>
            </span>
            {script && i === scriptLine && (
              <span aria-hidden className="poster-script" data-reveal="script">
                {script}
              </span>
            )}
          </span>
        </span>
      ))}
    </Tag>
  );
}
