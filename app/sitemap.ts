import type { MetadataRoute } from "next";
import { disciplines } from "@/lib/content";

const BASE = "https://experiencemedia.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: `${BASE}/`, lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: `${BASE}/work`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    ...disciplines.map((d) => ({
      url: `${BASE}/work/${d.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ];
}
