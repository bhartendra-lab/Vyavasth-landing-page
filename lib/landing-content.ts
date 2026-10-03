// lib/landing-content.ts — every swappable image and empty slot on the home
// page, in one place. Components read from here and never hard-code a path, so
// replacing a placeholder is an edit to this file (plus dropping the new file
// into public/landing-v2/), never a component change.
//
// Pure data. No React, no fetch, no env.

/** One image position. `src: null` renders a striped, dashed EMPTY SLOT. */
export type ImageSlot = {
  /** Public path (e.g. "/landing-v2/proof/kamal-owner.jpg"), or null while empty. */
  src: string | null;
  /** Alt text used once `src` is set. Empty string for purely decorative images. */
  alt: string;
  /** Short caption printed inside the slot while it is empty. */
  emptyLabel: string;
  /**
   * How a filled slot is drawn. "photo" (default) crops to the slot, for
   * portraits. "logo" shows the whole image at its own aspect ratio on a white
   * chip, and needs `width` and `height` (the file's pixel size).
   */
  fit?: "photo" | "logo";
  width?: number;
  height?: number;
};

/** A real image that is currently a stand-in drawn in code, not a real photo. */
export type PlaceholderImage = {
  src: string;
  /** Always true today. Flip to false (or delete the flag) when a real photo lands. */
  placeholder: boolean;
};

const BASE = "/landing-v2";

/* ───────────── Hero ───────────── */

export type HeroFace = {
  /** Face box in the photo's own pixel space (see `sceneW` / `sceneH`). */
  x: number;
  y: number;
  w: number;
  h: number;
  /** Name chip shown beside the face box on the first screen. */
  tag?: string;
};

export type HeroTile = PlaceholderImage & {
  id: "haldi" | "sangeet" | "dadi" | "varmala" | "mehendi" | "baraat";
  /** Caption printed on the tile ("Haldi"). */
  label: string;
  /** Tile size on the first screen. Keep the ratio: the phone grid depends on it. */
  w: number;
  h: number;
  /** Pixel size the face boxes were measured against. */
  sceneW: number;
  sceneH: number;
  faces: HeroFace[];
};

// When real photos arrive: replace the file, keep the 3:4, 4:3 and 1:1 ratios,
// and re-measure `faces` against the new photo (sceneW / sceneH are its pixel size).
export const HERO_TILES: HeroTile[] = [
  {
    id: "haldi", src: `${BASE}/hero/photos/haldi.jpg`, placeholder: true, label: "Haldi",
    w: 186, h: 248, sceneW: 300, sceneH: 400,
    faces: [{ x: 92, y: 136, w: 116, h: 122, tag: "Dulhan" }],
  },
  {
    id: "sangeet", src: `${BASE}/hero/photos/sangeet.jpg`, placeholder: true, label: "Sangeet",
    w: 256, h: 192, sceneW: 400, sceneH: 300,
    faces: [
      { x: 48, y: 118, w: 60, h: 63 },
      { x: 128, y: 98, w: 64, h: 67 },
      { x: 215, y: 105, w: 62, h: 65 },
      { x: 296, y: 122, w: 60, h: 63 },
    ],
  },
  {
    id: "dadi", src: `${BASE}/hero/photos/dadi.jpg`, placeholder: true, label: "Reception",
    w: 156, h: 156, sceneW: 300, sceneH: 300,
    faces: [{ x: 86, y: 74, w: 128, h: 136, tag: "Dadi" }],
  },
  {
    id: "varmala", src: `${BASE}/hero/photos/varmala.jpg`, placeholder: true, label: "Varmala",
    w: 174, h: 232, sceneW: 300, sceneH: 400,
    faces: [
      { x: 58, y: 126, w: 92, h: 118 },
      { x: 161, y: 161, w: 86, h: 96 },
    ],
  },
  {
    id: "mehendi", src: `${BASE}/hero/photos/mehendi.jpg`, placeholder: true, label: "Mehendi",
    w: 240, h: 180, sceneW: 400, sceneH: 300,
    faces: [],
  },
  {
    id: "baraat", src: `${BASE}/hero/photos/baraat.jpg`, placeholder: true, label: "Baraat",
    w: 160, h: 160, sceneW: 300, sceneH: 300,
    faces: [{ x: 110, y: 48, w: 80, h: 106 }],
  },
];

/** The selfie in the hero (a 1:1 face crop). */
export const HERO_GUEST: PlaceholderImage = {
  src: `${BASE}/hero/photos/guest.jpg`,
  placeholder: true,
};

/* ───────────── Welcome page (/welcome) ───────────── */

/** The hero's warm gradient as a still image, used instead of the WebGL canvas. */
export const WELCOME_POSTER = `${BASE}/hero/objects/hero-bg-poster.jpg`;

