#!/usr/bin/env node
/**
 * og.mjs — deterministyczny generator kart społecznościowych 1200×630 (`perf-images-policy`).
 *
 * Node 24, ZERO zależności npm, nigdy `npx`. Uruchamiaj z katalogu `site`:
 *   node scripts/og.mjs                 # 19 kart do public/og/
 *   node scripts/og.mjs --only faq      # jedna karta (klucz trasy albo slug narzędzia)
 *   node scripts/og.mjs --verify        # regeneracja do katalogu tymczasowego + porównanie sha256
 *
 * Co robi: składa szablon HTML/SVG na TOKENACH czytanych wprost z `src/styles/tokens.css`
 * (zero drugiej palety, `design-tokens-only`), wypełnia go tytułami z `src/data/pagesSeo.ts`
 * i katalogiem z `src/data/tools.ts` (jedno źródło, `seo-pageseo-single-source`), po czym
 * rasteryzuje headless Chromium z `file://`. Tło jest PIONOWYM gradientem stalowym: to
 * tymczasowy grunt, dopóki nie powstanie faktura z zewnętrznego generatora (plan §7.3 H3),
 * i jednocześnie jedyny kształt gradientu, który PNG kompresuje do kilkudziesięciu kilobajtów
 * (gradient ukośny w tym samym kadrze dawał 169 KB zamiast 29 KB).
 *
 * Determinizm (`demo-determinism`, `media-recorded-demo-determinism`): zero `Date`, zero
 * `Math.random`, zero sieci. Font jest wbudowany w HTML jako `data:`, więc rasteryzacja nie
 * zależy od fontów systemowych. Te same dane wejściowe dają ten sam plik co do bajtu
 * (bramka: `--verify`).
 *
 * Nie wchodzi do `npm run build`: karty są plikami statycznymi w `public/og/`, a CI Cloudflare
 * Pages nie ma przeglądarki. Uruchamiamy lokalnie po KAŻDEJ zmianie tytułów w `pagesSeo.ts`
 * albo nazw i hooków w `tools.ts` i commitujemy wynik.
 *
 * Czego NIE robi: nie generuje obrazów modelem, nie pobiera niczego z sieci, nie dotyka
 * `public/media/`. Karty są w `public/og/`, które NIE jest `immutable` w `public/_headers`,
 * więc nazwy nie mają sufiksu wersji (`media-headers-versioning` dotyczy `/media/` i `/thumbs/`).
 */
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
import { registerHooks } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";

const SITE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SRC = path.join(SITE, "src");
const MAX_BYTES = 200 * 1024; // limit z perf-images-policy (wiersz „OG per trasa")
const W = 1200;
const H = 630;

// ───────────────────────────── argumenty ─────────────────────────────
const argv = process.argv.slice(2);
const opts = { out: path.join(SITE, "public", "og"), only: null, verify: false, chrome: null, lang: "pl" };
for (let i = 0; i < argv.length; i++) {
  const a = argv[i];
  if (a === "--out") opts.out = path.resolve(argv[++i]);
  else if (a === "--only") opts.only = argv[++i];
  else if (a === "--chrome") opts.chrome = argv[++i];
  else if (a === "--lang") opts.lang = argv[++i] === "en" ? "en" : "pl";
  else if (a === "--verify") opts.verify = true;
  else if (a === "--help" || a === "-h") {
    process.stdout.write(fs.readFileSync(fileURLToPath(import.meta.url), "utf8").split("*/")[0] + "*/\n");
    process.exit(0);
  } else throw new Error(`nieznany argument: ${a}`);
}

// ──────────────── dane z TS: alias @/ rozwiązywany w locie ────────────────
/* Node 24 sam zdejmuje typy z `.ts`; brakuje mu tylko aliasu `@/…` z tsconfig,
   więc dokładamy synchroniczny hook resolve. Dzięki temu skrypt czyta TE SAME
   moduły co aplikacja i prerender, zamiast trzymać kopię tytułów (`code-single-source-copy`). */
registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/")) {
      const base = path.resolve(SRC, specifier.slice(2));
      for (const candidate of [`${base}.ts`, `${base}.tsx`, base, path.join(base, "index.ts")]) {
        if (fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
          return { url: pathToFileURL(candidate).href, shortCircuit: true };
        }
      }
    }
    return nextResolve(specifier, context);
  },
});

