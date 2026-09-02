import { ImageResponse } from "next/og";
import { EMBLEM_PATHS, EMBLEM_VIEWBOX } from "@/components/brand/emblem-paths";

export const alt = "Experience Media — video and content studio, New Delhi";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0A0A0B",
          color: "#F4F0EA",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          fontFamily: "sans-serif",
        }}
      >
        <svg viewBox={EMBLEM_VIEWBOX} width={132} fill="#F4F0EA" fillRule="evenodd">
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
          <div style={{ width: 56, height: 3, background: "#FF2D20" }} />
          <div style={{ fontSize: 26, color: "rgba(244,240,234,0.56)" }}>
            Experience Media — New Delhi
          </div>
        </div>
      </div>
    ),
    size
  );
}
