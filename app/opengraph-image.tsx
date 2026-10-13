import { ImageResponse } from "next/og";
import { EMBLEM_PATHS, EMBLEM_VIEWBOX } from "@/components/brand/emblem-paths";

export const alt = "Experience Media — 360° Media & Marketing Agency";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#F5F6F7",
          color: "#15171A",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <svg viewBox={EMBLEM_VIEWBOX} width={132} fill="#15171A" fillRule="evenodd">
          {EMBLEM_PATHS.map((p) => (
            <path key={p.id} d={p.d} />
          ))}
        </svg>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 82, fontWeight: 700, letterSpacing: -3, lineHeight: 1.02 }}>
            We make things people
          </div>
          <div style={{ fontSize: 82, fontWeight: 700, letterSpacing: -3, lineHeight: 1.02 }}>
            finish watching.
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div style={{ width: 56, height: 2, background: "#1F3DFF" }} />
          <div style={{ fontSize: 26, color: "rgba(21,23,26,0.72)" }}>
            Experience Media — 360° Media & Marketing Agency
          </div>
        </div>

      </div>
    ),
    size
  );
}
