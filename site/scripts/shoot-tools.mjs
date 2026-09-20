/* site/scripts/shoot-tools.mjs: zrzuty prawdziwych narzędzi na potrzeby ściany kafli,
   ram na hubie i kadru hero (plan §7.5, §7.6, reguła perf-images-policy).

   Po co: trzynaście dashboardów dzieli ten sam kit, więc zrzut CAŁEGO ekranu daje trzynaście
   identycznych ciemnych prostokątów. Dlatego każda pozycja ma własną SCENĘ (stan ekranu)
   i własny KADR: wycinek liczony z pudełek konkretnych elementów, dobrany pod typ obrazu
   (wykres, macierz statusów, Gantt, kafle hal, dokument A4, tabela z kwotami, chip PASS).
   Bliźniacze kadry poprawiamy zmianą sceny, nigdy filtrem graficznym (R-T1).

   Uruchamianie (zawsze `node` wprost; `npx` w tym repo nie działa przez znak & w ścieżce):

     cd site && npm run build                       # dist musi być świeży
     node scripts/shoot-tools.mjs                   # komplet 12 dem + kadr hero
     node scripts/shoot-tools.mjs --only raport-zarzadczy,os-czasu-zadan
     node scripts/shoot-tools.mjs --contact-sheet   # arkusz 4×4 do przeglądu (scratchpad)
     node scripts/shoot-tools.mjs --verify          # bez zapisu: porównanie sum z manifestem
     node scripts/shoot-tools.mjs --engine=chromium # tylko szybki podgląd, NIE do repo

   Zależności spoza repo (świadomie, patrz SOURCES.md):
     PW_CORE        ścieżka do pakietu `playwright-core` (katalog albo plik index.js)
     SHARP_DIR      katalog, w którym leży `node_modules/sharp`
     KLAROW_TOOLS   skrót: katalog z `node_modules/{playwright-core,sharp}` (ustawia oba)
     SRC_BRAND_RE   wzorzec marki firmy źródłowej; gdy brak, czytany z reguł strażnika
   Playwright i sharp NIE są zależnościami `site/`: katalog repo ma & w ścieżce i łamie shimy,
   a build strony nigdy nie robi zrzutów (do gita wchodzą gotowe pliki WebP).

   Determinizm (bramka demo-determinism i perf-images-policy p.5):
     - `Date` (konstruktor bez argumentów i `Date.now`) zamrożony na 2026-07-22T09:00:00.000Z,
       czyli tę samą datę, którą TaskTimeline trzyma jako „Dziś”,
     - `Math.random` = mulberry32(0xC10A12),
     - `localStorage` czyszczony, język ustawiany PRZED pierwszą farbą,
     - zrzut dopiero po [data-dashboard][data-ready='true'], zniknięciu `.skel`,
       `document.fonts.ready` i zatrzymaniu WSZYSTKICH animacji (`getAnimations`),
       nigdy po `setTimeout`,
     - każde wywołanie `Date.now`, `Math.random`, `fetch` i `XMLHttpRequest` jest liczone
       i raportowane jako ostrzeżenie (darmowa bramka na niedeterminizm wstawiony do silnika).

   Kadr powstaje przez CROP ze zrzutu okna (sharp `extract`), nie przez `clip` Playwrighta:
   współrzędne `clip` bywają liczone raz względem okna, raz względem dokumentu, a crop
   z jawnie policzonego pudełka jest jednoznaczny i identyczny w obu silnikach. */

import fs from "node:fs";
import path from "node:path";
import http from "node:http";
import crypto from "node:crypto";
import { fileURLToPath, pathToFileURL } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const SITE = path.resolve(HERE, "..");
const REPO = path.resolve(SITE, "..");
const DIST = path.join(SITE, "dist");

/* ───────────────────────────── CLI ───────────────────────────── */

const argv = process.argv.slice(2);
const flag = (name) => argv.includes(`--${name}`);
const value = (name, dflt) => {
  const eq = argv.find((a) => a.startsWith(`--${name}=`));
  if (eq) return eq.slice(name.length + 3);
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : dflt;
};

const OPT = {
  port: Number(value("port", 8772)),
  engine: value("engine", "webkit"),
  only: (value("only", "") || "").split(",").map((s) => s.trim()).filter(Boolean),
  lang: value("lang", "pl"),
  contactSheet: flag("contact-sheet"),
  verify: flag("verify"),
  debug: flag("debug"),
};

const SCRATCH =
  process.env.CLAUDE_SCRATCHPAD ||
  process.env.KLAROW_SCRATCH ||
  path.join(process.env.TEMP || process.env.TMP || ".", "klarow-shots");

/* ───────────────────────────── stałe determinizmu ───────────────────────────── */

const FROZEN_MS = Date.UTC(2026, 6, 22, 9, 0, 0, 0); // 2026-07-22T09:00:00.000Z
const RANDOM_SEED = 0xc10a12;
const VIEWPORT = { width: 1440, height: 1000 };
const VIEWPORT_MAX_H = 1800;
const DPR = 2;

/* drabinka jakości WebP: schodzimy tylko do dołu listy; przekroczenie limitu na ostatnim
   szczeblu kończy się błędem, nigdy cichym rozmytym plikiem (perf-images-policy §Parametry) */
const QUALITY_LADDER = [82, 78, 74, 70, 66, 62, 58];

/* ───────────────────────────── katalogi wyjściowe ─────────────────────────────
   Wszystkie cztery rozmiary kafla idą do `public/thumbs/`, bo mieszczą się w teście
   reguły (`find site/public/thumbs -name '*.webp' -size +40k` = pusto: 1280×800 waży
   ~27 KB, nie 120). Kadry hero są cięższe, więc siedzą w `public/media/`, i mają
   w nazwie człon `still`, żeby NIE zająć nazwy postera z nagrania: poster hero musi być
   klatką zero pliku wideo (plan §3 S1), a nie osobnym zrzutem. Te pliki są kandydatem
   do wariantu B (hero bez wideo) i materiałem porównawczym dla PSNR klatki 0. */
const OUT = {
  thumbs: path.join(SITE, "public", "thumbs"),
  hero: path.join(SITE, "public", "media"),
};
const MANIFEST = path.join(OUT.thumbs, "SHOTS.json");

