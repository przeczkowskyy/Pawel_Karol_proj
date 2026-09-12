---
id: seo-prerender-must-keep
title: Prerender must-keep: 19 HTML z prerenderAll(), pusty #root w szablonie, id="seo-jsonld", podmiany jako funkcje
impact: BLOCKER
tags: [seo, prerender, ssg, build, cloudflare]
source: CLAUDE.md „Architektura strony" + sesja cz. 7 (prerender, 7 poprawek) / site-audit.md §1.6, §5 p.1, p.9 / synthesis §2.2 (19 HTML: 4 + 13 + /rodo + 404), §2.8 p.1 / rozstrzygnięcie nadrzędne (1): trasa /rodo, dist/rodo.html
added: 2026-09-12
---

## Zasada

`npm run build` = `vite build` → `vite build --ssr src/prerender/entry.tsx --outDir dist-ssr` → `node scripts/prerender.mjs`. Niezmienniki, których żadna zmiana nie może naruszyć:
1. Liczba plików `dist/**/*.html` = liczba tras w `prerenderAll()` = **19**: `index.html`, `narzedzia.html`, `oferta.html`, `faq.html`, `rodo.html`, `404.html` + 13 × `narzedzia/<slug>.html` (faza 2 z kartami case: 21). Nowa trasa = wpis w `prerenderAll()` + `pagesSeo.ts` + link w Navbarze lub stopce; wpada do sitemapy i `llms.txt` automatycznie.
2. Szablon `dist/index.html` ma dokładnie PUSTY `<div id="root"></div>`; `prerender.mjs` rzuca, gdy go nie ma (twardy assert, nie usuwać).
3. JSON-LD wstrzykiwany z `id="seo-jsonld"` (klientowy `Seo.tsx` zdejmuje i wstawia własny); w każdym pliku dokładnie jeden `<script type="application/ld+json" id="seo-jsonld">`.
4. Wszystkie `String.prototype.replace` w `prerender.mjs` mają replacement jako FUNKCJĘ (treść zawiera `$'`, `$&`, `$1`: kwoty „$'000" w narzędziu USD rozwalały HTML).
5. Każdy plik: 1 `<main>`, 1 `<h1>`, pełna treść tekstowa bez JS (shell z `data/*`), sekcja `lang="en"`, brak `<video>` w shellu (poster `<img>`), brak `opacity:0` na treści.
6. `entry.tsx`: zero `window`/`document`/dat/losowości/`motion/*`; komponenty użyte w shellach są SSR-safe.

## Mechanizm awarii (dlaczego)

Prerender jest jedynym powodem, dla którego Google/Bing/LLM-y widzą treść bez JS i dla którego strona degraduje się łaskawie, gdy JS nie wstanie (historia „samego tła" na iPhonie). Bez pustego `#root` shell dubluje się z treścią Reacta; bez `id="seo-jsonld"` po starcie Reacta strona ma PODWÓJNY JSON-LD, a po nawigacji SPA nieaktualny (poprawka (1) z cz. 7). Replacement-string interpretuje `$` (poprawka (2)): build zielony, HTML zepsuty. Brak wpisu w `prerenderAll()` dla `/rodo` = brak `dist/rodo.html` = soft-404 dla adresu, do którego odsyłają wszystkie szablony outboundu (peer-legal §1.1). Motion w `entry.tsx` wywala build SSR (`window is not defined`).

## Niepoprawnie

```js
html = html.replace(/<\/head>/, head);                      // string: „$'000" w treści korumpuje HTML
html = html.replace('<div id="root"></div>', r.bodyHtml);   // j.w.
```
```tsx
// entry.tsx
import { m } from "motion/react-m";           // SSR build pada
const today = new Date().toISOString();       // niedeterministyczny HTML
```

## Poprawnie

```js
html = html.replace(/<\/head>/, () => head);
if (!html.includes('<div id="root"></div>')) throw new Error(`Szablon bez pustego #root: ${r.file}`);
html = html.replace('<div id="root"></div>', () => `<div id="root">${r.bodyHtml}</div>`);
```
```tsx
// entry.tsx prerenderAll(): + { file: "rodo.html", path: "/rodo", title: PAGES_SEO.rodo.title.pl, description: PAGES_SEO.rodo.description.pl, jsonLd: [ORG_JSONLD], bodyHtml: renderToStaticMarkup(<RodoShell />) }
//                          + { file: "404.html", path: "/404", noindex: true, … bodyHtml: renderToStaticMarkup(<NotFoundShell />) }
```

## Test

```bash
cd site && npm run build
find dist -name "*.html" | wc -l                                              # 19
for f in $(find dist -name "*.html"); do [ "$(grep -c 'id="seo-jsonld"' "$f")" = 1 ] || echo "FAIL jsonld $f"; [ "$(grep -c '<main' "$f")" = 1 ] || echo "FAIL main $f"; done
grep -c '<div id="root"></div>' index.html                                    # 1 (szablon źródłowy)
grep -nE "\.replace\([^)]*,\s*[^(=]*\)" scripts/prerender.mjs | grep -vE "=> " # 0 (każdy replace z funkcją)
grep -nE "window|document|Date\(|Math\.random|motion/" src/prerender/entry.tsx # 0
test -f dist/rodo.html && test -f dist/404.html && echo "OK rodo+404"
node ../.claude/skills/klarow-guardian/scripts/verify-site.mjs --expected 19   # liczba HTML w dist vs 19
# PLANOWANE (F3, verify-site.mjs nie zna tego trybu): node ../.claude/skills/klarow-guardian/scripts/verify-site.mjs --prerender
```

Severity: BLOCKER.

## Wyjątki

`dist/404.html` jest prerenderowany, ale NIE trafia do `sitemap.xml` i ma `<meta name="robots" content="noindex">` (`seo-404-noindex-real-404`).
