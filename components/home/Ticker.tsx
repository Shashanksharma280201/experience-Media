import { Fragment } from "react";
import ScrollVelocity from "@/components/bits/ScrollVelocity";

/**
 * A band of short phrases that slides with your scroll and reverses when
 * you do (React Bits ScrollVelocity). Under the hero it is the credibility
 * strip; in the capabilities scene it is every layer of the engine.
 */
export default function Ticker({ items, label, className = "" }: { items: string[]; label: string; className?: string }) {
  // Two rows, each its own keyed element: the same element twice in an
  // array is what React warns about.
  const rows = ["a", "b"].map((id) => (
    <Fragment key={`row-${id}`}>
      {items.map((n) => (
        <span key={n} className="ticker-item">
          {n}
          <span aria-hidden className="ticker-dot" />
        </span>
      ))}
    </Fragment>
  ));
  return (
    <div className={`ticker ${className}`} aria-label={`${label}: ${items.join(", ")}`}>
      <ScrollVelocity texts={rows} velocity={60} numCopies={4} className="ticker-copy" scrollerClassName="ticker-row" />
    </div>
  );
}