/** Warianty pliku dla pozycji ściany: rama na hubie / w S3 + trzy miniatury (srcset kafla). */
const TILE_OUTPUTS = [
  /* 38 KB, nie 30: pod testem reguły (`-size +40k` w thumbs) i daleko pod budżetem ramy
     (120 KB w perf-images-policy). Cel 30 KB trzyma 11 z 12 pozycji; gęsta tabela SOV
     (billing-us-g703) zeszłaby poniżej 30 KB dopiero przy jakości 58, a wtedy cyfry
     zaczynają się rozmywać, a rozmyte cyfry są zakazane wprost (media-asset-review-gate N1). */
  { dir: "thumbs", suffix: "1280", w: 1280, h: 800, maxKB: 38, role: "rama huba / S3" },
  { dir: "thumbs", suffix: "640", w: 640, h: 400, maxKB: 16, role: "srcset ramy" },
  { dir: "thumbs", suffix: "480", w: 480, h: 300, maxKB: 12, role: "kafel ściany" },
  { dir: "thumbs", suffix: "320", w: 320, h: 200, maxKB: 8, role: "srcset kafla" },
];

/* ───────────────────────────── sceny (13 pozycji) ─────────────────────────────
   Scenariusze stoją WYŁĄCZNIE na rolach i widocznym tekście: components/dashboards/**
   i DemoReport.tsx są zamrożone w v1 (plan §12.1), więc nie wolno dokładać `data-shot`.
   Każdy krok cytuje etykietę i miejsce w źródle; brak trafienia = twardy błąd z nazwą
   sluga, nigdy pusty zrzut. Etykiety są w wersji PL (v1 strzela po polsku, plan §7.4). */

const ROOT = "[data-dashboard]";

