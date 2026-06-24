# Experience Media — Website Redesign (v1) Design

**Date:** 2026-06-24
**Status:** Approved
**Goal:** Rebuild https://experiencemedia.in/ from scratch in Next.js with the
**same content** as today but a brand-new design and a rich on-scroll animation
experience (reference: terminal-industries.com, oryzo.ai, flomobility.com).

## Decisions (locked)

| Area | Decision |
|------|----------|
| Aesthetic | Minimal industrial / light editorial (Terminal Industries vibe) |
| Motion | Rich — Lenis smooth scroll + GSAP ScrollTrigger (pins, parallax, scrub, reveals) |
| Contact | Working Next.js API route (`/api/contact`) + Resend email, zod validation |
| Structure | Same 2 pages (Home + Portfolio), same sections, same content |
| Accent | Refined amber/gold `#C8920A` (nod to original brand), used sparingly |
| Services | Pinned sticky-panel reveal (replaces old click-to-expand) |

## Tech stack

- Next.js 16 (App Router) + TypeScript + Tailwind CSS v4
- Lenis (smooth scroll) + GSAP & ScrollTrigger (scroll animation)
- Framer Motion (menu / simple hover only)
- Resend + zod (contact API)
- next/font for grotesk display + mono label type
- All media in `/public/assets` (copied & slugified from the scrape)
- Deploy: Vercel

## Visual system

- **Canvas:** warm off-white `#F4F2EE`, ink `#0E0E0E`. A few near-black sections
  (hero reel, footer) for contrast.
- **Accent:** amber/gold `#C8920A` — tiny labels, hovers, underlines, active state.
- **Type:** tight modern grotesk (display) + mono (eyebrows, indices `01 —`, metadata).
- **Layout:** 12-col grid, hairline 1px rules, numbered sections, generous whitespace,
  big display type, subtle film-grain overlay.

## Motion system

- Global Lenis smooth scroll; thin scroll-progress bar; nav condenses past hero.
- Hero: framed showreel that scales/unmasks on scroll-scrub; kinetic split headline.
- Section reveals: hairline rules draw L→R; headings line-mask reveal; mono eyebrows fade up.
- Creators & testimonials: velocity-reactive marquees, pause on hover.
- Brands: staggered logo fade-in on enter.
- Counter: full-bleed count-up to 30,00,00,000 ("views generated in 2 months").
- Services: pinned section; advancing the 9-item list swaps a sticky image panel.
- Portfolio: grid reveal with per-column parallax; hover scale + platform label.

## Content (unchanged — see experiencemedia-source/CONTENT-REFERENCE.md)

**Home:** Hero reel → Creator Collaborations (9) → Brand Partners (15) → Views
counter → Services (9, same copy) → Testimonials (7) → Contact → Footer.

**Portfolio:** Short Format, Long-Form, Podcast, Motion Graphics, VFX & CGI —
thumbnail cards linking out to the same YouTube/Instagram URLs.

Contact: +91 85957 53414 (WhatsApp), parthmalhotra@experiencemedia.in, all socials
(YouTube @Xparth_, LinkedIn parth-malhotra-em, Instagram/Threads/X _xparth, Facebook).

## Component architecture

- `app/layout.tsx` — fonts, `<SmoothScrollProvider>`, `<Grain>`, metadata
- `app/page.tsx` — Home; `app/portfolio/page.tsx` — Portfolio
- `app/api/contact/route.ts` — zod + Resend
- `components/`: `SmoothScrollProvider`, `Nav`, `Footer`, `Hero`, `Marquee`,
  `BrandGrid`, `StatCounter`, `ServicesPinned`, `Testimonials`, `ContactForm`,
  `PortfolioGrid`, `Reveal`, `Grain`, `ScrollProgress`
- `lib/content.ts` — single source of truth for services, creators, brands,
  testimonials, portfolio items, contact + social links
- `lib/gsap.ts` — registers ScrollTrigger, shared helpers

## Out of scope for v1

- CMS / admin, blog, multilanguage, analytics dashboards
- WebGL/shader effects (could be a v2)
- Changing any copy or links

## Success criteria

- Visual + motion parity with the chosen references' polish, on the EM brand.
- All original content present and links working.
- Contact form submits and emails successfully.
- Responsive + accessible (reduced-motion fallback disables heavy scroll effects).
- Builds clean (`next build`) and runs on Vercel.
