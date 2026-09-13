import Shell from "./Shell";

/**
 * One act per section. A scene is at least a viewport tall and centres one
 * thing. `tone` switches the paper for a pop tint or the red block; `tight`
 * drops the viewport minimum for list scenes. A tint is its own layer so
 * the page can draw it in on scroll; the red block is where the site stops
 * performing, so it stays solid.
 */
export default function Scene({
  id,
  children,
  className = "",
  tone = "paper",
  tight = false,
  bleed = false,
}: {
  id?: string;
  children: React.ReactNode;
  className?: string;
  tone?: "paper" | "signal" | "sun" | "mint" | "sky" | "rose";
  tight?: boolean;
  bleed?: boolean;
}) {
  return (
    <section
      id={id}
      className={`scene ${tone !== "paper" ? `scene--${tone}` : ""} ${tight ? "scene--tight" : ""} ${className}`}
    >
      {tone !== "paper" && tone !== "signal" && <div className="scene-ground" aria-hidden />}
      {bleed ? <div className="scene-body">{children}</div> : <Shell className="scene-body">{children}</Shell>}
    </section>
  );
}