const SCENES = [
  {
    slug: "raport-zarzadczy",
    scene: "wykres-per-etap",
    frame: "pas 3 KPI, cały wykres kosztu vs zaawansowanie i pierwsze wiersze tabeli projektów",
    steps: [
      { kind: "click", sel: `${ROOT} button:has-text("Załaduj przykładowe dane")`, why: "DemoReport.tsx:312 t.loadExample" },
      { kind: "wait", sel: `${ROOT} .chart-card svg`, why: "wykres per etap zamontowany" },
    ],
    anchors: [`${ROOT} .card.stat`, `${ROOT} .chart-card`, `${ROOT} table.data-table tbody tr >> nth=2`],
  },
  {
    slug: "dashboard-produkcji",
    scene: "kafle-hal-rozbicie",
    frame: "siatka kafli hal ze statusami i rozwinięte rozbicie etapowe pod klikniętym kaflem",
    steps: [
      /* Suwak na T34: przy danych demo NIGDY nie zapala się status „Ryzyko” (odchylenie
         maksymalnie 5,5 p.p. przy progu 8), więc najmocniejszy realny stan to dwa kafle
         „Obserwuj” w T34. Scena z planu §7.6 („kafel o statusie ryzyka”) jest niewykonalna
         bez zmiany danych dashboardu, a dashboardy są w v1 zamrożone. */
      { kind: "slider", name: "Tydzień", to: 7, why: "ProductionDashboard.tsx:199 aria-label t.week; 7 = T34" },
      { kind: "click", sel: `${ROOT} button.card:has(.st-accent)`, why: "ProductionDashboard.tsx:214 kafel hali w statusie Obserwuj" },
      { kind: "wait", sel: `${ROOT} .card:has-text("Rozbicie na etapy")`, why: "ProductionDashboard.tsx:273 t.breakdown" },
    ],
    anchors: [`${ROOT} button.card`, `${ROOT} .card:has-text("Rozbicie na etapy")`],
  },
  {
    slug: "audyt-jakosci-danych",
    scene: "macierz-pewnosci",
    frame: "macierz OK / UWAGA / BŁĄD dla portfela i pierwsze wiersze listy naruszeń",
    steps: [
      { kind: "click", sel: `${ROOT} button:has-text("Załaduj przykład")`, why: "QualityGate.tsx:201 t.loadExample" },
      { kind: "wait", sel: `${ROOT} .card:has-text("Macierz pewności")`, why: "QualityGate.tsx:300 t.matrix" },
    ],
    anchors: [`${ROOT} .card:has-text("Macierz pewności")`, `${ROOT} table.data-table tbody tr >> nth=1`],
  },
  {
    slug: "import-z-rekoncyliacja",
    scene: "pass-dowod-sumy",
    frame: "chip PASS z linią dowodu sumy, trzy sumy kontrolne i pierwsze wiersze diffu",
    steps: [
      { kind: "click", sel: `${ROOT} button:has-text("Uruchom import (TEST)")`, why: "ImportReconciliation.tsx:179 t.run" },
      { kind: "wait", sel: `${ROOT} :text("REKONCYLIACJA: PASS")`, why: "ImportReconciliation.tsx:85 t.pass" },
    ],
    anchors: [`${ROOT} .card`, `${ROOT} table.data-table tbody tr >> nth=3`],
  },
  {
    slug: "os-czasu-zadan",
    scene: "gantt-dwa-snapshoty",
    frame: "oś Gantta: dwa pasy snapshotów, znacznik Dziś i ogony obsuwy",
    steps: [],
    anchors: [`${ROOT} .card:has(svg[role="img"])`],
  },
  {
    slug: "kalkulator-transz",
    scene: "alokacja-w-groszach",
    frame: "rozpiska alokacji transzy na inwestycje z kolumną brutto i linią zgodności sumy",
    steps: [
      { kind: "fill", sel: `${ROOT} input.input`, text: "180000", why: "PaymentCalculator.tsx:171 pole kwoty transzy" },
      { kind: "click", sel: `${ROOT} button:has-text("Dodaj transzę")`, why: "PaymentCalculator.tsx:188 t.add" },
      { kind: "fill", sel: `${ROOT} input.input`, text: "60000", why: "druga transza: reszta ląduje na ostatniej pozycji" },
      { kind: "click", sel: `${ROOT} button:has-text("Dodaj transzę")`, why: "PaymentCalculator.tsx:188 t.add" },
      { kind: "wait", sel: `${ROOT} :text("Σ transzy zgadza się co do grosza")`, why: "PaymentCalculator.tsx:71 t.sumCheck" },
    ],
    anchors: [`${ROOT} .card:has(table.data-table)`],
  },
  {
    slug: "obieg-przelewow",
    scene: "plan-14-dni",
    frame: "macierz planu płatności na 14 dni: słupki dzienne z wyróżnionymi przeniesieniami",
    /* Pięć decyzji, nie dwie: przy dwóch plan ma dwa słupki na czternaście kolumn i kadr
       czyta się jako pusty panel (widać to było na pierwszym kontakcie zbiorczym).
       Połowa („+7 dni”) daje słupki w kolorze przeniesienia, więc macierz ma dwa kolory. */
    steps: [
      { kind: "clickInRow", table: `${ROOT} table.data-table`, row: 0, sel: 'button:has-text("Całość")', why: "PaymentFlow.tsx:197 t.full" },
      { kind: "clickInRow", table: `${ROOT} table.data-table`, row: 1, sel: 'button:has-text("Połowa")', why: "PaymentFlow.tsx:200 t.partial" },
      { kind: "clickInRow", table: `${ROOT} table.data-table`, row: 2, sel: 'button:has-text("Całość")', why: "PaymentFlow.tsx:197 t.full" },
      { kind: "clickInRow", table: `${ROOT} table.data-table`, row: 3, sel: 'button:has-text("Połowa")', why: "PaymentFlow.tsx:200 t.partial" },
      { kind: "clickInRow", table: `${ROOT} table.data-table`, row: 4, sel: 'button:has-text("Całość")', why: "PaymentFlow.tsx:197 t.full" },
      { kind: "clickInRow", table: `${ROOT} table.data-table`, row: 5, sel: 'button:has-text("Połowa")', why: "PaymentFlow.tsx:200 t.partial" },
      { kind: "wait", sel: `${ROOT} .st:has-text("Częściowo (+7 dni)")`, why: "PaymentFlow.tsx:145 t.stPartial" },
    ],
    /* Zaczep obejmuje TAKŻE tabelę wniosków: sama karta planu jest niska i szeroka, więc
       dopełnienie do 16:10 musiałoby urosnąć w pionie ponad wysokość dashboardu i kadr
       zwężałby się, ucinając prawą część czternastu kolumn (pierwsza wersja tak właśnie
       wyszła). Wysoki zaczep = pełna szerokość planu plus chipy decyzji w kadrze. */
    anchors: [`${ROOT} .card:has-text("Wnioski do decyzji")`, `${ROOT} .card:has-text("Plan płatności: 14 dni")`],
  },
  {
    slug: "billing-us-g703",
    scene: "sov-powyzej-progu",
    frame: "arkusz wartości w USD z niezerową kolumną do zafakturowania po przejściu progu depozytu",
    steps: [
      { kind: "slider", name: "Wykonanie (M) 04", to: 55, why: "G703Billing.tsx:159 aria-label; m0 = 22 %, próg depozytu 40 %" },
      { kind: "wait", sel: `${ROOT} table.data-table`, why: "tabela SOV" },
    ],
    /* Kadr celowo ciaśniejszy niż cała karta: pełna tabela SOV to tyle drobnego tekstu,
       że WebP 1280×800 nie schodzi poniżej 30 KB bez rozmycia cyfr (a rozmycie cyfr jest
       zakazane: media-asset-review-gate N1).

       2026-09-17: z czterech wierszy na SZEŚĆ, czyli kadr SZERSZY, nie ciaśniejszy.
       Po wymianie kroju na Geist ten sam kadr wychodził 38,4 KB przy limicie 38 i bramka
       słusznie odmówiła zapisu. Pierwsza próba poszła za komunikatem dosłownie („zaciaśnij
       kadr") i dała 39,5 KB, czyli GORZEJ — bo kadr jest skalowany do 1280×800, więc
       mniejszy wycinek znaczy większe cyfry w wyniku, a większe cyfry to więcej krawędzi
       do zakodowania. Zależność jest odwrotna, niż sugeruje komunikat: szerszy wycinek
       zmniejsza tekst w kadrze i plik schodzi. Sześć wierszy pokazuje ten sam typ obrazu. */
    anchors: [`${ROOT} table.data-table thead`, `${ROOT} table.data-table tbody tr >> nth=5`],
  },
  {
    slug: "kontroling-kosztow",
    scene: "etc-eac-marza",
    frame: "paski budżet / wydatek / przekroczenie, KPI marży po zmianie ETC i bramka tygodnia",
    steps: [
      { kind: "fillLabel", name: "ETC Montaż", text: "1680", why: "CostControl.tsx:197 aria-label `ETC ${nazwa}`; etc0 = 1180" },
      { kind: "wait", sel: `${ROOT} button:has-text("Zatwierdź tydzień 30")`, why: "CostControl.tsx:238 t.approve" },
    ],
    anchors: [`${ROOT} .card.stat`, `${ROOT} button:has-text("Zatwierdź tydzień 30")`],
  },
  {
    slug: "importy-erp",
    scene: "test-slownik-dedup",
    frame: "chip TEST i tabela klasyfikacji: klasa ze słownika oraz duplikaty pominięte przy imporcie",
    steps: [
      { kind: "click", sel: `${ROOT} button:has-text("Uruchom import (tryb TEST)")`, why: "ErpImports.tsx:129 t.run" },
      { kind: "wait", sel: `${ROOT} :text("SANITY-CHECK: GREEN")`, why: "ErpImports.tsx:61 t.sanityPass" },
    ],
    anchors: [`${ROOT} .card:has(.st:has-text("TEST"))`, `${ROOT} table.data-table tbody tr >> nth=4`],
  },
  {
    slug: "protokoly-robocizny",
    scene: "dokument-a4",
    frame: "pasek cyklu życia dokumentu i protokół złożony jako gotowy dokument A4",
    steps: [
      { kind: "click", sel: `${ROOT} button:has-text("Generuj protokół (DRAFT)")`, why: "LabourProtocols.tsx:143 t.genDraft" },
      { kind: "wait", sel: `${ROOT} :text("PROTOKÓŁ ROZLICZENIA ROBOCIZNY")`, why: "LabourProtocols.tsx:57 t.doc" },
    ],
    anchors: [`${ROOT} .steps`, `${ROOT} .card:has-text("PROTOKÓŁ ROZLICZENIA ROBOCIZNY")`],
  },
  {
    slug: "rejestr-umow",
    scene: "rejestr-z-paskiem-akcji",
    frame: "pasek akcji z szukajką i eksportem nad rejestrem umów, pięć wierszy ze statusami",
    /* Plan §7.6 mówi o sześciu wierszach; w danych demo jest ich pięć (ContractRegister.tsx:23–27).
       Zaczep na trzecim wierszu dawał bajt w bajt ten sam plik co na piątym: kadr o proporcji
       16:10 jest tu szerszy niż wyższy, więc dopełnienie do proporcji i tak wciąga cały rejestr.
       Zostaje wersja czytelna wprost: cały rejestr plus pasek akcji, który odróżnia ten obraz
       od dwóch pozostałych tabel (import i importy ERP) kolorem szukajki i przyciskami. */
    steps: [{ kind: "wait", sel: `${ROOT} table.data-table tbody tr`, why: "lista wstępna, bez akcji" }],
    anchors: [`${ROOT} .card:has(input.input)`, `${ROOT} table.data-table tbody tr >> nth=4`],
  },
  {
    slug: "kontroling-ksef",
    scene: "diagram-ksef",
    frame: "diagram KsefFlow: cztery węzły i przekreślona strzałka zwrotna",
    /* `kind: "case"` w tools.ts: nie ma dashboardu do sfotografowania. Pozycja czeka na SVG
       (plan §7.5 --svg-fallback); tu wyłącznie odnotowana, żeby manifest miał 13 pozycji. */
    skip: "brak dashboardu (kind: case): kadr powstaje z diagramu SVG KsefFlow",
  },
];

