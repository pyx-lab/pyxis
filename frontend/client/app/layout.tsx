import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const SITE_URL = "https://search.pyx-lab.org";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Pyxis | Search the Web",
    template: "%s | Pyxis",
  },
  description:
    "Pyxis is a fast, private web search engine. Search the web, images, videos, news, and books without being tracked.",
  keywords: [
    "search engine",
    "private search",
    "web search",
    "Pyxis",
    "fast search",
    "no tracking",
  ],
  authors: [{ name: "Pyxis", url: SITE_URL }],
  creator: "Pyxis",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Pyxis",
    title: "Pyxis | Search the Web",
    description:
      "Fast, private web search. Search the web, images, videos, news, and books without being tracked.",
    images: [
      {
        url: "/images/pyxis-og.jpg",
        width: 1200,
        height: 630,
        alt: "Pyxis Search Engine",
        type: "image/jpeg",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pyxis | Search the Web",
    description:
      "Fast, private web search. Search the web, images, videos, news, and books without being tracked.",
    images: ["/images/pyxis-og.jpg"],
  },
  icons: {
    icon: [
      { url: "/icons/icon-16.png", sizes: "16x16", type: "image/png" },
      { url: "/icons/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/icons/favicon.ico",
    apple: { url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geist.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