/* ───────────── Workflow ───────────── */

/**
 * How the workflow card behaves on desktop (the horizontal layout, wider than
 * 980px). Change this one constant to switch.
 *
 *  "pin"      The card sticks just below the nav and page scroll drives the
 *             line from step 1 to step 6, then the card releases. If the
 *             viewport is too short for the card, it falls back to "autoplay".
 *  "autoplay" No scroll linkage. When the card is about half in view the line
 *             runs once by itself and stays complete. Clicking or focusing a
 *             step jumps to it.
 *
 * Phones (vertical layout) are unaffected: the line already moves in the scroll
 * direction. Reduced motion shows every step complete in either mode.
 */
export type WorkflowMode = "pin" | "autoplay";
export const WORKFLOW_MODE: WorkflowMode = "pin";

/** "pin": extra scroll distance while the card is stuck, as a multiple of the viewport height. */
export const WORKFLOW_PIN_SCROLL_VH = 1;

/** "pin": where the card sticks, in px from the top of the viewport (just below the nav pill). */
export const WORKFLOW_PIN_TOP_PX = 88;

/** "autoplay": how long the line takes to run from step 1 to step 6. */
export const WORKFLOW_AUTOPLAY_MS = 5000;

/** The gallery tile's four photos, and the photo that rides the line (`rider`). */
export const WORKFLOW_IMAGES = {
  gallery: [
    { src: `${BASE}/workflow/haldi.jpg`, placeholder: true },
    { src: `${BASE}/workflow/sangeet.jpg`, placeholder: true },
    { src: `${BASE}/workflow/varmala.jpg`, placeholder: true },
    { src: `${BASE}/workflow/dadi.jpg`, placeholder: true },
  ],
  rider: { src: `${BASE}/workflow/haldi.jpg`, placeholder: true },
} as const satisfies {
  gallery: readonly PlaceholderImage[];
  rider: PlaceholderImage;
};

/* ───────────── Features ───────────── */

const feat = (name: string): PlaceholderImage => ({
  src: `${BASE}/features/${name}.jpg`,
  placeholder: true,
});

export const FEATURE_IMAGES = {
  /** Smart Select grid, in reading order. */
  smartSelect: [
    feat("t_varmala"), feat("t_haldi"), feat("t_sangeet"), feat("t_dadi"),
    feat("t_baraat"), feat("t_mehendi"), feat("t_sangeet"), feat("t_haldi"),
  ],
  /** My People: the guest in the middle and their circle. */
  people: {
    guest: feat("a_guest"), dadi: feat("a_dadi"), bride: feat("a_bride"), groom: feat("a_groom"),
    f0: feat("a_f0"), f1: feat("a_f1"), f2: feat("a_f2"), f3: feat("a_f3"), dhol: feat("a_dhol"),
  },
  /** Uploads: the three event rows. */
  uploads: [feat("t_sangeet"), feat("t_haldi"), feat("t_varmala")],
  /** Branding: the watermarked photo. */
  brandShot: feat("big_varmala"),
} as const;

/* ───────────── Proof and price ───────────── */

// An `src: null` slot is an empty slot waiting for a real image. It renders
// striped and dashed on purpose so nobody ships one by accident.

/**
 * Image on the back of each quote card (2). Keyed by the card. Meant for the
 * owner's photo; for now each shows the studio's logo. To switch to a portrait,
 * set `src` to the photo and drop `fit`, `width` and `height`.
 */
export const OWNER_PHOTOS: { kamal: ImageSlot; weddingBooth: ImageSlot } = {
  kamal: {
    src: `${BASE}/proof/kamal-productions.png`,
    alt: "", // the studio's name is printed right beside it
    emptyLabel: "Photo",
    fit: "logo", width: 382, height: 348,
  },
  weddingBooth: {
    src: `${BASE}/proof/the-wedding-booth.png`,
    alt: "",
    emptyLabel: "Photo",
    fit: "logo", width: 406, height: 204,
  },
};

/** One studio in the "Studios delivering on Vyavasth" strip. */
export type StudioEntry = {
  name: string;
  /** Optional. When set, the strip shows this logo instead of the name (the name becomes its alt text). */
  logo?: { src: string; width: number; height: number };
};

/**
 * Studios delivering on Vyavasth, in strip order (the strip is six tiles wide).
 * Names are shown as typed until a logo is added to an entry.
 */
export const STUDIOS: StudioEntry[] = [
  { name: "Kamal Productions" },
  { name: "The Wedding Booth" },
  { name: "Manjhi Productions" },
  { name: "Ved Mantra Production" },
  { name: "Kismat Connection" },
  { name: "Poonam studios" },
];
