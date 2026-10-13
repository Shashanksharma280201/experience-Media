// components/training/PlaybookCover.tsx — the 30-day playbook as a cover,
// set in the site's type. No photo: the product is a document.
import Emblem from "@/components/brand/Emblem";
import { training } from "@/lib/content";

export default function PlaybookCover({ className = "" }: { className?: string }) {
  return (
    <div className={`cover ${className}`} aria-hidden>
      <span className="cover-days poster">30</span>
      <span className="cover-title poster">{training.product.replace(/^30-Day /, "")}</span>
      <span className="cover-foot">
        <Emblem className="h-5 w-auto" />
        <span className="micro">free · day one to day thirty</span>
      </span>
    </div>
  );
}
