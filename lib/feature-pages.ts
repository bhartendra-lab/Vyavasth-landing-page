// lib/feature-pages.ts, PURE content. No React, no fetch.
//
// Source of truth for the /features pages. Every claim here describes what the
// product does today (checked against the Delivery Hub code on 16 Oct 2026).
// Do not add features that are planned but not live. No prices here: link to
// /pricing instead, so nothing goes stale when plans change. No em dashes.

export type Step = { title: string; text: string };
export type Table = { caption: string; head: string[]; rows: string[][] };
export type Figure = { src: string; alt: string; caption: string; width: number; height: number; mobile?: boolean };
export type Section = { h2: string; paragraphs?: string[]; bullets?: string[]; table?: Table; figure?: Figure };
export type FaqItem = { q: string; a: string };
export type Quote = { text: string; studio: string; city: string };

export type FeaturePage = {
  slug: string;
  /** Short name for links, cards and breadcrumbs. */
  navLabel: string;
  title: string;
  metaDescription: string;
  h1: string;
  /** Answer-first summary: what it is, who it is for, the result. */
  summary: string;
  stepsHeading: string;
  steps: Step[];
  sections: Section[];
  quote?: Quote;
  faqs: FaqItem[];
  related: string[];
  /** Prefilled WhatsApp message for this page's CTA. */
  whatsappText: string;
};

const KAMAL: Quote = {
  text: "Photo selection ka kaam, jisme 2 mahine tak lag jaate the, wo ab 2 ghante mein hone laga hai. Album selection feature ne kaam bahut hi aasan kar diya hai.",
  studio: "Kamal Productions",
  city: "Gwalior",
};

const WEDDING_BOOTH: Quote = {
  text: "Vyavasth ka platform aur photo selection feature, jo couples ka selection aasan karta hai, usse jo madad mili hai, wo magic jaisi hi hai.",
  studio: "The Wedding Booth",
  city: "Bhopal",
};

const KAMAL_REVIEWS: Quote = {
  text: "Vyavasth ki branded gallery se Google reviews aur Instagram followers seedhe badhe hain.",
  studio: "Kamal Productions",
  city: "Gwalior",
};