/** Kadr hero: ten sam dashboard produkcji, ale INNA scena i inne proporcje niż kafel. */
const HERO = {
  slug: "hero-production-still",
  from: "dashboard-produkcji",
  scene: "hero-kafle-i-suwak",
  frame: "pas KPI z suwakiem tygodnia i pełna siatka kafli hal, bez rozwinięcia etapowego",
  steps: [{ kind: "wait", sel: `${ROOT} button.card`, why: "kafle hal, stan startowy T35" }],
  anchors: [`${ROOT} .card.stat`, `${ROOT} button.card >> nth=5`],
  outputs: [
    { dir: "hero", suffix: "1920", w: 1920, h: 1080, maxKB: 110, role: "kadr hero 16:9 (zadanie F1)" },
    { dir: "hero", suffix: "960", w: 960, h: 540, maxKB: 55, role: "srcset hero 16:9" },
    { dir: "hero", suffix: "1600", w: 1600, h: 1000, maxKB: 110, role: "kadr hero 16:10 (perf-images-policy)" },
    { dir: "hero", suffix: "800", w: 800, h: 500, maxKB: 55, role: "srcset hero 16:10" },
  ],
};

/* ───────────────────────────── ładowanie zależności spoza repo ───────────────────────────── */

async function loadExternal(name, envDir, envPkg) {
  const candidates = [];
  if (process.env[envPkg]) candidates.push(process.env[envPkg]);
  if (process.env[envDir]) candidates.push(path.join(process.env[envDir], "node_modules", name));
  if (process.env.KLAROW_TOOLS) candidates.push(path.join(process.env.KLAROW_TOOLS, "node_modules", name));
  for (const c of candidates) {
    const isDir = fs.existsSync(c) && fs.statSync(c).isDirectory();
    const target = isDir ? resolveEntry(c) : c;
    if (target && fs.existsSync(target)) {
      const mod = await import(pathToFileURL(target).href);
      return { mod: mod.default ?? mod, dir: isDir ? c : path.dirname(target) };
    }
  }
  try {
    const mod = await import(name);
    return { mod: mod.default ?? mod, dir: null };
  } catch {
    throw new Error(
      `Brak pakietu "${name}". Zainstaluj go POZA repo (katalog repo ma & w ścieżce) i wskaż ścieżkę:\n` +
        `  npm install --no-save ${name}   # w katalogu scratchpad\n` +
        `  set ${envDir}=<katalog ze scratchpadu>   albo   set KLAROW_TOOLS=<ten sam katalog>\n` +
        "Nigdy przez npx.",
    );
  }
}

function resolveEntry(pkgDir) {
  try {
    const pkg = JSON.parse(fs.readFileSync(path.join(pkgDir, "package.json"), "utf8"));
    const main = pkg.main || "index.js";
    return path.join(pkgDir, main);
  } catch {
    return path.join(pkgDir, "index.js");
  }
}

/** Wzorzec marki firmy źródłowej. Jedno źródło prawdy siedzi w regułach strażnika
    (sekcja 1, zakaz marki poprzedniej firmy); tutaj tylko go CZYTAMY, bo sama nazwa
    nie ma prawa paść nigdzie w `site/**`, także w komentarzu ani w nazwie stałej. */
function brandPattern() {
  if (process.env.SRC_BRAND_RE) return new RegExp(process.env.SRC_BRAND_RE, "i");
  const hook = path.join(REPO, ".claude", "skills", "klarow-guardian", "scripts", "hook-pre-tool.mjs");
  if (fs.existsSync(hook)) {
    const m = /const\s+BRAND_NAME\s*=\s*\/(.+?)\/[a-z]*;/.exec(fs.readFileSync(hook, "utf8"));
    if (m) return new RegExp(m[1], "i");
  }
  throw new Error(
    "Brak wzorca marki firmy źródłowej: ustaw SRC_BRAND_RE albo uruchom skrypt w repo ze skillem\n" +
      "klarow-guardian (sekcja 1 reguł marki). Bez wzorca zrzut nie powstaje: bramka nie ma\n" +
      "prawa milczeć, kiedy nie ma czym sprawdzić.",
  );
}

/* ───────────────────────────── serwer statyczny dla dist ───────────────────────────── */

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".png": "image/png",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

/** Bez SPA-fallbacku: chcemy prerenderowane dist/narzedzia/<slug>.html, nie shell. */
function startServer(port) {
  const server = http.createServer((req, res) => {
    const url = decodeURIComponent((req.url || "/").split("?")[0]);
    const rel = url.replace(/^\/+/, "");
    const tries = url.endsWith("/")
      ? [path.join(rel, "index.html")]
      : [rel, `${rel}.html`, path.join(rel, "index.html")];
    if (url === "/") tries.unshift("index.html");
    for (const t of tries) {
      const file = path.join(DIST, t);
      if (!file.startsWith(DIST)) break;
      if (fs.existsSync(file) && fs.statSync(file).isFile()) {
        res.writeHead(200, { "content-type": MIME[path.extname(file).toLowerCase()] || "application/octet-stream" });
        fs.createReadStream(file).pipe(res);
        return;
      }
    }
    res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
    res.end("404");
  });
  return new Promise((resolve, reject) => {
    server.on("error", reject);
    server.listen(port, "127.0.0.1", () => resolve(server));
  });
}

