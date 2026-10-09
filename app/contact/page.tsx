import type { Metadata } from "next";
import Contact from "@/components/home/Contact";

export const metadata: Metadata = {
  title: "Contact",
  description: "Tell us what you're trying to achieve. We'll figure out what it takes to get there.",
};

export default function ContactPage() {
  return <Contact page />;
}
