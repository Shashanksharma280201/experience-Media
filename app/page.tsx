import Hero from "@/components/home/Hero";
import Depth from "@/components/motion/Depth";
import Reel from "@/components/home/Reel";
import Ticker from "@/components/home/Ticker";
import ReelPlayer from "@/components/media/ReelPlayer";
import Positioning from "@/components/home/Positioning";
import Record from "@/components/home/Record";
import Clients from "@/components/home/Clients";
import Process from "@/components/home/Process";
import Services from "@/components/home/Services";
import SelectedWork from "@/components/home/SelectedWork";
import Testimonials from "@/components/home/Testimonials";
import Founder from "@/components/home/Founder";
import Contact from "@/components/home/Contact";
export default function Home() {
  return (
    <>
      <Hero />
      <Ticker />
      <Reel />
      <Positioning />
      <Record />
      <Clients />
      <Services />
      <Process />
      <SelectedWork />
      <Testimonials />
      <Founder />
      <Contact />
      <ReelPlayer />
      <Depth />
    </>
  );
}
