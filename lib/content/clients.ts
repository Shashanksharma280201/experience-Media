export const creators = [
  "/assets/creators/8.png",
  "/assets/creators/6.png",
  "/assets/creators/5.png",
  "/assets/creators/3.png",
  "/assets/creators/10.png",
  "/assets/creators/2.png",
  "/assets/creators/7.png",
  "/assets/creators/4.png",
  "/assets/creators/9.png",
];

export type Brand = {
  name: string;
  img: string;
  /** Intrinsic pixel size — drives correct aspect and prevents layout shift. */
  w: number;
  h: number;
  /**
   * The logo band silhouettes every mark to white. A few source files are
   * full-colour artwork on a solid background and turn into blank shapes when
   * silhouetted, so they sit the band out until a transparent version exists.
   */
  needsTransparentAsset?: boolean;
};

export const brands: Brand[] = [
  { name: "Hyundai", img: "/assets/brands/image-removebg-preview-2.png", w: 666, h: 375 },
  // Colour artwork on a solid white disc — silhouettes to a plain circle.
  { name: "MyGov", img: "/assets/brands/image.png", w: 180, h: 180, needsTransparentAsset: true },
  { name: "Odoo", img: "/assets/brands/image-removebg-preview-4.png", w: 577, h: 432 },
  { name: "Zerodha Zero1", img: "/assets/brands/image-removebg-preview-5.png", w: 200, h: 200 },
  { name: "Skillosaurus", img: "/assets/brands/image-removebg-preview-3.png", w: 1024, h: 135 },
  { name: "Frontier Group", img: "/assets/brands/image-removebg-preview-1.png", w: 225, h: 225 },
  { name: "We Smile Media", img: "/assets/brands/image-1.png", w: 1024, h: 1024 },
  { name: "Think School", img: "/assets/brands/image-removebg-preview-6.png", w: 500, h: 500 },
  { name: "Lenskart", img: "/assets/brands/image-removebg-previewgfd.png", w: 400, h: 331 },
  { name: "Ugaoo", img: "/assets/brands/image-removebg-preview-7-improved.png", w: 268, h: 119 },
  { name: "Cable Australia", img: "/assets/brands/ca-cable-aurtralia.png", w: 1563, h: 1563 },
  { name: "Flo Mobility", img: "/assets/brands/flo-mobility-autonomous-navigation.png", w: 500, h: 500 },
  { name: "Stemachip", img: "/assets/brands/stemachip.png", w: 207, h: 202 },
  { name: "TFN 2025", img: "/assets/brands/tfn2025-logo.png", w: 635, h: 387 },
  { name: "Webrook", img: "/assets/brands/webrook.png", w: 988, h: 241 },
];

export const testimonials = [
  { img: "/assets/testimonials/t1.jpeg", alt: "Kanchi, content creator" },
  { img: "/assets/testimonials/t2.jpeg", alt: "Varnit Singh, influencer" },
  { img: "/assets/testimonials/t3.jpeg", alt: "Rajat Verma, founder of Artifact World" },
  { img: "/assets/testimonials/t4.jpeg", alt: "Paritosh Anand, founder of We Smile Media" },
  { img: "/assets/testimonials/t7.jpg", alt: "Gaurav Kumar, content creator" },
  { img: "/assets/testimonials/t6.jpg", alt: "Armeya, content creator" },
  { img: "/assets/testimonials/t5.jpeg", alt: "Scent Savy, content creator" },
];
