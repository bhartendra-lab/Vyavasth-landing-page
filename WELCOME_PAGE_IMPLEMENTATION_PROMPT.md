# Implement `/welcome`: the expo QR landing page

You are working in the Vyavasth marketing site repo (`Vyavasth-landing-page`, Next.js 16 App Router, React 19, Tailwind v4, deployed to Cloudflare via OpenNext). Build a new, standalone page at **`/welcome`**. A QR code on our booth standee at **Imagic Expo Photofair 2026** will point here.

Read this whole prompt before writing any code.

---

## 0. Before you start

1. Read `CLAUDE.md` first and follow it. It points to `AGENTS.md`, so read that too. This Next.js version has breaking changes. Read the relevant guides in `node_modules/next/dist/docs/01-app/` before writing code, especially the ones on **pages/routing**, **metadata** (including `robots`), and **`next/image`**. Follow any deprecation notices you find there. Don't rely on what you remember about Next.js.
2. Read these files to learn the conventions. Reuse what's there and don't reinvent it:
   - `app/globals.css`: the design tokens (`--color-bg`, `--color-surface`, `--color-primary`, `--color-muted`, `--color-line`, `--color-accent`, `--color-accent-deep`, `--color-accent-soft`, `--shadow-*`, `--gutter`).
   - `app/layout.tsx`: the root layout, Plus Jakarta Sans font, default metadata, and `EnquiryProvider` wrapper.
   - `lib/site-legal.ts`: `WHATSAPP_NUMBER`, the single source of truth for the WhatsApp number.
   - `components/CtaSection.tsx` and `components/Footer.tsx`: how existing `wa.me` links and the logo are rendered.
   - `components/Hero.tsx`: how the app signup URL is built (`process.env.NEXT_PUBLIC_APP_URL ?? "https://deliver.vyavasth.in"` + `/login`).
   - `app/pricing/page.tsx`: how page-level `metadata` is declared.

---

## 1. Context: who this page is for

- The audience is **photographers and studio owners** walking around a photography trade fair. They're standing up, on their phones, using one hand, often on poor booth/hall network.
- They scan a QR on our standee and land here. The page gives them three things, plus one quiet extra:
  1. **Get your photos**: the Vyavasth event gallery for this expo. They take a selfie and see photos they're in. This is also a live demo of our product.
  2. **Chat with us**: opens WhatsApp chat with our business number.
  3. **Watch it work**: our YouTube Shorts tab with 60-second feature explainers.
  4. A small text link: **Start free** (signup).
- The page has to load almost instantly and need zero thinking. It isn't a marketing page.

---

## 2. Files to create

### 2.1 `lib/welcome.ts`: the single config for this page

Everything event-specific lives here, so the next expo only needs a change to this file.

```ts
import { WHATSAPP_NUMBER } from "@/lib/site-legal";

export const WELCOME_EVENT = {
  /** Shown in the header and in the prefilled WhatsApp message. */
  name: "Imagic Expo Photofair 2026",

  /** Vyavasth event gallery link for this expo. Empty string = not set yet. */
  galleryUrl: "", // TODO(Abhishek): add gallery link before the expo

  /** Vyavasth YouTube Shorts tab (e.g. https://www.youtube.com/@<handle>/shorts). Empty string = not set yet. */
  shortsUrl: "", // TODO(Abhishek): add YouTube Shorts link
} as const;
```

