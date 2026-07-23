import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

/* Prerender po buildzie klienta (część `npm run build`, także na CI
   Cloudflare Pages — czysty Node, zero przeglądarek):
   1. dist/index.html to szablon (skrypty/linki z hashami zostają nietknięte),
   2. dla każdej trasy z dist-ssr/entry.js podmieniamy title/description/
      canonical/og i wstrzykujemy JSON-LD + statyczny shell do #root,
   3. piszemy dist/narzedzia/<slug>.html (Pages serwuje je bez przekierowań
      dla ścieżek bez rozszerzenia; _redirects dalej łapie całą resztę),
   4. sitemap.xml i llms.txt lecą z tools.ts — jedno źródło prawdy. */

const dir = path.dirname(fileURLToPath(import.meta.url));
const site = path.resolve(dir, "..");
const dist = path.join(site, "dist");

const { prerenderAll } = await import(pathToFileURL(path.join(site, "dist-ssr", "entry.js")).href);
const { routes, sitemap, llms } = prerenderAll();

const template = readFileSync(path.join(dist, "index.html"), "utf8");

const esc = (s) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
/* JSON-LD wolno mu siedzieć w <script> — ale nie wolno mu domknąć taga */
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
  const head =
    `<title>${esc(r.title)}</title>\n` +
    `    <meta name="description" content="${esc(r.description)}" />\n` +
    `    <link rel="canonical" href="${url}" />\n` +
    `    <meta property="og:title" content="${esc(r.title)}" />\n` +
    `    <meta property="og:description" content="${esc(r.description)}" />\n` +
    `    <meta property="og:url" content="${url}" />\n` +
    /* id=seo-jsonld: klientowy Seo.tsx zdejmuje ten blok przy montażu i wstawia
       własny — bez id po starcie Reacta strona miałaby PODWÓJNY JSON-LD,
       a po nawigacji SPA nieaktualny */
    `    <script type="application/ld+json" id="seo-jsonld">${jsonLdSafe(r.jsonLd)}</script>\n  </head>`;
  /* replacement jako FUNKCJA: string interpretowałby sekwencje $ ($&, $', $1)
     z treści (np. kwoty "$'000" przy narzędziu USD) i cicho korumpował HTML */
  html = html.replace(/<\/head>/, () => head);

  if (!html.includes('<div id="root"></div>')) {
    throw new Error(`Szablon bez pustego #root — prerender ${r.file} przerwany`);
  }
  html = html.replace('<div id="root"></div>', () => `<div id="root">${r.bodyHtml}</div>`);

  const out = path.join(dist, r.file);
  mkdirSync(path.dirname(out), { recursive: true });
  writeFileSync(out, html, "utf8");
}

writeFileSync(path.join(dist, "sitemap.xml"), sitemap, "utf8");
writeFileSync(path.join(dist, "llms.txt"), llms, "utf8");

console.log(
  `prerender: ${routes.length} tras (index + ${routes.length - 1} narzędzi) + sitemap.xml + llms.txt`
);
