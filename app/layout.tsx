import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { SUPPORT_EMAIL, WHATSAPP_DISPLAY } from "@/lib/site-legal";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

// Used only for the hero's second beat and the phone title in the hero.
const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-instrument",
  display: "swap",
});

const TITLE = "Vyavasth: Wedding photo delivery and album selection for studios";
const DESCRIPTION =
  "Deliver wedding photos while the event is still running. Guests find their photos with one selfie, couples finish album selection in hours, and you locate the originals in one click.";

const orgLd = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": "https://vyavasth.in/#organization",
    name: "Vyavasth",
    url: "https://vyavasth.in",
    logo: "https://vyavasth.in/vyavasth-icon.png",
    description:
      "Wedding and event photo delivery software for photography studios in India: live delivery, selfie-based face search, album selection and studio-branded galleries.",
    email: SUPPORT_EMAIL,
    sameAs: [
      "https://www.instagram.com/vyavasth.in",
      "https://www.youtube.com/@Vyavasth",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Chanderi",
      addressRegion: "Madhya Pradesh",
      postalCode: "473446",
      addressCountry: "IN",
    },
    areaServed: { "@type": "Country", name: "India" },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        telephone: WHATSAPP_DISPLAY.replace(/\s+/g, ""),
        email: SUPPORT_EMAIL,
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"],
      },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": "https://vyavasth.in/#website",
    url: "https://vyavasth.in",
    name: "Vyavasth",
    inLanguage: "en-IN",
    publisher: { "@id": "https://vyavasth.in/#organization" },
  },
];

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  metadataBase: new URL("https://vyavasth.in"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: TITLE,
      },
    ],
    type: "website",
    siteName: "Vyavasth",
    locale: "en_IN",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#F5EDE0",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-IN" className={`${jakarta.variable} ${instrumentSerif.variable}`}>
      <body className="min-h-screen antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }}
        />
        {children}
      </body>
    </html>
  );
}
