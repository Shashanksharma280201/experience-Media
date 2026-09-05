import SplitText from "@/components/bits/SplitText";

/**
 * The poster headline: condensed caps, one line per entry, with a red script
 * word tucked over the end of one line. Lines rise letter by letter (React
 * Bits SplitText); `start` decides whether that waits for the loader.
 */
export default function Poster({
  as: Tag = "h2",
  lines,
  script,
  scriptLine = lines.length - 1,
  size = "l",
  className = "",
  start = "enter",
}: {
  as?: "h1" | "h2" | "p";
  lines: string[];
  script?: string;
  scriptLine?: number;
  size?: "xl" | "l" | "m";
  className?: string;
  start?: "enter" | "intro" | "now";
}) {
  return (
    <Tag className={`poster poster--${size} ${className}`}>
      {lines.map((line, i) => (
        <span key={`${line}-${i}`} className="poster-row">
          <span className="poster-anchor">
            <SplitText tag="span" text={line} className="poster-line" start={start} delay={28} />
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
