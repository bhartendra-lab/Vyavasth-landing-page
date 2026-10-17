// Compiles content/blog/*.md into lib/blog/posts.generated.ts.
// Cloudflare Workers cannot read content/ at runtime, so this runs at build time.
import { readdirSync, readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join, basename } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { marked } from "marked";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const CONTENT_DIR = join(ROOT, "content", "blog");
const OUT_FILE = join(ROOT, "lib", "blog", "posts.generated.ts");
const OG_DIR = join(ROOT, "public", "blog", "og");

const CATEGORIES = [
  "delivery",
  "album-selection",
  "guest-experience",
  "studio-business",
  "events",
  "industry",
];
const KNOWN_KEYS = ["title", "seoTitle", "description", "author", "date", "updated", "category"];
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const SLUG_RE = /^[a-z0-9-]+$/;
const FAQ_HEADING = "Frequently asked questions";
const DEFAULT_IMAGE = "/og-image.png";
const EM_DASH = "—";

// Authors: import lib/blog/authors.ts (Node strips TypeScript types on current
// versions); on an older Node, read the ids and "bio: null" entries from the file.
async function loadAuthors() {
  const file = join(ROOT, "lib", "blog", "authors.ts");
  try {
    const mod = await import(pathToFileURL(file).href);
    return mod.AUTHORS.map((a) => ({ id: a.id, hasBio: typeof a.bio === "string" && a.bio.length > 0 }));
  } catch {
    const src = readFileSync(file, "utf8");
    const entries = src.split(/\n\s*\{\s*\n\s*id:/).slice(1);
    return entries.map((chunk) => ({
      id: chunk.match(/^\s*"([^"]+)"/)?.[1] ?? "",
      hasBio: !/bio:\s*null/.test(chunk),
    }));
  }
}
const AUTHORS = await loadAuthors();

const errors = [];
const warnings = [];
const fail = (file, msg) => errors.push(`ERROR ${file}: ${msg}`);
const warn = (file, msg) => warnings.push(`WARN ${file}: ${msg}`);

