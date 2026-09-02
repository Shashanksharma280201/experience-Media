import dynamic from "next/dynamic";
import Hero from "@/components/home/Hero";
import SelectedWork from "@/components/home/SelectedWork";
import Capabilities from "@/components/home/Capabilities";
import Proof from "@/components/home/Proof";
import PointOfView from "@/components/home/PointOfView";
import Clients from "@/components/home/Clients";
import ContactForm from "@/components/ContactForm";

// The finale: the camera pulls back behind the contact section to reveal the
// whole constellation of work. Loaded only when the visitor gets there.
const WebGLScene = dynamic(() => import("@/components/webgl/WebGLScene"));

// The page is one reel; each section is a slate on it.
const REEL = 7;

export default function Home() {
  return (
    <div className="relative text-paper">
      {/* Ground plane, behind the scene. */}
      <div aria-hidden className="fixed inset-0 -z-20 bg-void" />
      <WebGLScene mode="pullback" anchorId="contact" />

      {/* Opaque stack — the canvas is hidden behind all of this. */}
      <div className="bg-void">
        <Hero />
        <SelectedWork index={1} total={REEL} />
        <Capabilities index={2} total={REEL} />
        <Proof index={3} total={REEL} />
        <PointOfView index={4} total={REEL} />
        <Clients index={5} total={REEL} />
      </div>

      {/* Transparent — the constellation resolves behind the contact form. */}
      <ContactForm index={6} total={REEL} />
    </div>
  );
}
