# SEO Phase 0: crawlability, identity and structured data

You are working in the Next.js repo `Vyavasth-landing-page`. This task makes the site readable and correctly understood by Google, Bing, ChatGPT search and Google AI Mode. It is mostly metadata and copy. Do not redesign anything or touch visual components beyond what is listed.

## Working rules (keep token use low)

- Do NOT start the dev server (`npm run dev`), do not open a browser, do not take screenshots.
- Read only the files named below. Do not explore the repo, and do not read `graphify-out/` unless a step fails and you need to locate something.
- Per AGENTS.md this Next.js version differs from your training data. Before writing `app/robots.ts` and `app/sitemap.ts`, read ONLY the metadata-file docs for robots and sitemap under `node_modules/next/dist/docs/` (find them with one `grep -ril "robots" node_modules/next/dist/docs | head`). Do not read other docs.
- All copy below is final. Paste it exactly. Do not add em dashes (the character "—") anywhere in new or edited copy; the founder does not want them. Where existing page titles in files you touch use " — Vyavasth", change them to ": Vyavasth" or as specified below.
- No new dependencies.
- Do not commit, push or deploy. Leave changes in the working tree.
- When finished, reply with a short list of files changed and the verification output only. No summaries of the code.

## Already done (do not redo)

- `public/og-image.png` (1200x630) now exists. The layout already references `/og-image.png`.
- `public/llms.txt` exists. Do not change it.

## 1. `app/robots.ts` (new)

Return:
- one rule for `userAgent: "*"`: `allow: "/"`, `disallow: ["/api/"]`
- `sitemap: "https://vyavasth.in/sitemap.xml"`
- `host: "https://vyavasth.in"`

Do not add per-bot blocks. All search and AI crawlers must be allowed.

## 2. `app/sitemap.ts` (new)

List these absolute URLs on `https://vyavasth.in`: `/`, `/pricing`, `/about`, `/contact`, `/privacy-policy`, `/terms`, `/refund-policy`, `/cookie-policy`.
- Do NOT include `/welcome` (it is noindex on purpose).
- `lastModified`: use a fixed date constant `const SITE_UPDATED = new Date("2026-10-16")` at the top of the file, not `new Date()` at build time (a changing lastmod on every build is a false freshness signal).
- `changeFrequency`: `/` and `/pricing` "weekly"; others "monthly" (legal pages "yearly").
- `priority`: `/` 1.0, `/pricing` 0.9, `/about` 0.7, `/contact` 0.5, legal pages 0.2.

## 3. `app/layout.tsx`

a) Replace `TITLE` and `DESCRIPTION`:

```ts
const TITLE = "Vyavasth: Wedding photo delivery and album selection for studios";
const DESCRIPTION =
  "Deliver wedding photos while the event is still running. Guests find their photos with one selfie, couples finish album selection in hours, and you locate the originals in one click.";
```

b) Keep `title: TITLE` as a plain string (no title template; every page sets its own full title). Add `openGraph.siteName: "Vyavasth"`, `openGraph.locale: "en_IN"`, `openGraph.url: "/"`.

c) Add Organization + WebSite JSON-LD, rendered once inside `<body>` before `{children}` as `<script type="application/ld+json">` (same `dangerouslySetInnerHTML` pattern as `app/page.tsx`). Import `SUPPORT_EMAIL`, `WHATSAPP_DISPLAY` from `@/lib/site-legal`. Use this object (an array of two nodes):

```ts
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
```

d) Change `<html lang="en">` to `<html lang="en-IN">`.

## 4. `app/page.tsx` (home JSON-LD only)

In the existing `jsonLd` object (keep the existing offers logic exactly):
- add `"@id": "https://vyavasth.in/#software"`, `url: "https://vyavasth.in"`, `publisher: { "@id": "https://vyavasth.in/#organization" }`
- change `description` to: `"Wedding and event photo delivery software for Indian photography studios. Live delivery during the event, one-selfie face search for guests, album selection for couples, and one-click locating of original files."`
- change `operatingSystem` to `"Web, Android"` (there is no iOS app)
- add `featureList`:
  ```ts
  featureList: [
    "Live photo delivery during the event",
    "Selfie-based face search for guests",
    "Album selection with likes and bride or groom side filters",
    "Locate original RAW files from selected photos",
    "Studio branding and watermark on every screen",
    "Google review prompts inside the gallery",
    "Resumable uploads and reusable storage",
  ],
  ```
