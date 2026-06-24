# Experience Media — Website (v1 redesign)

A from-scratch redesign of [experiencemedia.in](https://experiencemedia.in/) — a
founder-led digital creator + marketing agency. Same content as the original site,
rebuilt with a minimal-industrial editorial aesthetic and a rich on-scroll
animation experience.

## Stack

- **Next.js 16** (App Router) + **TypeScript** + **Tailwind CSS v4**
- **Lenis** smooth scroll + **GSAP / ScrollTrigger** for scroll animation
- **Aceternity UI** components (Container Scroll, Hero Parallax, Infinite Moving Cards)
- **Framer Motion / motion** for UI transitions
- **Resend** + **zod** for the contact API

## Develop

```bash
npm install
cp .env.example .env.local   # optional: add RESEND_API_KEY for live email
npm run dev                  # http://localhost:3000
npm run build                # production build
```

## Structure

```
app/
  page.tsx               Home (hero, founder, creators, brands, stat, services, work CTA, testimonials, contact)
  portfolio/page.tsx     Portfolio (Hero Parallax + category grids)
  api/contact/route.ts   Contact form handler (zod + Resend)
components/
  Hero, Founder, CreatorsStrip, BrandGrid, StatCounter, ServicesPinned,
  Testimonials, ContactForm, PortfolioGrid, Nav, Footer, Reveal,
  SmoothScrollProvider, ScrollProgress, Grain
  aceternity/            Aceternity UI components, themed to the brand
lib/
  content.ts             Single source of truth for all site content
  utils.ts               cn() helper
public/assets/           Media (slugified from the original site)
```

## Content

All copy, services, brand/creator logos, testimonials, portfolio items and links
live in `lib/content.ts`. The original site was scraped into
`../experiencemedia-source/` with a distilled `CONTENT-REFERENCE.md`.

## Notes

- Honors `prefers-reduced-motion` — heavy scroll effects disable gracefully.
- Brand logos render as a monochrome white wall on a dark band (most originals
  are white-on-transparent).
- Deploy on Vercel; set `RESEND_API_KEY` (and a verified `CONTACT_FROM_EMAIL`) for
  live contact emails.