/* ───────────────────────────── przeglądarka ───────────────────────────── */

/* Rewizję przeglądarki bierzemy z browsers.json TEGO playwright-core, nie „najwyższą z cache”.
   PUŁAPKA (kosztowała pół godziny): w cache leżą build-y z różnych wersji Playwrighta;
   przy niezgodności `launch()` przechodzi, a dopiero `newPage()` wisi bez błędu i bez timeoutu. */
function browserExecutable(engine, pwDir) {
  const base = path.join(process.env.LOCALAPPDATA || "", "ms-playwright");
  if (!fs.existsSync(base)) throw new Error(`Brak cache przeglądarek Playwrighta: ${base}`);
  let revision = null;
  try {
    const list = JSON.parse(fs.readFileSync(path.join(pwDir ?? "", "browsers.json"), "utf8")).browsers;
    revision = list.find((b) => b.name === engine)?.revision ?? null;
  } catch {
    revision = null;
  }
  const prefix = engine === "chromium" ? "chromium-" : "webkit-";
  const exact = revision ? path.join(base, `${prefix}${revision}`) : null;
  if (revision && !fs.existsSync(exact)) {
    throw new Error(
      `Brak ${prefix}${revision} w ${base}. Zainstaluj build pasujący do playwright-core:\n` +
        `  node <katalog>/node_modules/playwright-core/cli.js install ${engine}`,
    );
  }
  const dirs = fs
    .readdirSync(base)
    .filter((d) => d.startsWith(prefix) && !d.includes("headless_shell"))
    .sort();
  if (!exact && dirs.length === 0) throw new Error(`Brak przeglądarki ${engine} w ${base}`);
  const dir = exact ?? path.join(base, dirs[dirs.length - 1]);
  const candidates =
    engine === "chromium"
      ? [path.join(dir, "chrome-win", "chrome.exe")]
      : [path.join(dir, "Playwright.exe"), path.join(dir, "pw_run.sh")];
  const found = candidates.find((c) => fs.existsSync(c));
  if (!found) throw new Error(`Nie znalazłem pliku wykonywalnego ${engine} w ${dir}`);
  return found;
}

/** Skrypt inicjujący: wchodzi PRZED kodem aplikacji, w każdej ramce. */
function initScript({ frozenMs, seed, lang }) {
  return `(() => {
    const nondet = { dateNow: 0, random: 0, fetch: 0, xhr: 0 };
    window.__nondet = nondet;
    const RealDate = Date;
    class FrozenDate extends RealDate {
      constructor(...a) { if (a.length === 0) super(${frozenMs}); else super(...a); }
      static now() { nondet.dateNow++; return ${frozenMs}; }
    }
    window.Date = FrozenDate;
    let s = ${seed} >>> 0;
    Math.random = () => {
      nondet.random++;
      s = (s + 0x6d2b79f5) >>> 0;
      let t = s;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    const realFetch = window.fetch;
    window.fetch = (...a) => { nondet.fetch++; return realFetch.apply(window, a); };
    const realOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function (...a) { nondet.xhr++; return realOpen.apply(this, a); };
    try { localStorage.clear(); localStorage.setItem("klarow-lang", ${JSON.stringify(lang)}); } catch {}
  })();`;
}

/* Karetka w polu, pasek przewijania i pierścień fokusu to trzy najczęstsze źródła różnic
   piksela między przebiegami. Gasimy je po nawigacji, przed pomiarem. */
const STABLE_CSS = `
  *{caret-color:transparent!important}
  ::-webkit-scrollbar{display:none!important}
  *:focus-visible{outline:none!important}
  html{scrollbar-width:none!important}
`;

/* ───────────────────────────── procedura per pozycja ───────────────────────────── */

async function settle(page) {
  await page.waitForSelector(`${ROOT}[data-ready="true"]`, { timeout: 30000 });
  await page.waitForSelector(`${ROOT} .skel`, { state: "detached", timeout: 30000 });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(
    () =>
      typeof document.getAnimations !== "function" ||
      document.getAnimations().every((a) => a.playState !== "running"),
    null,
    { timeout: 15000 },
  );
  await page.evaluate(
    () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(() => r(true)))),
  );
}

async function runStep(page, step, slug) {
  const where = `${slug}: ${step.why ?? step.kind}`;
  if (step.kind === "click") {
    const loc = page.locator(step.sel).first();
    if ((await loc.count()) === 0) throw new Error(`${where}: brak elementu: ${step.sel}`);
    await loc.click({ timeout: 10000 });
    return;
  }
  if (step.kind === "clickInRow") {
    const row = page.locator(`${step.table} tbody tr`).nth(step.row);
    const loc = row.locator(step.sel).first();
    if ((await loc.count()) === 0) throw new Error(`${where}: brak przycisku w wierszu ${step.row}: ${step.sel}`);
    await loc.click({ timeout: 10000 });
    return;
  }
  if (step.kind === "fill") {
    const loc = page.locator(step.sel).first();
    if ((await loc.count()) === 0) throw new Error(`${where}: brak pola: ${step.sel}`);
    await loc.fill(step.text);
    return;
  }
  if (step.kind === "fillLabel") {
    const loc = page.getByLabel(step.name, { exact: true }).first();
    if ((await loc.count()) === 0) throw new Error(`${where}: brak pola o etykiecie „${step.name}”`);
    await loc.fill(step.text);
    return;
  }
  if (step.kind === "slider") {
    /* Suwak przestawiamy klawiaturą: `fill` nie działa na input[type=range], a sztuczne
       ustawienie value ominęłoby onChange Reacta. Klawisz = rola, nie atrybut testowy. */
    const loc = page.getByLabel(step.name, { exact: true }).first();
    if ((await loc.count()) === 0) throw new Error(`${where}: brak suwaka „${step.name}”`);
    await loc.focus();
    for (let i = 0; i < 400; i++) {
      const now = Number(await loc.inputValue());
      if (now === step.to) return;
      await loc.press(now < step.to ? "ArrowRight" : "ArrowLeft");
    }
    throw new Error(`${where}: suwak nie doszedł do ${step.to}`);
  }
  if (step.kind === "wait") {
    await page.waitForSelector(step.sel, { timeout: 15000 });
    return;
  }
  throw new Error(`${where}: nieznany krok ${step.kind}`);
}

