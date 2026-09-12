#!/usr/bin/env node
/**
 * verify-site.mjs — bramka buildu klarow.com (sprawdza site/dist po `npm run build`).
 *
 * Node 24, zero zależności, zero npx:
 *   node ".claude/skills/klarow-guardian/scripts/verify-site.mjs" [opcje]
 *
 * Gdy site/dist nie istnieje: wypisuje instrukcję buildu i kończy z exit 0 (to nie jest błąd
 * audytu, tylko brak artefaktu). Gdy istnieje, sprawdza:
 *   - liczbę statycznych HTML INDEKSOWANYCH, czyli bez 404.html i bez tras z <meta robots noindex>
 *     (v2: 19 plików na dysku = 5 tras + 13 podstron narzędzi + 404.html; z tego 17 indeksowanych,
 *     bo /rodo ma noindex do przeglądu radcy — po jego zdjęciu 18; 404.html sprawdzany osobno)
 *     vs --expected (domyślnie: liczba <url> w sitemap.xml,
 *     krzyżowo z liczbą slugów w src/data/tools.ts + trasy główne z pagesSeo.ts),
 *   - narzedzia.html: ≥ --min-tool-links (13) różnych linków do /narzedzia/<slug>,
 *   - sitemap.xml: każda trasa z dist ma <loc> i każdy <loc> ma HTML,
 *   - llms.txt istnieje i linkuje /narzedzia, /oferta, /faq (+ /rodo, jeśli trasa istnieje),
 *   - marka: 0 wystąpień „nuconic" i „FFA914" (case-insensitive) w całym dist (BLOCKER),
 *   - każdy HTML: <title> ≤ 60 zn., meta description 130–165 zn. (warn), dokładnie 1 <h1>,
 *     <main>, canonical, atrybut id o wartości seo-jsonld dokładnie raz (reguła seo-jsonld-per-kind),
 *     brak opacity:0 na treści shellu,
 *   - _headers/_redirects obecne w dist; alias /polityka-prywatnosci → /rodo gdy /rodo istnieje,
 *   - budżety chunków: assets/*.js gz (zlib, level 9) — chunk wejściowy (ze <script> w index.html)
 *     ≤ --budget (140 KB), CSS ≤ 20 KB, chunk z „motion" w nazwie ≤ 36 KB (HIGH przy przekroczeniu),
 *   - liczby w treści HTML vs references/allowed-numbers.md: liczby ≥ 4 cyfr lub z „%"
 *     nieobecne na liście → warn (MEDIUM) [brand-allowed-numbers-only]; lata 1990–2035, NAP, daty
 *     i wartości w JSON-LD/skryptach są wyłączone.
 *
 *   - baseline chunków `site/scripts/verify-site.baseline.json` (opcjonalny, tworzony świadomie przez
 *     --write-baseline): gdy istnieje, wzrost > +5 % względem zapisanych `homeGz`/`cssGz`/`motionGz`
 *     to finding MEDIUM [perf-chunk-size-gate]; gdy go nie ma, obowiązują budżety domyślne.
 *
 * Opcje: --dist <dir> (domyślnie site/dist) · --expected <n> · --min-tool-links <n> ·
 *        --budget <KB> · --json <plik> · --quiet · --write-baseline
 * Wyjście wg CONTRACT + JSONL; exit 1 przy BLOCKER (opcjonalnie --fail-on BLOCKER,HIGH).
 */
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..", "..", "..", "..");
const GUARDIAN = path.resolve(__dirname, "..");

