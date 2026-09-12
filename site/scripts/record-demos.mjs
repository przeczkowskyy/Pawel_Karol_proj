#!/usr/bin/env node
/*
 * site/scripts/record-demos.mjs  (faza F1, zero kredytow)
 *
 * Nagrywa PRAWDZIWE narzedzia z `site/dist` i produkuje pliki wideo do `site/public/media/`:
 *   N1  hero            dashboard-produkcji      8 s, 1600x1000, bez petli (WebM VP9 + MP4 + poster WebP)
 *   N2  klip ekranu     raport-zarzadczy         6 s,  960x600,  petla     (WebM VP9 + poster WebP)
 *   N3  klip ekranu     audyt-jakosci-danych     6 s,  960x600,  petla
 *   N4  klip ekranu     import-z-rekoncyliacja   6 s,  960x600,  petla
 *   N5  klip ekranu     os-czasu-zadan           6 s,  960x600,  petla
 *
 * Specyfikacja: docs/plan/strona-v2-plan.md par. 7.5a i par. 3 (S1); reguly straznika
 * media-recorded-demo-determinism, media-video-budgets, media-poster-first-frame.
 *
 * Potok jest DWUETAPOWY (kontener z Playwrighta nigdy nie trafia do repo):
 *   1. nagraj w kontekscie deterministycznym (zamrozony Date, Math.random = mulberry32(0xC10A12)),
 *   2. wyodrebnij klatki PNG 24 fps, policz sha256 kazdej klatki i digest listy,
 *   3. re-enkoduj z klatek na stalych 24 fps CFR; dopiero ten plik idzie do public/media.
 *
 * Uruchamianie (zawsze `node` wprost, `npx` w tym repo nie dziala):
 *   set PW_CORE=<katalog playwright-core poza sciezka ze znakiem &>
 *   node scripts/record-demos.mjs
 *   node scripts/record-demos.mjs --only os-czasu-zadan
 *   node scripts/record-demos.mjs --verify          (drugi przebieg, porownanie z manifestem, nic nie zapisuje)
 *   node scripts/record-demos.mjs --contact-sheet   (arkusz stop-klatek do przegladu, scratchpad)
 *
 * Bramka poczatku ujecia: w kontekscie zyje pasek "klaps" na dole viewportu (bialy w czasie
 * rozbiegu, czarny od chwili t0). Pasek jest WYCINANY z finalnego kadru, a jego przejscie
 * w czern znajduje `blackdetect`, wiec poczatek ujecia wyznacza tresc, nie zegar.
 */

import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { createServer } from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

/* ---------- sciezki i CLI ---------- */

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.resolve(HERE, "..");
const DIST = path.join(SITE, "dist");
const OUT_DIR = path.join(SITE, "public", "media");
const MANIFEST = path.join(SITE, "media", "CLIPS.json");

const argv = process.argv.slice(2);
const flag = (name) => argv.includes(name);
const arg = (name) => {
  const hit = argv.find((a) => a === name || a.startsWith(name + "="));
  if (!hit) return null;
  if (hit.includes("=")) return hit.slice(hit.indexOf("=") + 1);
  return argv[argv.indexOf(hit) + 1] ?? null;
};

const PORT = Number(arg("--port") ?? 8771);
const ENGINE = arg("--engine") ?? "chromium";
const ONLY = arg("--only");
const VERIFY = flag("--verify");
const CONTACT_SHEET = flag("--contact-sheet");
const KEEP = flag("--keep");

const WORK = path.join(process.env.KLAROW_WORK ?? process.env.TEMP ?? "/tmp", "klarow-record");

/* Zamrozony czas i ziarno: te same wartosci co w shoot-tools.mjs (par. 7.5a). */
const FROZEN_ISO = "2026-07-22T09:00:00.000Z";
const SEED = 0xc10a12;

/* Pasek klapsa: wysokosc doliczana do viewportu i wycinana z finalnego kadru. */
const BAND = 32;
/* Domkniecie petli: ogon wtopiony w glowe (par. 7.5a). */
const LOOP_FADE = 0.4;
/* Prog powtarzalnosci dla --verify: PSNR nowego nagrania wobec opublikowanego pliku.
   Ponizej tego progu scena pokazuje INNY stan narzedzia, nie sam szum dekodera. */
const VERIFY_PSNR_MIN = 38;

/* ---------- sceny ----------
 * Kroki wylacznie na rolach i widocznym tekscie: components/dashboards i DemoReport.tsx
 * sa w v1 zamrozone (plan par. 12.1), wiec nie wolno dokladac tam `data-shot`.
 * Kazdy krok cytuje etykiete i linie zrodla; brak trafienia = twardy blad z nazwa sluga.
 */

