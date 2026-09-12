#!/usr/bin/env node
/**
 * screenshots.mjs — zrzuty site/dist w prawdziwym WebKicie (Playwright) dla audytorów UI/motion.
 *
 * Node 24, zero npx. Wymaga JEDNORAZOWO pakietu playwright-core w katalogu BEZ „&” w ścieżce
 * (npm w tym repo łamie się na „&” i spacji):
 *   mkdir "%USERPROFILE%\.klarow-tools" && cd "%USERPROFILE%\.klarow-tools" && npm init -y && npm install playwright-core
 * oraz przeglądarki WebKit z cache Playwright (%LOCALAPPDATA%\ms-playwright\webkit-*\Playwright.exe —
 * jest po sesji 2026-07-24). Jeśli czegoś brakuje: skrypt wypisuje instrukcję i kończy z exit 0.
 *
 * Użycie:
 *   node ".claude/skills/klarow-guardian/scripts/screenshots.mjs" --out ".claude/work/audit/<data>/shots"
 *        [--routes / /narzedzia /oferta /faq /rodo /narzedzia/raport-zarzadczy]
 *        [--pw <katalog z node_modules/playwright-core>] [--webkit <Playwright.exe>] [--port 4173]
 *        [--only mobile|desktop] [--json <plik>]
 *
 * Co robi: własny serwer statyczny dist (bezrozszerzeniowe .html + SPA fallback, jak Cloudflare
 * Pages), potem dla każdej trasy × {mobile 390×844 dotyk, desktop 1440×900} × {normal, reduced-motion}
 * zrzut pełnej strony PNG + pomiary: przewijanie poziome (document.scrollWidth > innerWidth →
 * HIGH [a11y-safe-area-dvh]), błędy konsoli/JS i pusty #root (HIGH/BLOCKER [code-no-runtime-errors]),
 * liczba <h1> po JS (HIGH [a11y-headings-order-one-h1]), elementy z opacity:0 zawierające tekst
 * po 1,5 s (HIGH [motion-no-initial-hidden-above-fold]), canvas WebGL na mobile
 * (BLOCKER [perf-no-webgl-on-coarse]). ID = pliki rules/<id>.md strażnika.
 * Wyjście wg CONTRACT + JSONL (+ lista plików PNG). Deterministyczne nazwy plików.
 */
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import http from "node:http";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(__dirname, "..", "..", "..", "..");
const DIST = path.join(REPO_ROOT, "site", "dist");

const argv = process.argv.slice(2);
const opts = { out: path.join(REPO_ROOT, ".claude", "work", "audit", "shots"), routes: null, pw: null, webkit: null, port: 4173, only: null, json: null };
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === "--out") opts.out = argv[++i];
  else if (a === "--routes") {
    opts.routes = [];
    while (argv[i + 1] && !argv[i + 1].startsWith("--")) opts.routes.push(argv[++i]);
  } else if (a === "--pw") opts.pw = argv[++i];
  else if (a === "--webkit") opts.webkit = argv[++i];
  else if (a === "--port") opts.port = Number(argv[++i]);
  else if (a === "--only") opts.only = argv[++i];
  else if (a === "--json") opts.json = argv[++i];
  else if (a === "--help" || a === "-h") {
    console.log(fs.readFileSync(fileURLToPath(import.meta.url), "utf8").split("*/")[0].replace(/^\/\*\*?/, ""));
    process.exit(0);
  }
}
const toPosix = (p) => p.split(path.sep).join("/");
const rel = (abs) => toPosix(path.relative(REPO_ROOT, abs));

if (!fs.existsSync(path.join(DIST, "index.html"))) {
  console.log("screenshots: brak site/dist — zbuduj stronę (cd site && npm run build). exit 0");
  process.exit(0);
}