function parseFrontmatter(raw) {
  const lines = raw.replace(/\r\n/g, "\n").split("\n");
  if (lines[0].trim() !== "---") return null;
  const end = lines.findIndex((l, i) => i > 0 && l.trim() === "---");
  if (end === -1) return null;
  const data = {};
  for (const line of lines.slice(1, end)) {
    if (!line.trim()) continue;
    const idx = line.indexOf(":");
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    // Anything after the key's colon, including further colons, is the value.
    let value = line.slice(idx + 1).trim();
    if (/^(["']).*\1$/.test(value)) value = value.slice(1, -1);
    data[key] = value;
  }
  return { data, body: lines.slice(end + 1).join("\n").replace(/^\n+/, "") };
}

const slugify = (text) =>
  text
    .toLowerCase()
    .replace(/&[a-z#0-9]+;/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "section";

const decodeEntities = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

const stripTags = (html) => html.replace(/<[^>]+>/g, "");

function stripMarkdown(md) {
  return md
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/(\*\*|__)(.*?)\1/g, "$2")
    .replace(/(\*|_)(.*?)\1/g, "$2")
    .replace(/^\s*[-*+]\s+/gm, "")
    .replace(/^\s*\d+\.\s+/gm, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extractFaqs(body) {
  const lines = body.split("\n");
  const start = lines.findIndex((l) => l.trim() === `## ${FAQ_HEADING}`);
  if (start === -1) return [];
  const faqs = [];
  let q = null;
  let answer = [];
  const flush = () => {
    if (q !== null) {
      const a = stripMarkdown(answer.join("\n"));
      if (a) faqs.push({ q: stripMarkdown(q), a });
    }
    q = null;
    answer = [];
  };
  for (const line of lines.slice(start + 1)) {
    if (/^##\s/.test(line) || line.trim() === "---") break;
    if (/^###\s/.test(line)) {
      flush();
      q = line.replace(/^###\s+/, "");
    } else if (q !== null) {
      answer.push(line);
    }
  }
  flush();
  return faqs;
}

function postProcess(html) {
  const headings = [];
  const used = new Set();
  const withIds = html.replace(/<h([23])>([\s\S]*?)<\/h\1>/g, (_, level, inner) => {
    const text = decodeEntities(stripTags(inner)).trim();
    let id = slugify(text);
    let n = 2;
    while (used.has(id)) id = `${slugify(text)}-${n++}`;
    used.add(id);
    if (level === "2") headings.push({ id, text });
    return `<h${level} id="${id}">${inner}</h${level}>`;
  });
  const wrapped = withIds
    .replace(/<table>/g, '<div class="table-wrap"><table>')
    .replace(/<\/table>/g, "</table></div>");
  const linked = wrapped.replace(/<a href="(https?:\/\/[^"]+)"/g, (m, href) => {
    if (/^https?:\/\/(www\.)?vyavasth\.in(\/|$)/.test(href)) return m;
    return `<a href="${href}" target="_blank" rel="noopener"`;
  });
  return { html: linked, headings };
}

function effectiveTitle(fm) {
  const base = fm.seoTitle || fm.title;
  const withBrand = `${base} | Vyavasth`;
  return withBrand.length <= 65 ? withBrand : base;
}

const files = existsSync(CONTENT_DIR)
  ? readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".md")).sort()
  : [];
const posts = [];
const seen = new Map();

for (const file of files) {
  const slug = basename(file, ".md");
  const parsed = parseFrontmatter(readFileSync(join(CONTENT_DIR, file), "utf8"));
  if (!parsed) {
    fail(file, "missing frontmatter (expected --- ... --- at the top)");
    continue;
  }
  const { data: fm, body } = parsed;
  const before = errors.length;

  if (!SLUG_RE.test(slug)) fail(file, `slug "${slug}" must match ${SLUG_RE}`);
  if (seen.has(slug)) fail(file, `duplicate slug "${slug}"`);
  seen.set(slug, file);

  for (const key of ["title", "description", "author", "date", "category"]) {
    if (!fm[key]) fail(file, `missing required field "${key}"`);
  }
  if (fm.author) {
    const author = AUTHORS.find((a) => a.id === fm.author);
    if (!author) {
      fail(file, `author "${fm.author}" is not in lib/blog/authors.ts`);
    } else if (!author.hasBio) {
      fail(file, `author "${fm.author}" has no approved bio (bio: null) in lib/blog/authors.ts`);
    }
  }
  for (const key of Object.keys(fm)) {
    if (!KNOWN_KEYS.includes(key)) warn(file, `unknown frontmatter field "${key}" ignored`);
  }
  for (const key of ["date", "updated"]) {
    if (fm[key] && !DATE_RE.test(fm[key])) fail(file, `"${key}" must be YYYY-MM-DD, got "${fm[key]}"`);
  }
  if (fm.category && !CATEGORIES.includes(fm.category)) {
    fail(file, `category "${fm.category}" must be one of: ${CATEGORIES.join(", ")}`);
  }
  for (const key of ["title", "seoTitle", "description"]) {
    if (fm[key] && fm[key].includes(EM_DASH)) fail(file, `${key} contains an em dash`);
  }
  if (body.includes(EM_DASH)) fail(file, "body contains an em dash");
  let inFence = false;
  for (const line of body.split("\n")) {
    if (/^\s*```/.test(line)) inFence = !inFence;
    if (!inFence && /^# /.test(line)) {
      fail(file, "body contains an h1 line (# ...); the title is the h1");
      break;
    }
  }
  if (errors.length > before) continue;

  const rendered = marked.parse(body, { gfm: true, async: false });
  const { html, headings } = postProcess(rendered);
  const faqs = extractFaqs(body);
  const words = stripTags(html).split(/\s+/).filter(Boolean).length;

  const title = effectiveTitle(fm);
  if (title.length > 65) warn(file, `effective title is ${title.length} characters (over 65)`);
  if (fm.description.length < 110 || fm.description.length > 160) {
    warn(file, `description is ${fm.description.length} characters (aim for 110 to 160)`);
  }
  if (faqs.length < 3) warn(file, `only ${faqs.length} FAQ(s) (aim for at least 3)`);

  const post = {
    slug,
    title: fm.title,
    ...(fm.seoTitle ? { seoTitle: fm.seoTitle } : {}),
    description: fm.description,
    author: fm.author,
    date: fm.date,
    ...(fm.updated ? { updated: fm.updated } : {}),
    category: fm.category,
    image: existsSync(join(OG_DIR, `${slug}.png`)) ? `/blog/og/${slug}.png` : DEFAULT_IMAGE,
    html,
    faqs,
    readingMinutes: Math.max(1, Math.round(words / 200)),
    wordCount: words,
    headings,
  };
  posts.push(post);
}

for (const w of warnings) console.warn(w);
if (errors.length > 0) {
  for (const e of errors) console.error(e);
  console.error(`\nBlog build failed with ${errors.length} error(s).`);
  process.exit(1);
}

// Newest first; slug breaks ties so the output order is stable.
posts.sort((a, b) => (a.date === b.date ? a.slug.localeCompare(b.slug) : a.date < b.date ? 1 : -1));

mkdirSync(dirname(OUT_FILE), { recursive: true });
writeFileSync(
  OUT_FILE,
  `// Generated by scripts/build-blog.mjs. Do not edit.\n` +
    `import type { BlogPost } from "./index.ts";\n\n` +
    `export const BLOG_POSTS: BlogPost[] = ${JSON.stringify(posts, null, 2)};\n`,
);
console.log(`Blog: ${posts.length} post(s) written to lib/blog/posts.generated.ts`);