const SCENES = [
  {
    id: "N1",
    slug: "dashboard-produkcji",
    scene: "tydzien-przelicza",
    file: "hero-production-v1.webm",
    mp4: "hero-production-v1.mp4",
    dir: OUT_DIR,
    view: { w: 1600, h: 1000 },
    out: { w: 1600, h: 1000 },
    seconds: 8.0,
    loop: false,
    /* Kadr hero ma byc kadrem PRODUKTU, nie kawalkiem podstrony: wezszy kontener plus
       powiekszenie samego dashboardu wypelniaja 1600x1000 trescia narzedzia i podnosza
       czytelnosc cyfr po zmniejszeniu kadru w hero. Styl istnieje wylacznie w nagraniu. */
    style: ".max-w-6xl{max-width:1460px}\n[data-dashboard]{zoom:1.06}",
    anchor: "center",
    async prepare({ page, buttonByName }) {
      /* rozbicie na etapy otwarte JUZ przed ujeciem: wysokosc dashboardu jest stala przez
         cale ujecie (bez skoku kadru w polowie), a suwak przelicza rowniez rozbicie */
      const tile = await buttonByName(/Hala Poznań/);
      await tile.click();
      await page.getByText(/Rozbicie na etapy/).first().waitFor({ state: "visible" });
    },
    budget: 1258291,
    mp4Budget: 1468006,
    crfLadder: [20, 22, 24, 26, 28, 30, 32, 34, 36, 38, 40],
    x264Ladder: [18, 20, 22, 24, 26, 28],
    poster: { file: "hero-production-v1.webp", max: 112640, quality: [92, 88, 84, 80, 74, 70] },
    posterMobile: { file: "hero-production-v1-800.webp", width: 800, max: 56320, quality: [92, 88, 84, 80, 74, 70] },
    async steps({ page, hold, sliderByName, buttonByName }) {
      /* stan wyjsciowy: tydzien T35 (ProductionDashboard.tsx:157 useState(WEEKS - 4)) */
      await hold(1300);
      /* suwak tygodnia, aria-label z T.pl.week (ProductionDashboard.tsx:92, 199) */
      const week = await sliderByName("Tydzień");
      await week.press("ArrowRight"); /* T35 -> T36: KPI i kafle przeliczaja sie */
      await page.getByText("T36", { exact: true }).first().waitFor({ state: "visible" });
      await hold(2800);
      /* kafel hali, ktora po przeliczeniu stoi na statusie "Obserwuj" (ProductionDashboard.tsx:214) */
      const tile = await buttonByName(/Biurowiec Łódź/);
      await tile.click();
      /* rozbicie na etapy (ProductionDashboard.tsx:103, 273) */
      await page.getByText(/Rozbicie na etapy/).first().waitFor({ state: "visible" });
      await hold(3800);
    },
  },
  {
    id: "N2",
    slug: "raport-zarzadczy",
    scene: "przyklad-kpi-wykres",
    file: "tools/raport-zarzadczy-v1.webm",
    dir: OUT_DIR,
    view: { w: 1280, h: 800 },
    out: { w: 960, h: 600 },
    seconds: 6.4,
    loop: true,
    anchor: 16,
    budget: 327680,
    crfLadder: [24, 26, 28, 30, 32, 34, 36, 38, 40, 42],
    poster: { file: "tools/raport-zarzadczy-v1-480.webp", width: 480, max: 30720, quality: [92, 88, 84, 80, 74, 70] },
    async steps({ page, hold, buttonByName }) {
      await hold(900);
      /* DemoReport.tsx:38 loadExample + przycisk pustego stanu (DemoReport.tsx:361) */
      const load = await buttonByName(/Załaduj przykładowe dane/, "last");
      await load.click();
      /* DemoReport.tsx:59 chartTitle */
      await page.getByText(/Koszt vs zaawansowanie/).first().waitFor({ state: "visible" });
      await hold(5500);
    },
  },
  {
    id: "N3",
    slug: "audyt-jakosci-danych",
    scene: "macierz-werdykt",
    file: "tools/audyt-jakosci-danych-v1.webm",
    dir: OUT_DIR,
    view: { w: 1280, h: 800 },
    out: { w: 960, h: 600 },
    seconds: 6.4,
    loop: true,
    anchor: 16,
    budget: 327680,
    crfLadder: [24, 26, 28, 30, 32, 34, 36, 38, 40, 42],
    poster: { file: "tools/audyt-jakosci-danych-v1-480.webp", width: 480, max: 30720, quality: [92, 88, 84, 80, 74, 70] },
    async steps({ page, hold, buttonByName }) {
      await hold(900);
      /* QualityGate.tsx:39 loadExample + przycisk pustego stanu (QualityGate.tsx:241) */
      const load = await buttonByName(/Załaduj przykład/, "last");
      await load.click();
      /* QualityGate.tsx:57 matrix */
      await page.getByText(/Macierz pewności/).first().waitFor({ state: "visible" });
      await hold(5500);
    },
  },
  {
    id: "N4",
    slug: "import-z-rekoncyliacja",
    scene: "pass-co-do-grosza",
    file: "tools/import-z-rekoncyliacja-v1.webm",
    dir: OUT_DIR,
    view: { w: 1280, h: 800 },
    out: { w: 960, h: 600 },
    seconds: 6.4,
    loop: true,
    anchor: 16,
    budget: 327680,
    crfLadder: [24, 26, 28, 30, 32, 34, 36, 38, 40, 42],
    poster: { file: "tools/import-z-rekoncyliacja-v1-480.webp", width: 480, max: 30720, quality: [92, 88, 84, 80, 74, 70] },
    async steps({ page, hold, buttonByName }) {
      await hold(1000);
      /* ImportReconciliation.tsx:83 run + przycisk (ImportReconciliation.tsx:179) */
      const run = await buttonByName(/Uruchom import \(TEST\)/);
      await run.click();
      /* ImportReconciliation.tsx:85 pass */
      await page.getByText(/REKONCYLIACJA: PASS/).first().waitFor({ state: "visible" });
      await hold(5400);
    },
  },
  {
    id: "N5",
    slug: "os-czasu-zadan",
    scene: "skala-dzien-dryf",
    file: "tools/os-czasu-zadan-v1.webm",
    dir: OUT_DIR,
    view: { w: 1280, h: 800 },
    out: { w: 960, h: 600 },
    seconds: 6.4,
    loop: true,
    anchor: 16,
    budget: 327680,
    crfLadder: [24, 26, 28, 30, 32, 34, 36, 38, 40, 42],
    /* Szerszy kontener: przy 1104 px os czasu nie miesci sie w karcie, wiec wlasne
       auto-przewiniecie chowa kolumne nazw zadan i w kadrze zostaja anonimowe paski.
       Po poszerzeniu caly wykres (nazwy + oba snapshoty) siedzi w kadrze bez przewijania. */
    style: ".max-w-6xl{max-width:1430px}",
    poster: { file: "tools/os-czasu-zadan-v1-480.webp", width: 480, max: 30720, quality: [92, 88, 84, 80, 74, 70] },
    async steps({ hold, sliderByName, pressRepeat }) {
      await hold(800);
      /* TaskTimeline.tsx:75 selected + suwak wybranej daty (TaskTimeline.tsx:209):
         stalowa linia przejezdza przez ogony obsuwy i wraca na "Dzis", wiec ostatnia
         klatka wraca do pierwszej i petla nie ma spawu */
      const day = await sliderByName("Wybrana data");
      await pressRepeat(day, "ArrowRight", 38, 45);
      await hold(400);
      await pressRepeat(day, "ArrowLeft", 38, 45);
      await hold(1300);
    },
  },
];

