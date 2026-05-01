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
        url: "/images/pyxis-preview-1.jpg",
        width: 1200,
        height: 630,
        alt: "Pyxis Search Engine",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pyxis | Search the Web",
    description:
      "Fast, private web search. Search the web, images, videos, news, and books without being tracked.",
    images: ["/images/pyxis-preview-1.jpg"],
  },
  icons: {
    icon: "/images/pyxis.svg",
    shortcut: "/images/pyxis.svg",
    apple: "/images/pyxis.svg",
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
