import Hero from "@/components/home/Hero";
import LogoBand from "@/components/home/LogoBand";
import Positioning from "@/components/home/Positioning";
import Credibility from "@/components/home/Credibility";
import Services from "@/components/home/Services";
import SelectedWork from "@/components/home/SelectedWork";
import Testimonials from "@/components/home/Testimonials";
import Founder from "@/components/home/Founder";
import Contact from "@/components/home/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <LogoBand />
      <Positioning />
      <Credibility />
      <Services />
      <SelectedWork />
      <Testimonials />
      <Founder />
      <Contact />
    </>
  );
}
