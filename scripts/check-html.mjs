import { readFile } from "node:fs/promises";
import vm from "node:vm";

const html = await readFile(new URL("../index.html", import.meta.url), "utf8");
const fail = (message) => { console.error(`FAIL: ${message}`); process.exitCode = 1; };
const ok = (condition, message) => condition ? console.log(`PASS: ${message}`) : fail(message);

ok(/^<!doctype html>/i.test(html), "HTML5 doctype is present");
ok((html.match(/<title>[\s\S]*?<\/title>/i) || []).length === 1, "exactly one page title exists");
const description = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i)?.[1] ?? "";
ok(description.length > 0 && description.length < 155, "page description is present and under 155 characters");
ok((html.match(/<link\s+rel=["']canonical["']/gi) || []).length === 1, "one canonical URL exists");
ok(!/name=["']keywords["']/i.test(html), "obsolete meta keywords tag is absent");
ok(!/fonts\.(googleapis|gstatic)\.com/i.test(html), "no external Google Fonts request remains");
ok((html.match(/<img\b/gi) || []).length === 1, "only the hero portrait is an image element");
ok(/fetchpriority=["']high["']/.test(html), "hero portrait has high fetch priority");
ok(!/href=["']#["']/.test(html), "no empty placeholder links remain");

const ids = [...html.matchAll(/\bid=["']([^"']+)["']/gi)].map((m) => m[1]);
const duplicates = ids.filter((id, i) => ids.indexOf(id) !== i);
ok(duplicates.length === 0, duplicates.length ? `duplicate IDs: ${[...new Set(duplicates)].join(", ")}` : "element IDs are unique");
const idSet = new Set(ids);
const missingAnchors = [...html.matchAll(/href=["']#([^"'\s]+)["']/gi)].map((m) => m[1]).filter((id) => !idSet.has(id));
ok(missingAnchors.length === 0, missingAnchors.length ? `missing anchor targets: ${[...new Set(missingAnchors)].join(", ")}` : "all in-page links have a target");

for (const match of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)) {
  const attrs = match[1];
  const body = match[2];
  if (/type=["']application\/ld\+json["']/i.test(attrs)) {
    try { JSON.parse(body); console.log("PASS: JSON-LD is valid JSON"); }
    catch { fail("JSON-LD is invalid JSON"); }
  } else if (!/src=/i.test(attrs)) {
    try { new vm.Script(body); console.log("PASS: inline JavaScript parses"); }
    catch (error) { fail(`inline JavaScript syntax: ${error.message}`); }
  }
}

const robots = await readFile(new URL("../robots.txt", import.meta.url), "utf8");
const sitemap = await readFile(new URL("../sitemap.xml", import.meta.url), "utf8");
ok(robots.includes("Sitemap: https://umarilyas803-hub.github.io/sitemap.xml"), "robots.txt points to the sitemap");
ok(sitemap.includes("<loc>https://umarilyas803-hub.github.io/</loc>"), "sitemap includes the canonical homepage");
if (process.exitCode) process.exit(process.exitCode);
