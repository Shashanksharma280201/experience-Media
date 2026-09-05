import { Fragment } from "react";
import ScrollVelocity from "@/components/bits/ScrollVelocity";
import { disciplines } from "@/lib/content";

/**
 * Between the hero and the reel: the five disciplines as a band that slides
 * with your scroll and reverses when you do (React Bits ScrollVelocity).
 */
export default function Ticker() {
  const names = disciplines.map((d) => d.title);
  // Two rows, each its own keyed element: the same element twice in an
  // array is what React warns about.
  const rows = ["a", "b"].map((id) => (
    <Fragment key={`row-${id}`}>
      {names.map((n) => (
        <span key={n} className="ticker-item">
          {n}
          <span aria-hidden className="ticker-dot" />
        </span>
      ))}
    </Fragment>
  ));
  return (
    <div className="ticker" aria-label={`Disciplines: ${names.join(", ")}`}>
      <ScrollVelocity texts={rows} velocity={60} numCopies={4} className="ticker-copy" scrollerClassName="ticker-row" />
    </div>
  );
}