Also export small **pure helper functions** from this file (they're easy to unit-test):

- `buildWhatsAppUrl(eventName: string): string` returns `https://wa.me/${WHATSAPP_NUMBER}?text=<encoded>`, where the text is exactly:
  `Hi, I visited the Vyavasth booth at ${eventName}.`
  Use `encodeURIComponent`. Don't hardcode the number. Import `WHATSAPP_NUMBER` from `lib/site-legal.ts`.
- `buildSignupUrl(): string` returns `${process.env.NEXT_PUBLIC_APP_URL ?? "https://deliver.vyavasth.in"}/login?src=welcome`.
- `isLinkReady(url: string): boolean` returns true only if the trimmed string is non-empty and starts with `https://`.

### 2.2 `lib/welcome.test.ts`

The repo runs tests with `node --test "lib/**/*.test.ts"` (see `package.json` and the existing `lib/plans.test.ts` / `lib/features.test.ts` for the style; match it exactly, including how they import). Cover:

- `buildWhatsAppUrl` uses the number from `site-legal`, starts with `https://wa.me/`, and decodes back to the exact message string.
- `buildSignupUrl` ends with `/login?src=welcome`.
- `isLinkReady`: `""`, `"   "`, `"http://x"` and `"youtube.com"` return false. `"https://x.com"` returns true.

### 2.3 `app/welcome/page.tsx`

A **Server Component**, with no `"use client"`. The page has no interactive state, so it should ship essentially zero client JavaScript of its own.

**Metadata** (follow the metadata guide in the Next docs for the exact API):

- `title`: `"Welcome: Vyavasth at Imagic Expo Photofair 2026"`. Build it from `WELCOME_EVENT.name`, don't hardcode it.
- `description`: `"Get your event photos, chat with the Vyavasth team, and watch our 60-second feature explainers."`
- `robots`: **noindex, nofollow**. This page isn't for search.
- `alternates.canonical`: `"/welcome"`.

### 2.4 Optional: `components/welcome/WelcomeCard.tsx`

Only if it keeps `page.tsx` cleaner. It should also be a server component (a plain `<a>` or a disabled `<div>`, see §4).

**Don't** touch `Nav`, `Footer`, `Hero`, the homepage, or any other existing page. Don't link `/welcome` from the main nav or footer.

---

## 3. Layout and content

Mobile-first, single column, centered, `max-width` around **440px** on larger screens (it should look like a phone-width card on desktop, not stretched). Page background `var(--color-bg)`. Side padding should follow `var(--gutter)` or at least 20px. No horizontal scroll at 320px width.

**Don't render** `Nav`, `Footer`, `CtaSection`, the hero bokeh/Three.js, framer-motion, `MagneticButton`, or the enquiry modal. This page is standalone.

Top to bottom:

### 3.1 Header
- Vyavasth logo: `/vyavasth-full-logo.svg` via `next/image`, rendered **as-is**. Never recolor, redraw, crop, or distort the logo. Height around 28px, `width: auto`, `priority`.
- Small eyebrow line in `--color-muted`, uppercase, tracked: `WELCOME TO`
- Event name as the page `<h1>`: **Imagic Expo Photofair 2026**, from `WELCOME_EVENT.name`. Bold, `--color-primary`, roughly 28–32px on mobile, tight leading and letter-spacing, so it wraps cleanly onto 2 lines on a 360px phone.
- One short subline in `--color-muted`:
  `Thanks for stopping by. Here's everything in one place.`

### 3.2 Three equal cards, in this exact order

All three cards are **visually equal**: same size, same style, same weight. Order does the ranking. Stack them vertically with ~12px gap. Each card is a full-width tappable block.

| # | Icon (lucide-react) | Title | Subtitle | Link |
|---|---|---|---|---|
| 1 | gallery/images icon | **Get your photos** | Take a selfie, see every photo you're in. | `WELCOME_EVENT.galleryUrl` |
| 2 | message/chat icon | **Chat with us** | Questions, pricing, a demo. We reply on WhatsApp. | `buildWhatsAppUrl(WELCOME_EVENT.name)` |
| 3 | play icon | **Watch it work** | 60-second feature explainers. | `WELCOME_EVENT.shortsUrl` |

The repo is on `lucide-react` v1.x. Check icon export names in `node_modules/lucide-react` before importing (e.g. confirm whether it's `Images`, `MessageCircle`, `CirclePlay`/`PlayCircle`). Don't guess.

Card styling (use existing tokens, no new colors):
- Background `var(--color-surface)`, `1px solid var(--color-line)`, radius around 16–20px, `var(--shadow-subtle)`.
- Left: icon in a ~44px rounded square with `var(--color-accent-soft)` background and `var(--color-accent)` icon color.
- Middle: title (16–17px, semibold, `--color-primary`) and subtitle (14px, `--color-muted`).
- Right: a small `ArrowUpRight` (or `ArrowRight`) in `--color-muted`.
- Min height ~76px so the whole card is an easy one-thumb tap target (well above 44×44px).
- Hover/active: border goes to `var(--color-accent)`, plus a slight `translateY(-1px)` on hover-capable devices only. Keep transitions to CSS only.
- Visible focus ring for keyboard users (`focus-visible:ring-2` with the accent color, like the existing CTAs).

### 3.3 Signup link (small, quiet)
Below the cards, centered, ~14px:
`New here? Start free, your first 2 events are on us. →`
"Start free" is the link text, styled `--color-accent`, underline on hover, going to `buildSignupUrl()`. Same tab. The rest is `--color-muted`.
(The "2 events" figure matches the pricing page's "Start free with 2 events". If you find the free-event count is defined somewhere in `lib/plans.ts` in a way that's available statically, keep the copy consistent with it, but don't add a network fetch to this page for it.)

### 3.4 Footer line
A small, centered line at the bottom in `--color-faint`/`--color-muted`: a link to `https://vyavasth.in` showing **www.vyavasth.in**. Nothing else.

---

## 4. Link behavior

- **Gallery and Shorts** open in a **new tab**: `target="_blank" rel="noopener noreferrer"`. On phones the YouTube link will hand off to the YouTube app, which is fine.
- **WhatsApp** opens with `target="_blank" rel="noopener noreferrer"` (same as existing `wa.me` links in the repo).
- **Signup** opens in the same tab.
- Don't append tracking params to the gallery or YouTube URLs (it can break those links). Only the signup URL gets `?src=welcome`.

### Placeholder state (important: the gallery and Shorts links are empty right now)
If `isLinkReady(url)` is false for a card:
- Render it as a **non-link** element (a `<div>`, not an `<a>` with `href="#"`), with `aria-disabled="true"`.
- Same layout, but at ~55% opacity, no hover effect, and the arrow replaced by a small pill reading **`Opening soon`**.
- The card must not navigate anywhere, throw, or log errors.

When the links are added to `lib/welcome.ts` later, the cards should become live with no other code change.

---

## 5. Copy rules

- **No em dashes (—) anywhere** in user-facing copy, metadata, or alt text. Use commas, periods or colons instead. Grep your diff for `—` before you finish.
- Use the copy in this prompt verbatim. Don't add marketing lines, badges, emoji, stats, or testimonials.
- Use proper apostrophes in JSX (`&apos;` or `{"..."}`, like `Hero.tsx`) so ESLint's `react/no-unescaped-entities` passes.

---

## 6. Performance and robustness (booth Wi-Fi is bad)

- No client components, no framer-motion, no Three.js, no data fetching, no Mongo/API calls on this route. It should be statically renderable. Confirm in the `next build` output that `/welcome` is static (○), not dynamic.
- The only image is the logo SVG. No other images or videos.
- Font comes from the existing root layout. Don't add new fonts.
- Make sure nothing in the root layout (`EnquiryProvider`) forces this route dynamic. If it does, report it rather than refactoring the layout.

---

## 7. Accessibility

- Exactly one `<h1>` (the event name).
- Cards use semantic `<a>` (live) or `<div aria-disabled="true">` (placeholder). The accessible name should include the title, e.g. "Get your photos".
- Icons are decorative: `aria-hidden="true"`.
- Body text contrast meets WCAG AA on `--color-surface` and `--color-bg` (`--color-muted` on cream should pass at 14px; check it, and if it doesn't, use `--color-primary` at reduced emphasis instead of inventing a color).
- Respect `prefers-reduced-motion`: no translate on hover when reduced motion is set.

---

## 8. Verify before you report done

Run and make sure all of these pass:

1. `npm run lint`: no new warnings or errors.
2. `npm test`: including the new `lib/welcome.test.ts`.
3. `npm run build`: succeeds, and `/welcome` shows as a static route.
4. Run `npm run dev` and check `/welcome` at **360×780** (phone) and **1280×800** (desktop):
   - With empty `galleryUrl`/`shortsUrl`: cards 1 and 3 show "Opening soon" and aren't clickable, and card 2 (WhatsApp) works.
   - Temporarily set both to `https://example.com` and confirm all three cards become live links that open in new tabs. **Revert to empty strings afterwards.**
   - The WhatsApp link decodes to: `Hi, I visited the Vyavasth booth at Imagic Expo Photofair 2026.`
   - The page source has a `noindex` robots meta tag.
   - No horizontal scroll at 320px.
5. `grep -rn "—" app/welcome lib/welcome.ts components/welcome` returns nothing.

---

## 9. Out of scope (don't do these)

- No deploy (`deploy:prod` / `deploy:dev`), no git commit or push, unless explicitly asked.
- No changes to existing pages, components, nav, footer, or `globals.css` tokens.
- No QR code generation.
- No analytics SDKs or new dependencies.
- No "between events" behavior or multi-event routing (`/welcome/[event]`). That gets decided later.

---

## 10. Report back with

- The list of files created.
- Build output line for `/welcome` (static vs dynamic).
- Screenshots or a short description of the phone and desktop renders, in both placeholder and live states.
- Exactly which two lines in `lib/welcome.ts` need to be filled in (gallery URL and Shorts URL).
- Anything in this prompt that conflicted with the actual codebase, and what you chose.
