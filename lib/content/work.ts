// The body of work, organised by discipline.
//
// Every piece below is real: a real thumbnail and a real outbound link that
// already existed in the repo. The prose (`blurb`, `context`, `approach`) is
// DRAFT COPY written for shape — flagged for review. `outcome` is deliberately
// absent until Experience Media supplies figures it is willing to publish.

const T = "/assets/agency-thumbnails";
const F = "/assets/featured";

export type PortfolioItem = {
  thumb: string;
  href: string;
  platform: "YouTube" | "Instagram";
};

export type Discipline = {
  slug: string;
  title: string;
  /** One line with actual substance, used on the home page. */
  blurb: string;
  context: string;
  approach: string;
  /** Only set once there is a real, publishable number. */
  outcome?: string;
  layout: "short" | "long";
  period: string;
  items: PortfolioItem[];
};

export const disciplines: Discipline[] = [
  {
    slug: "short-format",
    title: "Short Format",
    blurb: "Reels cut for the first two seconds, because nothing after them matters if those fail.",
    context:
      "Short-form lives or dies in the opening beat. Most of this work is for creators whose audiences decide within a scroll-length whether to stay.",
    approach:
      "We cut the hook first and build backwards from it, so the edit is designed around retention rather than trimmed to fit it afterwards.",
    layout: "short",
    period: "2024—25",
    items: [
      { thumb: `${T}/3a9c0636b91743fca280178b7194aa5a.jpg`, href: "https://www.instagram.com/reel/DFb0SF-IaaX/", platform: "Instagram" },
      { thumb: `${T}/6fda69dd28134dc6b99db07f5feeb431.jpg`, href: "https://www.instagram.com/reel/DFQN5MTz5VB/", platform: "Instagram" },
      { thumb: `${T}/620df32f4bd04c518ce319acec86882f.jpg`, href: "https://www.instagram.com/reel/DHD5w1yI0J3/", platform: "Instagram" },
      { thumb: `${T}/1f6ca053bbc447c5b8bb92979fe4c2e5.jpg`, href: "https://www.instagram.com/reel/DFc5lTATX5r/", platform: "Instagram" },
      { thumb: `${T}/8bda5a6d47814934861fb1921f37a0be.jpg`, href: "https://www.instagram.com/p/DGLAMhMT9iy/", platform: "Instagram" },
      { thumb: `${T}/4677ab2051b54394b3baff4d7ebf97dd.jpg`, href: "https://www.instagram.com/reel/DFfzNNYqb0X/", platform: "Instagram" },
      { thumb: `${T}/6509482b6952400cbefdb29fc316715f.jpg`, href: "https://www.instagram.com/reel/C4A0B2RxsaH/", platform: "Instagram" },
      { thumb: `${T}/abe377cf58954f2391c0aaa7798630da.jpg`, href: "https://www.instagram.com/p/DFNr7nHM_Je/", platform: "Instagram" },
      { thumb: `${T}/e569d2f10d894837b8d9c71f2f663262.jpg`, href: "https://www.instagram.com/reel/DEkFUWCBga8/", platform: "Instagram" },
      { thumb: `${F}/oK1jMtrgQU4-portrait.jpg`, href: "https://youtube.com/shorts/oK1jMtrgQU4", platform: "YouTube" },
      { thumb: `${F}/Jytd_jziLbg-portrait.jpg`, href: "https://youtube.com/shorts/Jytd_jziLbg", platform: "YouTube" },
      { thumb: `${F}/REsDZpbQPew-portrait.jpg`, href: "https://youtube.com/shorts/REsDZpbQPew", platform: "YouTube" },
    ],
  },
  {
    slug: "long-form",
    title: "Long-Form",
    blurb: "Videos built to hold attention past the ten-minute mark, where authority actually compounds.",
    context:
      "Long-form is where a channel earns trust, but it is also where most edits sag — the middle third is where audiences leave.",
    approach:
      "We structure long-form around a spine of turns rather than a flat narration, so there is a reason to stay every ninety seconds.",
    layout: "long",
    period: "2024—25",
    items: [
      { thumb: `${T}/thumbnail-5.jpeg`, href: "https://www.youtube.com/watch?v=VHXEU4rq6rY&t=1s", platform: "YouTube" },
      { thumb: `${T}/thumbnail-6.jpeg`, href: "https://www.youtube.com/watch?v=kK9E95EuZGY", platform: "YouTube" },
      { thumb: `${T}/thumbnail-7.jpeg`, href: "https://www.youtube.com/watch?v=yY2_fxZ1CdM", platform: "YouTube" },
      { thumb: `${T}/wanders-hub-type-edit.jpg`, href: "https://www.youtube.com/watch?v=6pPNOvofdWs", platform: "YouTube" },
      { thumb: `${T}/premier-pro-fast-paced-basic-edit.jpg`, href: "https://www.youtube.com/watch?v=-UMG-7b5Fyc", platform: "YouTube" },
      { thumb: `${T}/fast-paced-premier-pro-videos.png`, href: "https://www.youtube.com/watch?v=xRNt1hz_2ho", platform: "YouTube" },
      { thumb: `${F}/gzb4m1xQEiQ.jpg`, href: "https://youtu.be/gzb4m1xQEiQ", platform: "YouTube" },
    ],
  },
  {
    slug: "podcast",
    title: "Podcast",
    blurb: "Multi-camera conversation cut so it reads as a show, not a recording of one.",
    context:
      "Podcast video is usually treated as documentation — two fixed angles and a switch every time someone speaks.",
    approach:
      "We cut on meaning rather than on who is talking, and treat the room, the cutaways and the sound bed as part of the edit rather than coverage.",
    layout: "long",
    period: "2024—25",
    items: [
      { thumb: `${T}/thumbnail-1.jpeg`, href: "https://www.youtube.com/watch?v=8nES01011GY", platform: "YouTube" },
      { thumb: `${T}/thumbnail-2.jpeg`, href: "https://www.youtube.com/watch?v=-DBx9Ss1C-g", platform: "YouTube" },
      { thumb: `${T}/thumbnail-3.jpeg`, href: "https://www.youtube.com/watch?v=jSO7SYg5Ucg", platform: "YouTube" },
      { thumb: `${T}/thumbnail-4.jpeg`, href: "https://www.youtube.com/watch?v=9obwr-EzcZc", platform: "YouTube" },
      { thumb: `${T}/thumbnail.jpeg`, href: "https://www.youtube.com/watch?v=CCTpxFwZPFg", platform: "YouTube" },
    ],
  },
  {
    slug: "motion-graphics",
    title: "Motion Graphics",
    blurb: "Explainers and data animation, built so the graphic carries the argument.",
    context:
      "The explainer space converged on one visual grammar, and audiences stopped seeing it. Charts arrive, sit there, and cut away.",
    approach:
      "We build data sequences as continuous camera moves rather than a series of cuts, so a graph never resets the viewer's attention mid-idea.",
    layout: "long",
    period: "2024—25",
    items: [
      { thumb: `${T}/iman-ghazi-type-motion-graphics.webp`, href: "https://www.youtube.com/watch?v=sUWU7UR63KI", platform: "YouTube" },
      { thumb: `${T}/magnet-media-like-motion-graphics.jpg`, href: "https://www.youtube.com/watch?v=4mX9fkeQFHQ", platform: "YouTube" },
      { thumb: `${T}/tharun-speaks-motion-graphics-type-edit.jpg`, href: "https://www.youtube.com/watch?v=FTV_WO_tmtc", platform: "YouTube" },
      { thumb: `${T}/phase-animation-like-vox.jpg`, href: "https://www.youtube.com/watch?v=5FBQh9FitsM", platform: "YouTube" },
      { thumb: `${T}/after-effect-motion-graphics-like-tharun-speaks.jpg`, href: "https://www.youtube.com/watch?v=v8dQWEgD2vg", platform: "YouTube" },
      { thumb: `${T}/bar-graph-animation-like-vox.jpg`, href: "https://www.youtube.com/watch?v=GsC25bIkrh8", platform: "YouTube" },
    ],
  },
  {
    slug: "vfx-cgi",
    title: "VFX & CGI",
    blurb: "Compositing, CGI and finishing — the layer that separates a shot from a scene.",
    context:
      "Effects work on social gets judged in a feed, at speed, next to everything else. It has to survive being watched badly.",
    approach:
      "We grade and composite for small screens first, so the work still reads when it is a hundred pixels wide and playing without sound.",
    layout: "long",
    period: "2024—25",
    items: [
      { thumb: `${T}/thumbnail-8.jpeg`, href: "https://www.youtube.com/watch?v=xIncgA51Sks", platform: "YouTube" },
      { thumb: `${T}/thumbnail-9.jpeg`, href: "https://www.youtube.com/watch?v=6vIaWnOmieI", platform: "YouTube" },
      { thumb: `${T}/thumbnail-10.jpeg`, href: "https://www.youtube.com/watch?v=vAh-TXdU2Qs", platform: "YouTube" },
      { thumb: `${T}/d873f8879e5e4ef99575a42e8eb41a6f.jpg`, href: "https://www.youtube.com/shorts/ebe399XM_ow", platform: "YouTube" },
      { thumb: `${T}/6770c4dcce56418eb170044555c45e43.jpg`, href: "https://www.youtube.com/shorts/PRmuWKV5UNg", platform: "YouTube" },
      { thumb: `${T}/4e0a3fc8e40c4dcebcf0bb578c65c5c6.jpg`, href: "https://www.youtube.com/shorts/zjTMZK6xdps", platform: "YouTube" },
      { thumb: `${T}/2d33f6eed1c14fb7ad83ba19f29f12b2.jpg`, href: "https://www.youtube.com/shorts/LBKlOIg-KWs", platform: "YouTube" },
      { thumb: `${T}/7e364c28e89a43dfab42d49a662a33b8.jpg`, href: "https://www.youtube.com/shorts/3nUzjMSAmRA", platform: "YouTube" },
      { thumb: `${T}/try1.jpg`, href: "https://www.youtube.com/shorts/w8_xoiLWrSg", platform: "YouTube" },
    ],
  },
];

