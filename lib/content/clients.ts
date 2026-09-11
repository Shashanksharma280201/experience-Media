/**
 * The creators, as the source square crops. `creatorPortraits` is what the
 * site actually renders — see below.
 */
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

/**
 * The die-cut round crops, one per creator. The square originals are the
 * photographer's frame; these are cropped to the face and cut to a circle,
 * which is the only way a creator appears on the site.
 */
export const creatorPortraits = creators.map((src) =>
  src.replace("/creators/", "/creators/round/")
);

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

export type Testimonial = {
  quote: string;
  author: string;
  role?: string;
  /** Out of five, as shown on the original card. */
  rating: number;
  /** The source card these words were taken from. */
  source: string;
};

/**
 * Transcribed verbatim from the testimonial cards in /public/assets/testimonials.
 * Kept in the voice they were written in, Hinglish included — sanding these into
 * corporate English would make them sound like everyone else's.
 */
export const testimonials: Testimonial[] = [
  {
    quote:
      "Sach bolu to bhai, jaise kandhe se pura bojh utar gaya ho! Bas raw footage diya aur inhone jo final video banake diya — ekdum top-class! Woh bhi bina delay ke, full turbo mode me. Tab se engagement to aise badha hai jaise rocket ho! Bhai, salute hai kaam ko!",
    author: "Kanchhiiii",
    role: "Content creator",
    rating: 4,
    source: "/assets/testimonials/t1.jpeg",
  },
  {
    quote:
      "Honestly, working with Experience Media felt super easy. I didn't have to over-explain anything — they just got what I wanted and delivered exactly that, super fast. Plus, my views literally jumped 5x. Can't recommend them enough.",
    author: "Varnit Singh",
    rating: 4,
    source: "/assets/testimonials/t2.jpeg",
  },
  {
    quote:
      "I had an amazing experience working with this team. The quality of their service is outstanding, and I really liked the way they understood my requirements and delivered beyond expectations. The video they created for me was not only high-quality but also impactful — it was even premiered at IIT Ropar's Annual Fest, which was a proud moment. Truly professional, creative, and reliable.",
    author: "Gaurav Kumar",
    role: "CEO, Alma Threads",
    rating: 4,
    source: "/assets/testimonials/t7.jpg",
  },
  {
    quote:
      "Bhai, video quality to ekdum top-level thi! Aur jo speed se kaam deliver kiya na, socha bhi nahi tha itna jaldi milega. Post karne ke baad to DM ki baarish ho gayi — log bol rahe hain, “bhai kya content daala hai!” Serious level ka fark pad gaya hai.",
    author: "Rajat Verma",
    role: "Founder, AffectArt World",
    rating: 4,
    source: "/assets/testimonials/t3.jpeg",
  },
  {
    quote:
      "They took my vision and made it 10x better. Plus, I didn't have to wait weeks to get it back. Super happy with the results — and the audience seems to be too.",
    author: "Paritosh Anand",
    role: "Founder, WeSmile Media",
    rating: 4,
    source: "/assets/testimonials/t4.jpeg",
  },
  {
    quote:
      "It was great work by the team. Very happy with the work and professionalism. Wish we could get in touch with you guys a little earlier to make it more interactive. At least now we know whom to reach for such projects. Will certainly recommend other students and parents as well.",
    author: "Armeya",
    rating: 4,
    source: "/assets/testimonials/t6.jpg",
  },
  {
    quote:
      "The process was quick, smooth, and the final result was fire. Definitely saw a spike in views and engagement after I started posting their work.",
    author: "Scent Savvy",
    role: "Content creator",
    rating: 4,
    source: "/assets/testimonials/t5.jpeg",
  },
];