export const FEATURE_PAGES: FeaturePage[] = [
  // ─────────────────────────── Album selection ───────────────────────────
  {
    slug: "album-selection",
    navLabel: "Album selection",
    title: "Wedding album selection software for photographers | Vyavasth",
    metaDescription:
      "Get couples to finish wedding album selection in hours, not months. The family likes photos in one gallery; you filter by bride's side, groom's side or guest, shortlist, and pull the originals.",
    h1: "Album selection that couples finish in hours, not months",
    summary:
      "Vyavasth's Smart Selects turns album selection into likes inside the wedding gallery. The couple and their family like photos on their phones, the studio filters those likes by the bride's side, the groom's side, a single guest or the most liked, then shortlists the final set and pulls the original files in one go. No pen drives going back and forth, no Excel sheets of file numbers, no chasing the couple for three months.",
    stepsHeading: "How album selection works on Vyavasth",
    steps: [
      {
        title: "Share one gallery link",
        text: "The couple and family open the same gallery link or QR on their phones. Guests can tell you which side they are from, using labels you set, such as Bride Team and Groom Team.",
      },
      {
        title: "Everyone likes the photos they want",
        text: "Likes are saved as they tap. Likes from the hosts, the couple and the family members who have the passcode, are marked as Host picks, so you can see what the family chose apart from everyone else.",
      },
      {
        title: "You filter and shortlist",
        text: "In the Smart Selects tab, filter likes by Host picks, by team, or by any guest who liked something, and sort by most liked. Shortlist the photos that go into the album.",
      },
      {
        title: "Pull the originals",
        text: "Point Vyavasth at the folder of originals on your laptop. It finds the shortlisted photos and their RAW files and copies them into one folder for your editor.",
      },
    ],
    sections: [
      {
        h2: "Why album selection takes months, and what changes",
        paragraphs: [
          "In most Indian weddings the album waits on selection, not on editing. The studio sends a pen drive or a Google Drive link with thousands of photos, the couple promises to choose, the family wants a say, and the list comes back weeks later as screenshots or file numbers on WhatsApp. Then someone has to find those files by hand.",
          "Vyavasth moves selection to the place the family already is: the gallery on their phone. Liking a photo is the selection. Nothing has to be typed, sent or matched by hand, so the studio can start the album as soon as the likes are in.",
        ],
      },
      {
        h2: "Filters made for Indian weddings",
        figure: { src: "/blog/img/smart-selects.jpg", alt: "Vyavasth Smart Selects tab with liked wedding photos and filters for Host picks, Shortlisted, Bride Team and Groom Team", caption: "Smart Selects: guests\u2019 likes, filtered by Host picks, Shortlisted, Bride Team or Groom Team.", width: 800, height: 757 },
        bullets: [
          "Host picks: only the photos the hosts liked, the couple and family with the passcode.",
          "Team: the bride's side, the groom's side, or any labels you set for the event.",
          "Guests: anyone who has liked a photo, searchable by name, sorted by how much they liked.",
          "Most liked: what the whole family keeps coming back to.",
          "Shortlisted: your team's final picks for the edit.",
        ],
        paragraphs: [
          "Filters combine, so \"Host picks from the bride's side, most liked first\" is two taps.",
        ],
      },
      {
        h2: "What changes for the studio",
        bullets: [
          "Albums start in days, because selection no longer blocks the edit.",
          "No file-number lists to decode and no wrong photos printed.",
          "The couple sees a premium, branded gallery instead of a drive folder, which is what they tell their friends about.",
        ],
      },
    ],
    quote: KAMAL,
    faqs: [
      {
        q: "Does the couple need to install an app to select photos?",
        a: "No. The gallery opens in the phone's browser from a link or QR code. They sign in with their WhatsApp number or Google so their likes are saved to them.",
      },
      {
        q: "Can I see only what the family selected?",
        a: "Yes. Likes from the hosts, the couple and family members with the passcode, show up as Host picks. Filter to just those, combine them with the bride's side or groom's side filter, or pick one guest by name.",
      },
      {
        q: "Is album selection available on every plan?",
        a: "Yes. Smart Selects, including the filters and locating originals, is on every plan, including pay per event.",
      },
      {
        q: "Can relatives select photos too?",
        a: "Yes. Anyone you share the gallery with can like photos. You decide whose likes count by filtering by host, team or guest.",
      },
    ],
    related: ["locate-original-raw-files", "face-search-photo-sharing", "live-photo-delivery"],
    whatsappText: "Hi, I want to see how album selection works on Vyavasth",
  },

  // ─────────────────────────── Locate originals ───────────────────────────
  {
    slug: "locate-original-raw-files",
    navLabel: "Locate originals",
    title: "Find the RAW files for your client's selected photos | Vyavasth",
    metaDescription:
      "Your client picked 400 photos. Vyavasth finds their original JPG and RAW files on your laptop and copies them into one folder for the editor, in minutes instead of a day of searching.",
    h1: "Your client picked 400 photos. Find their originals in one click.",
    summary:
      "Locate Originals takes the photos your client shortlisted in the Vyavasth gallery, scans the folder of originals on your laptop, and copies every matching original, along with its RAW file, into a “Smartly Selected” folder for your editor. Matching happens on your own computer, so your originals are never uploaded again.",
    stepsHeading: "How Locate Originals works",
    steps: [
      {
        title: "Shortlist the final photos",
        text: "Use Smart Selects to shortlist the photos that go into the album, from the couple's likes or your own picks.",
      },
      {
        title: "Click Locate original images",
        text: "Open it from the Smart Selects tab and choose the folder on your laptop or hard drive that holds the event's originals.",
      },
      {
        title: "Vyavasth matches every file",
        text: "Each shortlisted photo is matched to the exact file it was uploaded from. Photos that need a second look are shown for you to confirm before anything is copied.",
      },
      {
        title: "Hand the folder to your editor",
        text: "Matched originals, and their RAW files with the same name, are copied into a “Smartly Selected” subfolder inside the folder you picked, ready for your editor. Nothing else in your folder is changed.",
      },
    ],
    sections: [
      {
        h2: "The job it replaces",
        paragraphs: [
          "After selection, someone in the studio sits with a list of file names or screenshots and searches a hard drive for each one, then finds the RAW file next to it. For a wedding album that can take a full day, and one wrong file means a reprint.",
          "Locate Originals does that matching for you, against the exact files you uploaded, so the editor gets the right originals the same day the selection is done.",
        ],
      },
      {
        h2: "Good to know",
        figure: { src: "/blog/img/locate-originals.jpg", alt: "Vyavasth Locate Original Images window: pick a folder, match the shortlist, review, copy", caption: "Locate Originals: pick a folder, Vyavasth matches the shortlist, you review, it copies.", width: 700, height: 535 },
        bullets: [
          "Works in Google Chrome on a laptop or desktop. Other browsers show a note asking you to open the page in Chrome.",
          "Runs on your computer: originals are read from your drive and copied into a “Smartly Selected” subfolder there. Nothing is uploaded again.",
          "Brings the RAW file along when it sits next to the JPG with the same name.",
          "Run it again whenever the shortlist changes. It always works from the current shortlist.",
        ],
      },
    ],
    quote: KAMAL,
    faqs: [
      {
        q: "Does Locate Originals work with RAW files?",
        a: "Yes. When a matched photo has a RAW file with the same name in the same folder, the RAW file is copied too.",
      },
      {
        q: "Do I need to upload my RAW files to Vyavasth?",
        a: "No. You upload the photos you deliver. Locate Originals finds the originals and RAW files on your own drive and copies them there.",
      },
      {
        q: "Which browser do I need?",
        a: "Google Chrome on a laptop or desktop. It uses Chrome's ability to read and write a folder you choose.",
      },
      {
        q: "Is it on every plan?",
        a: "Yes, Locate Originals is part of Smart Selects, which is on every plan.",
      },
    ],
    related: ["album-selection", "live-photo-delivery", "face-search-photo-sharing"],
    whatsappText: "Hi, I want to see how Locate Originals works on Vyavasth",
  },

  // ─────────────────────────── Face search ───────────────────────────
  {
    slug: "face-search-photo-sharing",
    navLabel: "Face search",
    title: "AI face search photo sharing for weddings in India | Vyavasth",
    metaDescription:
      "Guests scan one QR, take one selfie and see every wedding photo they are in. Face search galleries for Indian photography studios, with passcode privacy and the studio's branding.",
    h1: "One selfie. Every photo they are in.",
    summary:
      "Vyavasth gives every wedding one gallery link and QR code. A guest opens it, takes a selfie, and sees only the photos they appear in, while the event is still running. The couple and family get the full gallery with a passcode, and every screen carries the studio's name and logo.",
    stepsHeading: "How face search works for guests",
    steps: [
      {
        title: "Scan the QR or open the link",
        text: "Put the event QR on a standee, the invitation or the family WhatsApp group. Guests open it in their phone's browser, with no app to install.",
      },
      {
        title: "Take one selfie",
        text: "Guests agree to face search and take a selfie. They can skip it and browse instead if they prefer.",
      },
      {
        title: "See My Photos",
        text: "Vyavasth finds every photo the guest is in, across thousands of photos, and keeps adding new ones as the studio uploads.",
      },
      {
        title: "Find photos with family and friends",
        text: "In My People, guests who have both agreed can find the photos they are in together. Nobody is shown in someone else's results without saying yes.",
      },
    ],
    sections: [
      {
        h2: "Built for Indian weddings with 500 guests and 8,000 photos",
        paragraphs: [
          "Nobody scrolls 8,000 photos to find themselves. Face search means every relative leaves with their own photos, on their own phone, the same day, and every one of those photos carries your studio's name.",
        ],
        bullets: [
          "My Photos for each guest, All Photos for the family with the passcode.",
          "One branded QR for your studio that you reuse at every event.",
          "Face search can be turned off for a single event if the family prefers a passcode-only gallery.",
          "Your logo, colours and watermark on every screen of the gallery.",
        ],
      },
      {
        h2: "Privacy the family can trust",
        figure: { src: "/blog/img/guest-signin.jpg", alt: "Private wedding gallery sign-in screen on a phone, with WhatsApp number or Google", caption: "Guests sign in with their WhatsApp number or Google before they see any photos.", width: 600, height: 976, mobile: true },
        bullets: [
          "Each event has one link, and the full gallery opens only with the host's passcode.",
          "Face search is opt-in: guests agree before taking a selfie, and can skip it.",
          "My People only shows photos of two guests together when both have agreed.",
          "Wedding galleries are kept out of Google search results.",
        ],
      },
    ],
    quote: WEDDING_BOOTH,
    faqs: [
      {
        q: "Do guests need to download an app?",
        a: "No. The gallery opens in the phone's browser from a QR code or link. Guests sign in with their WhatsApp number or Google so their photos and likes stay with them.",
      },
      {
        q: "Can guests see photos they are not in?",
        a: "Guests see My Photos, the photos they are in. The full gallery, All Photos, opens with the passcode the studio gives the family.",
      },
      {
        q: "Does face search work while the wedding is still going on?",
        a: "Yes. As the studio uploads during the event, new photos appear in each guest's My Photos.",
      },
      {
        q: "Can I turn face search off for one event?",
        a: "Yes. Switch face search off for any single event. Guests then browse the gallery, and the full gallery opens with the family's passcode.",
      },
    ],
    related: ["live-photo-delivery", "google-reviews-for-photographers", "album-selection"],
    whatsappText: "Hi, I want to see a face search gallery on Vyavasth",
  },

  // ─────────────────────────── Live delivery ───────────────────────────
  {
    slug: "live-photo-delivery",
    navLabel: "Live delivery",
    title: "Live wedding photo delivery during the event | Vyavasth",
    metaDescription:
      "Deliver wedding photos while the event is still running. Upload from the camera or laptop, photos reach the family's gallery in real time, and uploads resume on their own if the internet drops.",
    h1: "Deliver photos while the wedding is still going on",
    summary:
      "With Vyavasth, photos reach the family's gallery during the event instead of weeks later on a pen drive. Studios upload from the camera, from a laptop, or from the Vyavasth Android app, and the gallery updates as each batch lands. Guests find their photos with a selfie, and the couple starts liking photos for the album the same night.",
    stepsHeading: "How live delivery works",
    steps: [
      {
        title: "Create the event before the wedding",
        text: "Set up the event and share the gallery link or QR with the family, so guests can open it on the day.",
      },
      {
        title: "Shoot as you always do",
        text: "Nothing changes for the photographers on the floor.",
      },
      {
        title: "Upload during the event",
        text: "Send photos from the camera over FTP, connect the card or camera to a laptop and upload through the web app, or use the Vyavasth Android app over USB (in early access).",
      },
      {
        title: "Photos appear in the gallery",
        text: "Each batch shows up in the gallery and in every guest's My Photos as it uploads, organised by function such as Haldi or Sangeet.",
      },
    ],
    sections: [
      {
        h2: "Uploads you do not have to babysit",
        bullets: [
          "Uploads resume on their own when the internet drops, so a bad venue connection does not lose photos.",
          "Photos are compressed for fast viewing on phones: HD (2560 px, about 1 MB) and 4K (4096 px, about 3 MB).",
          "Original-quality delivery is available on storage plans of 500 GB and above.",
          "Storage is reusable. Delete an old event and the space is free for the next one.",
        ],
      },
      {
        h2: "Pen drive, Google Drive or a delivery gallery",
        table: {
          caption: "How the common ways of delivering wedding photos compare",
          head: ["", "Pen drive", "Google Drive", "Vyavasth gallery"],
          rows: [
            ["Reaches every guest", "No", "Only if they scroll the whole folder", "Yes, each guest finds their own photos with a selfie"],
            ["When photos arrive", "Weeks after the wedding", "After the wedding", "During the wedding"],
            ["Album selection", "Lists of file numbers on WhatsApp", "Lists of file numbers on WhatsApp", "Likes in the gallery, filtered by the studio"],
            ["Works on a phone", "No", "Partly, downloads come as zip files", "Yes"],
            ["Studio branding", "A sticker on the drive", "None", "Logo and watermark on every screen"],
            ["Good final archive", "Yes", "No", "Pair it with a pen drive of the final edits"],
          ],
        },
      },
      {
        h2: "Why same-day delivery wins the next booking",
        paragraphs: [
          "At an Indian wedding the guest list is the studio's next set of clients. When 300 relatives get their photos on their phones before the reception ends, with the studio's name on every screen, the studio is the one they remember and recommend.",
        ],
      },
    ],
    quote: KAMAL_REVIEWS,
    faqs: [
      {
        q: "What happens if the internet goes down at the venue?",
        a: "Uploads pause and resume on their own when the connection is back. Nothing has to be started again.",
      },
      {
        q: "Can several photographers upload to the same event?",
        a: "Yes. Photos from different cameras and laptops go into the same event gallery.",
      },
      {
        q: "Do I need the Android app?",
        a: "No. The Android app is in early access. Every studio can upload from a laptop through the web app, or straight from the camera over FTP.",
      },
      {
        q: "How long does an event stay live?",
        a: "On pay per event, an event stays live for 3 months and can be extended. On storage plans, you choose when each event expires when you create it: 1, 3 or 6 months, a custom date, or never.",
      },
    ],
    related: ["face-search-photo-sharing", "album-selection", "google-reviews-for-photographers"],
    whatsappText: "Hi, I want to try live delivery on Vyavasth for my next wedding",
  },

  // ─────────────────────────── Reviews & branding ───────────────────────────
  {
    slug: "google-reviews-for-photographers",
    navLabel: "Google reviews and branding",
    title: "Get more Google reviews from every wedding you deliver | Vyavasth",
    metaDescription:
      "Every Vyavasth gallery asks happy guests for a Google review and carries your studio's logo, watermark and social links, so each wedding you deliver brings in reviews and followers.",
    h1: "Turn every wedding you deliver into Google reviews",
    summary:
      "The moment a guest finds their photos is the moment they are happiest with your work. Every Vyavasth gallery shows a one-tap Google review prompt at that moment, and carries your studio's logo, colours, watermark and social links on every screen. Studios using it see reviews and Instagram followers grow with each wedding they deliver.",
    stepsHeading: "How it works",
    steps: [
      {
        title: "Add your Google review link and social links",
        text: "Add your Google review link, Instagram and wedding portal listings such as WedMeGood, WeddingBazaar or JustDial once in Settings.",
      },
      {
        title: "Brand the gallery",
        text: "Your logo, colours and watermark appear across the whole gallery, not just the first page. Use your own domain for gallery links if you want.",
      },
      {
        title: "Guests see their photos, then the review prompt",
        text: "The review prompt appears inside the gallery, along with your studio card and social links.",
      },
      {
        title: "Turn it off when you need to",
        text: "Switch the review prompt off for all events, or just for one.",
      },
    ],
    sections: [
      {
        h2: "Why reviews come from delivery, not from asking",
        paragraphs: [
          "Asking a couple for a review on WhatsApp a month after the wedding rarely works. Hundreds of guests opening a branded gallery and finding their own photos is the best moment you will get, and Vyavasth puts the review button right there.",
        ],
      },
      {
        h2: "Your studio's name on every photo",
        bullets: [
          "Logo, colours and watermark on every screen of the gallery.",
          "Your Instagram and wedding portal links in the gallery.",
          "Optionally, ask guests to visit one of your links before their first download.",
          "One branded QR for your studio, reused at every event.",
        ],
      },
    ],
    quote: KAMAL_REVIEWS,
    faqs: [
      {
        q: "Can I switch off the review prompt for a particular wedding?",
        a: "Yes. Turn it off for all events in Settings, or just for one event.",
      },
      {
        q: "Does my watermark appear on downloaded photos?",
        a: "Yes. Your watermark is applied to the photos guests download, not only to what they see in the gallery.",
      },
      {
        q: "Can I use my own domain for gallery links?",
        a: "Yes. You can serve gallery links from your studio's own domain, set up from Settings.",
      },
    ],
    related: ["face-search-photo-sharing", "live-photo-delivery", "album-selection"],
    whatsappText: "Hi, I want to know how Vyavasth helps with Google reviews",
  },
];

export function featureBySlug(slug: string): FeaturePage | undefined {
  return FEATURE_PAGES.find((p) => p.slug === slug);
}
