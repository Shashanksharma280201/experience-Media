import Hero from "@/components/home/Hero";
import LogoBand from "@/components/home/LogoBand";
import Positioning from "@/components/home/Positioning";
import Credibility from "@/components/home/Credibility";
import Services from "@/components/home/Services";

// Sections are built one at a time — see BRIEF §8 step 4.
export default function Home() {
  return (
    <>
      <Hero />
      <LogoBand />
      <Positioning />
      <Credibility />
      <Services />
    </>
  );
}