/* ---------- narzedzia zewnetrzne ---------- */

function fail(msg) {
  console.error("BLAD: " + msg);
  process.exit(1);
}

function resolveFfmpeg() {
  const probe = (bin) => spawnSync(bin, ["-version"], { encoding: "utf8" }).status === 0;
  const fromEnv = process.env.FFMPEG;
  if (fromEnv && probe(fromEnv)) return fromEnv;
  if (probe("ffmpeg")) return "ffmpeg";
  const winget = path.join(process.env.LOCALAPPDATA ?? "", "Microsoft", "WinGet", "Packages");
  if (fs.existsSync(winget)) {
    for (const d of fs.readdirSync(winget)) {
      if (!d.startsWith("Gyan.FFmpeg")) continue;
      const base = path.join(winget, d);
      for (const b of fs.readdirSync(base)) {
        const exe = path.join(base, b, "bin", "ffmpeg.exe");
        if (fs.existsSync(exe) && probe(exe)) return exe;
      }
    }
  }
  fail(
    "brak ffmpeg. Zainstaluj: winget install --id Gyan.FFmpeg -e. Build ffmpeg dolaczony do Playwrighta " +
      "ma tylko libvpx_vp8 (bez VP9, x264 i WebP) i nie nadaje sie do produkcji plikow.",
  );
  return "";
}

const FFMPEG = resolveFfmpeg();
const FFPROBE = FFMPEG === "ffmpeg" ? "ffprobe" : path.join(path.dirname(FFMPEG), "ffprobe.exe");

function ff(args, { capture = false } = {}) {
  const r = spawnSync(FFMPEG, ["-hide_banner", "-nostdin", ...args], { encoding: "utf8", maxBuffer: 1 << 26 });
  if (r.status !== 0 && !capture) fail("ffmpeg zwrocil " + r.status + "\n" + (r.stderr ?? "").slice(-2500));
  return (r.stderr ?? "") + (r.stdout ?? "");
}

function ffprobeJson(file) {
  const r = spawnSync(
    FFPROBE,
    [
      "-v", "error",
      "-count_frames",
      "-show_entries", "stream=codec_type,width,height,r_frame_rate,nb_read_frames,pix_fmt",
      "-show_entries", "format=duration",
      "-of", "json",
      file,
    ],
    { encoding: "utf8", maxBuffer: 1 << 26 },
  );
  if (r.status !== 0) fail("ffprobe zwrocil " + r.status + "\n" + (r.stderr ?? ""));
  return JSON.parse(r.stdout);
}

async function loadPlaywright() {
  const raw = process.env.PW_CORE;
  if (!raw) {
    fail(
      "ustaw PW_CORE na katalog pakietu playwright-core (poza sciezka ze znakiem &). " +
        "Instalacja: w katalogu bez znaku & wykonaj  npm install --no-save playwright-core",
    );
  }
  const candidates = [raw, path.join(raw, "index.js"), path.join(raw, "node_modules", "playwright-core", "index.js")];
  for (const c of candidates) {
    if (!fs.existsSync(c) || !fs.statSync(c).isFile()) continue;
    const mod = await import(pathToFileURL(c).href);
    /* playwright-core jest pakietem CJS: silniki siedza raz w namespace, raz w `default` */
    return mod.chromium ? mod : mod.default;
  }
  return fail("PW_CORE nie wskazuje na playwright-core: " + raw);
}

