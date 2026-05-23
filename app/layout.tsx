import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Vyavasth — Studio Management for Photographers",
  description: "[Placeholder — add your own description after launch]",
  metadataBase: new URL("https://vyavasth.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Vyavasth",
    description: "[Placeholder]",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Vyavasth — Studio Management for Photographers",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vyavasth — Studio Management for Photographers",
    description: "[Placeholder]",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfairDisplay.variable} ${inter.variable}`}
    >
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