/** Suma pudełek podanych zaczepów, we współrzędnych okna. */
async function unionBox(page, anchors, slug) {
  let box = null;
  for (const sel of anchors) {
    const loc = sel.includes(" >> nth=") ? page.locator(sel) : page.locator(sel).first();
    if ((await loc.count()) === 0) throw new Error(`${slug}, kadr: brak zaczepu ${sel}`);
    const b = await loc.boundingBox();
    if (!b) throw new Error(`${slug}, kadr: zaczep bez pudełka ${sel}`);
    box = box
      ? {
          x: Math.min(box.x, b.x),
          y: Math.min(box.y, b.y),
          right: Math.max(box.right, b.x + b.width),
          bottom: Math.max(box.bottom, b.y + b.height),
        }
      : { x: b.x, y: b.y, right: b.x + b.width, bottom: b.y + b.height };
  }
  return { x: box.x, y: box.y, width: box.right - box.x, height: box.bottom - box.y };
}

/** Rozszerza pudełko do zadanych proporcji, ale NIGDY poza obszar dashboardu.
    PUŁAPKA (widoczna na pierwszym kontakcie zbiorczym): kadr niższy niż proporcja rośnie
    w pionie, a rosnąc „na środek” wyjeżdża nad dashboard i wciąga pasek nawigacji strony.
    Dlatego granicą jest pudełko `[data-dashboard]` przycięte do okna i do wysokości nagłówka. */
function toAspect(box, aspect, pad, bounds) {
  let x = box.x - pad;
  let y = box.y - pad;
  let w = box.width + pad * 2;
  let h = box.height + pad * 2;
  if (w / h < aspect) {
    const nw = h * aspect;
    x -= (nw - w) / 2;
    w = nw;
  } else {
    const nh = w / aspect;
    y -= (nh - h) / 2;
    h = nh;
  }
  const bw = bounds.right - bounds.left;
  const bh = bounds.bottom - bounds.top;
  if (w > bw) {
    w = bw;
    h = w / aspect;
  }
  if (h > bh) {
    h = bh;
    w = h * aspect;
  }
  x = Math.min(Math.max(bounds.left, x), bounds.right - w);
  y = Math.min(Math.max(bounds.top, y), bounds.bottom - h);
  return { x: Math.round(x), y: Math.round(y), width: Math.round(w), height: Math.round(h) };
}

/** Zrzut okna + crop: jeden przebieg strony, dowolna liczba proporcji kadru. */
async function shoot(page, entry, brandRe) {
  const slug = entry.from ?? entry.slug;
  const url = `http://127.0.0.1:${OPT.port}/narzedzia/${slug}`;
  await page.setViewportSize(VIEWPORT);
  await page.goto(url, { waitUntil: "load", timeout: 45000 });
  await page.addStyleTag({ content: STABLE_CSS });
  await page.locator(ROOT).first().scrollIntoViewIfNeeded();
  await settle(page);
  for (const step of entry.steps) await runStep(page, step, entry.slug);
  await settle(page);

  const html = await page.content();
  if (brandRe.test(html)) throw new Error(`${entry.slug}: marka firmy źródłowej w DOM, zrzut wstrzymany`);

  const navH = await page.evaluate(() => {
    const el = document.querySelector("header");
    if (!el) return 0;
    return getComputedStyle(el).position === "fixed" ? el.getBoundingClientRect().bottom : 0;
  });
  const navSafe = navH + 8;

  /* Wysokość okna dopasowana do kadru, nie do samego zaczepu: pudełko szersze niż wyższe
     rośnie w pionie przy dopełnianiu do 16:10, więc okno musi mieć zapas na PEŁNĄ wysokość
     kadru (`width / 1.6`). Szerokość zostaje stała (1440), żeby nie przeskoczyć breakpointu
     siatki i nie zmienić układu dashboardu. */
  let box = await unionBox(page, entry.anchors, entry.slug);
  const need = Math.ceil(Math.max(box.height, box.width / 1.6) + navSafe + 64);
  if (need > VIEWPORT.height) {
    await page.setViewportSize({ width: VIEWPORT.width, height: Math.min(VIEWPORT_MAX_H, need) });
    await settle(page);
    box = await unionBox(page, entry.anchors, entry.slug);
  }
  const vh = page.viewportSize().height;
  const vw = page.viewportSize().width;

  /* Zaczep ustawiamy POŚRODKU wolnej wysokości okna, nie tuż pod nagłówkiem.
     PUŁAPKA (14 % kadru uciętego w protokołach i rejestrze): granicą kadru jest pudełko
     dashboardu przycięte do okna; gdy zaczep siedzi przy dolnej krawędzi dashboardu,
     dopełnienie do proporcji nie ma dokąd urosnąć w pionie i zwęża kadr, obcinając
     ostatnie kolumny tabeli. Wyśrodkowanie daje zapas w obie strony. */
  await page.evaluate((dy) => window.scrollTo(0, Math.max(0, window.scrollY + dy)), box.y - Math.max(navSafe, navSafe + (vh - navSafe - box.height) / 2));
  await settle(page);
  box = await unionBox(page, entry.anchors, entry.slug);

  const rootBox = await page.locator(ROOT).first().boundingBox();
  const bounds = {
    left: Math.max(0, rootBox.x - 8),
    top: Math.max(0, rootBox.y - 8, navSafe),
    right: Math.min(vw, rootBox.x + rootBox.width + 8),
    bottom: Math.min(vh, rootBox.y + rootBox.height + 8),
  };

  const png = await page.screenshot({ type: "png" });
  const nondet = await page.evaluate(() => window.__nondet);
  return { png, box, bounds, nondet };
}

/* ───────────────────────────── zapis plików ───────────────────────────── */

