import Link from "next/link";
import type { Metadata } from "next";
import Scene from "@/components/layout/Scene";
import Group from "@/components/motion/Group";
import Poster from "@/components/motion/Poster";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <Scene>
      <Group onLoad>
        <Poster as="h1" lines={["That one", "doesn't exist."]} script="sorry" scriptLine={0} />
        <p className="lede mt-10 max-w-[42ch] text-ink-dim" data-reveal="fade">
          The link may be old, or we may have moved it. The work is all still here.
        </p>
        <div className="mt-12 flex flex-wrap gap-x-10 gap-y-4" data-reveal="fade">
          <Link href="/" className="link-underline heading">Home</Link>
          <Link href="/work" className="link-underline heading">See the work</Link>
        </div>
      </Group>
    </Scene>
  );
}
