import Shell from "./Shell";

/**
 * One act per section. A scene is at least a viewport tall and centres one
 * thing. `tone` switches the paper for the dark band; `tight` drops the
 * viewport minimum for list scenes. The band is its own layer so the page
 * can draw it in on scroll (motion #12).
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
  tone?: "paper" | "dark";
  tight?: boolean;
  bleed?: boolean;
}) {
  return (
    <section
      id={id}
      className={`scene ${tone === "dark" ? "scene--dark" : ""} ${tight ? "scene--tight" : ""} ${className}`}
    >
      {tone === "dark" && <div className="scene-ground" aria-hidden />}
      {bleed ? <div className="scene-body">{children}</div> : <Shell className="scene-body">{children}</Shell>}
    </section>
  );
}
