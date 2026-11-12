# SEO Phase 8: indexing and snippet fixes (from the 5 Nov Search Console and Bing check)

Repo: `Vyavasth-landing-page`. Read `AGENTS.md` first.

## Working rules

- Do NOT run the dev server, open a browser or take screenshots.
- No new dependencies. No em dashes in visible text. Do not commit, push or deploy.
- Keep `export const dynamic = "force-dynamic"` on dynamic routes.

## Why

- Google has not indexed any of the 8 `/compare/vyavasth-vs-*` pages ("Discovered, currently not indexed", "Referring page: none detected"). Indexing was requested by hand on 5 Nov; we also need stronger internal links so Google finds them.
- Bing shows 0 impressions for 2 weeks and recommends IndexNow.
- Bing flags meta descriptions as too long on most pages. Google cuts titles near 60 characters.

## 1. IndexNow (Bing, Yandex, Seznam; also used by ChatGPT search via Bing)

- Generate a 32-character hex key. Add `public/{key}.txt` whose only content is the key.
- Add `scripts/indexnow.mjs`: reads `https://vyavasth.in/sitemap.xml` (or builds the URL list from the same source the sitemap uses), and POSTs to `https://api.indexnow.org/indexnow` with `{ host: "vyavasth.in", key, keyLocation: "https://vyavasth.in/{key}.txt", urlList }`. Print the HTTP status. Accept an optional list of URLs as CLI args to submit only those.
- Add `"indexnow": "node scripts/indexnow.mjs"` to package.json scripts. Do not run it. I will run it after each deploy.

## 2. Meta descriptions and titles

Target: description 110 to 155 characters, title (including " | Vyavasth") 65 or fewer.
Current values that break it (measured on production):

| Page | Title length | Description length |
|---|---|---|
| / | 59 | 174 |
| /pricing | 57 | 92 (too short) |
| /about | 66 | 179 |
| /features | 71 | 197 |
| /features/* (all 5) | 55 to 67 | 176 to 193 |
| /compare | 76 | 189 |
| /compare/vyavasth-vs-* (all 8) | 69 to 72 | 146 to 173 |
| /contact | 51 | 99 (too short) |

- Shorten each description to 155 or fewer by cutting the last clause, not by rewriting the meaning. Lengthen /pricing and /contact to at least 110 with facts already on the page.
- Compare page titles: change the pattern to `Vyavasth vs {Name}: price with GST and features (2026)` and let the layout add no suffix if it would pass 65.
- /compare title: `Face search photo sharing apps in India: 2026 prices` (or shorter).
- /features title: `Vyavasth features: album selection, face search, live delivery`.
- Add a test that every static page and every compare and feature entry has a description of 110 to 155 characters.

## 3. Internal links to the compare pages

- On the homepage, add a small "Comparing tools?" line near the pricing section with links to the 4 most searched: Kwikpic, Samaro, FotoOwl, Pixieset (`/compare/vyavasth-vs-{slug}`), plus "All comparisons" to `/compare`.
- In the footer, add a "Compare" column listing all 8 compare pages.
- On `/compare`, make sure each competitor card links to its page with an `<a href>` in the server HTML (not only on click).

## 4. Keep API and app hosts out of Google

Google has indexed `https://api.vyavasth.in/deliverables/redirect-qr/{id}` URLs and `https://deliver.vyavasth.in/login`. These live in the other repos, so just write a note in `ai-tasks/API_NOINDEX_NOTE.md` for Bharat: add the header `X-Robots-Tag: noindex` to every response from api.vyavasth.in (redirects included), and `<meta name="robots" content="noindex">` to the deliver.vyavasth.in login page. Gallery pages stay as they are.

## Verification

1. `npx tsc --noEmit 2>&1 | tail -20`
2. `npm test 2>&1 | grep -E "^# (pass|fail)"`
3. `npm run build 2>&1 | grep -E "Error|compare|features" | head -10`
4. `ls public/*.txt` shows the key file.

Reply with the changed file list and the outputs.
