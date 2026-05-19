import type { Metadata } from "next";
import TitleBar from "@/components/TitleBar";
import Footer from "@/components/Footer";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000/";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "ÖPNV Projekt Tracker",
  description:
    "Interaktive Übersicht über ÖPNV-Projekte mit Statusverlauf, Projektarten und Quellen.",
  icons: {
    icon: `${siteUrl}favicon.png`,
    shortcut: `${siteUrl}favicon.png`,
    apple: `${siteUrl}icons/apple-touch-icon.png`,
  },
  keywords: [
    "ÖPNV",
    "Neubauprojekt",
    "Streckenreaktivierung",
    "Projekt Tracker",
    "Nahverkehr",
    "Verkehr",
    "Bahn",
    "Bus",
    "Mobilität",
  ],
  openGraph: {
    type: "website",
    locale: "de_DE",
    url: siteUrl,
    siteName: "ÖPNV Projekt Tracker",
    title: "ÖPNV Projekt Tracker",
    description:
      "Interaktive Übersicht über ÖPNV-Projekte mit Statusverlauf, Projektarten und Quellen.",
    images: [
      {
        url: "og/og-image.png",
        width: 1200,
        height: 630,
        alt: "ÖPNV Projekt Tracker - Interaktive Übersicht über ÖPNV-Projekte",
      }
    ]
  },
  twitter: {
    card: "summary",
    title: "ÖPNV Projekt Tracker",
    description:
      "Interaktive Übersicht über ÖPNV-Projekte mit Statusverlauf, Projektarten und Quellen.",
    images: [
      {
        url: "og/og-image.png",
        width: 1200,
        height: 630,
        alt: "ÖPNV Projekt Tracker - Interaktive Übersicht über ÖPNV-Projekte",
      }
    ]
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body className="min-h-screen antialiased flex flex-col">
        <TitleBar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
