import type { Metadata } from "next";
import { Archivo, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import { ScrollProgressProvider } from "@/hooks/useScrollProgress";
import Scrubber from "@/components/chrome/Scrubber";
import Transition from "@/components/chrome/Transition";
import CursorReadout from "@/components/chrome/CursorReadout";
import Intro from "@/components/intro/Intro";
import Grain from "@/components/Grain";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { site } from "@/lib/content";

// Archivo carries both a weight and a width axis; the hero maps scroll to `wdth`.
const display = Archivo({
  variable: "--font-display",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

// Technical furniture: timecodes, reel indices, deliverable tracks, metric labels.
const technical = JetBrains_Mono({
  variable: "--font-technical",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://experiencemedia.in"),
  title: "Experience Media — Creative Agency, YouTube Management & Video Editing",
  description: site.description,
  keywords: [
    "motion graphics",
    "animation",
    "social media management",
    "video editing",
    "YouTube management",
    "content creation",
    "ad campaigns",
    "Experience Media",
  ],
  icons: {
    icon: "/assets/favicons/favicon-48x48.png",
    apple: "/assets/favicons/apple-touch-icon.png",
  },
  openGraph: {
    title: "Experience Media — Creative Agency",
    description:
      "Experience Media helps creators & brands grow through content strategy, editing, and YouTube management.",
    url: "https://experiencemedia.in/",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Experience Media — Creative Agency",
    description: "India's most immersive creative agency — Experience Media.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${technical.variable} antialiased`}>
      <body>
        {/* Runs before paint: if the intro already played this session, the
            loading screen is never rendered at all — no flash either way. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(sessionStorage.getItem('em-intro-seen')==='1')document.documentElement.classList.add('intro-done')}catch(e){}`,
          }}
        />
        <Intro />
        <Grain />
        <Transition />
        <CursorReadout />
        <SmoothScrollProvider>
          <ScrollProgressProvider>
            <Nav />
            <main>{children}</main>
            <Footer />
            {/* Inside the provider — the scrubber is its consumer. */}
            <Scrubber />
          </ScrollProgressProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