function resolveBrowserExe(engine) {
  const root = path.join(process.env.LOCALAPPDATA ?? "", "ms-playwright");
  if (!fs.existsSync(root)) fail("brak cache przegladarek Playwrighta: " + root);
  const prefix = engine === "webkit" ? "webkit-" : "chromium-";
  const dirs = fs
    .readdirSync(root)
    .filter((d) => d.startsWith(prefix))
    .sort((a, b) => Number(b.slice(prefix.length)) - Number(a.slice(prefix.length)));
  for (const d of dirs) {
    const exe =
      engine === "webkit" ? path.join(root, d, "Playwright.exe") : path.join(root, d, "chrome-win64", "chrome.exe");
    if (fs.existsSync(exe)) return { exe, build: d };
  }
  return fail("nie znalazlem silnika " + engine + " w " + root);
}

/* ---------- serwer statyczny (bez SPA-fallbacku) ---------- */

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
};

function startServer() {
  const srv = createServer((req, res) => {
    let p = decodeURIComponent(new URL(req.url, "http://127.0.0.1").pathname);
    if (p.endsWith("/")) p += "index.html";
    let file = path.join(DIST, p);
    if (!file.startsWith(DIST)) {
      res.writeHead(403);
      res.end();
      return;
    }
    if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      /* prerenderowane podstrony: /narzedzia/<slug> -> dist/narzedzia/<slug>.html */
      if (fs.existsSync(file + ".html")) file += ".html";
      else {
        res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
        res.end("404 " + p);
        return;
      }
    }
    res.writeHead(200, {
      "content-type": MIME[path.extname(file)] ?? "application/octet-stream",
      "cache-control": "no-store",
    });
    fs.createReadStream(file).pipe(res);
  });
  return new Promise((ok, no) => {
    srv.once("error", no);
    srv.listen(PORT, "127.0.0.1", () => ok(srv));
  });
}

/* ---------- determinizm w kontekscie strony ---------- */

const INIT_SCRIPT = ({ frozenIso, seed, band }) => {
  /* zamrozony czas: konstruktor bezargumentowy i Date.now widza jedna chwile */
  const T = new Date(frozenIso).getTime();
  const RealDate = Date;
  function FrozenDate(...a) {
    return a.length === 0 ? new RealDate(T) : new RealDate(...a);
  }
  FrozenDate.prototype = RealDate.prototype;
  FrozenDate.now = () => T;
  FrozenDate.parse = RealDate.parse;
  FrozenDate.UTC = RealDate.UTC;
  window.Date = FrozenDate;

  /* mulberry32: ten sam strumien liczb przy kazdym przebiegu */
  let s = seed >>> 0;
  Math.random = () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  try {
    localStorage.clear();
    sessionStorage.clear();
  } catch {
    /* tryb prywatny: brak dostepu do magazynu nie jest bledem */
  }

  /* klaps: bialy pasek w czasie rozbiegu, czarny od t0; wycinany z finalnego kadru */
  const install = () => {
    if (document.getElementById("klarow-clap")) return;
    const d = document.createElement("div");
    d.id = "klarow-clap";
    d.setAttribute("aria-hidden", "true");
    d.style.cssText =
      "position:fixed;left:0;right:0;bottom:0;height:" +
      band +
      "px;background:#ffffff;z-index:2147483647;pointer-events:none"; // token-exempt: klaps nie jest UI, tylko znacznikiem dla blackdetect (czysta biel), i jest wycinany z kadru
    (document.body || document.documentElement).appendChild(d);
  };
  if (document.body) install();
  else document.addEventListener("DOMContentLoaded", install);
};

const STYLE_QUIET = [
  "*{caret-color:transparent!important}",
  "*:focus-visible{outline:none!important}",
  "::-webkit-scrollbar{display:none}",
  "header{display:none!important}",
  /* podpowiedz nad dashboardem nalezy do podstrony, nie do narzedzia: w kadrze zostaje samo narzedzie */
  "div:has(> [data-dashboard]) > p{visibility:hidden}",
  /* Animowane tlo WebGL (GLSLHills w .bg-layer) gasi sie na czas nagrania: jest sterowane
     zegarem, wiec psulo powtarzalnosc klatek, zjadalo bitrate przeznaczony na cyfry UI
     i wnosilo drugi ruchomy plan do kadru narzedzia. Zostaje statyczny gradient .bg-layer. */
  ".bg-layer > *{display:none!important}",
].join("\n");

/* ---------- nagranie jednej sceny ---------- */

