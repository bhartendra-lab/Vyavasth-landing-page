import type { Metadata } from "next";
import Link from "next/link";
import LegalPageShell from "@/components/LegalPageShell";
import { whatsappUrl } from "@/lib/site-legal";
import { FEATURE_PAGES } from "@/lib/feature-pages";

const TITLE = "Vyavasth features: album selection, face search, live delivery and more";
const DESCRIPTION =
  "What Vyavasth does for wedding and event photography studios in India: album selection in hours, originals in one click, one-selfie face search, live delivery and Google reviews from every gallery.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/features" },
  openGraph: { title: TITLE, description: DESCRIPTION, url: "/features" },
};

const h2 = "text-xl font-semibold mt-2 mb-3 tracking-tight";
const h2Style = { fontFamily: "var(--font-syne)", color: "#1A1208" } as const;

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://vyavasth.in/" },
      { "@type": "ListItem", position: 2, name: "Features", item: "https://vyavasth.in/features" },
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: FEATURE_PAGES.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      url: `https://vyavasth.in/features/${p.slug}`,
      name: p.navLabel,
    })),
  },
];

export default function FeaturesPage() {
  return (
    <LegalPageShell title="Features">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <p className="m-0">
        Everything below is included on every Vyavasth plan, including pay per
        event. The one exception is original-quality delivery, which needs a
        storage plan of 500 GB or more.
      </p>

      {FEATURE_PAGES.map((p) => (
        <section key={p.slug}>
          <h2 className={h2} style={h2Style}>
            <Link href={`/features/${p.slug}`} className="text-[#C25A3A] underline">
              {p.navLabel}
            </Link>
          </h2>
          <p className="m-0">{p.summary}</p>
        </section>
      ))}

      <section>
        <a
          href={whatsappUrl("Hi, I want to know more about Vyavasth")}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center px-6 py-3.5 rounded-xl font-semibold text-white transition-all duration-200 hover:brightness-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C25A3A]/50 no-underline w-full sm:w-auto text-center"
          style={{ backgroundColor: "#C25A3A", fontFamily: "var(--font-dm-sans)" }}
        >
          Chat on WhatsApp
        </a>
      </section>
    </LegalPageShell>
  );
}
