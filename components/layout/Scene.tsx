import Shell from "./Shell";

/**
 * One act per section. A scene is at least a viewport tall and centres one
 * thing. `tone` switches the paper for a pop tint or the red block; `tight`
 * drops the viewport minimum for list scenes.
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
      {bleed ? <div className="scene-body">{children}</div> : <Shell className="scene-body">{children}</Shell>}
    </section>
  );
}