Do not change anything else in this file.

## 5. `lib/site-legal.ts`

Change only:
```ts
export const SERVICE_DESCRIPTION_SHORT =
  "wedding and event photo delivery software for photography studios";
```

## 6. Legal pages: fix the wrong service description only

The terms and privacy pages describe Vyavasth as a "SaaS platform for business operations management" for "internal operations, tasks, workflows". That is wrong and confuses search engines about what the company is. Change ONLY those descriptive phrases; do not touch any clause, obligation, date, or other legal text.

- `app/terms/page.tsx` around lines 78-84: replace the description of the service so the sentence says Vyavasth provides **wedding and event photo delivery software for photography studios**, which helps studios in India upload, deliver and share event photos with their clients and guests, and manage photo selection. Keep the surrounding sentence structure and the `<strong>` styling.
- `app/privacy-policy/page.tsx` line ~38: replace "platform for business operations management" with "wedding and event photo delivery software for photography studios".
- `app/privacy-policy/page.tsx` line ~153: replace the "(including workflows, task tracking, and day-to-day business ...)" parenthetical with "(including event photos, guest selfies used for face search, photo selections and related event details)". Read 5 lines around it first so the sentence stays grammatical.
- Do not edit `LAST_UPDATED`.

## 6b. Page titles (metadata `title` only)

Change these `title` strings exactly (they currently use " — Vyavasth"):
- `app/terms/page.tsx`: "Terms & Conditions: Vyavasth"
- `app/privacy-policy/page.tsx`: "Privacy Policy: Vyavasth"
- `app/refund-policy/page.tsx`: "Refund & Cancellation Policy: Vyavasth"
- `app/cookie-policy/page.tsx`: "Cookie Policy: Vyavasth"
- `app/contact/page.tsx`: "Contact Vyavasth: WhatsApp, phone and email support" (leave its description)
- `app/pricing/page.tsx`: change `const TITLE = "Pricing: Vyavasth";` to `const TITLE = "Vyavasth pricing: pay per event or an annual storage plan";`. Touch nothing else in that file.

## 7. `app/about/page.tsx`: rewrite the content

Keep `LegalPageShell`, the existing `h2`/`h2Style`/`list` class constants, the "Business entity" section exactly as it is, and the link styling (`text-[#C25A3A] underline`). Replace everything else.

Metadata:
```ts
export const metadata: Metadata = {
  title: "About Vyavasth: wedding photo delivery software for Indian studios",
  description:
    "Vyavasth is wedding and event photo delivery software for photography studios in India. Live delivery, one-selfie face search, album selection in hours and originals in one click.",
  alternates: { canonical: "/about" },
};
```
Shell title stays "About Us". Then these sections in this order (`<p>` for paragraphs, `<ul className={list}>` for lists):

**(no heading, opening paragraph)**
"Vyavasth is wedding and event photo delivery software for photography studios in India. Studios upload photos during the event, guests find every photo they are in with one selfie, couples finish album selection in hours instead of months, and the studio locates the original files for the selected photos in one click."

**h2: What Vyavasth does**
List:
- "<strong>Live delivery.</strong> Photos reach the client's gallery while the event is still running, not weeks later on a pen drive or a Google Drive link."
- "<strong>Face search.</strong> Every guest opens one link, takes one selfie, and sees only the photos they are in. With consent, they can also see photos of their own family and friends group."
- "<strong>Album selection.</strong> The couple and family like photos inside the gallery. The studio filters selections by the bride's side or the groom's side, by person, or by total likes."
- "<strong>Originals in one click.</strong> For every selected photo, the studio locates the matching original file to send to the editor."
- "<strong>Your studio's name on every screen.</strong> The studio's logo and watermark appear throughout the gallery, and guests are prompted to leave the studio a Google review."
- "<strong>Uploads you do not babysit.</strong> Uploads resume on their own when the internet drops, and storage is reusable: delete an old event and the space is free again."