async function record(pw, scene, dirs) {
  const { exe, build } = resolveBrowserExe(ENGINE);
  const browser = await pw[ENGINE].launch({
    executablePath: exe,
    args: ENGINE === "chromium" ? ["--force-color-profile=srgb", "--disable-lcd-text"] : [],
  });
  const size = { width: scene.view.w, height: scene.view.h + BAND };
  const ctx = await browser.newContext({
    viewport: size,
    deviceScaleFactor: 1,
    recordVideo: { dir: dirs.raw, size },
    colorScheme: "dark",
    locale: "pl-PL",
    timezoneId: "Europe/Warsaw",
    hasTouch: false,
    reducedMotion: "no-preference" /* trescia nagrania sa wlasne reveale dashboardu */,
  });
  await ctx.addInitScript(INIT_SCRIPT, { frozenIso: FROZEN_ISO, seed: SEED, band: BAND });

  const page = await ctx.newPage();
  const started = Date.now();
  const url = "http://127.0.0.1:" + PORT + "/narzedzia/" + scene.slug;
  const resp = await page.goto(url, { waitUntil: "load" });
  if (!resp || resp.status() !== 200) {
    throw new Error("[" + scene.slug + "] " + url + " zwrocil " + (resp ? resp.status() : "brak odpowiedzi"));
  }

  await page.addStyleTag({ content: STYLE_QUIET + (scene.style ? "\n" + scene.style : "") });

  /* jawny sygnal gotowosci z DashboardMount (src/motion/DashboardMount.tsx, ReadyFlag) */
  await page.locator("[data-dashboard]").scrollIntoViewIfNeeded();
  await page.waitForSelector("[data-dashboard][data-ready='true']", { timeout: 20000 });
  await page.waitForSelector("[data-dashboard] .skel", { state: "detached", timeout: 20000 });
  await page.waitForFunction(() => document.fonts.status === "loaded", null, { timeout: 20000 });

  const helpers = {
    page,
    hold: (ms) => page.waitForTimeout(ms),
    async buttonByName(name, which = "first") {
      const loc = page.getByRole("button", { name });
      if ((await loc.count()) === 0) throw new Error("[" + scene.slug + "] brak przycisku " + name);
      return which === "last" ? loc.last() : loc.first();
    },
    async sliderByName(name) {
      const loc = page.getByRole("slider", { name });
      if ((await loc.count()) === 0) throw new Error("[" + scene.slug + "] brak suwaka " + name);
      return loc.first();
    },
    async textByName(text) {
      const loc = page.getByText(text, { exact: true });
      if ((await loc.count()) === 0) throw new Error("[" + scene.slug + "] brak tekstu " + text);
      return loc.first();
    },
    /* Powtarzane wciskanie klawisza: wartosc zmienia sie o jeden krok co ~2 klatki, wiec
       w kadrze widac RUCH, a nie przeskok, i przejazd tam ma dokladnie taka sama liczbe
       krokow jak przejazd z powrotem (stan koncowy = stan poczatkowy, petla bez spawu).
       Mysz odpada: klikniecie w sciezke suwaka skacze wartoscia, a Playwright i tak nie
       rysuje kursora, wiec scena i tak musi czytac sie ZMIANA STANU, nie "klikiem". */
    async pressRepeat(locator, key, times, gapMs) {
      for (let i = 0; i < times; i++) {
        await locator.press(key);
        await page.waitForTimeout(gapMs);
      }
    },
  };

  /* stan wyjsciowy sceny ustawiany PRZED ujeciem: klatka 0 (czyli poster) ma byc juz
     spokojna, bez resztek animacji z przygotowania */
  if (scene.prepare) {
    await scene.prepare(helpers);
    await page.waitForTimeout(700);
  }

  /* Kadrowanie liczone PO przygotowaniu sceny, bo dopiero wtedy dashboard ma swoja
     docelowa wysokosc: "center" srodkuje narzedzie w ujeciu, liczba = tyle pikseli
     nad gorna krawedzia dashboardu. */
  await page.evaluate(
    ({ pad, frame }) => {
      const el = document.querySelector("[data-dashboard]");
      const box = el.getBoundingClientRect();
      const gap = pad === "center" ? Math.max(0, Math.round((frame - box.height) / 2)) : pad;
      window.scrollTo({ top: Math.max(0, Math.round(box.top + window.scrollY - gap)), behavior: "instant" });
    },
    { pad: scene.anchor, frame: scene.view.h },
  );
  await page.waitForTimeout(500); /* wyciszenie po przewinieciu */

  /* t0: klaps gasnie (bialy -> czarny). Od tej klatki liczy sie ujecie. */
  await page.evaluate(() => {
    const d = document.getElementById("klarow-clap");
    if (d) d.style.background = "#000000"; // token-exempt: czysta czern to sygnal dla blackdetect, nie kolor interfejsu
  });
  const t0Wall = (Date.now() - started) / 1000;

  await scene.steps(helpers);

  await page.waitForTimeout(700); /* bufor ogona: ostatnia klatka ujecia nie jest ostatnia klatka pliku */
  const video = page.video();
  await ctx.close();
  const raw = await video.path();
  await browser.close();
  return { raw, t0Wall, engine: build };
}

/* ---------- potok klatek i enkodowanie ---------- */

function sha256(buf) {
  return createHash("sha256").update(buf).digest("hex");
}

function detectClapStart(raw, scene) {
  const crop = "crop=" + scene.view.w + ":" + BAND + ":0:" + scene.view.h;
  const log = ff(["-i", raw, "-vf", crop + ",blackdetect=d=0.08:pic_th=0.95:pix_th=0.12", "-an", "-f", "null", "-"], {
    capture: true,
  });
  const starts = [...log.matchAll(/black_start:([0-9.]+)/g)].map((m) => Number(m[1]));
  if (!starts.length) throw new Error("[" + scene.slug + "] nie znalazlem klapsa (pasek nie zmienil sie w czern)");
  return starts[starts.length - 1];
}

function extractFrames(raw, scene, t0, dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  const frames = Math.round(scene.seconds * 24);
  const vf = [
    "fps=24",
    "crop=" + scene.view.w + ":" + scene.view.h + ":0:0",
    scene.out.w !== scene.view.w ? "scale=" + scene.out.w + ":" + scene.out.h + ":flags=lanczos" : null,
  ]
    .filter(Boolean)
    .join(",");
  ff(["-y", "-i", raw, "-ss", String(t0), "-frames:v", String(frames), "-vf", vf, path.join(dir, "f_%04d.png")]);
  const list = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".png"))
    .sort();
  if (list.length !== frames) {
    throw new Error("[" + scene.slug + "] wyodrebnilem " + list.length + " klatek zamiast " + frames);
  }
  const hashes = list.map((f) => sha256(fs.readFileSync(path.join(dir, f))));
  return { frames: list.length, framesSha256: sha256(Buffer.from(hashes.join("\n"))) };
}