const { PAGES_SEO } = await import(pathToFileURL(path.join(SRC, "data", "pagesSeo.ts")).href);
const { getTools } = await import(pathToFileURL(path.join(SRC, "data", "tools.ts")).href);

/* Trasy: klucz z pagesSeo → nazwa pliku i ścieżka kanoniczna. Nazwy plików są ścieżkowe
   (`narzedzia`, `404`), bo `og:image` wpina się per trasa i ma być czytelny w podglądzie. */
const ROUTES = [
  { key: "home", slug: "home", path: "/" },
  { key: "tools", slug: "narzedzia", path: "/narzedzia" },
  { key: "oferta", slug: "oferta", path: "/oferta" },
  { key: "faq", slug: "faq", path: "/faq" },
  { key: "rodo", slug: "rodo", path: "/rodo" },
  { key: "notFound", slug: "404", path: "/404" },
];

/* Tytuł karty = tytuł SEO trasy bez powtórzonej marki: wordmark stoi już w lewym górnym rogu.
   Zdejmujemy wyłącznie prefiks „Klarow: ” i sufiks „ | Klarow”; „Klarow” w środku zdania
   („Oferta Klarow: pilot…”) zostaje, bo jest częścią zdania, a nie doklejoną sygnaturą. */
function cardTitle(title) {
  let t = title.replace(/\s*\|\s*Klarow\s*$/u, "").replace(/^Klarow:\s*/u, "");
  if (t !== title) t = t.charAt(0).toLocaleUpperCase("pl-PL") + t.slice(1);
  return t;
}

/* Etykieta dowodu na kartach narzędzi. Do czasu, aż powstanie komponent chipa dowodu
   (faza 2), to jedyne miejsce z tą parą zdań; wtedy przenieść do wspólnego modułu. */
const PROOF = {
  demo: { pl: "Demo na danych przykładowych", en: "Demo on sample data" },
  product: { pl: "Własny produkt", en: "Our own product" },
};

/* Podtytuł (hook z tools.ts) odpada, gdy powtarza nazwę: „Protokoły robocizny" +
   „Protokoły robocizny do faktury" to jedna linia przeczytana dwa razy. Próg liczony
   z pokrycia SŁÓW, więc wynik jest ten sam przy każdym przebiegu i przy każdym języku. */