**h2: Who uses Vyavasth**
"Wedding and event photography studios, from large studios to one-person teams. Our studios work across Madhya Pradesh, Uttar Pradesh, Rajasthan, Maharashtra and Gujarat. Our team works out of Bhopal, Indore, Gwalior and Jhansi, and the company is registered in Chanderi, Madhya Pradesh."

**h2: What studios say**
Two `<blockquote>`s, each followed by a `<p>` attribution. Use exactly this text (it is copied from the home page testimonials in `components/home/Proof.tsx`; do not paraphrase):
1. "Main 10 saal se industry mein hoon, aur Google Drive aur pendrive se hi delivery sahi lagti thi. Par Vyavasth ki branded gallery se Google reviews aur Instagram followers seedhe badhe hain. Aur photo selection ka kaam, jisme 2 mahine tak lag jaate the, wo ab 2 ghante mein hone laga hai. Album selection feature ne kaam bahut hi aasan kar diya hai." Attribution: "<strong>Kamal Productions</strong>, Gwalior"
2. "Kaafi saari companies AI features ki baat karti thi, par Vyavasth ka platform aur photo selection feature, jo couples ka selection aasan karta hai, usse jo madad mili hai, wo magic jaisi hi hai." Attribution: "<strong>The Wedding Booth</strong>, Bhopal"
Style the blockquotes minimally with Tailwind (`border-l-2 border-[#C25A3A] pl-4 italic m-0`), no new CSS file.

**h2: How pricing works**
"Two ways to pay: pay per event, or an annual storage plan for studios that shoot many events a year. Prices are in Indian rupees. See current prices on the " + `<Link href="/pricing">pricing page</Link>` + "."

**(keep) h2: Business entity** (unchanged)

**h2: Trust and responsibility** (keep the list, change only the first bullet to:)
"We built Vyavasth as a <strong>secure platform</strong> for storing and delivering event photos, with face search that guests opt into."
Keep bullets 2 and 3 unchanged.

**h2: Talk to us**
"Questions about Vyavasth or pricing? Message us on WhatsApp and a person will answer, any time of day."
Replace the old "Contact us for pricing" `/contact` button with a button of the same styling linking to `whatsappUrl("Hi, I want to know more about Vyavasth")` (import `whatsappUrl` from `@/lib/site-legal`), `target="_blank" rel="noopener noreferrer"`, label "Chat on WhatsApp". Because it is an external link use `<a>`, not `<Link>`.

Remove the now-unused `SERVICE_DESCRIPTION_SHORT` import from this file if nothing else uses it there.

## 8. `components/Footer.tsx`

In the social links array that contains Instagram, add after it:
`{ label: "YouTube", href: "https://www.youtube.com/@Vyavasth" }`
Check how Instagram is rendered (icon or text). If it uses an icon map keyed by label, add a YouTube icon from `lucide-react` (`Youtube`) the same way. Nothing else.

## Verification (run in this order, keep output short)

1. `npx tsc --noEmit 2>&1 | tail -20`
2. `npm run lint 2>&1 | tail -20`
3. `npm test 2>&1 | tail -15`
4. `npm run build 2>&1 | tail -40`
5. After a successful build, print the generated files, which proves robots and sitemap work without a server:
   `find .next/server/app -name "robots.txt.body" -o -name "sitemap.xml.body" | xargs -I{} sh -c 'echo "== {}"; cat "{}"'`
6. `grep -rn "— Vyavasth" app | head` and `grep -n "—" app/about/page.tsx app/robots.ts app/sitemap.ts | head` must print nothing (existing em dashes in code comments elsewhere are fine).
7. `grep -rn "business operations\|task tracking" app lib | head` must print nothing.

Fix anything that fails, then reply with the changed-file list and the output of steps 4 (last lines), 5, 6 and 7.

If `graphify` is installed, run `graphify update .` last (no API cost).