export function getDiscipline(slug: string): Discipline | undefined {
  return disciplines.find((d) => d.slug === slug);
}

/** Wraps at both ends so prev/next is never a dead end. */
export function adjacentDisciplines(slug: string): {
  prev: Discipline;
  next: Discipline;
} {
  const i = disciplines.findIndex((d) => d.slug === slug);
  const n = disciplines.length;
  return {
    prev: disciplines[(i - 1 + n) % n],
    next: disciplines[(i + 1) % n],
  };
}

export const totalPieces = disciplines.reduce((n, d) => n + d.items.length, 0);

/** The same video, however it was linked: watch?v=, youtu.be/, shorts/, reel/. */
export function pieceId(href: string): string {
  const m = href.match(/(?:v=|youtu\.be\/|shorts\/|reel\/|\/p\/)([A-Za-z0-9_-]{6,})/);
  return m ? m[1] : href;
}

export type Featured = {
  rank: number;
  /** DRAFT LABELS for the untitled uploads (ranks 5–9) — flagged for review. */
  title: string;
  href: string;
  thumb: string;
  platform: "YouTube" | "Instagram";
  orientation: "landscape" | "portrait";
  discipline: string;
};

/** The top eleven, in the client's order (links.txt, 2026-09-13). */
export const featured: Featured[] = [
  { rank: 1, title: "Motion graphics demonstration", href: "https://www.youtube.com/watch?v=4mX9fkeQFHQ", thumb: `${F}/4mX9fkeQFHQ.jpg`, platform: "YouTube", orientation: "landscape", discipline: "motion-graphics" },
  { rank: 2, title: "I loved Moon Knight, so I made my own", href: "https://www.youtube.com/watch?v=xIncgA51Sks", thumb: `${F}/xIncgA51Sks.jpg`, platform: "YouTube", orientation: "landscape", discipline: "vfx-cgi" },
  { rank: 3, title: "The history of reincarnation", href: "https://youtu.be/gzb4m1xQEiQ", thumb: `${F}/gzb4m1xQEiQ.jpg`, platform: "YouTube", orientation: "landscape", discipline: "long-form" },
  { rank: 4, title: "YouTube sample edit", href: "https://youtu.be/6pPNOvofdWs", thumb: `${F}/6pPNOvofdWs.jpg`, platform: "YouTube", orientation: "landscape", discipline: "long-form" },
  { rank: 5, title: "The bombs don't stop", href: "https://youtube.com/shorts/oK1jMtrgQU4", thumb: `${F}/oK1jMtrgQU4-portrait.jpg`, platform: "YouTube", orientation: "portrait", discipline: "short-format" },
  { rank: 6, title: "From around the world", href: "https://youtube.com/shorts/Jytd_jziLbg", thumb: `${F}/Jytd_jziLbg-portrait.jpg`, platform: "YouTube", orientation: "portrait", discipline: "short-format" },
  { rank: 7, title: "Final edit", href: "https://youtube.com/shorts/REsDZpbQPew", thumb: `${F}/REsDZpbQPew-portrait.jpg`, platform: "YouTube", orientation: "portrait", discipline: "short-format" },
  { rank: 8, title: "Instagram reel", href: "https://www.instagram.com/reel/DHD5w1yI0J3/", thumb: `${T}/620df32f4bd04c518ce319acec86882f.jpg`, platform: "Instagram", orientation: "portrait", discipline: "short-format" },
  { rank: 9, title: "Instagram reel", href: "https://www.instagram.com/reel/DFQN5MTz5VB/", thumb: `${T}/6fda69dd28134dc6b99db07f5feeb431.jpg`, platform: "Instagram", orientation: "portrait", discipline: "short-format" },
  { rank: 10, title: "Delhi 2025 elections — Think School", href: "https://www.youtube.com/watch?v=8nES01011GY", thumb: `${F}/8nES01011GY.jpg`, platform: "YouTube", orientation: "landscape", discipline: "podcast" },
  { rank: 11, title: "Leadership lessons with Capt Raghu Raman — Think School", href: "https://www.youtube.com/watch?v=-DBx9Ss1C-g", thumb: `${F}/-DBx9Ss1C-g.jpg`, platform: "YouTube", orientation: "landscape", discipline: "podcast" },
];

const featuredIds = new Set(featured.map((f) => pieceId(f.href)));

export type RestPiece = PortfolioItem & { discipline: Discipline };

/** Everything that is not in the top eleven, discipline attached. */
export const rest: RestPiece[] = disciplines.flatMap((d) => d.items.filter((i) => !featuredIds.has(pieceId(i.href))).map((i) => ({ ...i, discipline: d })));
