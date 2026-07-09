import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "jeanch.ai",
  description: "An interactive sailing adventure around Bald Head Island — a Father's Day gift built with Three.js and React Three Fiber.",
  keywords: ["Bald Head Island", "sailing", "interactive", "3D", "Father's Day", "Three.js"],
  openGraph: {
    title: "jeanch.ai",
    description: "An interactive sailing adventure around Bald Head Island — a Father's Day gift built with Three.js and React Three Fiber.",
    url: "https://jeanch.ai",
    siteName: "jeanch.ai",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "jeanch.ai",
    description: "An interactive sailing adventure around Bald Head Island — a Father's Day gift built with Three.js and React Three Fiber.",
  },
  metadataBase: new URL("https://jeanch.ai"),
  icons: {
    icon: "/icon",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="h-full bg-[#050f1a]">{children}</body>
    </html>
  );
}