// ── playwright-core ──
const candidates = [opts.pw, process.env.PLAYWRIGHT_CORE_DIR, path.join(os.homedir(), ".klarow-tools"), process.cwd(), path.join(REPO_ROOT, "site")].filter(Boolean);
let pw = null;
let pwFrom = null;
for (const c of candidates) {
  try {
    const req = createRequire(path.join(c, "package.json"));
    pw = req("playwright-core");
    pwFrom = c;
    break;
  } catch {
    /* następny kandydat */
  }
}
if (!pw) {
  console.log(
    [
      "screenshots: brak pakietu playwright-core. Zainstaluj RAZ w katalogu bez „&” w ścieżce:",
      `  mkdir "${path.join(os.homedir(), ".klarow-tools")}" ; cd tam ; npm init -y ; npm install playwright-core`,
      "albo podaj --pw <katalog z node_modules/playwright-core>. exit 0 (zrzuty pominięte — wpisz „nie sprawdzano: zrzuty”).",
    ].join("\n")
  );
  process.exit(0);
}
// ── WebKit ──
let webkitExe = opts.webkit;
if (!webkitExe) {
  const cache = path.join(os.homedir(), "AppData", "Local", "ms-playwright");
  if (fs.existsSync(cache)) {
    const dirs = fs.readdirSync(cache).filter((d) => d.startsWith("webkit-")).sort((a, b) => Number(b.split("-")[1]) - Number(a.split("-")[1]));
    for (const d of dirs) {
      const exe = path.join(cache, d, "Playwright.exe");
      if (fs.existsSync(exe)) {
        webkitExe = exe;
        break;
      }
    }
  }
}
if (!webkitExe) {
  console.log("screenshots: brak WebKit w %LOCALAPPDATA%\\ms-playwright\\webkit-*\\Playwright.exe. Podaj --webkit <exe> albo zainstaluj (z katalogu bez „&”): node node_modules/playwright-core/cli.js install webkit. exit 0");
  process.exit(0);
}

