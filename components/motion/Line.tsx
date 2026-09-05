/**
 * A masked line for `Group` to reveal. Server-safe: it only writes markup.
 * The outer element clips; the inner span is what rises.
 */
export default function Line({
  as: Tag = "span",
  className = "",
  children,
}: {
  as?: "span" | "h1" | "h2" | "h3" | "p" | "dd";
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <Tag className={`mask-line ${className}`}>
      <span data-reveal="line">{children}</span>
    </Tag>
  );
}
