import type { Metadata } from "next";
import { Geist, Inter } from "next/font/google";
import { StartupLoader } from "@/components/layout/StartupLoader";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
// Self-hosted by next/font at build time, so the loader never waits on the network for it.
const geist = Geist({ weight: "500", subsets: ["latin"], variable: "--font-geist", display: "swap" });

export const metadata: Metadata = {
  title: "BITS Knowledge Base",
  description: "Platform guides, flows, standards and templates for the BITS Automation Portal.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${geist.variable}`}>
      <body>
        <StartupLoader />
        {children}
      </body>
    </html>
  );
}
