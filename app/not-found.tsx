import Link from "next/link";
import type { Metadata } from "next";
import Shell from "@/components/layout/Shell";

export const metadata: Metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <div className="flex min-h-svh items-center">
      <Shell>
        <p className="micro">no such page</p>
        <h1 className="display-l mt-8 max-w-[14ch]">
          That one doesn&rsquo;t exist.
        </h1>
        <p className="lede mt-8 max-w-[42ch] text-bone-dim">
          The link may be old, or we may have moved it. The work is all still here.
        </p>
        <div className="mt-12 flex flex-wrap gap-x-10 gap-y-4">
          <Link href="/" className="link-underline heading">
            Home
          </Link>
          <Link href="/work" className="link-underline heading">
            See the work
          </Link>
        </div>
      </Shell>
    </div>
  );
}