const argv = process.argv.slice(2);
const opts = { dist: "site/dist", expected: null, minToolLinks: 13, budget: 140, json: null, quiet: false, failOn: ["BLOCKER"], writeBaseline: false };
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === "--dist") opts.dist = argv[++i];
  else if (a === "--expected") opts.expected = Number(argv[++i]);
  else if (a === "--min-tool-links") opts.minToolLinks = Number(argv[++i]);
  else if (a === "--budget") opts.budget = Number(argv[++i]);
  else if (a === "--json") opts.json = argv[++i];
  else if (a === "--quiet") opts.quiet = true;
  else if (a === "--fail-on") opts.failOn = String(argv[++i] || "").split(",").map((s) => s.trim().toUpperCase()).filter(Boolean);
  else if (a === "--write-baseline") opts.writeBaseline = true;
  else if (a === "--help" || a === "-h") {
    console.log(fs.readFileSync(__filename, "utf8").split("*/")[0].replace(/^\/\*\*?/, ""));
    process.exit(0);
  }
}

const DIST = path.isAbsolute(opts.dist) ? opts.dist : path.resolve(REPO_ROOT, opts.dist);
const CHUNK_BASELINE = path.resolve(REPO_ROOT, "site/scripts/verify-site.baseline.json");
const toPosix = (p) => p.split(path.sep).join("/");
const rel = (abs) => toPosix(path.relative(REPO_ROOT, abs));

if (!fs.existsSync(DIST) || !fs.existsSync(path.join(DIST, "index.html"))) {
  console.log(
    [
      `verify-site: brak ${rel(DIST)}/index.html — nie ma czego sprawdzać.`,
      "Zbuduj stronę (bez npx; ścieżka repo ma „&” i spację):",
      '  cd site && node node_modules/typescript/bin/tsc --noEmit && npm run build',
      "Potem uruchom ponownie ten skrypt. (exit 0 — brak artefaktu to nie jest naruszenie)",
    ].join("\n")
  );
  process.exit(0);
}

// ───────────────────────────── findings ─────────────────────────────
const findings = [];
const add = (file, line, severity, rule, msg, fix = null) =>
  findings.push({ file: rel(file), line: line || 1, col: 1, severity, rule, msg, fix, confidence: "CONFIRMED", source: "build" });
const lineOfIndex = (content, idx) => (idx < 0 ? 1 : content.slice(0, idx).split("\n").length);

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const allFiles = walk(DIST);
const htmlFiles = allFiles.filter((p) => p.endsWith(".html") && path.basename(p) !== "404.html");
const routeOf = (p) => {
  const r = toPosix(path.relative(DIST, p)).replace(/\.html$/, "");
  return r === "index" ? "/" : "/" + r.replace(/\/index$/, "");
};
const routes = htmlFiles.map(routeOf).sort();
const has404 = allFiles.some((p) => path.basename(p) === "404.html");

// Trasy z <meta name="robots" content="noindex"> są celowo POZA sitemapą (dziś: /rodo do czasu
// przeglądu radcy — rules/legal-rodo-page-required.md). Liczba plików na dysku i liczba <url>
// w sitemapie to więc DWIE różne liczby; porównujemy sitemapę z trasami INDEKSOWANYMI.
const isNoindex = (p) => {
  try {
    const head = fs.readFileSync(p, "utf8").slice(0, 8192);
    return /<meta[^>]+name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(head);
  } catch {
    return false;
  }
};
const noindexRoutes = htmlFiles.filter(isNoindex).map(routeOf).sort();
const indexableRoutes = routes.filter((r) => !noindexRoutes.includes(r));

