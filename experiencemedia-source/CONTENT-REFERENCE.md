# Experience Media — Content & Brand Reference

Scraped from https://experiencemedia.in/ on 2026-06-24. Raw mirror lives in
`experiencemedia.in/`. This file distills everything needed to rebuild the site.

## Brand

- **Name:** The Experience Media ("India's most immersive creative agency")
- **Founder / face:** Parth Malhotra (handle: `Xparth_` / `_xparth`)
- **Tagline ideas in use:** "YouTube Management & Video Editing", "We Help Your
  Content Reach Millions", "Experience We've Shared"
- **Description:** Motion graphics, animation, social media management, video
  editing, content creation, ad campaigns, and sound design.
- **Built by (credit in footer):** Pari Sharma. © 2025.

## Design tokens (from original CSS)

- **Font:** Montserrat (full weight range, self-hosted woff2 in `styles/fonts/`)
- **Theme:** Dark. Backgrounds `#0e0e0e`, `#111`, `#1a1a1a`, `#222`. Text white.
- **Accent:** Yellow/gold gradient — `#ffe100` → `#ffbf00` → `#ffb300`
  (also seen: `#e7fc00`). Used for underlines, buttons, highlights.
- **Logo/emblem:** `ExperienceMedia-assets/emblem.png`

## Contact

- **Phone / WhatsApp:** +91 85957 53414 (`wa.me/8595753414`)
- **Email:** parthmalhotra@experiencemedia.in
- **Contact form:** POST to `https://experiencemedia.in/form_handler.php`
  fields: name, email, phone, whatsapp, country, message
- **Socials:**
  - YouTube: https://www.youtube.com/@Xparth_/featured
  - LinkedIn: https://www.linkedin.com/in/parth-malhotra-em/
  - Instagram: https://www.instagram.com/_xparth/
  - Threads: https://www.threads.com/@_xparth
  - Facebook: https://www.facebook.com/people/XParth/61568950719784/
  - X/Twitter: https://x.com/ParthMalho4856

## Page: index.html (Home)

Sections in order:
1. **Hero** — fullscreen autoplay/muted/loop video (`Experience Media Show Reel.mp4`, 14MB)
2. **Creator Collaborations** — horizontal auto-scrolling strip, 9 creator logos (`creators/2-10.png`)
3. CTA button → portfolio
4. **Our Trusted Brand Partners** — grid of 15 brand logos (`brands/`):
   Hyundai, MyGov, Odoo, Zerodha (Zero1), Skillosaurus, Frontier Group,
   We Smile Media, Think School, Lenskart, Ugaoo, Cable Australia,
   Flo Mobility, Stemachip, TFN2025, Webrook
5. **Counter** — animates 0 → 30,00,00,000 ("views generated in 2 months")
6. **Services** (9 cards, click-to-expand) — see Services list below
7. CTA → "See Our Work"
8. **Testimonials** — horizontal carousel, 7 screenshot images (`testimonials/t1-t7`)
9. **Contact form** (#call)
10. **Footer** — socials split left/right

## Services (from JS/app.js — title, desc, image)

1. Viral Social Media Content — "Create buzzworthy and engaging content that spreads like wildfire."
2. Podcast Production Service — "Professional audio production and editing for captivating podcasts."
3. VFX And CGI — "High-quality visual effects and computer graphics for stunning visuals."
4. Storytelling Documentary — "Craft compelling documentaries that inspire and inform."
5. Event Photography & Videography — "Capture memorable moments from your events in high definition."
6. Strategic Content Consultancy — "Consulting for effective and results-driven content strategies."
7. Music Videos — "Creative and visually striking music videos for artists and labels."
8. Ad Production Service — "Compelling ads with cinematic precision and marketing impact."
9. Team Training & System Enhancement — "Upskill your team and optimize workflows."

(Service icons live in `ExperienceMedia-assets/services/` — downloaded separately,
since the original injects them via JS.)

## Page: portfolio.html

Title: "Experience We've Shared". Categories, each a grid of thumbnail cards that
link out to the actual videos (no media hosted locally — only thumbnails):

- **Short Format** — 11 Instagram reels/posts (thumbnails in `Agency thumbnails/`)
- **Long-Form Content** — 6 YouTube videos
- **Podcast** — 5 YouTube videos
- **Motion Graphics** — 6 YouTube videos
- **VFX and CGI** — 3 YouTube long-form + 6 YouTube shorts

All external video URLs are preserved inside `experiencemedia.in/portfolio.html`.

## Interactions in the original (to re-imagine with better animation)

- Hero background video
- Auto-scrolling creator/testimonial strips (pause on hover/interaction)
- IntersectionObserver count-up on the views counter
- Click-to-expand service cards
- Navbar underline-on-hover (gold gradient)
- Mobile hamburger menu

## Asset inventory

- `ExperienceMedia-assets/emblem.png` — logo
- `ExperienceMedia-assets/Experience Media Show Reel.mp4` — hero reel
- `creators/` — 9 creator logos
- `brands/` — 15 brand logos
- `testimonials/` — 7 testimonial screenshots
- `Agency thumbnails/` — ~35 portfolio thumbnails
- `services/` — 9 service icons
- `socials/` — social icons
- `favicons/` — favicon set
- `styles/fonts/` — Montserrat woff2 family
