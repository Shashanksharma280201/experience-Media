// The numbers, the process, the offer and the audiences — all from the
// October 2026 redevelopment brief, §3 to §7. Only figures the brief
// approves appear anywhere on the site; nothing is derived from array
// lengths any more, so a roster edit can never change a published claim.

export type Readout = { value: string; label: string };

/** §3 — verified metrics. The order is the credibility section's order. */
export const metrics: Readout[] = [
  { value: "500M+", label: "Views generated" },
  { value: "30M+", label: "Organic views in the last 2 months" },
  { value: "10", label: "Years in media" },
  { value: "15+", label: "Brand partners" },
  { value: "9+", label: "Creator collaborations" },
];

/** §4.01 — the strip under the hero. */
export const credibility = ["500M+ Views Generated", "10 Years in Media", "15+ Brand Partners", "9+ Creator Collaborations"];

export type Step = { n: string; title: string; body: string };

/** §4.10 — the process. */
export const process: Step[] = [
  { n: "01", title: "Discover", body: "Business, audience, positioning and goals." },
  { n: "02", title: "Strategise", body: "Content roadmap, formats, ideas and distribution." },
  { n: "03", title: "Produce", body: "Shoot, edit, design, animate and finish." },
  { n: "04", title: "Grow", body: "Publish, analyse, optimise and improve." },
];
export const processClose = "The goal isn't more content. It's more momentum.";

/** §4.07 — the offer. */
export const offer = {
  headline: ["Buy back your time.", "We'll handle the content."],
  subhead: "Your most valuable business asset isn't money. It's your time.",
  proposition:
    "We help business owners build a consistent organic content engine without turning content creation into another full-time job.",
  visual: ["Two days from you.", "Everything else from us."],
  days: [
    { n: "Day 01", title: "Shoot", body: "Capture ideas, expertise and stories." },
    { n: "Day 02", title: "Analysis", body: "Understand business, audience, positioning, competitors and content opportunities." },
  ],
  chain: ["Strategy", "Ideas", "Scripts", "Shoot", "Edit", "Packaging", "Publishing", "Optimisation"],
  close: "You just show up. We build the machine.",
  cta: "Build My Content Engine",
};

export type Audience = { title: string; body: string };

/** §4.06 — who we work with. */
export const audiences: Audience[] = [
  { title: "Business owners", body: "Build authority, generate demand and buy back your time through content." },
  { title: "Content creators", body: "Turn ideas into content that earns attention and compounds audience growth." },
  { title: "Brands", body: "Build campaigns, films and content systems that people remember." },
];

/** §4.14 / §9 — training. */
export const training = {
  headline: ["Learn the system.", "Build it yourself."],
  product: "30-Day Content Growth Playbook",
  body: "A practical 30-day system to help you plan, create and publish content consistently — completely free.",
  cta: "Get the Free Playbook",
  future: ["Video courses", "Templates", "PDFs", "Workshops"],
};
