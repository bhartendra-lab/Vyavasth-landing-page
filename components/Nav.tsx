import { FEATURE_PAGES } from "@/lib/feature-pages";
import NavClient from "./NavClient";

// The order the Features menu lists the pages in. A page not listed here is
// added after these, so a new feature page shows up in the menu on its own.
const MENU_ORDER = [
  "album-selection",
  "face-search-photo-sharing",
  "live-photo-delivery",
  "locate-original-raw-files",
  "google-reviews-for-photographers",
];

const rank = (slug: string) => {
  const i = MENU_ORDER.indexOf(slug);
  return i === -1 ? MENU_ORDER.length : i;
};

/**
 * The top bar. A server component so the feature pages' copy stays out of the
 * client bundle: only the label and link of each page reaches NavClient.
 */
export default function Nav() {
  const featureLinks = [...FEATURE_PAGES]
    .sort((a, b) => rank(a.slug) - rank(b.slug))
    .map((p) => ({ label: p.navLabel, href: `/features/${p.slug}` }));
  return <NavClient featureLinks={featureLinks} />;
}
