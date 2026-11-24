// Tells Bing, Yandex and Seznam (and so ChatGPT search, which reads Bing) that
// pages changed. Run it after each deploy:
//   npm run indexnow                        every URL in the live sitemap
//   npm run indexnow -- https://vyavasth.in/compare https://vyavasth.in/blog/x
//                                           only those URLs
// The key is the name of the 32-character hex .txt file in public/, which must
// contain the same key and be live at https://vyavasth.in/{key}.txt.
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const HOST = "vyavasth.in";
const SITE = `https://${HOST}`;

const keyFile = readdirSync(join(ROOT, "public")).find((f) => /^[0-9a-f]{32}\.txt$/.test(f));
if (!keyFile) {
  console.error("No IndexNow key file (public/{32 hex characters}.txt) found.");
  process.exit(1);
}
const key = keyFile.replace(/\.txt$/, "");
if (readFileSync(join(ROOT, "public", keyFile), "utf8").trim() !== key) {
  console.error(`public/${keyFile} must contain only its own name's key.`);
  process.exit(1);
}

let urlList = process.argv.slice(2);
if (urlList.length === 0) {
  const res = await fetch(`${SITE}/sitemap.xml`);
  if (!res.ok) {
    console.error(`Could not read ${SITE}/sitemap.xml: HTTP ${res.status}`);
    process.exit(1);
  }
  const xml = await res.text();
  urlList = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}
urlList = urlList.filter((u) => u.startsWith(`${SITE}/`) || u === SITE);
if (urlList.length === 0) {
  console.error(`No ${SITE} URLs to submit.`);
  process.exit(1);
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key, keyLocation: `${SITE}/${key}.txt`, urlList }),
});
console.log(`IndexNow: submitted ${urlList.length} URL(s), HTTP ${res.status} ${res.statusText}`);
// 200 and 202 mean accepted. 403 means the key file is not live yet.
process.exit(res.status === 200 || res.status === 202 ? 0 : 1);
