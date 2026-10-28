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
  /** Price as listed, in rupees, per year. null when not published. */
  listedPerYear: number | null;
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
      "Kwikpic is the cheaper way in if you mainly need face search and a branded gallery: its Basic plan costs less than any Vyavasth storage plan, and it has a free plan. Vyavasth puts every feature on every plan, so album selection with collections, bride and groom side filters, Locate Originals, watermarks and the Google review prompt are there from the first rupee. On Kwikpic, client favourites start on Standard, watermarks cost extra on Standard, and instant camera upload is on Premium and Premium Max.",
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
      "FotoOwl gives more storage for the money on its larger plans and adds extras Vyavasth does not have: a free plan, photo selling, auto-generated reels and guest uploads. Vyavasth includes GST in its storage prices, sells single events, and is built around album selection for Indian weddings: collections for each album, bride and groom side filters, and Locate Originals to hand the editor the right files. If storage per rupee and extras matter most, FotoOwl's bigger plans win. If album selection is the bottleneck, Vyavasth fits better.",
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
      "Samaro is the broader platform: AI culling, AI editing, album design, a WhatsApp bot and camera to cloud sit alongside delivery. Vyavasth does less, costs less per GB once GST is counted, and is built around the slowest part of an Indian wedding: getting the couple and family to finish album selection, then handing the editor the right originals. If you want one subscription for culling, editing, design and delivery, look at Samaro. If delivery and album selection are the job, Vyavasth is the simpler and cheaper fit.",
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
      "PicPapaya is a clean, low-cost face search gallery with a free plan and large storage plans up to 10 TB, and its 1 TB plan costs less than Vyavasth's. Vyavasth costs more at that size but does the work after the wedding too: album selection with collections and bride and groom side filters, Locate Originals for the editor, and a Google review prompt. If you only need guests to find their photos, PicPapaya is a strong, cheaper choice. If album selection is your bottleneck, Vyavasth covers it.",
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
      "FaceSnap has the lowest photographer entry price here and a 30-day free trial, plus extras like a portfolio website and highlight reels. Its plans cap active images and active events, and watermarks are not on the Standard plan. Vyavasth caps storage, not events, and adds album selection with collections, bride and groom side filters and Locate Originals on every plan. If you want the cheapest face search gallery, start with FaceSnap. If album selection is your bottleneck, Vyavasth covers it.",
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

/** Listed price including 18% GST, rounded to the rupee. null if unknown. */
export function withGst(plan: CompetitorPlan): number | null {
  if (plan.listedPerYear === null) return null;
  if (plan.gstIncluded === false) return Math.round(plan.listedPerYear * 1.18);
  return plan.listedPerYear;
}