function encodeWebm(dir, scene, crf, out) {
  const total = Math.round(scene.seconds * 24) / 24;
  const base = ["-y", "-framerate", "24", "-i", path.join(dir, "f_%04d.png")];
  const enc = [
    "-r", "24",
    "-an",
    "-c:v", "libvpx-vp9",
    "-b:v", "0",
    "-crf", String(crf),
    "-row-mt", "1",
    "-deadline", "good",
    "-cpu-used", "2",
    "-g", "192",
    "-pix_fmt", "yuv420p",
    out,
  ];
  if (!scene.loop) {
    ff([...base, ...enc]);
    return;
  }
  /* Domkniecie petli: glowa wtapia sie w ogon, wiec ostatnia klatka wraca do klatki 0.
     Wtopienie konczy sie o jedna klatke wczesniej niz okno, zeby OSTATNIA klatka byla juz
     w pelni glowa (inaczej alfa nie dochodzi do 1 i spaw widac co obrot). */
  const off = (total - 2 * LOOP_FADE).toFixed(3);
  const fadeIn = (LOOP_FADE - 1 / 24).toFixed(4);
  const graph =
    "[0:v]split[body][pre];" +
    "[pre]trim=duration=" + LOOP_FADE + ",format=yuva420p,fade=d=" + fadeIn + ":alpha=1,setpts=PTS+" + off + "/TB[jt];" +
    "[body]trim=start=" + LOOP_FADE + ",setpts=PTS-STARTPTS[main];" +
    "[main][jt]overlay=eof_action=pass,format=yuv420p[v]";
  ff([...base, "-filter_complex", graph, "-map", "[v]", ...enc]);
}

function encodeMp4(dir, scene, crf, out) {
  ff([
    "-y", "-framerate", "24", "-i", path.join(dir, "f_%04d.png"),
    "-r", "24",
    "-an",
    "-c:v", "libx264",
    "-profile:v", "high",
    "-level", "4.1",
    "-preset", "slow",
    "-tune", "film",
    "-crf", String(crf),
    "-g", "192",
    "-pix_fmt", "yuv420p",
    "-movflags", "+faststart",
    out,
  ]);
}

/* Poster = klatka 0 GOTOWEGO pliku wideo (media-poster-first-frame), nigdy osobny zrzut. */
function makePoster(video, spec, tmp) {
  for (const q of spec.quality) {
    const vf = spec.width ? ["-vf", "scale=" + spec.width + ":-2"] : [];
    ff(["-y", "-i", video, "-frames:v", "1", ...vf, "-c:v", "libwebp", "-quality", String(q), tmp]);
    const bytes = fs.statSync(tmp).size;
    if (bytes <= spec.max) return { bytes, quality: q };
  }
  throw new Error("poster " + spec.file + " nie miesci sie w " + spec.max + " B nawet przy q=" + spec.quality.at(-1));
}

/* PSNR dwoch obrazow; `scaleA` sprowadza pierwszy do rozmiaru drugiego (nagranie 1x, zrzut 2x). */
function psnr(a, b, scaleA = null) {
  const graph = scaleA
    ? "[0:v]scale=" + scaleA + ":flags=lanczos,setsar=1[a];[1:v]setsar=1[b];[a][b]psnr"
    : "psnr";
  const log = ff(["-i", a, "-i", b, "-lavfi", graph, "-f", "null", "-"], { capture: true });
  const m = log.match(/average:([0-9.]+|inf)/);
  if (!m) return null;
  return m[1] === "inf" ? 99.99 : Number(m[1]);
}

/* Porownanie DWOCH NAGRAN klatka po klatce. To jest uczciwa bramka powtarzalnosci:
   kontener z Playwrighta jest stratny (VP8), wiec klatki PNG wyodrebnione z dwoch
   przebiegow NIGDY nie maja tego samego sha256, nawet gdy tresc jest ta sama. Roznice
   to szum dekodera, a nie inny stan narzedzia, i widac to po PSNR. */
function videoPsnr(a, b) {
  const log = ff(["-i", a, "-i", b, "-lavfi", "[0:v][1:v]psnr", "-f", "null", "-"], { capture: true });
  const line = log.split("\n").reverse().find((l) => l.includes("PSNR") && l.includes("average:"));
  if (!line) return null;
  const avg = line.match(/average:([0-9.]+|inf)/);
  const min = line.match(/min:([0-9.]+|inf)/);
  const num = (m) => (m ? (m[1] === "inf" ? 99.99 : Number(m[1])) : null);
  return { avg: num(avg), min: num(min) };
}

function encodeToBudget(dir, scene, out) {
  for (const crf of scene.crfLadder) {
    encodeWebm(dir, scene, crf, out);
    const bytes = fs.statSync(out).size;
    if (bytes <= scene.budget) return { crf, bytes };
    console.log("   crf " + crf + ": " + bytes + " B > budzet " + scene.budget + " B, schodze nizej");
  }
  throw new Error(
    "[" + scene.slug + "] nie mieszcze sie w budzecie " + scene.budget + " B nawet przy crf " + scene.crfLadder.at(-1) +
      ". Reguly zabraniaja rozmywac obraz: skroc scene albo zawez kadr.",
  );
}

