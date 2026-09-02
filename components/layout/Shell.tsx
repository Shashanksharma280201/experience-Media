/** The measure. Every non-bleed block on the site sits inside this. */
export default function Shell({
  children,
  className = "",
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "header" | "footer" | "section";
}) {
  return (
    <Tag
      className={`mx-auto w-full max-w-[var(--container-shell)] px-[var(--gutter)] ${className}`}
    >
      {children}
    </Tag>
  );
}