async function writeVariant(sharp, png, box, bounds, out, file) {
  const rect = toAspect(box, out.w / out.h, 18, bounds);
  const crop = {
    left: Math.round(rect.x * DPR),
    top: Math.round(rect.y * DPR),
    width: Math.round(rect.width * DPR),
    height: Math.round(rect.height * DPR),
  };
  let last = null;
  for (const quality of QUALITY_LADDER) {
    const buf = await sharp(png)
      .extract(crop)
      .resize(out.w, out.h, { fit: "cover", kernel: "lanczos3" })
      .webp({ quality, effort: 6 })
      .toBuffer();
    last = { buf, quality };
    if (buf.length <= out.maxKB * 1024) break;
  }
  if (last.buf.length > out.maxKB * 1024) {
    throw new Error(
      `${path.basename(file)}: ${(last.buf.length / 1024).toFixed(1)} KB przy jakości ${last.quality}, ` +
        `limit ${out.maxKB} KB. Poniżej drabinki nie schodzimy: zaciaśnij kadr w scenie, nie rozmywaj pliku.`,
    );
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, last.buf);
  return {
    bytes: last.buf.length,
    quality: last.quality,
    sha256: crypto.createHash("sha256").update(last.buf).digest("hex"),
    rect,
    /* Kadr węższy niż zaczep = coś z prawej zostało ucięte, bo dopełnienie do proporcji
       nie zmieściło się w wysokości dashboardu. Cichy przycięty obraz jest gorszy od błędu,
       więc wychodzi to w raporcie jako obserwacja do poprawy sceny (wyższy zaczep). */
    trimPct: Math.max(0, Math.round(((box.width - rect.width) / box.width) * 100)),
  };
}

/* ───────────────────────────── kontakt zbiorczy ───────────────────────────── */

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/* Kolory arkusza czytamy z `src/styles/tokens.css`, zamiast wpisywać je literałami:
   tokeny są prawem także dla materiału roboczego, a przy zmianie palety arkusz sam się
   dostraja. Bierzemy PIERWSZĄ definicję każdej zmiennej, czyli motyw ciemny z bloku
   `:root` (dalej w pliku stoją nadpisania motywu jasnego). */
function themeColors() {
  const css = fs.readFileSync(path.join(SITE, "src", "styles", "tokens.css"), "utf8");
  const raw = new Map();
  for (const m of css.matchAll(/(--[a-z0-9-]+)\s*:\s*([^;]+);/gi)) {
    if (!raw.has(m[1])) raw.set(m[1], m[2].split("/*")[0].trim());
  }
  const resolve = (name, depth = 0) => {
    const v = raw.get(name);
    if (!v || depth > 8) throw new Error(`tokens.css: nie umiem rozwinąć ${name}`);
    const ref = /^var\((--[a-z0-9-]+)\)$/i.exec(v);
    return ref ? resolve(ref[1], depth + 1) : v;
  };
  return {
    background: resolve("--background"),
    surface: resolve("--surface"),
    border: resolve("--border"),
    accent: resolve("--accent"),
    muted: resolve("--foreground-muted"),
    faint: resolve("--foreground-faint"),
  };
}

