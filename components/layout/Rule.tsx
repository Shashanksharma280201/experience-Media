/** A 1px hairline. The only divider on the site — no cards, no shadows. */
export default function Rule({ className = "" }: { className?: string }) {
  return <hr className={`h-px w-full border-0 bg-hairline ${className}`} />;
}
