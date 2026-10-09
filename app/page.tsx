import Hero from "@/components/home/Hero";
import Depth from "@/components/motion/Depth";
import Reel from "@/components/home/Reel";
import Ticker from "@/components/home/Ticker";
import ReelPlayer from "@/components/media/ReelPlayer";
import Positioning from "@/components/home/Positioning";
import FounderStory from "@/components/home/FounderStory";
import Record from "@/components/home/Record";
import Clients from "@/components/home/Clients";
import Offer from "@/components/home/Offer";
import Services from "@/components/home/Services";
import Capabilities from "@/components/home/Capabilities";
import Process from "@/components/home/Process";
import TopEleven from "@/components/home/TopEleven";
import Testimonials from "@/components/home/Testimonials";
import Founder from "@/components/home/Founder";
import Training from "@/components/home/Training";
import Contact from "@/components/home/Contact";
import { credibility } from "@/lib/content";

/** The home page, in the brief's order (§4). */
export default function Home() {
  return (
    <>
      <Hero />
      <Ticker items={credibility} label="Credibility" />
      <Reel />
      <Positioning />
      <FounderStory />
      <Record />
      <Clients />
      <Offer />
      <Services />
      <Capabilities />
      <Process />
      <TopEleven />
      <Testimonials />
      <Founder />
      <Training />
      <Contact />
      <ReelPlayer />
      <Depth />
    </>
  );
}
