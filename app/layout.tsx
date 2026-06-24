import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import { ScrollProgressProvider } from "@/hooks/useScrollProgress";
import ScrollProgress from "@/components/ScrollProgress";
import Grain from "@/components/Grain";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { site } from "@/lib/content";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
      <body>
        <Grain />
        <ScrollProgress />
        <SmoothScrollProvider>
          <ScrollProgressProvider>
            <Nav />
            <main>{children}</main>
            <Footer />
          </ScrollProgressProvider>
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
