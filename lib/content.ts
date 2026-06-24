// Single source of truth for all site content.
// Mirrors the original experiencemedia.in content (see experiencemedia-source/CONTENT-REFERENCE.md).

export const site = {
  name: "Experience Media",
  tagline: "India's most immersive creative agency",
  description:
    "Experience Media offers motion graphics, animation, social media management, video editing, content creation, ad campaigns, and sound design.",
  founder: "Parth Malhotra",
  showreel: "/assets/experience-media-show-reel.mp4",
  emblem: "/assets/emblem.png",
};

export const contact = {
  phone: "+91 85957 53414",
  phoneRaw: "918595753414",
  email: "parthmalhotra@experiencemedia.in",
  whatsapp:
    "https://wa.me/918595753414?text=Hi%20I%20would%20like%20to%20know%20more%20about%20your%20services",
};

export const socials = [
  { label: "YouTube", handle: "Xparth_", href: "https://www.youtube.com/@Xparth_/featured" },
  { label: "Instagram", handle: "_xparth", href: "https://www.instagram.com/_xparth/" },
  { label: "LinkedIn", handle: "parth-malhotra-em", href: "https://www.linkedin.com/in/parth-malhotra-em/" },
  { label: "Threads", handle: "_xparth", href: "https://www.threads.com/@_xparth" },
  { label: "X", handle: "_xparth", href: "https://x.com/ParthMalho4856" },
  {
    label: "Facebook",
    handle: "XParth",
    href: "https://www.facebook.com/people/XParth/61568950719784/",
  },
];

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

export const brands = [
  { name: "Hyundai", img: "/assets/brands/image-removebg-preview-2.png" },
  { name: "MyGov", img: "/assets/brands/image.png" },
  { name: "Odoo", img: "/assets/brands/image-removebg-preview-4.png" },
  { name: "Zerodha Zero1", img: "/assets/brands/image-removebg-preview-5.png" },
  { name: "Skillosaurus", img: "/assets/brands/image-removebg-preview-3.png" },
  { name: "Frontier Group", img: "/assets/brands/image-removebg-preview-1.png" },
  { name: "We Smile Media", img: "/assets/brands/image-1.png" },
  { name: "Think School", img: "/assets/brands/image-removebg-preview-6.png" },
  { name: "Lenskart", img: "/assets/brands/image-removebg-previewgfd.png" },
  { name: "Ugaoo", img: "/assets/brands/image-removebg-preview-7-improved.png" },
  { name: "Cable Australia", img: "/assets/brands/ca-cable-aurtralia.png" },
  { name: "Flo Mobility", img: "/assets/brands/flo-mobility-autonomous-navigation.png" },
  { name: "Stemachip", img: "/assets/brands/stemachip.png" },
  { name: "TFN 2025", img: "/assets/brands/tfn2025-logo.png" },
  { name: "Webrook", img: "/assets/brands/webrook.png" },
];

export const stat = {
  value: 300000000, // 30,00,00,000
  label: "views generated in 2 months",
};

export const services = [
  {
    title: "Viral Social Media Content",
    desc: "Create buzzworthy and engaging content that spreads like wildfire.",
    img: "/assets/services/viral-socialmedia.png",
  },
  {
    title: "Podcast Production Service",
    desc: "Professional audio production and editing for captivating podcasts.",
    img: "/assets/services/podcast-prodservice.png",
  },
  {
    title: "VFX And CGI",
    desc: "High-quality visual effects and computer graphics for stunning visuals.",
    img: "/assets/services/vfx-cgi.png",
  },
  {
    title: "Storytelling Documentary",
    desc: "Craft compelling documentaries that inspire and inform.",
    img: "/assets/services/storytelling-documentary.png",
  },
  {
    title: "Event Photography & Videography",
    desc: "Capture memorable moments from your events in high definition.",
    img: "/assets/services/event-photography-videography.png",
  },
  {
    title: "Strategic Content Consultancy",
    desc: "Consulting for effective and results-driven content strategies.",
    img: "/assets/services/strategic-content-consultancy.png",
  },
  {
    title: "Music Videos",
    desc: "Creative and visually striking music videos for artists and labels.",
    img: "/assets/services/music-videos.png",
  },
  {
    title: "Ad Production Service",
    desc: "Compelling ads with cinematic precision and marketing impact.",
    img: "/assets/services/add-production-service.png",
  },
  {
    title: "Team Training & System Enhancement",
    desc: "Upskill your team and optimize workflows.",
    img: "/assets/services/team-training-system-enhancement.png",
  },
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

const T = "/assets/agency-thumbnails";

export type PortfolioItem = { thumb: string; href: string; platform: "YouTube" | "Instagram" };
export type PortfolioCategory = { title: string; layout: "short" | "long"; items: PortfolioItem[] };

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
