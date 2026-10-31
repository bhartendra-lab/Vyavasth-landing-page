// lib/compare-data.ts, PURE content. No React, no fetch.
//
// Source of truth for the /compare pages. Every competitor fact here was read
// from that competitor's own public pricing or home page on CHECKED_ON, in a
// browser from India. Change a fact only after re-checking that page.
// Vyavasth's own prices are NOT stored here: pages read them from the plans API
// at render time, so they never drift from /pricing.
//
// Rules for anyone editing this file:
// - Every competitor claim must be visible on the competitor's own site.
//   If it is not, leave it out or write "Not published" / "Not listed".
// - Say where the competitor is better. Honest pages get cited by search and
//   AI engines; one-sided ones get ignored.
// - No em dashes in copy.

export const CHECKED_ON = "2026-10-28";
export const CHECKED_ON_LABEL = "28 October 2026";

export type CompetitorPlan = {
  name: string;
  /** What the plan holds, in the competitor's own unit (photos or GB). */
  limit: string;
  /** Price as listed, per year, in `currency` (rupees by default). null when not published. */
  listedPerYear: number | null;
  /** Currency of `listedPerYear`. Defaults to INR. USD prices are shown in US$ and never converted. */
  currency?: "INR" | "USD";
  /** true: listed price includes GST. false: "+ GST/taxes". null: not stated. */
  gstIncluded: boolean | null;
  note?: string;
};

export type CompareRow = { label: string; vyavasth: string; competitor: string };
export type FaqItem = { q: string; a: string };

/** One line per tool on the /compare hub table. */
export type HubSummary = {
  pricedBy: string;
  entry: string;
  albumSelection: string;
  gst: string;
};

export type Competitor = {
  slug: string;
  name: string;
  site: string;
  sources: { label: string; url: string }[];
  hub: HubSummary;
  title: string;
  metaDescription: string;
  h1: string;
  verdict: string;
  pricingModel: string;
  plans: CompetitorPlan[];
  pricingNote: string;
  rows: CompareRow[];
  theyAreBetterAt: string[];
  vyavasthIsBetterAt: string[];
  chooseThemIf: string[];
  chooseVyavasthIf: string[];
  faqs: FaqItem[];
};

/** Tools listed on the hub only, without their own comparison page. */
export type HubOnlyTool = {
  name: string;
  site: string;
  source: { label: string; url: string };
  hub: HubSummary;
  note: string;
};

// Facts about Vyavasth used in the rows below. Keep in sync with the product.
// Prices are deliberately absent: pages render them from the plans API.
const V = {
  model: "Pay per event, or an annual storage plan. Storage plan prices include GST.",
  faceSearch: "Yes, on every plan. Guests take one selfie and see only the photos they are in.",
  selection:
    "Yes, on every plan. Family likes photos; the couple builds collections for each album, calendar or table book; you filter by bride's side, groom's side, person or total likes.",
  originals: "Locate Originals copies the shortlisted photos and their RAW files from your laptop into one folder for the editor, on every plan.",
  originalDelivery: "HD and 4K delivery on every plan. Original-quality delivery on storage plans of 500 GB and above.",
  branding: "Logo, colours and watermark across the whole gallery, on every plan.",
  reviews: "A Google review prompt inside every gallery.",
  liveUpload: "From the camera over FTP during the event, or from a laptop through the web uploader. Android USB upload app in early access.",
  storage: "Reusable: delete an old event and the space is free again.",
  support: "WhatsApp and phone.",
};

const vsTitle = (n: string) => `Vyavasth vs ${n} (2026): prices with GST, features, which to choose`;