function tooSimilar(title, sub) {
  const words = (s) =>
    [...new Set(s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").split(/[^a-z0-9]+/).filter((w) => w.length > 2))];
  const inTitle = words(title);
  const inSub = words(sub);
  if (!inSub.length) return true;
  return inSub.filter((w) => inTitle.includes(w)).length / inSub.length >= 0.6;
}

function cards() {
  const lang = opts.lang;
  const out = ROUTES.map((r) => ({
    slug: r.slug,
    path: r.path,
    title: cardTitle(PAGES_SEO[r.key].title[lang]),
    sub: "",
    chip: "",
  }));
  for (const tool of getTools(lang)) {
    out.push({
      slug: tool.slug,
      path: `/narzedzia/${tool.slug}`,
      title: tool.name,
      sub: tooSimilar(tool.name, tool.hook) ? "" : tool.hook,
      chip: (tool.kind === "demo" ? PROOF.demo : PROOF.product)[lang],
    });
  }
  return opts.only ? out.filter((c) => c.slug === opts.only) : out;
}

// ──────────────── tokeny: jedyne źródło kolorów to tokens.css ────────────────
function readTokens() {
  const css = fs.readFileSync(path.join(SRC, "styles", "tokens.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  const raw = new Map();
  /* bierzemy wyłącznie bloki `:root` (motyw ciemny); `[data-theme="light"]` pomijamy,
     bo karta społecznościowa jest zawsze ciemna (`design-page-theme-lock`) */
  for (const block of css.matchAll(/:root\s*\{([^}]*)\}/g)) {
    for (const decl of block[1].matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/gi)) raw.set(decl[1], decl[2].trim());
  }
  const resolve = (value, depth = 0) => {
    if (depth > 8) throw new Error(`cykl w tokenach: ${value}`);
    return value.replace(/var\((--[a-z0-9-]+)\)/gi, (_, name) => {
      if (!raw.has(name)) throw new Error(`brak tokenu ${name} w tokens.css`);
      return resolve(raw.get(name), depth + 1);
    });
  };
  const need = [
    "--background", "--surface", "--border", "--accent", "--accent-text",
    "--accent-a12", "--accent-a35", "--foreground-strong", "--foreground-muted",
    "--foreground-faint", "--steel-900",
  ];
  return need.map((name) => `${name}: ${resolve(raw.get(name) ?? "")};`).join("\n    ");
}

function fontFace() {
  /* font wbudowany: rasteryzacja nie może zależeć od tego, co jest zainstalowane w systemie */
  const dir = path.join(SITE, "public", "fonts");
  return ["NunitoSans-var-latin.woff2", "NunitoSans-var-latin-ext.woff2"]
    .map((file) => {
      const b64 = fs.readFileSync(path.join(dir, file)).toString("base64");
      return `@font-face{font-family:"Nunito Sans";font-style:normal;font-weight:200 1000;
      src:url(data:font/woff2;base64,${b64}) format("woff2")}`;
    })
    .join("\n");
}

// ──────────────── szablon karty ────────────────
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** stopień pisma tytułu wybierany z DŁUGOŚCI, nie z pomiaru: ta sama liczba przy każdym przebiegu */
function titleSize(title) {
  const n = title.length;
  if (n <= 24) return 70;
  if (n <= 40) return 60;
  if (n <= 56) return 52;
  return 44;
}

function cardHtml(card, tokens, fonts) {
  const fs1 = titleSize(card.title);
  return `<!doctype html><html lang="${opts.lang}"><meta charset="utf-8"><style>
${fonts}
:root{
    ${tokens}
}
*{margin:0;padding:0;box-sizing:border-box}
html,body{width:${W}px;height:${H}px;overflow:hidden}
body{background:linear-gradient(180deg,var(--steel-900) 0%,var(--background) 58%,var(--background) 100%);
  font-family:"Nunito Sans",sans-serif;-webkit-font-smoothing:antialiased;
  display:flex;flex-direction:column;padding:60px 72px}
.wordmark{font-weight:800;font-size:27px;letter-spacing:.15em;color:var(--foreground-strong)}
.rule{height:1px;background:var(--border);margin:26px 0 0}
.mid{flex:1;display:flex;flex-direction:column;justify-content:center;max-width:1000px}
.tick{width:72px;height:3px;background:var(--accent);margin-bottom:30px}
h1{font-weight:800;font-size:${fs1}px;line-height:1.12;letter-spacing:-.01em;color:var(--foreground-strong);
  text-wrap:balance;
  max-height:${Math.round(fs1 * 1.12 * 3)}px;overflow:hidden}
.sub{margin-top:22px;font-weight:600;font-size:27px;line-height:1.35;color:var(--foreground-muted)}
.bot{display:flex;align-items:center;justify-content:space-between;gap:24px}
.path{font-weight:600;font-size:21px;color:var(--foreground-muted)}
.chip{font-weight:700;font-size:19px;color:var(--accent-text);background:var(--accent-a12);
  border:1px solid var(--accent-a35);border-radius:9999px;padding:9px 20px;white-space:nowrap}
</style>
<div class="wordmark">KLAROW</div>
<div class="rule"></div>
<div class="mid"><div class="tick"></div><h1>${esc(card.title)}</h1>${card.sub ? `<p class="sub">${esc(card.sub)}</p>` : ""}</div>
<div class="bot"><span class="path">klarow.com${esc(card.path === "/" ? "" : card.path)}</span>${
    card.chip ? `<span class="chip">${esc(card.chip)}</span>` : ""
  }</div>
</html>`;
}

// ──────────────── rasteryzacja: headless Chromium z file:// ────────────────
/* Kolejność szukania przeglądarki: zmienna OG_CHROME → cache Playwrighta (ten sam binarny
   Chromium, którego używają zrzuty narzędzi) → Edge/Chrome systemowy → PATH.
   Zero `npx`, zero instalacji: skrypt ma działać na maszynie foundera i na CI. */
function findChrome() {
  const tried = [];
  const push = (p) => {
    if (p) tried.push(p);
    return p && fs.existsSync(p) ? p : null;
  };
  if (opts.chrome) {
    const explicit = push(opts.chrome);
    if (explicit) return explicit;
    throw new Error(`--chrome wskazuje na nieistniejący plik: ${opts.chrome}`);
  }
  const fromEnv = push(process.env.OG_CHROME);
  if (fromEnv) return fromEnv;

  const cache = process.env.PLAYWRIGHT_BROWSERS_PATH || path.join(os.homedir(), "AppData", "Local", "ms-playwright");
  if (fs.existsSync(cache)) {
    const dirs = fs.readdirSync(cache).sort().reverse(); // najwyższy build, deterministycznie
    for (const dir of dirs) {
      const candidate =
        (dir.startsWith("chromium_headless_shell-") &&
          path.join(cache, dir, "chrome-headless-shell-win64", "chrome-headless-shell.exe")) ||
        (dir.startsWith("chromium-") && path.join(cache, dir, "chrome-win64", "chrome.exe"));
      const hit = push(candidate || null);
      if (hit) return hit;
    }
  }
  const system = [
    "C:/Program Files/Google/Chrome/Application/chrome.exe",
    "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
    "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
    "/usr/bin/google-chrome",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ];
  for (const p of system) {
    const hit = push(p);
    if (hit) return hit;
  }
  throw new Error(`nie znaleziono Chromium. Ustaw OG_CHROME albo --chrome. Sprawdzone:\n  ${tried.join("\n  ")}`);
}

function shoot(chrome, htmlFile, pngFile, profile) {
  execFileSync(
    chrome,
    [
      "--headless",
      "--disable-gpu",
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--hide-scrollbars",
      "--disable-lcd-text", // wygładzanie w skali szarości: mniejszy PNG i ten sam wynik na każdej maszynie
      "--font-render-hinting=none",
      "--force-device-scale-factor=1",
      `--user-data-dir=${profile}`,
      `--window-size=${W},${H}`,
      `--screenshot=${pngFile}`,
      "--virtual-time-budget=4000",
      pathToFileURL(htmlFile).href,
    ],
    { stdio: ["ignore", "ignore", "pipe"] },
  );
}

// ──────────────── przebieg ────────────────
const list = cards();
if (!list.length) throw new Error(`--only ${opts.only}: brak takiej trasy ani narzędzia`);

const tokens = readTokens();
const fonts = fontFace();
const chrome = findChrome();
const work = path.join(os.tmpdir(), "klarow-og-work");
fs.rmSync(work, { recursive: true, force: true });
fs.mkdirSync(path.join(work, "profile"), { recursive: true });

const target = opts.verify ? path.join(work, "verify") : opts.out;
fs.mkdirSync(target, { recursive: true });

const rows = [];
for (const card of list) {
  const htmlFile = path.join(work, `${card.slug}.html`);
  const pngFile = path.join(target, `${card.slug}.png`);
  fs.writeFileSync(htmlFile, cardHtml(card, tokens, fonts), "utf8");
  shoot(chrome, htmlFile, pngFile, path.join(work, "profile"));
  const buf = fs.readFileSync(pngFile);
  rows.push({ slug: card.slug, bytes: buf.length, sha: crypto.createHash("sha256").update(buf).digest("hex") });
}

let failed = 0;
for (const row of rows) {
  const kb = (row.bytes / 1024).toFixed(1).padStart(7);
  let note = "";
  if (row.bytes > MAX_BYTES) {
    note = `  PRZEKROCZONY LIMIT ${MAX_BYTES / 1024} KB`;
    failed++;
  }
  if (opts.verify) {
    const current = path.join(opts.out, `${row.slug}.png`);
    if (!fs.existsSync(current)) {
      note += "  BRAK PLIKU W public/og";
      failed++;
    } else if (crypto.createHash("sha256").update(fs.readFileSync(current)).digest("hex") !== row.sha) {
      note += "  ROZNA SUMA SHA256 (niedeterminizm albo nieaktualny plik)";
      failed++;
    }
  }
  process.stdout.write(`${row.slug.padEnd(26)} ${kb} KB  ${row.sha.slice(0, 12)}${note}\n`);
}
const total = rows.reduce((sum, r) => sum + r.bytes, 0);
process.stdout.write(
  `\n${rows.length} kart ${opts.verify ? "zweryfikowanych" : "zapisanych do " + path.relative(SITE, opts.out)}` +
    `, razem ${(total / 1024).toFixed(1)} KB, największa ${(Math.max(...rows.map((r) => r.bytes)) / 1024).toFixed(1)} KB\n`,
);
fs.rmSync(work, { recursive: true, force: true });
process.exit(failed ? 1 : 0);
