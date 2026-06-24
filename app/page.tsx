import Link from "next/link";
import dynamic from "next/dynamic";
import Hero from "@/components/Hero";
import Founder from "@/components/Founder";
import CreatorsStrip from "@/components/CreatorsStrip";
import BrandGrid from "@/components/BrandGrid";
import StatCounter from "@/components/StatCounter";
import ServicesPinned from "@/components/ServicesPinned";
import Testimonials from "@/components/Testimonials";
import ContactForm from "@/components/ContactForm";

const WebGLCanvas = dynamic(() => import("@/components/webgl/WebGLCanvas"));

export default function Home() {
  return (
    <>
      {/* Fixed WebGL multiverse — shows through the transparent hero region. */}
      <WebGLCanvas />

      <Hero />

      {/* Everything below scrolls up over the canvas on an opaque paper surface. */}
      <div className="relative z-10 bg-paper">
        <Founder />
        <CreatorsStrip />
        <BrandGrid />
        <StatCounter />
        <ServicesPinned />

        {/* CTA to portfolio */}
        <section className="border-t border-line">
          <Link
            href="/portfolio"
            className="group mx-auto flex max-w-[1600px] flex-col items-start justify-between gap-6 px-5 py-20 md:flex-row md:items-center md:px-10 md:py-28"
          >
            <h2 className="display text-[clamp(2.2rem,7vw,6rem)]">
              See the work
              <span className="text-accent">.</span>
            </h2>
            <span className="eyebrow flex items-center gap-3 rounded-full border border-ink px-6 py-4 transition-colors group-hover:bg-ink group-hover:text-paper">
              Explore portfolio{" "}
              <span className="transition-transform group-hover:translate-x-1">↗</span>
            </span>
          </Link>
        </section>

        <Testimonials />
        <ContactForm />
      </div>
    </>
  );
}