/* ---------- manifest ---------- */

function readManifest() {
  if (!fs.existsSync(MANIFEST)) return {};
  return JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
}

function writeManifest(data) {
  const sorted = {};
  for (const k of Object.keys(data).sort()) {
    const inner = {};
    for (const kk of Object.keys(data[k]).sort()) inner[kk] = data[k][kk];
    sorted[k] = inner;
  }
  fs.mkdirSync(path.dirname(MANIFEST), { recursive: true });
  fs.writeFileSync(MANIFEST, JSON.stringify(sorted, null, 2) + "\n");
}

/* ---------- arkusz stop-klatek ---------- */

function contactSheet(scene, dir) {
  const out = path.join(WORK, "contact-" + scene.slug + ".png");
  const frames = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".png"))
    .sort();
  const picks = [0, 0.2, 0.4, 0.6, 0.8, 0.99].map(
    (p) => frames[Math.min(frames.length - 1, Math.round(p * (frames.length - 1)))],
  );
  const sheet = path.join(WORK, "sheet-" + scene.slug);
  fs.rmSync(sheet, { recursive: true, force: true });
  fs.mkdirSync(sheet, { recursive: true });
  picks.forEach((f, i) =>
    fs.copyFileSync(path.join(dir, f), path.join(sheet, "s_" + String(i + 1).padStart(2, "0") + ".png")),
  );
  ff(["-y", "-i", path.join(sheet, "s_%02d.png"), "-vf", "scale=640:-2,tile=3x2:margin=8:padding=8", "-frames:v", "1", out]);
  return out;
}

/* ---------- przebieg ---------- */