// ── serwer statyczny (jak Cloudflare Pages: bezrozszerzeniowe .html + SPA fallback) ──
const MIME = { ".html": "text/html; charset=utf-8", ".js": "text/javascript", ".css": "text/css", ".png": "image/png", ".ico": "image/x-icon", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".xml": "application/xml", ".txt": "text/plain; charset=utf-8", ".json": "application/json", ".webp": "image/webp", ".mp4": "video/mp4", ".webm": "video/webm", ".jpg": "image/jpeg" };
const server = http.createServer((req, res) => {
  const url = decodeURIComponent((req.url || "/").split("?")[0]);
  let file = path.join(DIST, url);
  if (url.endsWith("/")) file = path.join(file, "index.html");
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    if (fs.existsSync(file + ".html")) file = file + ".html";
    else file = path.join(DIST, "index.html");
  }
  const ext = path.extname(file);
  res.writeHead(200, { "content-type": MIME[ext] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(opts.port, "127.0.0.1", r));
const base = `http://127.0.0.1:${opts.port}`;

// ── trasy ──
let routes = opts.routes;
if (!routes) {
  routes = ["/", "/narzedzia", "/oferta", "/faq"];
  if (fs.existsSync(path.join(DIST, "rodo.html"))) routes.push("/rodo");
  const tools = fs.existsSync(path.join(DIST, "narzedzia")) ? fs.readdirSync(path.join(DIST, "narzedzia")).filter((f) => f.endsWith(".html")).sort() : [];
  for (const t of tools.slice(0, 2)) routes.push("/narzedzia/" + t.replace(/\.html$/, ""));
}
const VIEWPORTS = [
  { name: "mobile", viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, isMobile: true, hasTouch: true },
  { name: "desktop", viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1, isMobile: false, hasTouch: false },
].filter((v) => !opts.only || v.name === opts.only);
const MOTION = ["normal", "reduced"];

fs.mkdirSync(opts.out, { recursive: true });
const findings = [];
const shots = [];
const add = (route, severity, rule, msg, ctx) => findings.push({ file: routeFile(route), line: 1, col: 1, severity, rule, msg: `${msg} [${ctx}]`, fix: null, confidence: "CONFIRMED", source: "build" });
const routeFile = (route) => rel(path.join(DIST, route === "/" ? "index.html" : route.slice(1) + ".html"));
const slug = (route) => (route === "/" ? "home" : route.slice(1).replace(/\//g, "_"));

const browser = await pw.webkit.launch({ executablePath: webkitExe, headless: true });
try {
  for (const route of routes) {
    for (const vp of VIEWPORTS) {
      for (const motion of MOTION) {
        const ctx = await browser.newContext({ viewport: vp.viewport, deviceScaleFactor: vp.deviceScaleFactor, isMobile: vp.isMobile, hasTouch: vp.hasTouch, reducedMotion: motion === "reduced" ? "reduce" : "no-preference", locale: "pl-PL" });
        const page = await ctx.newPage();
        const errors = [];
        page.on("pageerror", (e) => errors.push(String(e.message || e)));
        page.on("console", (m) => {
          if (m.type() === "error") errors.push(m.text());
        });
        await page.goto(base + route, { waitUntil: "networkidle", timeout: 30000 }).catch((e) => errors.push("goto: " + e.message));
        await page.waitForTimeout(1500);
        const probe = await page.evaluate(() => {
          const de = document.documentElement;
          const hiddenText = [...document.querySelectorAll("main *")].filter((el) => {
            const cs = getComputedStyle(el);
            return cs.opacity === "0" && el.textContent && el.textContent.trim().length > 20 && el.getBoundingClientRect().top < innerHeight * 3;
          }).length;
          return {
            scrollX: de.scrollWidth > innerWidth + 1,
            scrollWidth: de.scrollWidth,
            innerWidth,
            h1: document.querySelectorAll("h1").length,
            canvas: document.querySelectorAll("canvas").length,
            hiddenText,
            rootEmpty: !document.getElementById("root") || document.getElementById("root").children.length === 0,
          };
        });
        const file = path.join(opts.out, `${slug(route)}--${vp.name}--${motion}.png`);
        await page.screenshot({ path: file, fullPage: true }).catch((e) => errors.push("screenshot: " + e.message));
        shots.push(rel(file));
        const label = `${vp.name}/${motion}`;
        if (probe.scrollX) add(route, "HIGH", "a11y-safe-area-dvh", `strona przewija się poziomo (${probe.scrollWidth} > ${probe.innerWidth}px)`, label);
        if (probe.h1 !== 1) add(route, "HIGH", "a11y-headings-order-one-h1", `${probe.h1} × <h1> po starcie JS`, label);
        if (probe.hiddenText > 0) add(route, "HIGH", "motion-no-initial-hidden-above-fold", `${probe.hiddenText} elementów z tekstem w opacity:0 po 1,5 s`, label);
        if (vp.name === "mobile" && probe.canvas > 0) add(route, "BLOCKER", "perf-no-webgl-on-coarse", `canvas na urządzeniu dotykowym (${probe.canvas}) — iOS „samo tło”`, label);
        if (probe.rootEmpty) add(route, "BLOCKER", "code-no-runtime-errors", "#root pusty po starcie — React nie wstał", label);
        for (const e of [...new Set(errors)].slice(0, 5)) add(route, "HIGH", "code-no-runtime-errors", `błąd runtime: ${e.slice(0, 140)}`, label);
        await ctx.close();
      }
    }
  }
} finally {
  await browser.close();
  server.close();
}

const counts = { BLOCKER: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };
for (const f of findings) counts[f.severity]++;
const out = [`# screenshots: ${shots.length} zrzutów → ${rel(opts.out)} (playwright-core z ${pwFrom}; WebKit ${path.basename(path.dirname(webkitExe))})`];
for (const s of shots) out.push("  " + s);
const byFile = new Map();
for (const f of findings) {
  if (!byFile.has(f.file)) byFile.set(f.file, []);
  byFile.get(f.file).push(f);
}
for (const [file, list] of byFile) {
  out.push(`## ${file} (${list.length})`);
  for (const f of list) out.push(`${f.file}:${f.line} - ${f.severity} [${f.rule}] ${f.msg}`);
}
out.push("");
out.push(`Σ BLOCKER ${counts.BLOCKER} · HIGH ${counts.HIGH} · MEDIUM ${counts.MEDIUM} · LOW ${counts.LOW}`);
process.stdout.write(out.join("\n") + "\n");
if (opts.json) {
  const jp = path.isAbsolute(opts.json) ? opts.json : path.resolve(process.cwd(), opts.json);
  fs.mkdirSync(path.dirname(jp), { recursive: true });
  fs.writeFileSync(jp, findings.map((f) => JSON.stringify(f)).join("\n") + (findings.length ? "\n" : ""), "utf8");
}
process.exit(counts.BLOCKER ? 1 : 0);
