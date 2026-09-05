import type { Metadata } from "next";
import { Archivo, Inter_Tight, Pinyon_Script } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import Transition from "@/components/chrome/Transition";
import Intro from "@/components/intro/Intro";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { site } from "@/lib/content";

// Display. The width axis is the point — see DESIGN.md §2.
const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  axes: ["wdth"],
  display: "swap",
});

// Body. Narrow and neutral, so the pair contrasts on width, not just weight.
const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  display: "swap",
});

// The script: one word in red laid over the condensed caps — see DESIGN.md §2.
const pinyon = Pinyon_Script({
  variable: "--font-pinyon",
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://experiencemedia.in"),
  title: {
    default: "Experience Media — Marketing agency, New Delhi",
    template: "%s — Experience Media",
  },
  description: site.description,
  icons: {
    icon: "/assets/favicons/favicon-48x48.png",
    apple: "/assets/favicons/apple-touch-icon.png",
  },
  openGraph: {
    title: "Experience Media",
    description: site.description,
    url: "https://experiencemedia.in/",
    siteName: site.name,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Experience Media",
    description: site.description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${interTight.variable} ${pinyon.variable} antialiased`}
    >
      <body>
        <Intro />
        <Transition />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[90] focus:bg-ink focus:px-4 focus:py-2 focus:text-paper"
        >
          Skip to content
        </a>
        <SmoothScrollProvider>
          <Nav />
          <main id="main">{children}</main>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
