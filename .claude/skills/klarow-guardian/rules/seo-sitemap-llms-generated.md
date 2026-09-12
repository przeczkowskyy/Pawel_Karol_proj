---
id: seo-sitemap-llms-generated
title: sitemap.xml i llms.txt wyłącznie generowane w buildzie; ręczny public/sitemap.xml nigdy
impact: BLOCKER
tags: [seo, sitemap, llms, geo, build]
source: CLAUDE.md sesja cz. 7 („sitemap.xml i llms.txt GENEROWANE z tools.ts; public/sitemap.xml USUNIĘTY, nie odtwarzać!") / site-audit.md §5 p.2 / synthesis §2.8 p.1 (llms.txt z messaging.ts), §2.2 (priorytety: / 1.0, /narzedzia 0.9, /oferta 0.9, /faq 0.7, /rodo 0.3, narzędzia 0.8)
added: 2026-09-12
---

## Zasada

`dist/sitemap.xml` i `dist/llms.txt` powstają WYŁĄCZNIE w `scripts/prerender.mjs` z funkcji `sitemapXml()` i `llmsTxt()` w `src/prerender/entry.tsx`, które czytają `getTools()`, listę tras z `prerenderAll()` i `messaging.ts`. Plik `site/public/sitemap.xml` ani `site/public/llms.txt` nie istnieje i nie wolno go utworzyć (Vite skopiowałby go do `dist` i nadpisał generowany). Sitemapa zawiera dokładnie trasy z `prerenderAll()` **minus trasy z `noindex`**: dziś odpadają `404` i `/rodo` (strona ma `noindex` do zatwierdzenia treści przez radcę, D-21 — `legal-rodo-page-required` §Wyjątki), czyli **17 `<loc>` z 19 HTML**. Po zdjęciu `noindex` z `/rodo` (D-21) trasa wchodzi do sitemapy z priorytetem 0.3 i liczba `<loc>` rośnie do 18; to jedyny dopuszczalny moment zmiany progu w tej regule, w `seo-lastmod-from-git-not-now` i w bramce `verify-site.mjs`. `<lastmod>` z gita (`seo-lastmod-from-git-not-now`). `llms.txt` zawiera: opis firmy z `messaging.oneLiner`/`subtext`, filary, 13 narzędzi z linkami i hookami, sekcje `/narzedzia`, `/oferta`, `/faq`, `/rodo` (w `llms.txt` `/rodo` JEST, mimo `noindex` w sitemapie: to adres z szablonów outboundu, a `llms.txt` nie jest sygnałem indeksacji), kontakt z `contact.ts`, sekcję EN. `robots.txt` w `public/` wskazuje `Sitemap: https://klarow.com/sitemap.xml` (to jedyny statyczny plik SEO w `public/`).

## Mechanizm awarii (dlaczego)

Ręczna sitemapa rozjeżdża się z trasami po pierwszym nowym narzędziu (dziś 13, jutro 15) i wysyła Google adresy 404 albo pomija nowe; Vite kopiuje `public/` do `dist/` PO buildzie klienta, ale PRZED prerenderem, więc generowany plik nadpisuje ręczny bez ostrzeżenia, a przy odwrotnej kolejności (`emptyOutDir`) ręczny nadpisuje generowany. `llms.txt` pisany ręcznie dryfuje od `messaging.ts` (T12: dryf przekazu między powierzchniami) i dziś zawiera „wyrosły na Excelu"/„Windows + Excel" (`entry.tsx:449-452, 491-494`), które schodzą z przekazu (D-02).

## Niepoprawnie

```
site/public/sitemap.xml      ← ręcznie utrzymywany plik (usunięty 2026-07-23; nie odtwarzać)
site/public/llms.txt         ← j.w.
```
```tsx
// entry.tsx llmsTxt(): ręczna proza zamiast messaging.ts
return `# Klarow\n\n> Custom narzędzia pod proces dla firm 20–250 osób, które „wyrosły na Excelu" …`;
```

## Poprawnie

```tsx
// entry.tsx
function sitemapXml(routes: RouteOut[], lastmod: Record<string, string>): string {
  const urls = routes.filter((r) => !r.noindex).map((r) =>
    `  <url><loc>${ORIGIN}${r.path === "/" ? "/" : r.path}</loc><lastmod>${lastmod[r.path]}</lastmod><priority>${r.priority}</priority></url>`);
  return `<?xml version="1.0" encoding="UTF-8"?>\n<!-- GENEROWANE w buildzie (scripts/prerender.mjs) z prerenderAll(); nie edytuj ręcznie -->\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join("\n")}\n</urlset>\n`;
}
function llmsTxt(pl: ToolItem[], en: ToolItem[]): string {
  return `# Klarow\n\n> ${MESSAGING.oneLiner.pl} ${MESSAGING.subtext.pl}\n\n${MESSAGING.pillars.map((p) => `- ${p.pl}`).join("\n")}\n…`;
}
```

## Test

```bash
test ! -f site/public/sitemap.xml && test ! -f site/public/llms.txt && echo "OK: brak ręcznych plików"
grep -c "<loc>" site/dist/sitemap.xml                                        # 17 (19 HTML − 404 − /rodo noindex; po D-21: 18)
grep -c "klarow.com/rodo" site/dist/sitemap.xml                              # 0 do D-21 (noindex); po zdjęciu noindex: 1
grep -c "klarow.com/404" site/dist/sitemap.xml                               # 0
grep -ci "noindex" site/dist/rodo.html                                       # 1 (dopóki 0 w sitemapie, musi być 1 tutaj)
grep -nE "GENEROWANE" site/dist/sitemap.xml                                  # 1
grep -nE "Sitemap: https://klarow.com/sitemap.xml" site/public/robots.txt    # 1
grep -nE "wyros(ł|l)y na Excelu|Windows \+ Excel" site/dist/llms.txt         # 0 (po D-02)
node .claude/skills/klarow-guardian/scripts/verify-site.mjs                                    # m.in. sitemap ↔ dist, llms.txt z linkami do /narzedzia, /oferta, /faq, /rodo
# PLANOWANE (F3, verify-site.mjs nie zna tego trybu): node .claude/skills/klarow-guardian/scripts/verify-site.mjs --sitemap-llms
```

Severity: BLOCKER.

## Wyjątki

`robots.txt`, `_headers`, `_redirects`, plik weryfikacji GSC (`google<token>.html`) są statyczne w `public/` z natury.
