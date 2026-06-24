import type { Metadata } from "next";
import PortfolioGrid from "@/components/PortfolioGrid";
import ContactForm from "@/components/ContactForm";
import { HeroParallax, type ParallaxProduct } from "@/components/aceternity/hero-parallax";
import { portfolio } from "@/lib/content";

export const metadata: Metadata = {
  title: "Portfolio — Experience Media",
  description:
    "Short-form, long-form, podcasts, motion graphics, VFX & CGI — the experience we've shared with creators and brands.",
};

// Curate 15 landscape pieces for the parallax showcase.
const parallaxProducts: ParallaxProduct[] = portfolio
  .filter((c) => c.layout === "long")
  .flatMap((c) => c.items.map((it) => ({ title: c.title, link: it.href, thumbnail: it.thumb })))
  .slice(0, 15);

export default function PortfolioPage() {
  return (
    <>
      <HeroParallax
        products={parallaxProducts}
        eyebrow="Selected work"
        heading={
          <>
            Experience
            <br />
            we&apos;ve <span className="text-accent">shared.</span>
          </>
        }
        subheading="A cross-section of edits, campaigns and productions for creators and brands — tap any piece to watch it on YouTube or Instagram."
      />

      {portfolio.map((category, i) => (
        <PortfolioGrid key={category.title} category={category} index={i} />
      ))}

      <ContactForm />
    </>
  );
}
