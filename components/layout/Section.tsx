import Shell from "./Shell";

/**
 * Vertical rhythm + the optional parenthetical micro label.
 * `bleed` opts out of the measure for full-width children (marquees).
 */
export default function Section({
  id,
  label,
  children,
  className = "",
  bleed = false,
}: {
  id?: string;
  label?: string;
  children: React.ReactNode;
  className?: string;
  bleed?: boolean;
}) {
  const body = (
    <>
      {label && <p className="micro mb-10 md:mb-14">{label}</p>}
      {children}
    </>
  );

  return (
    <section id={id} className={`py-[var(--section-y)] ${className}`}>
      {bleed ? body : <Shell>{body}</Shell>}
    </section>
  );
}