export const COMPETITORS: Competitor[] = [
  // ───────────────────────────── Kwikpic ─────────────────────────────
  {
    slug: "vyavasth-vs-kwikpic",
    name: "Kwikpic",
    site: "kwikpic.in",
    sources: [{ label: "Kwikpic pricing", url: "https://www.kwikpic.in/landing/pricing" }],
    hub: {
      pricedBy: "Number of photos, yearly or quarterly",
      entry: "₹3,490 a year + GST (20,000 photos). Free plan up to 1,000 photos.",
      albumSelection: "\"View client favourites\" from the Standard plan up",
      gst: "Extra",
    },
    title: vsTitle("Kwikpic"),
    metaDescription:
      "Vyavasth vs Kwikpic for Indian wedding studios: yearly prices with GST, photo limits, album selection, watermarks and face search, and where each one is better.",
    h1: "Vyavasth vs Kwikpic",
    verdict:
      "Kwikpic sells photos the way telecom companies sell data: a pack of 20,000, a reuse allowance of twice that, and a bigger pack when it runs out. It is cheap to start and has a free plan, which is real value. But client favourites start on Standard, the watermark costs ₹1,000 extra there, and instant upload from the camera waits until Premium at ₹28,990 + GST. Vyavasth sells GB you can empty and refill as often as you like, with album selection, watermarks and live upload on every plan from the first rupee.",
    pricingModel:
      "Kwikpic sells yearly plans sized by number of photos, priced plus GST, with quarterly billing on some plans. Vyavasth sells storage plans with GST included, or single events.",
    plans: [
      { name: "Basic", limit: "20,000 photos stored, reuse up to 40,000", listedPerYear: 3490, gstIncluded: false },
      { name: "Basic Plus", limit: "50,000 photos stored, reuse up to 100,000", listedPerYear: 4990, gstIncluded: false },
      { name: "Standard", limit: "100,000 photos stored, reuse up to 200,000", listedPerYear: 7490, gstIncluded: false, note: "Watermark is an extra ₹1,000" },
      { name: "Essential Lite", limit: "150,000 photos stored, reuse up to 300,000", listedPerYear: 11990, gstIncluded: false },
      { name: "Essential", limit: "200,000 photos stored, reuse up to 400,000", listedPerYear: 14990, gstIncluded: false },
      { name: "Essential Ultra", limit: "300,000 photos stored, reuse up to 600,000", listedPerYear: 21990, gstIncluded: false },
      { name: "Premium", limit: "500,000 photo uploads in total", listedPerYear: 28990, gstIncluded: false, note: "Adds instant upload from camera or folder" },
      { name: "Premium Max", limit: "500,000 photos, reuse up to 1,000,000", listedPerYear: 37990, gstIncluded: false, note: "Adds instant upload from camera or folder" },
    ],
    pricingNote:
      "Kwikpic lists prices per year plus GST; the GST column adds 18%. Kwikpic counts photos and Vyavasth counts GB, so plan sizes are not a like-for-like match. Kwikpic also has a free plan for up to 1,000 photos.",
    rows: [
      { label: "How you pay", vyavasth: V.model, competitor: "Yearly plans by number of photos, plus GST. Quarterly billing on some plans." },
      { label: "Face search for guests", vyavasth: V.faceSearch, competitor: "Yes, on all plans, with unlimited events and guests." },
      { label: "Album selection", vyavasth: V.selection, competitor: "\"View client favourites\" from the Standard plan up." },
      { label: "Originals for the editor", vyavasth: V.originals, competitor: "Not listed on the pricing page." },
      { label: "What the plan limits", vyavasth: "GB of storage. Delete an old event and the space is free again, with no cap on how many times.", competitor: "Number of photos. Each plan lets you store a set number and reuse up to twice that number in the plan year, for example store 20,000 and reuse up to 40,000 on Basic." },
      { label: "Watermark", vyavasth: "Included on every plan.", competitor: "Not listed on Basic or Basic Plus; extra ₹1,000 on Standard; included from Essential Lite up." },
      { label: "Google reviews from the gallery", vyavasth: V.reviews, competitor: "Not listed on the pricing page." },
      { label: "Upload during the event", vyavasth: V.liveUpload, competitor: "Instant upload from camera or folder on Premium and Premium Max." },
      { label: "Extras", vyavasth: "None of these.", competitor: "Portfolio website from Standard; digital flipbook album and sponsor branding on Premium and Premium Max." },
      { label: "Support", vyavasth: V.support, competitor: "24x7 WhatsApp support on all plans." },
    ],
    theyAreBetterAt: [
      "Lower entry price: Basic costs less than any Vyavasth storage plan.",
      "A free plan for up to 1,000 photos.",
      "Extras Vyavasth does not offer: portfolio website, digital flipbook album and sponsor branding.",
    ],
    vyavasthIsBetterAt: [
      "Every feature on every plan, so album selection, watermarks and camera upload do not need a higher tier.",
      "Album selection built for Indian weddings: collections for each album, and likes filtered by bride's side, groom's side, person or total likes.",
      "Locate Originals: the shortlisted photos and their RAW files, copied into one folder for the editor.",
      "Pay per event, for studios with a few weddings a season.",
      "A Google review prompt in every gallery.",
    ],
    chooseThemIf: [
      "You mainly need face search and a branded gallery at the lowest yearly cost.",
      "You want a portfolio website or flipbook album from the same tool.",
    ],
    chooseVyavasthIf: [
      "Album selection is where your weeks go and you want couples to finish it themselves.",
      "You want watermarks, camera upload and album selection without moving up a tier.",
      "You would rather pay per event than commit to a yearly plan.",
    ],
    faqs: [
      { q: "Is Vyavasth cheaper than Kwikpic?", a: "Not at the entry level. Kwikpic's Basic plan costs less than Vyavasth's smallest storage plan, and Kwikpic has a free plan. Vyavasth includes album selection, watermarks and camera upload on every plan, which need higher Kwikpic plans, and it also sells single events. Compare the plans that have the features you will use." },
      { q: "Does Kwikpic have album selection?", a: "Kwikpic lists \"View client favourites\" from its Standard plan up. Vyavasth's album selection is on every plan and adds collections for each album and filters for the bride's side, groom's side, person and total likes, plus Locate Originals for the editor." },
      { q: "What happens when a Kwikpic plan's photo count runs out?", a: "Kwikpic plans count photos, not storage. Each plan lists how many photos you can store and lets you reuse up to twice that number by deleting old ones, for example 100,000 stored and 200,000 in total on Standard. Vyavasth storage plans count GB, and deleting an old event frees the space again with no cap on how many times." },
      { q: "Can I move from Kwikpic to Vyavasth?", a: "Yes. Message Vyavasth on WhatsApp and the team will help you set up your next event. Your old Kwikpic galleries can stay where they are." },
    ],
  },

  // ───────────────────────────── FotoOwl ─────────────────────────────
  {
    slug: "vyavasth-vs-fotoowl",
    name: "FotoOwl",
    site: "fotoowl.ai",
    sources: [{ label: "FotoOwl pricing", url: "https://fotoowl.ai/pricing" }],
    hub: {
      pricedBy: "Storage, billed yearly, half-yearly or monthly",
      entry: "₹494 a month billed yearly (50 GB). Free plan up to 1,000 images.",
      albumSelection: "Photo selection (select liked pictures)",
      gst: "Not stated on the pricing page",
    },
    title: vsTitle("FotoOwl"),
    metaDescription:
      "Vyavasth vs FotoOwl for Indian wedding studios: yearly prices, storage, album selection, camera upload and extras like photo selling and reels, and where each one is better.",
    h1: "Vyavasth vs FotoOwl",
    verdict:
      "FotoOwl gives more storage per rupee on its big plans, plus photo selling and auto-generated reels, and that is a genuine edge. Read the small print on the best-value Biker plan though: the headline 700 GB is 500 GB for live galleries and 200 GB of \"passive\" storage, and the pricing page never says whether GST goes on top. Vyavasth's storage prices include GST, it sells single events, and its album selection is built for Indian families: collections for each album, bride and groom side filters, and Locate Originals for the editor.",
    pricingModel:
      "FotoOwl sells plans by storage, shown as a monthly figure billed every year, every six months or every month. Vyavasth sells storage plans with GST included, or single events.",
    plans: [
      { name: "Rider", limit: "1,000 images", listedPerYear: 0, gstIncluded: null },
      { name: "Skater Small", limit: "50 GB", listedPerYear: 5928, gstIncluded: null, note: "₹494 a month, billed yearly" },
      { name: "Skater", limit: "100 GB", listedPerYear: 10992, gstIncluded: null, note: "₹916 a month, billed yearly" },
      { name: "Biker", limit: "500 GB active + 200 GB passive", listedPerYear: 15000, gstIncluded: null, note: "₹1,250 a month, billed yearly" },
      { name: "Pilot", limit: "1 TB active + 300 GB passive", listedPerYear: 24996, gstIncluded: null, note: "₹2,083 a month, billed yearly" },
    ],
    pricingNote:
      "FotoOwl shows a monthly price billed yearly; the yearly figure above is that price times 12. Its pricing page does not say whether GST is included, so no GST is added here. Half-yearly and monthly billing cost more per month.",
    rows: [
      { label: "How you pay", vyavasth: V.model, competitor: "By storage, billed yearly, half-yearly or monthly. Free plan for 1,000 images." },
      { label: "Face search for guests", vyavasth: V.faceSearch, competitor: "Yes, on all plans." },
      { label: "Album selection", vyavasth: V.selection, competitor: "Photo selection, where clients select liked pictures." },
      { label: "Originals for the editor", vyavasth: V.originals, competitor: "Not listed on the pricing page." },
      { label: "Upload during the event", vyavasth: V.liveUpload, competitor: "Beam camera-to-cloud upload, one Beam user on paid plans." },
      { label: "Extras", vyavasth: "None of these.", competitor: "Photo selling, auto-generated reels (Reelit), guest uploads, TV app, sponsor frames as add-ons." },
      { label: "Your own domain", vyavasth: "Gallery links on your own domain, set up from Settings.", competitor: "Custom sub-domain on Biker, your own domain on Pilot." },
      { label: "Google reviews from the gallery", vyavasth: V.reviews, competitor: "Not listed on the pricing page." },
    ],
    theyAreBetterAt: [
      "More storage for the money on the Biker and Pilot plans.",
      "A free plan for up to 1,000 images.",
      "Photo selling, auto-generated reels, guest uploads and a TV app.",
    ],
    vyavasthIsBetterAt: [
      "Pay per event, for studios that do not want a yearly plan.",
      "GST included in storage plan prices, so the price you see is the price you pay.",
      "Collections for each album, and likes filtered by bride's side, groom's side, person or total likes.",
      "Locate Originals: the shortlist and its RAW files, copied into one folder for the editor.",
      "A Google review prompt in every gallery.",
    ],
    chooseThemIf: [
      "You need a lot of storage at the lowest yearly price.",
      "You want to sell photos or auto-generate reels from the gallery.",
    ],
    chooseVyavasthIf: [
      "Album selection and getting the right originals to your editor is what slows you down.",
      "You want to pay per event, or want prices with GST already included.",
    ],
    faqs: [
      { q: "Is FotoOwl cheaper than Vyavasth?", a: "On the larger plans, yes: FotoOwl's Biker and Pilot plans give more GB per rupee, though the page does not say whether GST is included. On smaller needs, Vyavasth's pay-per-event price can cost less, and its storage prices include GST." },
      { q: "Does FotoOwl have album selection?", a: "FotoOwl lists photo selection, where clients select liked pictures. Vyavasth adds collections for each album, filters for the bride's side, groom's side, person and total likes, and Locate Originals for the editor." },
    ],
  },

  // ───────────────────────────── Samaro ─────────────────────────────
  {
    slug: "vyavasth-vs-samaro",
    name: "Samaro",
    site: "samaro.ai",
    sources: [
      { label: "Samaro photographer pricing", url: "https://events.samaro.ai/photographer/pricing-plans" },
      { label: "Samaro home page", url: "https://samaro.ai/" },
    ],
    hub: {
      pricedBy: "Reusable storage, monthly or yearly",
      entry: "₹8,000 a year + taxes (50 GB). Free trial with 10 GB and 2 events.",
      albumSelection: "Photo selection for albums, plus AI album design",
      gst: "Extra",
    },
    title: vsTitle("Samaro"),
    metaDescription:
      "Vyavasth vs Samaro for Indian wedding studios: yearly prices with GST, storage, album selection, AI culling and editing, camera to cloud, and where each one is better.",
    h1: "Vyavasth vs Samaro",
    verdict:
      "Samaro wants to run your whole studio: AI culling, AI editing, album design, invites and a WhatsApp bot. If you want all of that, it is impressive. If you just need guests to get their photos and the couple to finish the album, it is a cockpit for a trip to the market. Its pricing page shows a struck-out price, a sale price and a discount code, all plus taxes, so the number you see is rarely the invoice you get. Vyavasth does less, costs less per GB once GST is counted, and the price on our page is the price you pay.",
    pricingModel:
      "Samaro sells monthly or yearly plans by reusable storage, plus taxes, with unlimited events. Vyavasth sells storage plans with GST included, or single events.",
    plans: [
      { name: "Free trial", limit: "10 GB, 2 events", listedPerYear: 0, gstIncluded: null },
      { name: "Starter Mini", limit: "50 GB", listedPerYear: 8000, gstIncluded: false },
      { name: "Starter", limit: "100 GB", listedPerYear: 12750, gstIncluded: false },
      { name: "Amateur", limit: "500 GB", listedPerYear: 25500, gstIncluded: false },
      { name: "Pro", limit: "1,000 GB", listedPerYear: 44880, gstIncluded: false },
      { name: "Pro Max", limit: "4,000 GB", listedPerYear: 70380, gstIncluded: false },
      { name: "Advanced", limit: "8,000 GB", listedPerYear: 96900, gstIncluded: false },
    ],
    pricingNote:
      "Samaro lists yearly prices plus taxes; the GST column adds 18%. On the day we checked, Samaro's page showed a 10% discount code, which is not included above.",
    rows: [
      { label: "How you pay", vyavasth: V.model, competitor: "Monthly or yearly by reusable storage, plus taxes. Unlimited events." },
      { label: "Face search for guests", vyavasth: V.faceSearch, competitor: "Yes." },
      { label: "Album selection", vyavasth: V.selection, competitor: "Photo selection for albums, and AI album design with print-ready export." },
      { label: "Originals for the editor", vyavasth: V.originals, competitor: "RAW delivery through Samaro's GradeX desktop app." },
      { label: "Camera to cloud", vyavasth: V.liveUpload, competitor: "Camera2Cloud: JPEG transfer over FTP from the camera." },
      { label: "AI culling and editing", vyavasth: "Not offered.", competitor: "AI culling and AI editing." },
      { label: "WhatsApp", vyavasth: "WhatsApp notifications to the studio and hosts.", competitor: "WhatsApp bot for photo sharing and adding guests." },
      { label: "Google reviews from the gallery", vyavasth: V.reviews, competitor: "Not listed on the pricing page." },
      { label: "Storage", vyavasth: V.storage, competitor: "Reusable storage." },
      { label: "Price shown vs price paid", vyavasth: "Storage plan prices include GST. The price on the page is the price you pay.", competitor: "Listed plus taxes, with a struck-through price and a discount code on the pricing page, so the amount paid depends on the offer running." },
      { label: "Learning curve", vyavasth: "Delivery, face search and album selection only, so a studio is set up after one event.", competitor: "A much larger product, from culling and editing to album design, invites and a WhatsApp bot, so there is more to learn before it pays off." },
    ],
    theyAreBetterAt: [
      "A wider toolset: AI culling, AI editing, album design, a WhatsApp bot and guest uploads.",
      "A free trial with 10 GB and 2 events.",
      "An 8,000 GB plan for very high-volume studios.",
    ],
    vyavasthIsBetterAt: [
      "Lower price per GB at every size we compared, once GST is counted.",
      "Pay per event, for studios that do not want a subscription.",
      "Collections for each album and bride and groom side filters, with Locate Originals and no separate desktop app.",
      "A Google review prompt in every gallery.",
      "A smaller product a studio can learn in one event.",
    ],
    chooseThemIf: [
      "You want culling, editing, album design and delivery in one subscription.",
      "You want a WhatsApp bot to deliver photos to guests.",
    ],
    chooseVyavasthIf: [
      "Delivery and album selection are the work you want off your plate.",
      "You want to pay less for storage, or pay per event.",
      "You already edit in Lightroom or with an editor.",
    ],
    faqs: [
      { q: "Is Vyavasth cheaper than Samaro?", a: "On the storage plans we compared, yes. Vyavasth's storage prices include GST while Samaro lists prices plus taxes, and Vyavasth costs less per GB at each size. Samaro includes tools Vyavasth does not have, such as AI culling, editing and album design, so compare on what you will use." },
      { q: "Does Vyavasth do AI culling or editing?", a: "No. Vyavasth focuses on delivery, face search and album selection. Studios that want culling and editing in the same subscription should look at Samaro." },
      { q: "Do both deliver photos during the event?", a: "Yes. Both take photos from the camera over FTP. Vyavasth also has a web uploader for laptops and an Android USB app in early access." },
    ],
  },

  // ───────────────────────────── PicPapaya ─────────────────────────────
  {
    slug: "vyavasth-vs-picpapaya",
    name: "PicPapaya",
    site: "picpapaya.com",
    sources: [{ label: "PicPapaya India pricing", url: "https://picpapaya.com/in" }],
    hub: {
      pricedBy: "Storage, half-yearly or yearly",
      entry: "₹5,090 a year (50 GB). Free plan with 1 event and 1 GB.",
      albumSelection: "Not listed",
      gst: "Not stated",
    },
    title: vsTitle("PicPapaya"),
    metaDescription:
      "Vyavasth vs PicPapaya for Indian wedding studios: yearly prices, storage, face search, album selection and branding, and where each one is better.",
    h1: "Vyavasth vs PicPapaya",
    verdict:
      "PicPapaya is a clean, cheap face search gallery, and at 1 TB it beats our price; credit where due. Then the wedding ends and the real work starts. Its India page lists no album selection, so the months of \"which 300 photos go in the album?\" are still yours to run on WhatsApp. Vyavasth covers what happens after the wedding too: collections for each album, side filters, Locate Originals and a Google review prompt.",
    pricingModel:
      "PicPapaya sells plans by storage, billed half-yearly or yearly, with every feature on every plan. Vyavasth sells storage plans with GST included, or single events.",
    plans: [
      { name: "Free", limit: "1 event, 1 GB", listedPerYear: 0, gstIncluded: null },
      { name: "Starter", limit: "50 GB", listedPerYear: 5090, gstIncluded: null },
      { name: "Pro", limit: "100 GB", listedPerYear: 9170, gstIncluded: null },
      { name: "Business", limit: "500 GB", listedPerYear: 20390, gstIncluded: null },
      { name: "Elite", limit: "1 TB", listedPerYear: 25490, gstIncluded: null },
      { name: "Signature", limit: "5 TB", listedPerYear: 61190, gstIncluded: null },
      { name: "Imperial", limit: "10 TB", listedPerYear: 81590, gstIncluded: null },
    ],
    pricingNote:
      "Yearly prices as shown on PicPapaya's India page, which lists a 15% saving on yearly billing. The page does not say whether GST is included, so no GST is added here.",
    rows: [
      { label: "How you pay", vyavasth: V.model, competitor: "By storage, half-yearly or yearly. Unlimited events and photos per event on paid plans." },
      { label: "Face search for guests", vyavasth: V.faceSearch, competitor: "Yes. Guests take a selfie in the browser, with no app. Selfies auto-delete." },
      { label: "Album selection", vyavasth: V.selection, competitor: "Not listed on the home page." },
      { label: "Originals for the editor", vyavasth: V.originals, competitor: "Not listed on the home page." },
      { label: "Watermark and download control", vyavasth: "Watermark on every plan.", competitor: "Text or logo watermark, downloads on or off per event, password lock." },
      { label: "Branding", vyavasth: V.branding, competitor: "Studio name, logo and colours on galleries." },
      { label: "Google reviews from the gallery", vyavasth: V.reviews, competitor: "Not listed on the home page." },
      { label: "Support", vyavasth: V.support, competitor: "WhatsApp and ticket support on paid plans." },
    ],
    theyAreBetterAt: [
      "A free plan, and a lower price for 1 TB.",
      "Very large plans, up to 10 TB.",
      "Print-ready QR poster templates.",
    ],
    vyavasthIsBetterAt: [
      "Album selection: collections for each album, and likes filtered by bride's side, groom's side, person or total likes.",
      "Locate Originals: the shortlist and its RAW files, copied into one folder for the editor.",
      "Pay per event, and storage prices that include GST.",
      "A Google review prompt in every gallery.",
    ],
    chooseThemIf: [
      "You only need guests to find their photos, at a low yearly price.",
      "You need more than 4 TB of storage.",
    ],
    chooseVyavasthIf: [
      "Album selection and the edit afterwards are where your time goes.",
      "You want to pay per event, or want GST included in the price.",
    ],
    faqs: [
      { q: "Is PicPapaya cheaper than Vyavasth?", a: "At 1 TB, yes, before any GST. At smaller sizes the two are closer, and Vyavasth's storage prices already include GST. Vyavasth also sells single events." },
      { q: "Does PicPapaya have album selection?", a: "It is not listed on PicPapaya's home page. Vyavasth has album selection on every plan, with collections and side filters." },
    ],
  },

  // ───────────────────────────── FaceSnap ─────────────────────────────
  {
    slug: "vyavasth-vs-facesnap",
    name: "FaceSnap",
    site: "facesnap.in",
    sources: [{ label: "FaceSnap pricing", url: "https://facesnap.in/pricing" }],
    hub: {
      pricedBy: "Number of active images and events, yearly",
      entry: "₹2,990 a year + 18% GST for photographers (25,000 images). 30-day free trial.",
      albumSelection: "Not listed",
      gst: "Extra",
    },
    title: vsTitle("FaceSnap"),
    metaDescription:
      "Vyavasth vs FaceSnap for Indian wedding studios: yearly prices with GST, image and event limits, album selection, watermarks and face search, and where each one is better.",
    h1: "Vyavasth vs FaceSnap",
    verdict:
      "FaceSnap's ₹2,990 Standard plan is the cheapest way into face search, with a 30-day trial and extras like a portfolio website. The fine print: 25 active events and no watermark on that plan, so your best shots of the season travel the internet without your name on them. Vyavasth puts no cap on events, and your watermark and album selection are on every plan.",
    pricingModel:
      "FaceSnap sells yearly photographer plans by number of active images and active events, plus 18% GST. Vyavasth sells storage plans with GST included, or single events.",
    plans: [
      { name: "Standard", limit: "25,000 active images, 25 active events", listedPerYear: 2990, gstIncluded: false, note: "No photo watermarks" },
      { name: "Essential", limit: "1,20,000 active images, 100 active events", listedPerYear: 7990, gstIncluded: false },
      { name: "Pro", limit: "2,50,000 active images, 150 active events", listedPerYear: 17990, gstIncluded: false },
      { name: "Premium", limit: "5,00,000 active images, unlimited active events", listedPerYear: 29990, gstIncluded: false },
    ],
    pricingNote:
      "FaceSnap lists photographer prices per 365 days plus 18% GST; the GST column adds it. FaceSnap also has host plans from ₹799 a year and a 30-day free trial with 5,000 images.",
    rows: [
      { label: "How you pay", vyavasth: V.model, competitor: "Yearly by active images and active events, plus 18% GST." },
      { label: "Face search for guests", vyavasth: V.faceSearch, competitor: "Yes, on all plans, plus guest-to-guest sharing." },
      { label: "Album selection", vyavasth: V.selection, competitor: "Not listed on the pricing page." },
      { label: "Originals for the editor", vyavasth: V.originals, competitor: "Not listed on the pricing page." },
      { label: "Watermark", vyavasth: "Included on every plan.", competitor: "Not on Standard; shown on higher plans." },
      { label: "Event limits", vyavasth: "No cap on events; storage plans are limited by GB.", competitor: "25, 100 or 150 active events, unlimited on Premium." },
      { label: "Extras", vyavasth: "None of these.", competitor: "Portfolio website on higher plans, highlight reels, guest registry." },
      { label: "Google reviews from the gallery", vyavasth: V.reviews, competitor: "Not listed on the pricing page." },
    ],
    theyAreBetterAt: [
      "The lowest photographer entry price in this comparison, and a 30-day free trial.",
      "A portfolio website, highlight reels and guest-to-guest sharing.",
    ],
    vyavasthIsBetterAt: [
      "No cap on the number of events.",
      "Watermarks on every plan.",
      "Album selection with collections and bride and groom side filters, plus Locate Originals.",
      "A Google review prompt in every gallery.",
    ],
    chooseThemIf: [
      "You want the cheapest face search gallery to start with.",
      "You want a portfolio website from the same tool.",
    ],
    chooseVyavasthIf: [
      "You shoot many events and do not want an event cap.",
      "Album selection and handing originals to your editor is your bottleneck.",
    ],
    faqs: [
      { q: "Is FaceSnap cheaper than Vyavasth?", a: "At the entry level, yes: FaceSnap Standard costs less than any Vyavasth storage plan, though it caps active events at 25 and has no watermark. Compare at the plan size and features you need." },
      { q: "Does FaceSnap have album selection?", a: "It is not listed on FaceSnap's pricing page. Vyavasth has album selection on every plan." },
    ],
  },

  // ───────────────────────────── Pixieset ─────────────────────────────
  {
    slug: "vyavasth-vs-pixieset",
    name: "Pixieset",
    site: "pixieset.com",
    sources: [
      { label: "Pixieset pricing", url: "https://pixieset.com/pricing/" },
      { label: "Pixieset client gallery features", url: "https://pixieset.com/client-gallery/" },
    ],
    hub: {
      pricedBy: "Storage, monthly or yearly, in US dollars",
      entry: "US$8 a month billed yearly (10 GB). Free plan with 3 GB.",
      albumSelection: "Client favourites and comments on photos",
      gst: "Billed in US dollars; tax not stated",
    },
    title: vsTitle("Pixieset"),
    metaDescription:
      "Vyavasth vs Pixieset for Indian wedding studios: prices in rupees vs US dollars, face search, QR sharing, album selection, print store and where each one is better.",
    h1: "Vyavasth vs Pixieset",
    verdict:
      "Pixieset was made in Vancouver for portrait sessions and print sales, and it is excellent at that. It also shows its prices in US dollars when you open it from India, and its gallery and pricing pages say nothing about face search or QR codes. That is fine for a family of four. At a 600-guest sangeet it means 600 people scrolling through 8,000 photos looking for themselves. Vyavasth is built for that night: one QR, one selfie, rupee pricing with GST included, and album selection both families can work in.",
    pricingModel:
      "Pixieset sells client gallery plans by storage, billed monthly or yearly in US dollars. Vyavasth sells storage plans in rupees with GST included, or single events.",
    plans: [
      { name: "Free", limit: "3 GB", listedPerYear: 0, gstIncluded: null, currency: "USD" },
      { name: "Basic", limit: "10 GB", listedPerYear: 96, gstIncluded: null, currency: "USD", note: "US$8 a month billed yearly, or US$10 monthly" },
      { name: "Plus", limit: "100 GB", listedPerYear: 192, gstIncluded: null, currency: "USD", note: "US$16 a month billed yearly, or US$20 monthly" },
      { name: "Pro", limit: "1,000 GB, RAW uploads", listedPerYear: 288, gstIncluded: null, currency: "USD", note: "US$24 a month billed yearly, or US$30 monthly" },
      { name: "Ultimate", limit: "Unlimited storage", listedPerYear: 480, gstIncluded: null, currency: "USD", note: "US$40 a month billed yearly, or US$50 monthly" },
    ],
    pricingNote:
      "Pixieset shows prices in US dollars, also when opened from India. We have not converted them, because the rupee amount depends on the exchange rate and your bank's foreign currency charges. Its page does not say how tax applies to Indian customers.",
    rows: [
      { label: "How you pay", vyavasth: V.model, competitor: "Monthly or yearly by storage, in US dollars." },
      { label: "Face search for guests", vyavasth: V.faceSearch, competitor: "Not listed on Pixieset's client gallery or pricing pages." },
      { label: "QR code for guests", vyavasth: "One QR for each event, for standees and invitations.", competitor: "Not listed on Pixieset's client gallery or pricing pages." },
      { label: "Album selection", vyavasth: V.selection, competitor: "Clients pick favourites and add comments on photos; you track their favourite lists." },
      { label: "Upload during the event", vyavasth: V.liveUpload, competitor: "Not listed on the pricing page." },
      { label: "Selling prints", vyavasth: "Not offered.", competitor: "Built-in print store with automatic fulfilment; no commission on paid plans." },
      { label: "Website and studio tools", vyavasth: "Not offered.", competitor: "Website builder and Studio Manager as separate Pixieset products." },
      { label: "Google reviews from the gallery", vyavasth: V.reviews, competitor: "Not listed on the pricing page." },
    ],
    theyAreBetterAt: [
      "A built-in print store with automatic fulfilment.",
      "A website builder, studio manager and mobile gallery apps from the same company.",
      "A free plan with 3 GB.",
    ],
    vyavasthIsBetterAt: [
      "Face search: every guest finds their own photos with one selfie.",
      "One QR per event, and live delivery during the wedding.",
      "Prices in rupees with GST included, or pay per event.",
      "Album selection made for Indian weddings, with collections for each album and bride and groom side filters, plus Locate Originals.",
    ],
    chooseThemIf: [
      "You sell prints and shoot for international clients.",
      "You want your website and gallery from the same company.",
    ],
    chooseVyavasthIf: [
      "You deliver Indian weddings to hundreds of guests who want their own photos the same day.",
      "You want to pay in rupees, with GST on the invoice.",
    ],
    faqs: [
      { q: "Does Pixieset have face search or QR codes for guests?", a: "Neither is listed on Pixieset's client gallery or pricing pages as of the date above. Vyavasth has both on every plan." },
      { q: "Can Indian studios pay for Pixieset in rupees?", a: "Pixieset's pricing page shows US dollars, also when opened from India, so the rupee amount depends on the exchange rate and your bank's charges. Vyavasth prices are in rupees with GST included on storage plans." },
      { q: "Is Pixieset good for Indian weddings?", a: "It is a strong gallery for portraits and print sales. For Indian weddings with hundreds of guests, face search, QR sharing and album selection by both families matter more, and those are where Vyavasth is built." },
    ],
  },

  // ───────────────────────────── Pic-Time ─────────────────────────────
  {
    slug: "vyavasth-vs-pic-time",
    name: "Pic-Time",
    site: "pic-time.com",
    sources: [{ label: "Pic-Time pricing", url: "https://www.pic-time.com/pricing/client-delivery-suite" }],
    hub: {
      pricedBy: "Storage, monthly or yearly, in US dollars",
      entry: "US$7 a month billed yearly (20 GB). Free plan with 10 GB.",
      albumSelection: "Not listed as a separate feature; selfie search for clients on Advanced",
      gst: "Billed in US dollars; tax not stated",
    },
    title: vsTitle("Pic-Time"),
    metaDescription:
      "Vyavasth vs Pic-Time for Indian wedding studios: prices in rupees vs US dollars, selfie search, print store, album selection and where each one is better.",
    h1: "Vyavasth vs Pic-Time",
    verdict:
      "Pic-Time is a print and product sales machine: 30+ labs, an album builder, marketing automations. Face search exists, but only on the top Advanced plan at US$42 a month, billed in dollars. Vyavasth has face search on every plan, including pay per event, priced in rupees, and is built around Indian weddings: live delivery to hundreds of guests and album selection by both families.",
    pricingModel:
      "Pic-Time sells plans by storage, billed monthly or yearly in US dollars. Vyavasth sells storage plans in rupees with GST included, or single events.",
    plans: [
      { name: "Free", limit: "10 GB, about 3,000 photos", listedPerYear: 0, gstIncluded: null, currency: "USD" },
      { name: "Beginner", limit: "20 GB, about 6,000 photos", listedPerYear: 84, gstIncluded: null, currency: "USD", note: "US$7 a month billed yearly, or US$8 monthly" },
      { name: "Professional", limit: "100 GB, about 30,000 photos", listedPerYear: 252, gstIncluded: null, currency: "USD", note: "US$21 a month billed yearly, or US$25 monthly" },
      { name: "Advanced", limit: "Unlimited storage (terms apply)", listedPerYear: 504, gstIncluded: null, currency: "USD", note: "US$42 a month billed yearly, or US$50 monthly. Adds selfie search for clients" },
    ],
    pricingNote:
      "Pic-Time shows prices in US dollars. We have not converted them, because the rupee amount depends on the exchange rate and your bank's foreign currency charges. Its page does not say how tax applies to Indian customers.",
    rows: [
      { label: "How you pay", vyavasth: V.model, competitor: "Monthly or yearly by storage, in US dollars." },
      { label: "Face search for guests", vyavasth: V.faceSearch, competitor: "Selfie search for clients on the Advanced plan only." },
      { label: "Album selection", vyavasth: V.selection, competitor: "Not listed as a separate feature on the pricing page; an album builder is part of the print store." },
      { label: "Selling prints and products", vyavasth: "Not offered.", competitor: "Print store with 30+ labs, automatic fulfilment, album builder, coupons and gift cards." },
      { label: "Marketing tools", vyavasth: V.reviews, competitor: "Automated marketing campaigns, slideshows, blogs and a vendor network on higher plans." },
      { label: "Upload during the event", vyavasth: V.liveUpload, competitor: "Not listed on the pricing page." },
    ],
    theyAreBetterAt: [
      "Selling prints and products, with 30+ labs and automatic fulfilment.",
      "Marketing automations, slideshows and blogs.",
      "A free plan with 10 GB.",
    ],
    vyavasthIsBetterAt: [
      "Face search on every plan, not only the top one.",
      "Prices in rupees with GST included, or pay per event.",
      "Live delivery during the wedding, and one QR per event.",
      "Album selection by both families, with collections and side filters, plus Locate Originals.",
    ],
    chooseThemIf: [
      "Print and product sales are a big part of your revenue.",
      "Your clients are mostly international.",
    ],
    chooseVyavasthIf: [
      "You deliver Indian weddings where hundreds of guests want their own photos.",
      "You want face search without paying for the top plan, in rupees.",
    ],
    faqs: [
      { q: "Does Pic-Time have face search?", a: "Pic-Time lists selfie search for clients on its Advanced plan. Vyavasth has face search on every plan, including pay per event." },
      { q: "Is Pic-Time priced in rupees?", a: "Its pricing page shows US dollars. Vyavasth prices are in rupees, with GST included on storage plans." },
    ],
  },

  // ───────────────────────────── Camtom ─────────────────────────────
  {
    slug: "vyavasth-vs-camtom",
    name: "Camtom",
    site: "camtom.in",
    sources: [{ label: "Camtom home page and pricing", url: "https://www.camtom.in/" }],
    hub: {
      pricedBy: "Two yearly plans",
      entry: "₹1,299 a year (no face recognition), or ₹1,999 a year with AI face recognition",
      albumSelection: "Unlimited photo selection, multi-user selection, original and RAW photos of the selection in one click",
      gst: "Not stated",
    },
    title: vsTitle("Camtom"),
    metaDescription:
      "Vyavasth vs Camtom for Indian studios: yearly price, photo selection, face recognition, CRM and billing tools, gallery experience and where each one is better.",
    h1: "Vyavasth vs Camtom",
    verdict:
      "Camtom is the cheapest tool here at ₹1,299 a year, and it throws in quotations, billing, order booking and expenses. In its own words it is \"order management software\", and that is where it shines. What it does not sell is a premium wedding gallery: its home page talks about selection, CRM and payments, and says photos are kept with Google Cloud and Google Drive without saying how they are served when 500 guests open the link at once. Vyavasth is the gallery your guests see and remember your studio by: live delivery, face search on every plan, collections for each album and a Google review prompt.",
    pricingModel:
      "Camtom sells two yearly plans; its page does not mention GST. Vyavasth sells storage plans with GST included, or single events.",
    plans: [
      { name: "Elite Photographer", limit: "Unlimited photo selection, no AI face recognition", listedPerYear: 1299, gstIncluded: null },
      { name: "Professional + AI", limit: "Unlimited photo selection, AI face recognition, e-album flipbook", listedPerYear: 1999, gstIncluded: null },
    ],
    pricingNote:
      "Camtom's page lists these two yearly prices and does not say whether GST is included. Photos have one year validity on both plans. The page does not list a storage limit; it says data is protected with Google Cloud and Google Drive.",
    rows: [
      { label: "How you pay", vyavasth: V.model, competitor: "Yearly, ₹1,299 or ₹1,999. GST not stated." },
      { label: "Face search for guests", vyavasth: V.faceSearch, competitor: "AI face recognition on the ₹1,999 plan only." },
      { label: "Album selection", vyavasth: V.selection, competitor: "Unlimited photo selection, multi-user selection and a selection timer." },
      { label: "Originals for the editor", vyavasth: V.originals, competitor: "Original and RAW photos of the selection in one click." },
      { label: "CRM and billing", vyavasth: "Not offered.", competitor: "Quotations, billing, order booking and calendar, client and team management, payment records, expenses." },
      { label: "Paid downloads", vyavasth: "Not offered.", competitor: "Free or paid photo downloads for clients." },
      { label: "Upload during the event", vyavasth: V.liveUpload, competitor: "Not listed on the home page." },
      { label: "Google reviews from the gallery", vyavasth: V.reviews, competitor: "Not listed on the home page." },
      { label: "Where photos are stored", vyavasth: "Vyavasth's own cloud storage, sized by your plan.", competitor: "The page says Google Cloud and Google Drive; no storage limit is listed." },
    ],
    theyAreBetterAt: [
      "The lowest yearly price in this comparison.",
      "Studio CRM and billing tools in the same subscription.",
      "Paid photo downloads, and desktop, Android and iOS apps.",
    ],
    vyavasthIsBetterAt: [
      "A premium, branded gallery guests see on their phones, with face search on every plan.",
      "Live delivery while the wedding is still going on.",
      "Collections for each album and bride and groom side filters.",
      "A Google review prompt in every gallery.",
    ],
    chooseThemIf: [
      "You want photo selection and a CRM at the lowest yearly cost.",
      "You want to charge clients for downloads.",
    ],
    chooseVyavasthIf: [
      "The guest gallery is part of how you win the next booking.",
      "You want photos reaching guests during the wedding, not after.",
    ],
    faqs: [
      { q: "Is Camtom cheaper than Vyavasth?", a: "Yes. Camtom's plans are ₹1,299 and ₹1,999 a year, less than any Vyavasth storage plan. Camtom also includes CRM and billing tools. Vyavasth costs more for a premium guest gallery with face search on every plan, live delivery and album collections." },
      { q: "Does Camtom store photos on Google Drive?", a: "Camtom's home page says data is protected with Google Cloud and Google Drive, and it does not list a storage limit. Ask Camtom how photos are served to guests at large events. Vyavasth stores and serves photos from its own cloud storage." },
    ],
  },
];

