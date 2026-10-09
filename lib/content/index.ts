// Barrel: every binding the v1 components imported from `@/lib/content`
// still resolves here, so the split is transparent to consumers.

export { site, statement, contact, socials } from "./site";
export {
  brands,
  creators,
  creatorPortraits,
  testimonials,
  type Brand,
  type Testimonial,
} from "./clients";
export { services, legs, servicesLine, capabilities, production, type Service, type Leg } from "./capabilities";
export { metrics, credibility, process, processClose, offer, audiences, training, type Readout, type Step, type Audience } from "./proof";
export { founder } from "./founder";
export {
  disciplines,
  getDiscipline,
  adjacentDisciplines,
  featured,
  rest,
  pieceId,
  type Discipline,
  type PortfolioItem,
  type Featured,
  type RestPiece,
} from "./work";
