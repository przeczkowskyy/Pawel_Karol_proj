import { existsSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

/* Prerender po buildzie klienta (część `npm run build`, także na CI
   Cloudflare Pages, czyli czysty Node, zero przeglądarek):
   1. dist/index.html to szablon (skrypty/linki z hashami zostają nietknięte),
   2. dla każdej trasy z dist-ssr/entry.js podmieniamy title/description/
      robots/canonical/og/twitter i wstrzykujemy JSON-LD + statyczny shell do #root,
   3. piszemy dist/narzedzia/<slug>.html, dist/rodo.html i dist/404.html
      (Pages serwuje je bez przekierowań dla ścieżek bez rozszerzenia;
      _redirects dalej łapie całą resztę),
   4. sitemap.xml i llms.txt lecą z tools.ts i messaging.ts: jedno źródło prawdy.

   Trasy z `noindex` (dziś /rodo do przeglądu radcy i 404) dostają meta robots
   i NIE wchodzą do sitemapy; 404 dodatkowo nie dostaje canonical ani og:url,
   bo nie jest kanonicznym adresem żadnej treści. */

const dir = path.dirname(fileURLToPath(import.meta.url));
const site = path.resolve(dir, "..");
const dist = path.join(site, "dist");

const { prerenderAll } = await import(pathToFileURL(path.join(site, "dist-ssr", "entry.js")).href);
const { routes, sitemap, llms } = prerenderAll();

const template = readFileSync(path.join(dist, "index.html"), "utf8");

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
/* JSON-LD wolno mu siedzieć w <script>, ale nie wolno mu domknąć taga */
const jsonLdSafe = (o) => JSON.stringify(o).replace(/</g, "\\u003c");

for (const r of routes) {
  let html = template;

  /* zdejmij tagi z szablonu, które nadpisujemy per trasa */
  html = html
    .replace(/<title>[\s\S]*?<\/title>/, "")
    .replace(/<meta[^>]*name="description"[^>]*>/, "")
    .replace(/<link[^>]*rel="canonical"[^>]*>/, "")
    .replace(/<meta[^>]*property="og:title"[^>]*>/, "")
    .replace(/<meta[^>]*property="og:description"[^>]*>/, "")
    .replace(/<meta[^>]*property="og:url"[^>]*>/, "");

  const url = "https://klarow.com" + (r.path === "/" ? "/" : r.path);
  /* 404 nie jest adresem kanonicznym żadnej treści: bez canonical i bez og:url */
  const isErrorPage = r.file === "404.html";

  const tags = [
    `<title>${esc(r.title)}</title>`,
    `<meta name="description" content="${esc(r.description)}" />`,
    r.noindex ? `<meta name="robots" content="noindex, follow" />` : "",
    isErrorPage ? "" : `<link rel="canonical" href="${url}" />`,
    isErrorPage ? "" : `<meta property="og:title" content="${esc(r.title)}" />`,
    isErrorPage ? "" : `<meta property="og:description" content="${esc(r.description)}" />`,
    isErrorPage ? "" : `<meta property="og:url" content="${url}" />`,
    isErrorPage ? "" : `<meta property="og:locale" content="pl_PL" />`,
    isErrorPage ? "" : `<meta property="og:locale:alternate" content="en_US" />`,
    /* twitter:* musi być w STATYCZNYM HTML: LinkedIn, Slack i Teams czytają
       kartę bez wykonywania JS (klientowy Seo.tsx ustawia to samo po nawigacji).
       Karta „summary”, bo og:image jest kwadratowe 512×512; „summary_large_image”
       dopiero z obrazem 1200×630 (scripts/og.mjs, faza assetów). */
    isErrorPage ? "" : `<meta name="twitter:card" content="summary" />`,
    isErrorPage ? "" : `<meta name="twitter:title" content="${esc(r.title)}" />`,
    isErrorPage ? "" : `<meta name="twitter:description" content="${esc(r.description)}" />`,
    /* id=seo-jsonld: klientowy Seo.tsx zdejmuje ten blok przy montażu i wstawia
       własny; bez id po starcie Reacta strona miałaby PODWÓJNY JSON-LD,
       a po nawigacji SPA nieaktualny */
    r.jsonLd && r.jsonLd.length
      ? `<script type="application/ld+json" id="seo-jsonld">${jsonLdSafe(r.jsonLd)}</script>`
      : "",
  ].filter(Boolean);

  const head = tags.join("\n    ") + "\n  </head>";
  /* replacement jako FUNKCJA: string interpretowałby sekwencje $ ($&, $', $1)
     z treści (np. kwoty "$'000" przy narzędziu USD) i cicho korumpował HTML */
  html = html.replace(/<\/head>/, () => head);

  if (!html.includes('<div id="root"></div>')) {
    throw new Error(`Szablon bez pustego #root: prerender ${r.file} przerwany`);
  }
  html = html.replace('<div id="root"></div>', () => `<div id="root">${r.bodyHtml}</div>`);

  const out = path.join(dist, r.file);
  mkdirSync(path.dirname(out), { recursive: true });
  writeFileSync(out, html, "utf8");
}

writeFileSync(path.join(dist, "sitemap.xml"), sitemap, "utf8");
writeFileSync(path.join(dist, "llms.txt"), llms, "utf8");

/* Bramka publikacji: dopóki w treści /rodo stoi marker decyzji founderów, brakuje
   danych administratora z art. 14 RODO, więc build wolno wgrać najwyżej na preview.
   Build celowo NIE pada: faza F0 potrzebuje zielonych bramek, a blokadę trzyma
   RODO_READY w src/data/rodo.ts i przegląd radcy. */
const rodoHtml = path.join(dist, "rodo.html");
if (existsSync(rodoHtml) && readFileSync(rodoHtml, "utf8").includes("[DECYZJA FOUNDER")) {
  console.warn(
    "prerender: UWAGA, /rodo ma jeszcze marker [DECYZJA FOUNDERÓW] w treści widocznej dla czytelnika. " +
      "Ten build NIE nadaje się na produkcję ani pod outbound: uzupełnij CONTROLLER w src/data/rodo.ts."
  );
}

const toolCount = routes.filter((r) => r.path.startsWith("/narzedzia/")).length;
const indexed = routes.filter((r) => !r.noindex).length;
console.log(
  `prerender: ${routes.length} plików HTML (${toolCount} podstron narzędzi; ` +
    `${indexed} w sitemapie, poza nią: ${routes.filter((r) => r.noindex).map((r) => r.path).join(", ") || "brak"}) ` +
    `+ sitemap.xml + llms.txt`
);
