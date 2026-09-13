import { brands, creators } from "./clients";
import { offers } from "./capabilities";

export const stat = {
  value: 300000000, // 30,00,00,000
  label: "views generated in 2 months",
};

export type Readout = { label: string; value: string };

/** Derived from the real data so the ledger can never drift out of sync. */
export const telemetry: Readout[] = [
  { label: "Views generated in two months", value: "300M+" },
  { label: "Brand partners", value: String(brands.length) },
  { label: "Creator collaborations", value: String(creators.length) },
  { label: "Ways in", value: String(offers.length) },
];

export type Step = { title: string; body: string };

/** How an engagement runs. DRAFT COPY — flagged for review. */
export const process: Step[] = [
  {
    title: "Brief",
    body: "One conversation. What you sell, who buys it, and what is not working. We read your last ninety days before we turn up.",
  },
  {
    title: "Strategy",
    body: "A plan you can read in a page: platforms, formats, cadence, and the one number we are chasing this quarter.",
  },
  {
    title: "Production",
    body: "Shot, cut, graded and finished in-house. You see rough cuts inside a week, not a deck about them.",
  },
  {
    title: "Distribution",
    body: "Posted, promoted and reported. We read the numbers with you every week and change next month's plan because of them.",
  },
];
