import { existsSync } from "node:fs";
import { join } from "node:path";
import Hero from "@/components/home/Hero";
import Reel from "@/components/home/Reel";
import Ticker from "@/components/home/Ticker";
import ReelPlayer from "@/components/media/ReelPlayer";
import Positioning from "@/components/home/Positioning";
import Record from "@/components/home/Record";
import Process from "@/components/home/Process";
import Services from "@/components/home/Services";
import TopEleven from "@/components/home/TopEleven";
import Testimonials from "@/components/home/Testimonials";
import Founder from "@/components/home/Founder";
import Contact from "@/components/home/Contact";
import { site } from "@/lib/content";

// Resolved at build time: until the photograph lands, the hero stays
// typographic instead of shipping a broken image.
const portrait = existsSync(join(process.cwd(), "public", site.founderPortrait))
  ? site.founderPortrait
  : undefined;

export default function Home() {
  return (
    <>
      <Hero portrait={portrait} />
      <Ticker />
      <Reel />
      <Positioning />
      <Record />
      <Services />
      <Process />
      <TopEleven />
      <Testimonials />
      <Founder />
      <Contact />
      <ReelPlayer />
    </>
  );
}
