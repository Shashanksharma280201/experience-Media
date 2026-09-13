// Barrel: every binding the v1 components imported from `@/lib/content`
// still resolves here, so the split is transparent to consumers.

export { site, contact, socials } from "./site";
export {
  brands,
  creators,
  creatorPortraits,
  testimonials,
  type Brand,
  type Testimonial,
} from "./clients";
export { services, offers, type Service, type Offer } from "./capabilities";
export { stat, telemetry, process, type Readout, type Step } from "./proof";
export {
  disciplines,
  getDiscipline,
  adjacentDisciplines,
  totalPieces,
  featured,
  rest,
  pieceId,
  type Discipline,
  type PortfolioItem,
  type Featured,
  type RestPiece,
} from "./work";
