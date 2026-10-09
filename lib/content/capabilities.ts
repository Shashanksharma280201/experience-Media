// §4.08, §4.09, §6 and §8 of the brief: three primary legs, fifteen
// capabilities, and what production means without a studio of our own.

export type Service = { title: string; desc: string; img: string };

/** The nine services, as the site has always listed them. */
export const services: Service[] = [
  { title: "Viral Social Media Content", desc: "Create buzzworthy and engaging content that spreads like wildfire.", img: "/assets/services/viral-socialmedia.png" },
  { title: "Podcast Production Service", desc: "Professional audio production and editing for captivating podcasts.", img: "/assets/services/podcast-prodservice.png" },
  { title: "VFX And CGI", desc: "High-quality visual effects and computer graphics for stunning visuals.", img: "/assets/services/vfx-cgi.png" },
  { title: "Storytelling Documentary", desc: "Craft compelling documentaries that inspire and inform.", img: "/assets/services/storytelling-documentary.png" },
  { title: "Event Photography & Videography", desc: "Capture memorable moments from your events in high definition.", img: "/assets/services/event-photography-videography.png" },
  { title: "Strategic Content Consultancy", desc: "Consulting for effective and results-driven content strategies.", img: "/assets/services/strategic-content-consultancy.png" },
  { title: "Music Videos", desc: "Creative and visually striking music videos for artists and labels.", img: "/assets/services/music-videos.png" },
  { title: "Ad Production Service", desc: "Compelling ads with cinematic precision and marketing impact.", img: "/assets/services/add-production-service.png" },
  { title: "Team Training & System Enhancement", desc: "Upskill your team and optimize workflows.", img: "/assets/services/team-training-system-enhancement.png" },
];

export type Leg = {
  id: string;
  title: string;
  /** Who it is for, in a line. */
  audience: string;
  positioning: string;
  cta: string;
  /** What the engagement includes, for the row's marquee. */
  includes: string[];
};

/** §6 — the three primary legs. Every plan is customisable. */
export const legs: Leg[] = [
  {
    id: "social",
    title: "Viral Social Media Content",
    audience: "For business owners and content creators.",
    positioning: "Short-form content built for attention, retention and distribution.",
    cta: "Explore Social Content",
    includes: ["Hooks", "Scripts", "Shoot", "Edit", "Packaging", "Publishing", "Optimisation"],
  },
  {
    id: "podcast",
    title: "Podcast Production",
    audience: "End-to-end podcast management.",
    positioning: "A new-age newsroom for leaders. End-to-end concept, production, recording, editing, shorts and distribution.",
    cta: "Build a Podcast",
    includes: ["Concept", "Production", "Recording", "Editing", "Shorts", "Distribution"],
  },
  {
    id: "events",
    title: "Event Coverage",
    audience: "Photography, videography and social-first event content.",
    positioning: "Turn live events into content that keeps working after the event ends.",
    cta: "Cover My Event",
    includes: ["Photography", "Videography", "Social-first cuts", "Highlights", "Speaker clips"],
  },
];

export const servicesLine = "We don't sell isolated creative services. We build end-to-end content systems designed around growth.";

/** §4.09 — every layer of the content engine, for the marquee. */
export const capabilities = [
  "Strategy", "Growth", "Short-Form", "Long-Form", "Podcasts", "Brand Films", "VFX", "CGI",
  "Motion Graphics", "Cinematography", "Storytelling", "Documentaries", "Music Videos", "Event Coverage", "Distribution",
];

/** §8 — production, wherever the story needs to happen. */
export const production = {
  headline: ["Production, wherever", "the story needs to happen."],
  body: "From controlled studio shoots to locations, events, documentaries and cinematic productions — we build the right production environment around the story.",
  kinds: ["Cinematography", "Documentaries", "Films", "Podcasts", "Commercial Production", "VFX & CGI", "AI Films", "Event Production"],
};
