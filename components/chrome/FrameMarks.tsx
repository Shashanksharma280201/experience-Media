/**
 * Camera framing guides — four corner brackets drawn inside the parent box.
 * Parent must be `relative`. Purely decorative.
 */
export default function FrameMarks({
  className = "",
  size = "size-4",
}: {
  className?: string;
  size?: string;
}) {
  const base = `pointer-events-none absolute ${size} border-paper/25 transition-colors duration-300 group-hover:border-accent`;
  return (
    <span aria-hidden className={`pointer-events-none absolute inset-0 ${className}`}>
      <span className={`${base} left-0 top-0 border-l border-t`} />
      <span className={`${base} right-0 top-0 border-r border-t`} />
      <span className={`${base} bottom-0 left-0 border-b border-l`} />
      <span className={`${base} bottom-0 right-0 border-b border-r`} />
    </span>
  );
}
