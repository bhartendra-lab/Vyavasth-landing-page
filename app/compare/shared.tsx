import Link from "next/link";
import type { ReactNode } from "react";
import { getPlans } from "@/lib/vyavasth-api";
import { vyavasthCompare } from "@/lib/compare-vyavasth";

/** Where a Vyavasth price would be when the plans API gave none. */
export function SeePrices() {
  return (
    <Link href="/pricing" style={{ color: "var(--terra)", textDecoration: "underline" }}>
      See current prices on the pricing page
    </Link>
  );
}

/** An outside link: opens in a new tab and passes no ranking credit. */
export function Ext({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener nofollow" style={{ color: "var(--terra)", textDecoration: "underline" }}>
      {children}
    </a>
  );
}

export const firstSentence = (s: string) => s.split(/(?<=\.)\s/)[0];

/** Vyavasth's own figures, from the plans API. Never throws: an API failure gives empty figures. */
export async function loadVyavasth() {
  const result = await getPlans();
  return vyavasthCompare(result.ok ? result.data.plans : []);
}
