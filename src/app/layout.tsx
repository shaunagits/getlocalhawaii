import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, IBM_Plex_Mono, IBM_Plex_Sans } from "next/font/google";
import { SITE_NAME, SITE_URL } from "@/lib/site";

import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  weight: ["400", "600", "800"],
  display: "swap",
});

const plexSans = IBM_Plex_Sans({
  variable: "--font-plex-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  variable: "--font-plex-mono",
  subsets: ["latin"],
  weight: ["500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  // Every canonical and Open Graph URL on the site resolves against this.
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME}: lei stands, markets and local produce`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "A directory of Hawaiʻi lei stands and local food sellers, built from public listings, with each listing showing where its information came from and when it was last checked.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_US",
    url: SITE_URL,
  },
};

export const viewport: Viewport = {
  themeColor: "#0a2e33",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body
        className={`${bricolage.variable} ${plexSans.variable} ${plexMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
