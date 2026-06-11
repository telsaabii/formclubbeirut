import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  style: ["normal", "italic"],
  axes: ["wdth"],
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: {
    default: "Form Club Beirut — Strength in Every Form",
    template: "%s — Form Club Beirut",
  },
  description:
    "Fitness, personal training, martial arts, and rehabilitation under one roof in Verdun, Beirut. Strength in Every Form.",
  openGraph: {
    title: "Form Club Beirut",
    description: "Strength in Every Form — Verdun, Beirut.",
    images: ["/brand/logo-full.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#07060b",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${archivo.variable} ${plexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ink text-bone">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
