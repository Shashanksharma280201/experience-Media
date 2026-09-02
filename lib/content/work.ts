// Flagship case studies + the full work index.
//
// CONTENT STATUS: every case study below is `draft` — the structure is real, the
// prose is a template. Client briefs, approach and publishable metrics come from
// Experience Media. `publishedCaseStudies` is the launch gate: it stays empty
// until real copy lands and `contentStatus` flips to "final".

const T = "/assets/agency-thumbnails";

export type PortfolioItem = {
  thumb: string;
  href: string;
  platform: "YouTube" | "Instagram";
};

export type PortfolioCategory = {
  title: string;
  layout: "short" | "long";
  items: PortfolioItem[];
};

export type CaseStudyMedia = {
  type: "video" | "image";
  src: string;
  poster?: string;
  aspect: "16:9" | "9:16" | "1:1";
};

export type CaseStudy = {
  slug: string;
  client: string;
  logo: string;
  year: string;
  category: string;
  headline: string;
  challenge: string;
  approach: string;
  deliverables: string[];
  metrics: { label: string; value: string }[];
  media: CaseStudyMedia[];
  links: { label: string; href: string }[];
  testimonial?: { quote: string; author: string; role: string };
  contentStatus: "draft" | "final";
};

const draft = (client: string) => ({
  headline: `Draft — one line on what Experience Media did for ${client}.`,
  challenge: `Draft — replace with the brief ${client} set: what problem the content had to solve, and what constraint made it hard.`,
  approach: `Draft — replace with how the studio answered it: the format decision, the production model, and what made the output repeatable.`,
  deliverables: [
    "Draft — deliverable one",
    "Draft — deliverable two",
    "Draft — deliverable three",
  ],
  metrics: [
    { label: "Views", value: "TBC" },
    { label: "Deliverables", value: "TBC" },
    { label: "Engagement", value: "TBC" },
  ],
  contentStatus: "draft" as const,
});

export const caseStudies: CaseStudy[] = [
  {
    slug: "hyundai",
    client: "Hyundai",
    logo: "/assets/brands/image-removebg-preview-2.png",
    year: "2025",
    category: "Brand Films",
    ...draft("Hyundai"),
    media: [
      { type: "image", src: `${T}/thumbnail-5.jpeg`, aspect: "16:9" },
      { type: "image", src: `${T}/thumbnail-6.jpeg`, aspect: "16:9" },
    ],
    links: [
      {
        label: "Watch on YouTube",
        href: "https://www.youtube.com/watch?v=VHXEU4rq6rY&t=1s",
      },
    ],
  },
  {
    slug: "lenskart",
    client: "Lenskart",
    logo: "/assets/brands/image-removebg-previewgfd.png",
    year: "2025",
    category: "Content Engine",
    ...draft("Lenskart"),
    media: [
      { type: "image", src: `${T}/3a9c0636b91743fca280178b7194aa5a.jpg`, aspect: "9:16" },
      { type: "image", src: `${T}/6fda69dd28134dc6b99db07f5feeb431.jpg`, aspect: "9:16" },
    ],
    links: [
      {
        label: "View on Instagram",
        href: "https://www.instagram.com/reel/DFb0SF-IaaX/",
      },
    ],
  },
  {
    slug: "zerodha-zero1",
    client: "Zerodha Zero1",
    logo: "/assets/brands/image-removebg-preview-5.png",
    year: "2025",
    category: "Content Engine",
    ...draft("Zerodha Zero1"),
    media: [
      { type: "image", src: `${T}/thumbnail-1.jpeg`, aspect: "16:9" },
      { type: "image", src: `${T}/thumbnail-2.jpeg`, aspect: "16:9" },
    ],
    links: [
      {
        label: "Watch on YouTube",
        href: "https://www.youtube.com/watch?v=8nES01011GY",
      },
    ],
  },
  {
    slug: "mygov",
    client: "MyGov",
    logo: "/assets/brands/image.png",
    year: "2025",
    category: "Post & VFX",
    ...draft("MyGov"),
    media: [
      { type: "image", src: `${T}/thumbnail-8.jpeg`, aspect: "16:9" },
      { type: "image", src: `${T}/thumbnail-9.jpeg`, aspect: "16:9" },
    ],
    links: [
      {
        label: "Watch on YouTube",
        href: "https://www.youtube.com/watch?v=xIncgA51Sks",
      },
    ],
  },
];

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug);
}

/** Launch gate — only case studies with real, signed-off copy. */
export const publishedCaseStudies: CaseStudy[] = caseStudies.filter(
  (c) => c.contentStatus === "final"
);

/** The full body of work, behind the flagships. */
export const portfolio: PortfolioCategory[] = [
  {
    title: "Short Format",
    layout: "short",
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
      { thumb: `${T}/e569d2f10d894837b8d9c71f2f663262.jpg`, href: "https://www.instagram.com/reel/DRR8HU-khmz/", platform: "Instagram" },
      { thumb: `${T}/e569d2f10d894837b8d9c71f2f663262.jpg`, href: "https://www.instagram.com/reel/DPjaU6kD5-z/", platform: "Instagram" },
    ],
  },
  {
    title: "Long-Form Content",
    layout: "long",
    items: [
      { thumb: `${T}/thumbnail-5.jpeg`, href: "https://www.youtube.com/watch?v=VHXEU4rq6rY&t=1s", platform: "YouTube" },
      { thumb: `${T}/thumbnail-6.jpeg`, href: "https://www.youtube.com/watch?v=kK9E95EuZGY", platform: "YouTube" },
      { thumb: `${T}/thumbnail-7.jpeg`, href: "https://www.youtube.com/watch?v=yY2_fxZ1CdM", platform: "YouTube" },
      { thumb: `${T}/wanders-hub-type-edit.jpg`, href: "https://www.youtube.com/watch?v=6pPNOvofdWs", platform: "YouTube" },
      { thumb: `${T}/premier-pro-fast-paced-basic-edit.jpg`, href: "https://www.youtube.com/watch?v=-UMG-7b5Fyc", platform: "YouTube" },
      { thumb: `${T}/fast-paced-premier-pro-videos.png`, href: "https://www.youtube.com/watch?v=xRNt1hz_2ho", platform: "YouTube" },
    ],
  },
  {
    title: "Podcast",
    layout: "long",
    items: [
      { thumb: `${T}/thumbnail-1.jpeg`, href: "https://www.youtube.com/watch?v=8nES01011GY", platform: "YouTube" },
      { thumb: `${T}/thumbnail-2.jpeg`, href: "https://www.youtube.com/watch?v=-DBx9Ss1C-g", platform: "YouTube" },
      { thumb: `${T}/thumbnail-3.jpeg`, href: "https://www.youtube.com/watch?v=jSO7SYg5Ucg", platform: "YouTube" },
      { thumb: `${T}/thumbnail-4.jpeg`, href: "https://www.youtube.com/watch?v=9obwr-EzcZc", platform: "YouTube" },
      { thumb: `${T}/thumbnail.jpeg`, href: "https://www.youtube.com/watch?v=CCTpxFwZPFg", platform: "YouTube" },
    ],
  },
  {
    title: "Motion Graphics",
    layout: "long",
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
    title: "VFX & CGI",
    layout: "long",
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