/** Shown in the hub table only, without their own page. */
export const HUB_ONLY: HubOnlyTool[] = [
  {
    name: "Photomall",
    site: "photomall.in",
    source: { label: "Photomall pricing", url: "https://photomall.in/en/pricing-offers" },
    hub: {
      pricedBy: "Number of photos, monthly, yearly or per event",
      entry: "₹999 a month (10,000 photos), or ₹3,799 a year (40,000 photo uploads). Free trial with 1,000 images.",
      albumSelection: "Photo selection from the Gold Essential plan (₹7,699 a year) up, and on per-event plans",
      gst: "Not stated",
    },
    note: "Also offers e-albums, e-invitations, billing software and a portfolio website.",
  },
  {
    name: "Kamero",
    site: "kamero.ai",
    source: { label: "Kamero pricing", url: "https://kamero.ai/pricing" },
    hub: {
      pricedBy: "Pay per event, yearly subscription or enterprise",
      entry: "Not published. First event free.",
      albumSelection: "Photo shortlisting and selection for album prints",
      gst: "Not stated",
    },
    note: "Offers live camera-to-cloud upload and branded iOS and Android apps.",
  },
];

export function competitorBySlug(slug: string): Competitor | undefined {
  return COMPETITORS.find((c) => c.slug === slug);
}

/** Listed price including 18% GST, rounded to the rupee. null if unknown or not in rupees. */
export function withGst(plan: CompetitorPlan): number | null {
  if (plan.listedPerYear === null) return null;
  if (plan.currency === "USD") return null;
  if (plan.gstIncluded === false) return Math.round(plan.listedPerYear * 1.18);
  return plan.listedPerYear;
}
