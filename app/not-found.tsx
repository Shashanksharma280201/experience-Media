import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-svh flex-col justify-center bg-void text-paper">
      <div className="mx-auto w-full max-w-[1600px] px-5 md:px-10">
        <p className="eyebrow text-accent">00:00:00:00 · No signal</p>
        <h1 className="display mt-8 text-[clamp(3rem,14vw,11rem)]">
          404<span className="text-accent">.</span>
        </h1>
        <p className="mt-8 max-w-md text-paper/60">
          That frame doesn&apos;t exist. The reel is still running, though.
        </p>
        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/"
            className="eyebrow border border-rule px-6 py-3 transition-colors hover:border-accent hover:text-accent"
          >
            Back to index
          </Link>
          <Link
            href="/work"
            className="eyebrow border border-accent px-6 py-3 text-accent transition-colors hover:bg-accent hover:text-void"
          >
            See the work
          </Link>
        </div>
      </div>
    </div>
  );
}