// ───────────────────────────── 1. liczba HTML ─────────────────────────────
const sitemapPath = path.join(DIST, "sitemap.xml");
const sitemap = fs.existsSync(sitemapPath) ? fs.readFileSync(sitemapPath, "utf8") : "";
const sitemapUrls = [...sitemap.matchAll(/<loc>\s*([^<\s]+)\s*<\/loc>/g)].map((m) => m[1].replace(/^https?:\/\/[^/]+/, "") || "/").map((u) => (u === "" ? "/" : u));
let expected = opts.expected;
let expectedSource = "--expected";
if (!expected) {
  expected = sitemapUrls.length;
  expectedSource = "sitemap.xml";
}
// krzyżowo: slugi z tools.ts + trasy z pagesSeo.ts
const toolsTs = path.join(REPO_ROOT, "site/src/data/tools.ts");
const pagesSeoTs = path.join(REPO_ROOT, "site/src/data/pagesSeo.ts");
let expectedFromSrc = null;
if (fs.existsSync(toolsTs) && fs.existsSync(pagesSeoTs)) {
  const slugs = new Set([...fs.readFileSync(toolsTs, "utf8").matchAll(/^\s*slug:\s*["']([a-z0-9-]+)["']/gm)].map((m) => m[1]));
  const pages = fs.readFileSync(pagesSeoTs, "utf8");
  // Klucze bierzemy z CIAŁA obiektu PAGES_SEO, nie z parametru Record<…>: parametr bywa aliasem
  // typu (`Record<PageKey, PageSeo>`) i wtedy liczyłby się jako jedna „trasa" (fałszywy HIGH, F0).
  // Bierzemy WYŁĄCZNIE ciało literału PAGES_SEO (do pierwszego "\n};"), bo dalej w pliku
  // stoją inne obiekty z kluczami na tym samym wcięciu (h1, line, toHome dla 404).
  const start = pages.indexOf("PAGES_SEO");
  const body = start < 0 ? "" : pages.slice(start, pages.indexOf("\n};", start) + 1);
  const pageKeys = new Set([...body.matchAll(/^\s{2}([a-zA-Z][a-zA-Z0-9]*)\s*:\s*\{/gm)].map((m) => m[1]));
  // 404.html liczy się osobno (has404), więc klucz notFound wypada z porównania z htmlFiles.
  const pageRoutes = [...pageKeys].filter((k) => k !== "notFound" && k !== "404");
  expectedFromSrc = slugs.size + pageRoutes.length;
}
const counted = expectedSource === "sitemap.xml" ? indexableRoutes.length : htmlFiles.length;
if (counted !== expected) {
  add(
    sitemapPath,
    1,
    "BLOCKER",
    "seo-prerender-must-keep",
    `statycznych HTML ${expectedSource === "sitemap.xml" ? "indeksowanych" : ""}: ${counted}, oczekiwano ${expected} (wg ${expectedSource}); na dysku ${htmlFiles.length} + ${has404 ? 1 : 0} × 404.html, noindex: ${noindexRoutes.length ? noindexRoutes.join(", ") : "brak"}`,
    "sprawdź prerenderAll() w src/prerender/entry.tsx i scripts/prerender.mjs",
  );
}
if (expectedFromSrc !== null && expectedFromSrc !== htmlFiles.length) {
  add(toolsTs, 1, "HIGH", "seo-prerender-must-keep", `źródła (tools.ts slugi + pagesSeo.ts trasy) sugerują ${expectedFromSrc} tras, dist ma ${htmlFiles.length}`, "nowa trasa musi trafić do prerenderAll() + pagesSeo.ts");
}

// ───────────────────────────── 2. hub narzędzi ─────────────────────────────
const hubPath = path.join(DIST, "narzedzia.html");
if (!fs.existsSync(hubPath)) add(hubPath, 1, "BLOCKER", "seo-links-in-dom", "brak narzedzia.html (hub 13 narzędzi)");
else {
  const hub = fs.readFileSync(hubPath, "utf8");
  const links = new Set([...hub.matchAll(/href=["'](?:https?:\/\/klarow\.com)?(\/narzedzia\/[a-z0-9-]+)["']/g)].map((m) => m[1]));
  if (links.size < opts.minToolLinks) add(hubPath, 1, "BLOCKER", "seo-links-in-dom", `narzedzia.html ma ${links.size} linków /narzedzia/<slug>, minimum ${opts.minToolLinks}`);
}

// ───────────────────────────── 3. sitemap ↔ dist ─────────────────────────────
if (!sitemap) add(sitemapPath, 1, "BLOCKER", "seo-sitemap-llms-generated", "brak sitemap.xml w dist (ma być generowany przy buildzie)");
else {
  for (const r of indexableRoutes) if (!sitemapUrls.includes(r)) add(sitemapPath, 1, "HIGH", "seo-sitemap-llms-generated", `trasa ${r} ma HTML, ale brak jej w sitemap.xml`);
  for (const r of noindexRoutes) if (sitemapUrls.includes(r)) add(sitemapPath, 1, "HIGH", "seo-sitemap-llms-generated", `trasa ${r} ma noindex, a mimo to jest w sitemap.xml — usuń <loc> albo zdejmij noindex`);
  for (const u of sitemapUrls) if (!routes.includes(u)) add(sitemapPath, lineOfIndex(sitemap, sitemap.indexOf(u)), "HIGH", "seo-sitemap-llms-generated", `sitemap ma ${u}, ale brak ${u === "/" ? "index" : u.slice(1)}.html w dist`);
  if (/<lastmod>/.test(sitemap) === false) add(sitemapPath, 1, "LOW", "seo-sitemap-llms-generated", "sitemap bez <lastmod> (opcjonalne; data z gita)");
}
if (fs.existsSync(path.join(REPO_ROOT, "site/public/sitemap.xml"))) add(path.join(REPO_ROOT, "site/public/sitemap.xml"), 1, "BLOCKER", "seo-sitemap-llms-generated", "ręczny public/sitemap.xml — usuń, sitemap jest generowany z tools.ts");

// ───────────────────────────── 4. llms.txt ─────────────────────────────
const llmsPath = path.join(DIST, "llms.txt");
if (!fs.existsSync(llmsPath)) add(llmsPath, 1, "BLOCKER", "seo-sitemap-llms-generated", "brak llms.txt w dist");
else {
  const llms = fs.readFileSync(llmsPath, "utf8");
  for (const must of ["/narzedzia", "/oferta", "/faq", ...(routes.includes("/rodo") ? ["/rodo"] : [])]) {
    if (!llms.includes("klarow.com" + must)) add(llmsPath, 1, "HIGH", "seo-sitemap-llms-generated", `llms.txt nie linkuje ${must}`);
  }
  if (!/^# /m.test(llms)) add(llmsPath, 1, "MEDIUM", "seo-sitemap-llms-generated", "llms.txt bez nagłówka H1 (spec llms.txt)");
}

// ───────────────────────────── 5. marka w dist ─────────────────────────────
const TEXT_EXT = new Set([".html", ".js", ".css", ".txt", ".xml", ".json", ".svg", ".map", ""]);
for (const p of allFiles) {
  if (!TEXT_EXT.has(path.extname(p))) continue;
  const c = fs.readFileSync(p, "utf8");
  if (c.includes("\0")) continue;
  let m;
  const reN = /nuconic/gi;
  while ((m = reN.exec(c))) add(p, lineOfIndex(c, m.index), "BLOCKER", "brand-no-nuconic", "„Nuconic” w artefakcie publicznym (CLAUDE.md #3)");
  const reG = /ffa914/gi;
  while ((m = reG.exec(c))) add(p, lineOfIndex(c, m.index), "BLOCKER", "brand-no-gold", "złoto #FFA914 w artefakcie publicznym");
}

// ───────────────────────────── 6. każdy HTML ─────────────────────────────
const stripToText = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;| /g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ");

for (const p of htmlFiles) {
  const html = fs.readFileSync(p, "utf8");
  const title = (html.match(/<title>([^<]*)<\/title>/i) || [])[1];
  if (!title) add(p, 1, "HIGH", "seo-pageseo-single-source", "brak <title>");
  else if (title.trim().length > 60) add(p, lineOfIndex(html, html.indexOf("<title>")), "MEDIUM", "seo-pageseo-single-source", `title ${title.trim().length} zn. (> 60; Google ucina ~55–60)`);
  const desc = (html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i) || html.match(/<meta\s+content=["']([^"']*)["']\s+name=["']description["']/i) || [])[1];
  if (!desc) add(p, 1, "HIGH", "seo-pageseo-single-source", "brak meta description");
  else if (desc.length < 130 || desc.length > 165) add(p, lineOfIndex(html, html.indexOf(desc)), "MEDIUM", "seo-pageseo-single-source", `description ${desc.length} zn. (poza 130–165)`);
  const h1 = (html.match(/<h1\b/gi) || []).length;
  if (h1 !== 1) add(p, 1, "HIGH", "seo-prerender-must-keep", `${h1} × <h1> (ma być dokładnie 1)`);
  if (!/<main\b/i.test(html)) add(p, 1, "HIGH", "a11y-main-and-skip-link", "brak <main>");
  if (!/<link\s+rel=["']canonical["']/i.test(html)) add(p, 1, "HIGH", "seo-pageseo-single-source", "brak <link rel=\"canonical\">");
  const jsonld = (html.match(/id=["']seo-jsonld["']/g) || []).length;
  // komunikat cytuje ATRYBUT wstrzykiwany przez prerender (id o wartości seo-jsonld), nie ID reguły
  if (jsonld !== 1) add(p, 1, "HIGH", "seo-jsonld-per-kind", `atrybut id o wartości seo-jsonld × ${jsonld} (ma być dokładnie 1; inaczej podwójny/nieaktualny JSON-LD po starcie Reacta)`);
  for (const m of html.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    try {
      JSON.parse(m[1]);
    } catch {
      add(p, lineOfIndex(html, m.index), "HIGH", "seo-jsonld-per-kind", "JSON-LD nie parsuje się (sekwencje $ w prerender.mjs?)");
    }
  }
  const root = html.match(/<div id=["']root["']>([\s\S]*?)<\/div>\s*<script/i);
  if (root && root[1].trim().length < 200) add(p, lineOfIndex(html, html.indexOf('id="root"')), "HIGH", "seo-prerender-must-keep", "shell w #root prawie pusty — treść bez JS niewidoczna dla botów");
  if (/style=["'][^"']*opacity:\s*0/i.test(html)) add(p, lineOfIndex(html, html.search(/opacity:\s*0/i)), "HIGH", "motion-no-initial-hidden-above-fold", "opacity:0 inline w statycznym HTML — treść zależy od animacji");
  if (!/<html[^>]*\blang=/i.test(html)) add(p, 1, "MEDIUM", "a11y-lang", "brak atrybutu lang na <html>");
  if (/https?:\/\/(fonts\.googleapis|fonts\.gstatic|cdnjs|unpkg|esm\.sh|cdn\.jsdelivr|picsum\.photos|images\.unsplash)/i.test(html)) add(p, 1, "BLOCKER", "integ-no-external-scripts-on-site", "zewnętrzny CDN w HTML (fonty/skrypty/obrazy mają być self-hosted)");
}
if (!has404) add(path.join(DIST, "404.html"), 1, "MEDIUM", "seo-404-noindex-real-404", "brak dist/404.html (trasa * + noindex) — soft-404 dla nieistniejących adresów");
else {
  const c = fs.readFileSync(path.join(DIST, "404.html"), "utf8");
  if (!/noindex/i.test(c)) add(path.join(DIST, "404.html"), 1, "MEDIUM", "seo-404-noindex-real-404", "404.html bez <meta name=\"robots\" content=\"noindex\">");
}

// ───────────────────────────── 7. _headers / _redirects ─────────────────────────────
const headersPath = path.join(DIST, "_headers");
if (!fs.existsSync(headersPath)) add(headersPath, 1, "HIGH", "media-headers-versioning", "brak _headers w dist (HTML no-cache, /assets/* immutable)");
else {
  const h = fs.readFileSync(headersPath, "utf8");
  if (!/no-cache/.test(h)) add(headersPath, 1, "HIGH", "media-headers-versioning", "_headers bez Cache-Control: no-cache dla HTML");
  if (!/\/assets\/\*[\s\S]*immutable/.test(h)) add(headersPath, 1, "HIGH", "media-headers-versioning", "_headers bez immutable dla /assets/*");
  if (!/\/fonts\/\*[\s\S]*immutable/.test(h)) add(headersPath, 1, "MEDIUM", "media-headers-versioning", "_headers bez immutable dla /fonts/*");
}
const redirectsPath = path.join(DIST, "_redirects");
if (!fs.existsSync(redirectsPath)) add(redirectsPath, 1, "HIGH", "seo-redirects-registry", "brak _redirects (SPA fallback /* /index.html 200)");
else {
  const rd = fs.readFileSync(redirectsPath, "utf8");
  if (!/^\/\*\s+\/index\.html\s+200/m.test(rd)) add(redirectsPath, 1, "HIGH", "seo-redirects-registry", "_redirects bez SPA fallbacku „/* /index.html 200”");
  if (routes.includes("/rodo") && !/^\/polityka-prywatnosci\s+\/rodo\s+301/m.test(rd)) add(redirectsPath, 1, "BLOCKER", "legal-rodo-page-required", "brak aliasu 301: /polityka-prywatnosci → /rodo w _redirects");
}
if (!routes.includes("/rodo")) add(path.join(DIST, "rodo.html"), 1, "BLOCKER", "legal-rodo-page-required", "brak trasy /rodo (klauzula art. 14 RODO + polityka prywatności; twardy warunek przed pierwszym kontaktem handlowym)", "pagesSeo.ts → RodoPage w App.tsx → RodoShell w entry.tsx prerenderAll() → link w stopce");

// ───────────────────────────── 8. budżety chunków ─────────────────────────────
const indexHtml = fs.readFileSync(path.join(DIST, "index.html"), "utf8");
const entryScripts = [...indexHtml.matchAll(/<script[^>]*src=["']\/?(assets\/[^"']+\.js)["']/g)].map((m) => m[1]);
const entryCss = [...indexHtml.matchAll(/<link[^>]*href=["']\/?(assets\/[^"']+\.css)["']/g)].map((m) => m[1]);
const modulePreload = [...indexHtml.matchAll(/<link[^>]*rel=["']modulepreload["'][^>]*href=["']\/?(assets\/[^"']+\.js)["']/g)].map((m) => m[1]);
const gz = (p) => zlib.gzipSync(fs.readFileSync(p), { level: 9 }).length;
const kb = (n) => (n / 1024).toFixed(1);
const assetsDir = path.join(DIST, "assets");
const chunkReport = [];
if (fs.existsSync(assetsDir)) {
  let entryTotal = 0;
  for (const f of fs.readdirSync(assetsDir).sort()) {
    const p = path.join(assetsDir, f);
    if (!/\.(js|css)$/.test(f)) continue;
    const g = gz(p);
    const relName = "assets/" + f;
    const isEntry = entryScripts.includes(relName) || modulePreload.includes(relName) || entryCss.includes(relName);
    chunkReport.push({ name: relName, gz: g, isEntry });
    if (isEntry && f.endsWith(".js")) entryTotal += g;
    if (f.endsWith(".css") && g > 20 * 1024) add(p, 1, "MEDIUM", "perf-chunk-size-gate", `CSS ${kb(g)} KB gz > 20 KB`);
    if (/motion/i.test(f) && g > 36 * 1024) add(p, 1, "HIGH", "motion-bundle-budget-motion", `chunk Motion ${kb(g)} KB gz > 36 KB (domMax / pełny motion?)`);
    if (/pdfmake|vfs_fonts/i.test(f) && isEntry) add(p, 1, "HIGH", "code-lazy-routes-and-dashboards", `${f} ładowany na starcie — pdfmake ma być lazy (import() przy kliknięciu)`);
    if (/glsl|three/i.test(f) && isEntry) add(p, 1, "HIGH", "code-lazy-routes-and-dashboards", `${f} ładowany na starcie — three.js tylko lazy na desktopie`);
  }
  if (entryTotal > opts.budget * 1024) add(path.join(DIST, "index.html"), 1, "HIGH", "perf-js-budget-home", `JS wejściowy home ${kb(entryTotal)} KB gz > budżet ${opts.budget} KB`, "React.lazy dla ToolPage/dashboardów/BookingModal; sprawdź, co wciąga index-*.js");

  // ── baseline chunków (site/scripts/verify-site.baseline.json) ──
  // Plik jest OPCJONALNY i powstaje świadomie: `verify-site.mjs --write-baseline` po pierwszym
  // zielonym buildzie (commit „Perf: nowy baseline chunków (powód)”). Gdy istnieje, pilnuje
  // REGRESJI (> +5 % względem zapisanej wartości) obok twardych budżetów wyżej; gdy go nie ma,
  // obowiązują wyłącznie budżety domyślne, a skrypt mówi, jak go utworzyć.
  const motionGz = chunkReport.filter((c) => /motion/i.test(c.name)).reduce((a, c) => Math.max(a, c.gz), 0);
  const cssGz = chunkReport.filter((c) => c.name.endsWith(".css") && c.isEntry).reduce((a, c) => a + c.gz, 0);
  const current = { homeGz: entryTotal, cssGz, motionGz };
  if (opts.writeBaseline) {
    fs.mkdirSync(path.dirname(CHUNK_BASELINE), { recursive: true });
    fs.writeFileSync(CHUNK_BASELINE, JSON.stringify(current, null, 2) + "\n", "utf8");
    if (!opts.quiet) console.error(`[verify-site] zapisano baseline chunków: ${rel(CHUNK_BASELINE)} (${JSON.stringify(current)})`);
  } else if (fs.existsSync(CHUNK_BASELINE)) {
    let base = {};
    try {
      base = JSON.parse(fs.readFileSync(CHUNK_BASELINE, "utf8"));
    } catch {
      add(CHUNK_BASELINE, 1, "MEDIUM", "perf-chunk-size-gate", "baseline chunków nie jest poprawnym JSON-em — napraw albo odtwórz przez --write-baseline");
    }
    for (const [key, label] of [["homeGz", "JS wejściowy home"], ["cssGz", "CSS wejściowy"], ["motionGz", "chunk Motion"]]) {
      const b = Number(base[key]);
      if (!b || !current[key]) continue;
      if (current[key] > b * 1.05) {
        add(path.join(DIST, "index.html"), 1, "MEDIUM", "perf-chunk-size-gate", `${label} ${kb(current[key])} KB gz > baseline ${kb(b)} KB + 5 %`, "uzasadnij wzrost i podbij baseline commitem „Perf: nowy baseline chunków (powód)” albo zetnij chunk");
      }
    }
  } else if (!opts.quiet) {
    console.error(`[verify-site] brak ${rel(CHUNK_BASELINE)} — obowiązują budżety domyślne; po pierwszym zielonym buildzie v2 utwórz go przez --write-baseline`);
  }
}

// ───────────────────────────── 9. liczby vs allowed-numbers.md ─────────────────────────────
const allowedPath = path.join(GUARDIAN, "references", "allowed-numbers.md");
if (!fs.existsSync(allowedPath)) {
  add(allowedPath, 1, "MEDIUM", "brand-allowed-numbers-only", "brak references/allowed-numbers.md — audyt liczb w dist pominięty (utwórz listę liczb ze źródłem)");
} else {
  const allowedRaw = fs.readFileSync(allowedPath, "utf8");
  const normNum = (s) => s.replace(/[\s ]/g, "").replace(",", ".");
  const allowed = new Set();
  for (const m of allowedRaw.matchAll(/(\d[\d\s ]*(?:[.,]\d+)?)(\s?%)?/g)) {
    const n = normNum(m[1]);
    if (!n) continue;
    allowed.add(n + (m[2] ? "%" : ""));
    allowed.add(n);
  }
  const builtin = new Set(["786296426", "48786296426", "121212", "2026"]);
  const seenNum = new Set();
  for (const p of htmlFiles) {
    const text = stripToText(fs.readFileSync(p, "utf8"));
    for (const m of text.matchAll(/(?<![\w.,-])(\d{1,3}(?:[  ]\d{3})+|\d{4,}|\d+(?:[.,]\d+)?(?=\s?%))(\s?%)?/g)) {
      const raw = m[1];
      const pct = !!m[2];
      const n = normNum(raw);
      if (builtin.has(n)) continue;
      const asInt = Number(n);
      if (!pct && Number.isInteger(asInt) && asInt >= 1990 && asInt <= 2035) continue; // lata
      if (!pct && /^\d{1,2}\.\d{2}\.\d{4}$/.test(raw)) continue; // daty
      const key = n + (pct ? "%" : "");
      if (allowed.has(key) || allowed.has(n)) continue;
      const dedupeKey = rel(p) + "|" + key;
      if (seenNum.has(dedupeKey)) continue;
      seenNum.add(dedupeKey);
      add(p, 1, "MEDIUM", "brand-allowed-numbers-only", `liczba „${raw}${pct ? "%" : ""}” w treści bez wpisu w allowed-numbers.md`, "dopisz liczbę ze źródłem do references/allowed-numbers.md albo usuń z copy");
    }
  }
}

// ───────────────────────────── wyjście ─────────────────────────────
const SEV_ORDER = { BLOCKER: 0, HIGH: 1, MEDIUM: 2, LOW: 3 };
findings.sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line || a.rule.localeCompare(b.rule));
const counts = { BLOCKER: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
for (const f of findings) counts[f.severity]++;

if (!opts.quiet) {
  const out = [];
  out.push(`# verify-site: ${rel(DIST)} — ${htmlFiles.length} HTML na dysku (${indexableRoutes.length} indeksowanych, oczekiwano ${expected} wg ${expectedSource}; noindex: ${noindexRoutes.length ? noindexRoutes.join(", ") : "brak"}), ${sitemapUrls.length} URL w sitemap, 404.html: ${has404 ? "jest" : "brak"}`);
  if (chunkReport.length) {
    out.push("## chunki (gzip level 9)");
    for (const c of chunkReport) out.push(`  ${c.isEntry ? "•" : "·"} ${c.name}  ${kb(c.gz)} KB gz${c.isEntry ? "  (start)" : "  (lazy)"}`);
  }
  const byFile = new Map();
  for (const f of findings) {
    if (!byFile.has(f.file)) byFile.set(f.file, []);
    byFile.get(f.file).push(f);
  }
  for (const [file, list] of byFile) {
    const maxSev = list.reduce((acc, f) => (SEV_ORDER[f.severity] < SEV_ORDER[acc] ? f.severity : acc), "LOW");
    out.push(`## ${file} (${list.length}, ${maxSev})`);
    for (const f of list) {
      out.push(`${f.file}:${f.line} - ${f.severity} [${f.rule}] ${f.msg}`);
      if (f.fix) out.push(`  → fix: ${f.fix}`);
    }
  }
  const passCount = htmlFiles.filter((p) => !byFile.has(rel(p))).length;
  out.push("");
  out.push(`Σ BLOCKER ${counts.BLOCKER} · HIGH ${counts.HIGH} · MEDIUM ${counts.MEDIUM} · LOW ${counts.LOW} · ✓ pass ${passCount} plików HTML`);
  process.stdout.write(out.join("\n") + "\n");
}
if (opts.json) {
  const jp = path.isAbsolute(opts.json) ? opts.json : path.resolve(process.cwd(), opts.json);
  fs.mkdirSync(path.dirname(jp), { recursive: true });
  fs.writeFileSync(jp, findings.map((f) => JSON.stringify(f)).join("\n") + (findings.length ? "\n" : ""), "utf8");
}
process.exit(findings.some((f) => opts.failOn.includes(f.severity)) ? 1 : 0);
