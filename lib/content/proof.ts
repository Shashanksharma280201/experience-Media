import { brands, creators } from "./clients";
import { offers } from "./capabilities";

export const stat = {
  value: 300000000, // 30,00,00,000
  label: "views generated in 2 months",
};

export type Readout = { label: string; value: string };

/** Derived from the real data so the ledger can never drift out of sync. */
export const telemetry: Readout[] = [
  { label: "Views generated", value: "300M+" },
  { label: "Brand partners", value: String(brands.length) },
  { label: "Creator collaborations", value: String(creators.length) },
  { label: "Disciplines", value: String(offers.length) },
];
