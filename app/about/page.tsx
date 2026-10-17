import type { Metadata } from "next";
import Link from "next/link";
import LegalPageShell from "@/components/LegalPageShell";
import {
  BUSINESS_NAME,
  REGISTERED_ADDRESS,
  whatsappUrl,
} from "@/lib/site-legal";

export const metadata: Metadata = {
  title: "About Vyavasth: wedding photo delivery software for Indian studios",
  description:
    "Vyavasth is wedding and event photo delivery software for photography studios in India. Live delivery, one-selfie face search, album selection in hours and originals in one click.",
  alternates: { canonical: "/about" },
};

const h2 = "text-xl font-semibold mt-2 mb-3 tracking-tight";
const h2Style = { fontFamily: "var(--font-syne)", color: "#1A1208" } as const;
const list = "list-disc pl-5 space-y-2 m-0";
const quote = "border-l-2 border-[#C25A3A] pl-4 italic m-0";

export default function AboutPage() {
  return (
    <LegalPageShell title="About Us">
      <section>
        <p>
          Vyavasth is wedding and event photo delivery software for photography
          studios in India. Studios upload photos during the event, guests find
          every photo they are in with one selfie, couples finish album
          selection in hours instead of months, and the studio locates the
          original files for the selected photos in one click.
        </p>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          What Vyavasth does
        </h2>
        <ul className={list}>
          <li>
            <Link href="/features/live-photo-delivery" className="text-[#C25A3A] underline">
              <strong>Live delivery.</strong>
            </Link> Photos reach the client&apos;s
            gallery while the event is still running, not weeks later on a pen
            drive or a Google Drive link.
          </li>
          <li>
            <Link href="/features/face-search-photo-sharing" className="text-[#C25A3A] underline">
              <strong>Face search.</strong>
            </Link> Every guest opens one link, takes one
            selfie, and sees only the photos they are in. With consent, they can
            also see photos of their own family and friends group.
          </li>
          <li>
            <Link href="/features/album-selection" className="text-[#C25A3A] underline">
              <strong>Album selection.</strong>
            </Link> The couple and family like photos
            inside the gallery. The studio filters selections by the
            bride&apos;s side or the groom&apos;s side, by person, or by total
            likes.
          </li>
          <li>
            <Link href="/features/locate-original-raw-files" className="text-[#C25A3A] underline">
              <strong>Originals in one click.</strong>
            </Link> For every selected photo,
            the studio locates the matching original file to send to the editor.
          </li>
          <li>
            <Link
              href="/features/google-reviews-for-photographers"
              className="text-[#C25A3A] underline"
            >
              <strong>Your studio&apos;s name on every screen.</strong>
            </Link> The
            studio&apos;s logo and watermark appear throughout the gallery, and
            guests are prompted to leave the studio a Google review.
          </li>
          <li>
            <strong>Uploads you do not babysit.</strong> Uploads resume on their
            own when the internet drops, and storage is reusable: delete an old
            event and the space is free again.
          </li>
        </ul>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          Who uses Vyavasth
        </h2>
        <p>
          Wedding and event photography studios, from large studios to
          one-person teams. Our studios work across Madhya Pradesh, Uttar
          Pradesh, Rajasthan, Maharashtra and Gujarat. Our team works out of
          Bhopal, Indore, Gwalior and Jhansi, and the company is registered in
          Chanderi, Madhya Pradesh.
        </p>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          What studios say
        </h2>
        <blockquote className={quote}>
          Main 10 saal se industry mein hoon, aur Google Drive aur pendrive se
          hi delivery sahi lagti thi. Par Vyavasth ki branded gallery se Google
          reviews aur Instagram followers seedhe badhe hain. Aur photo selection
          ka kaam, jisme 2 mahine tak lag jaate the, wo ab 2 ghante mein hone
          laga hai. Album selection feature ne kaam bahut hi aasan kar diya hai.
        </blockquote>
        <p>
          <strong>Kamal Productions</strong>, Gwalior
        </p>
        <blockquote className={quote}>
          Kaafi saari companies AI features ki baat karti thi, par Vyavasth ka
          platform aur photo selection feature, jo couples ka selection aasan
          karta hai, usse jo madad mili hai, wo magic jaisi hi hai.
        </blockquote>
        <p>
          <strong>The Wedding Booth</strong>, Bhopal
        </p>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          How pricing works
        </h2>
        <p>
          Two ways to pay: pay per event, or an annual storage plan for studios
          that shoot many events a year. Prices are in Indian rupees. See current
          prices on the{" "}
          <Link href="/pricing" className="text-[#C25A3A] underline">
            pricing page
          </Link>
          .
        </p>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          Business entity
        </h2>
        <p>
          <strong>{BUSINESS_NAME}</strong>
        </p>
        <p className="m-0">Registered address:</p>
        <p className="mt-1 mb-0">{REGISTERED_ADDRESS}</p>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          Trust and responsibility
        </h2>
        <ul className={list}>
          <li>
            We built Vyavasth as a <strong>secure platform</strong> for storing
            and delivering event photos, with face search that guests opt into.
          </li>
          <li>
            We are committed to <strong>data privacy</strong> and transparent
            handling of personal and business information. See our{" "}
            <Link href="/privacy-policy" className="text-[#C25A3A] underline">
              Privacy Policy
            </Link>
            .
          </li>
          <li>
            Billing, refunds, and cancellations are explained in our{" "}
            <Link href="/refund-policy" className="text-[#C25A3A] underline">
              Refund &amp; Cancellation Policy
            </Link>{" "}
            and{" "}
            <Link href="/terms" className="text-[#C25A3A] underline">
              Terms &amp; Conditions
            </Link>
            .
          </li>
        </ul>
      </section>

      <section>
        <h2 className={h2} style={h2Style}>
          Talk to us
        </h2>
        <p>
          Questions about Vyavasth or pricing? Message us on WhatsApp and a
          person will answer, any time of day.
        </p>
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