async function contactSheet(sharp, manifest) {
  const C = themeColors();
  const CELL_W = 480;
  const CELL_H = 300;
  const LABEL_H = 34;
  const COLS = 4;
  const ROWS = 4;
  const items = SCENES.map((s) => ({
    slug: s.slug,
    file: manifest.shots[s.slug]?.files.find((f) => f.path.endsWith("-480.webp")),
    skip: s.skip,
  }));
  const width = COLS * CELL_W;
  const height = ROWS * (CELL_H + LABEL_H);
  const layers = [];
  for (let i = 0; i < items.length; i++) {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    const left = col * CELL_W;
    const top = row * (CELL_H + LABEL_H);
    const it = items[i];
    if (it.file) {
      const src = path.join(SITE, "public", it.file.path.replace(/^\//, ""));
      layers.push({ input: await sharp(src).toBuffer(), left, top });
    } else {
      const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${CELL_W}" height="${CELL_H}">
        <rect width="100%" height="100%" fill="${C.surface}" stroke="${C.border}"/>
        <text x="50%" y="48%" text-anchor="middle" font-family="sans-serif" font-size="15" fill="${C.muted}">BRAK ZRZUTU</text>
        <text x="50%" y="58%" text-anchor="middle" font-family="sans-serif" font-size="11" fill="${C.faint}">${esc(it.skip ?? "")}</text>
      </svg>`;
      layers.push({ input: Buffer.from(svg), left, top });
    }
    const label = `<svg xmlns="http://www.w3.org/2000/svg" width="${CELL_W}" height="${LABEL_H}">
      <rect width="100%" height="100%" fill="${C.background}"/>
      <text x="10" y="22" font-family="sans-serif" font-size="13" fill="${C.accent}">${i + 1}. ${esc(it.slug)}</text>
    </svg>`;
    layers.push({ input: Buffer.from(label), left, top: top + CELL_H });
  }
  const file = path.join(SCRATCH, "contact-sheet.png");
  fs.mkdirSync(SCRATCH, { recursive: true });
  await sharp({ create: { width, height, channels: 3, background: C.background } })
    .composite(layers)
    .png()
    .toFile(file);
  return file;
}

/* ───────────────────────────── manifest ───────────────────────────── */

function sortDeep(v) {
  if (Array.isArray(v)) return v.map(sortDeep);
  if (v && typeof v === "object") {
    return Object.fromEntries(
      Object.keys(v)
        .sort()
        .map((k) => [k, sortDeep(v[k])]),
    );
  }
  return v;
}

function readManifest() {
  if (!fs.existsSync(MANIFEST)) return { engine: OPT.engine, shots: {} };
  return JSON.parse(fs.readFileSync(MANIFEST, "utf8"));
}

/* ───────────────────────────── główny przebieg ───────────────────────────── */

async function main() {
  if (!fs.existsSync(path.join(DIST, "index.html"))) {
    throw new Error(`Brak ${DIST}/index.html, najpierw: cd site && npm run build`);
  }
  const brandRe = brandPattern();
  const { mod: sharp } = await loadExternal("sharp", "SHARP_DIR", "SHARP_PKG");
  const { mod: pw, dir: pwDir } = await loadExternal("playwright-core", "PW_DIR", "PW_CORE");

  const wanted = (e) => OPT.only.length === 0 || OPT.only.includes(e.slug);
  const queue = [...SCENES.filter((s) => !s.skip), HERO].filter(wanted);

  const server = await startServer(OPT.port);
  const browser = await pw[OPT.engine].launch({
    executablePath: browserExecutable(OPT.engine, pwDir),
    headless: true,
  });
  const context = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: DPR,
    colorScheme: "dark",
    reducedMotion: "reduce",
    locale: OPT.lang === "pl" ? "pl-PL" : "en-US",
    timezoneId: "Europe/Warsaw",
    hasTouch: false,
    isMobile: false,
  });
  await context.addInitScript(initScript({ frozenMs: FROZEN_MS, seed: RANDOM_SEED, lang: OPT.lang }));
  const page = await context.newPage();

  /* `--only` dopisuje do istniejącego manifestu; pełny przebieg buduje go od zera,
     żeby nie zostawały wpisy po pozycjach, których już nie ma w tablicy scen. */
  const manifest = OPT.verify || OPT.only.length ? readManifest() : { engine: OPT.engine, shots: {} };
  const previous = readManifest();
  const problems = [];
  const notes = [];
  const report = [];

  try {
    for (const entry of queue) {
      const t0 = Date.now();
      process.stderr.write(`… ${entry.slug}\n`); // ślad na wypadek zawieszenia, nie zdobienie
      const { png, box, bounds, nondet } = await shoot(page, entry, brandRe);
      if (OPT.debug) {
        fs.mkdirSync(SCRATCH, { recursive: true });
        fs.writeFileSync(path.join(SCRATCH, `debug-${entry.slug}.png`), png);
      }
      const outputs = entry.outputs ?? TILE_OUTPUTS;
      const files = [];
      for (const out of outputs) {
        const name = `${entry.slug}-v1-${out.suffix}.webp`;
        const dir = OUT[out.dir];
        const file = path.join(dir, name);
        const pub = `/${path.relative(path.join(SITE, "public"), file).split(path.sep).join("/")}`;
        if (OPT.verify) {
          const before = previous.shots[entry.slug]?.files.find((f) => f.path === pub);
          const now = await writeVariantDry(sharp, png, box, bounds, out);
          if (!before) problems.push(`${pub}: brak w manifeście`);
          else if (before.sha256 !== now.sha256) problems.push(`${pub}: inna suma sha256`);
          files.push({ path: pub, w: out.w, h: out.h, ...now, role: out.role });
        } else {
          const res = await writeVariant(sharp, png, box, bounds, out, file);
          if (res.trimPct > 5) notes.push(`${entry.slug} ${out.suffix}: kadr węższy o ${res.trimPct}% od zaczepu, podnieś zaczep sceny`);
          files.push({ path: pub, w: out.w, h: out.h, bytes: res.bytes, quality: res.quality, sha256: res.sha256, role: out.role });
        }
      }
      manifest.shots[entry.slug] = {
        source: `/narzedzia/${entry.from ?? entry.slug}`,
        scene: entry.scene,
        frame: entry.frame,
        crop: `${Math.round(box.width)}×${Math.round(box.height)} css px @${DPR}x`,
        files,
      };
      const ms = Date.now() - t0;
      const sizes = files.map((f) => `${f.w}px ${(f.bytes / 1024).toFixed(1)} KB q${f.quality}`).join(" · ");
      report.push(`${entry.slug.padEnd(24)} ${String(ms).padStart(5)} ms  ${sizes}`);
      /* `Date.now` i `Math.random` są ZASTĄPIONE ziarnem, więc zrzut zostaje powtarzalny:
         to obserwacja dla strażnika (skąd losowość na stronie), nie awaria. Sieć w trakcie
         zrzutu to co innego: demo ma liczyć lokalnie, więc każdy request jest problemem. */
      const seeded = Object.entries(nondet).filter(([k, n]) => n > 0 && (k === "dateNow" || k === "random"));
      const network = Object.entries(nondet).filter(([k, n]) => n > 0 && (k === "fetch" || k === "xhr"));
      if (seeded.length) notes.push(`${entry.slug}: ${seeded.map(([k, n]) => `${k}×${n}`).join(", ")} (zaziarnione)`);
      if (network.length) problems.push(`${entry.slug}: ruch sieciowy w demie: ${network.map(([k, n]) => `${k}×${n}`).join(", ")}`);
    }

    for (const s of SCENES.filter((x) => x.skip)) {
      manifest.shots[s.slug] = { scene: s.scene, frame: s.frame, skipped: s.skip, files: [] };
    }

    if (!OPT.verify) {
      fs.mkdirSync(path.dirname(MANIFEST), { recursive: true });
      fs.writeFileSync(MANIFEST, `${JSON.stringify(sortDeep(manifest), null, 2)}\n`, "utf8");
    }
    if (OPT.contactSheet) {
      const sheet = await contactSheet(sharp, manifest);
      report.push(`kontakt zbiorczy: ${sheet}`);
    }
  } finally {
    await context.close();
    await browser.close();
    server.close();
  }

  console.log(report.join("\n"));
  if (notes.length) console.log(`\nObserwacje:\n- ${notes.join("\n- ")}`);
  if (problems.length) {
    console.error(`\nDO SPRAWDZENIA:\n- ${problems.join("\n- ")}`);
    process.exitCode = 1;
  } else {
    console.log(`\nOK: ${queue.length} pozycji, silnik ${OPT.engine}, manifest ${path.relative(REPO, MANIFEST)}`);
  }
}

/** Wariant „na sucho” dla --verify: liczy te same bajty, ale nic nie zapisuje. */
async function writeVariantDry(sharp, png, box, bounds, out) {
  const rect = toAspect(box, out.w / out.h, 18, bounds);
  const crop = {
    left: Math.round(rect.x * DPR),
    top: Math.round(rect.y * DPR),
    width: Math.round(rect.width * DPR),
    height: Math.round(rect.height * DPR),
  };
  let last = null;
  for (const quality of QUALITY_LADDER) {
    const buf = await sharp(png)
      .extract(crop)
      .resize(out.w, out.h, { fit: "cover", kernel: "lanczos3" })
      .webp({ quality, effort: 6 })
      .toBuffer();
    last = { buf, quality };
    if (buf.length <= out.maxKB * 1024) break;
  }
  return {
    bytes: last.buf.length,
    quality: last.quality,
    sha256: crypto.createHash("sha256").update(last.buf).digest("hex"),
  };
}

await main();
