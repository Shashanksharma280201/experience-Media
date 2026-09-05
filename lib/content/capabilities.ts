// The nine services, grouped into four brand-facing offers.
// Nine sibling services read as a rate card; four offers read as an agency.

export type Service = { title: string; desc: string; img: string };

export type Offer = {
  id: string;
  title: string;
  summary: string;
  services: Service[];
};

export const services: Service[] = [
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

const byTitle = (title: string): Service => {
  const found = services.find((s) => s.title === title);
  if (!found) throw new Error(`Unknown service: ${title}`);
  return found;
};

// Strategy first: an agency leads with the thinking, then the making.
// DRAFT COPY — flagged for review.
export const offers: Offer[] = [
  {
    id: "strategy",
    title: "Strategy & Growth",
    summary:
      "Where to play, what to make, and the number we are chasing — then training your team to run the system after we build it.",
    services: [
      byTitle("Strategic Content Consultancy"),
      byTitle("Team Training & System Enhancement"),
    ],
  },
  {
    id: "content-engine",
    title: "Content Engine",
    summary:
      "Always-on output. Short-form that travels and long-form that builds authority, on a schedule that never slips.",
    services: [
      byTitle("Viral Social Media Content"),
      byTitle("Podcast Production Service"),
    ],
  },
  {
    id: "brand-films",
    title: "Brand Films",
    summary:
      "Single pieces made to carry a campaign — ads, documentaries, music videos and live capture.",
    services: [
      byTitle("Ad Production Service"),
      byTitle("Music Videos"),
      byTitle("Storytelling Documentary"),
      byTitle("Event Photography & Videography"),
    ],
  },
  {
    id: "post-vfx",
    title: "Post & VFX",
    summary:
      "Visual effects, CGI and finishing — the craft layer that turns a shot into a scene.",
    services: [byTitle("VFX And CGI")],
  },
];
