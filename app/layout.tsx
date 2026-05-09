import type { Metadata } from "next";
import { Syne, DM_Sans } from "next/font/google";
import "./globals.css";

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-sans",
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
      className={`${syne.variable} ${dmSans.variable}`}
    >
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