async function main() {
  if (!fs.existsSync(path.join(DIST, "index.html"))) fail("brak site/dist. Zbuduj strone przed nagraniem.");
  const scenes = SCENES.filter((s) => !ONLY || s.slug === ONLY || s.id === ONLY);
  if (!scenes.length) fail("nie znam sceny " + ONLY);

  fs.mkdirSync(WORK, { recursive: true });
  const pw = await loadPlaywright();
  const srv = await startServer();
  console.log("serwer: http://127.0.0.1:" + PORT + " (site/dist, bez SPA-fallbacku)");
  console.log("ffmpeg: " + FFMPEG);

  const manifest = readManifest();
  const report = [];
  let rc = 0;

  try {
    for (const scene of scenes) {
      const started = Date.now();
      console.log(
        "\n== " + scene.id + " " + scene.slug + " (" + scene.out.w + "x" + scene.out.h + ", " + scene.seconds + " s, " +
          (scene.loop ? "petla" : "jedno odtworzenie") + ")",
      );
      const dirs = {
        raw: path.join(WORK, "raw-" + scene.slug),
        frames: path.join(WORK, "frames-" + scene.slug),
      };
      fs.rmSync(dirs.raw, { recursive: true, force: true });
      fs.mkdirSync(dirs.raw, { recursive: true });

      const { raw, t0Wall, engine } = await record(pw, scene, dirs);
      const t0 = detectClapStart(raw, scene);
      if (Math.abs(t0 - t0Wall) > 2.0) {
        throw new Error(
          "[" + scene.slug + "] klaps na " + t0.toFixed(2) + " s odbiega od pomiaru zegara " + t0Wall.toFixed(2) + " s",
        );
      }
      const { frames, framesSha256 } = extractFrames(raw, scene, t0, dirs.frames);

      const tmpWebm = path.join(WORK, path.basename(scene.file));
      const { crf, bytes } = encodeToBudget(dirs.frames, scene, tmpWebm);

      const probe = ffprobeJson(tmpWebm);
      const v = probe.streams.find((s) => s.codec_type === "video");
      const audio = probe.streams.filter((s) => s.codec_type === "audio").length;
      const durationMs = Math.round(Number(probe.format.duration) * 1000);

      /* poster: klatka 0 gotowego pliku */
      const f0 = path.join(WORK, "f0-" + scene.slug + ".png");
      ff(["-y", "-i", tmpWebm, "-frames:v", "1", f0]);
      const tmpPoster = path.join(WORK, path.basename(scene.poster.file));
      const posterInfo = makePoster(tmpWebm, scene.poster, tmpPoster);
      const posterPsnrDb = psnr(f0, tmpPoster, scene.poster.width ? scene.poster.width + ":-2" : null);

      let loopPsnrDb = null;
      if (scene.loop) {
        /* ostatnia klatka pliku: ogon rozpakowany do PNG, brany najwyzszy numer
           (pojedyncze `-sseof` potrafi trafic w przedostatnia klatke) */
        const tail = path.join(WORK, "tail-" + scene.slug);
        fs.rmSync(tail, { recursive: true, force: true });
        fs.mkdirSync(tail, { recursive: true });
        ff(["-y", "-sseof", "-0.3", "-i", tmpWebm, path.join(tail, "t_%02d.png")]);
        const last = fs.readdirSync(tail).filter((f) => f.endsWith(".png")).sort().at(-1);
        loopPsnrDb = last ? psnr(f0, path.join(tail, last)) : null;
      }

      let mp4Info = null;
      if (scene.mp4) {
        const tmpMp4 = path.join(WORK, scene.mp4);
        for (const q of scene.x264Ladder) {
          encodeMp4(dirs.frames, scene, q, tmpMp4);
          const b = fs.statSync(tmpMp4).size;
          if (b <= scene.mp4Budget) {
            mp4Info = { crf: q, bytes: b, file: tmpMp4 };
            break;
          }
          console.log("   x264 crf " + q + ": " + b + " B > budzet " + scene.mp4Budget + " B, schodze nizej");
        }
        if (!mp4Info) throw new Error("[" + scene.slug + "] MP4 nie miesci sie w " + scene.mp4Budget + " B");
      }

      let mobileInfo = null;
      let tmpMobile = null;
      if (scene.posterMobile) {
        tmpMobile = path.join(WORK, path.basename(scene.posterMobile.file));
        mobileInfo = makePoster(tmpWebm, scene.posterMobile, tmpMobile);
      }

      const entry = {
        slug: scene.slug,
        scene: scene.scene,
        w: scene.out.w,
        h: scene.out.h,
        fps: 24,
        durationMs,
        bytes,
        crf,
        framesSha256,
        posterPsnrDb: posterPsnrDb === null ? null : Number(posterPsnrDb.toFixed(2)),
        engine,
      };
      if (loopPsnrDb !== null) entry.loopPsnrDb = Number(loopPsnrDb.toFixed(2));

      const prev = manifest[scene.file];
      let verifyInfo = null;

      if (VERIFY) {
        if (!prev) {
          console.log("   VERIFY: brak wpisu w manifescie");
          rc = 1;
        } else {
          const hard = [];
          if (Math.abs(prev.durationMs - durationMs) > 200) {
            hard.push("durationMs " + prev.durationMs + " -> " + durationMs);
          }
          if (bytes > scene.budget) hard.push("bytes " + bytes + " > budzet " + scene.budget);
          const published = path.join(scene.dir, scene.file);
          const same = fs.existsSync(published) ? videoPsnr(tmpWebm, published) : null;
          if (!same) hard.push("brak opublikowanego pliku do porownania");
          else if (same.avg !== null && same.avg < VERIFY_PSNR_MIN) {
            hard.push("PSNR wobec opublikowanego " + same.avg + " dB < " + VERIFY_PSNR_MIN + " dB");
          }
          verifyInfo = {
            psnrAvgDb: same ? same.avg : null,
            psnrMinDb: same ? same.min : null,
            bytesPrev: prev.bytes,
            framesSha256Equal: prev.framesSha256 === framesSha256,
          };
          console.log(
            "   VERIFY: PSNR wobec opublikowanego " + (same ? same.avg + " dB (min " + same.min + " dB)" : "brak") +
              ", bytes " + prev.bytes + " -> " + bytes +
              ", framesSha256 identyczny: " + verifyInfo.framesSha256Equal,
          );
          if (hard.length) {
            console.log("   VERIFY: rozjazd: " + hard.join(", "));
            rc = 1;
          }
        }
      } else {
        const target = path.join(scene.dir, scene.file);
        fs.mkdirSync(path.dirname(target), { recursive: true });
        fs.copyFileSync(tmpWebm, target);
        fs.mkdirSync(path.dirname(path.join(scene.dir, scene.poster.file)), { recursive: true });
        fs.copyFileSync(tmpPoster, path.join(scene.dir, scene.poster.file));
        if (mp4Info) fs.copyFileSync(mp4Info.file, path.join(scene.dir, scene.mp4));
        if (mobileInfo) fs.copyFileSync(tmpMobile, path.join(scene.dir, scene.posterMobile.file));
        manifest[scene.file] = entry;
      }

      if (CONTACT_SHEET) console.log("   arkusz: " + contactSheet(scene, dirs.frames));

      report.push({
        id: scene.id,
        file: scene.file,
        bytes,
        budget: scene.budget,
        durationMs,
        frames,
        fpsProbe: v ? v.r_frame_rate : "?",
        readFrames: v ? v.nb_read_frames : "?",
        size: v ? v.width + "x" + v.height : "?",
        audioStreams: audio,
        crf,
        poster: scene.poster.file,
        posterBytes: posterInfo.bytes,
        posterQuality: posterInfo.quality,
        posterPsnrDb: entry.posterPsnrDb,
        loopPsnrDb: entry.loopPsnrDb ?? null,
        mp4Bytes: mp4Info ? mp4Info.bytes : null,
        mp4Crf: mp4Info ? mp4Info.crf : null,
        mobileBytes: mobileInfo ? mobileInfo.bytes : null,
        t0: Number(t0.toFixed(3)),
        framesSha256,
        prevFramesSha256: prev ? prev.framesSha256 : null,
        prevBytes: prev ? prev.bytes : null,
        verify: verifyInfo,
        tookSec: Number(((Date.now() - started) / 1000).toFixed(1)),
      });

      if (!KEEP) fs.rmSync(dirs.raw, { recursive: true, force: true });
      console.log(
        "   gotowe w " + report.at(-1).tookSec + " s: " + bytes + " B, " + durationMs + " ms, poster " +
          posterInfo.bytes + " B",
      );
    }

    if (!VERIFY) writeManifest(manifest);
  } finally {
    srv.close();
  }

  console.log("\n--- podsumowanie ---");
  console.log(JSON.stringify(report, null, 2));
  process.exit(rc);
}

main().catch((e) => {
  console.error("BLAD: " + (e && e.stack ? e.stack : e));
  process.exit(1);
});
