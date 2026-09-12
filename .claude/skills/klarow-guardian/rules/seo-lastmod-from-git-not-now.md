---
id: seo-lastmod-from-git-not-now
title: <lastmod> w sitemap z daty commitu pliku danych (git log), nigdy z Date.now() w buildzie
impact: MEDIUM
tags: [seo, sitemap, lastmod, determinism, build]
source: site-audit.md §3.6 p.4 (brak lastmod), §6 p.12 (lastmod deterministycznie z gita, nie Date.now) / synthesis §2.8 p.1 (`git log -1 --format=%cI -- <plik danych>`) / CLAUDE.md #6 (determinizm jako obietnica; build powtarzalny)
added: 2026-09-12
---

## Zasada

Każdy `<url>` w `sitemap.xml` ma `<lastmod>` w ISO 8601 pochodzący z ostatniego commitu pliku, który definiuje treść trasy: `/` → `data/home.ts` + `messaging.ts`; `/narzedzia` → `data/tools.ts`; `/narzedzia/<slug>` → max(`tools.ts`, `toolsSeo.ts`); `/oferta` → `data/oferta.ts`; `/faq` → `data/faq.ts`; `/rodo` → `data/rodo.ts`. Źródło: `git log -1 --format=%cI -- <plik>` wykonane w `scripts/prerender.mjs` (Node `child_process.execFileSync("git", …)`, bez shella, bo ścieżka repo ma `&`). Gdy git jest niedostępny (Cloudflare Pages ma klon płytki, ale z historią `--depth`; przy braku historii): fallback = data z `package.json` pola `lastmod` aktualizowana ręcznie w PR z treścią, NIGDY `new Date()`. Dwa buildy tego samego commitu dają identyczny `sitemap.xml` (bramka).

## Mechanizm awarii (dlaczego)

`Date.now()`/`new Date()` w buildzie stempluje każdą trasę datą deployu: Google widzi „wszystko zmienione dziś" przy każdym pushu, uczy się ignorować `lastmod` (oficjalnie: „lastmod musi być konsekwentnie wiarygodny, inaczej jest pomijany") i strona traci jedyny tani sygnał do ponownego crawlu podstron, które faktycznie się zmieniły. Niedeterministyczny build łamie też zasadę „dwa przebiegi = identyczny wynik" (CLAUDE.md #6), przez co diff `dist` między buildami jest bezużyteczny do weryfikacji deployu po treści (memory `klarow-cf-deploy-verify-by-content`).

## Niepoprawnie

```js
const lastmod = new Date().toISOString().slice(0, 10);
urls.push(`<url><loc>${loc}</loc><lastmod>${lastmod}</lastmod></url>`);
```

## Poprawnie

```js
// scripts/prerender.mjs
import { execFileSync } from "node:child_process";
const gitDate = (file) => {
  try { return execFileSync("git", ["log", "-1", "--format=%cI", "--", file], { cwd: site, encoding: "utf8" }).trim().slice(0, 10) || null; }
  catch { return null; }
};
const FALLBACK = JSON.parse(readFileSync(path.join(site, "package.json"), "utf8")).lastmod;   // "2026-09-12", edytowane w PR z treścią
const lastmodFor = (files) => files.map(gitDate).filter(Boolean).sort().at(-1) ?? FALLBACK;    // Node 24: at() OK w skrypcie
const lastmod = Object.fromEntries(routes.map((r) => [r.path, lastmodFor(r.sources)]));       // r.sources z prerenderAll()
```

## Test

```bash
grep -nE "new Date\(|Date\.now\(" site/scripts/prerender.mjs site/src/prerender/entry.tsx     # 0
grep -c "<lastmod>" site/dist/sitemap.xml                                                     # 17 (= liczba <loc>; po D-21, gdy /rodo traci noindex: 18)
# determinizm buildu: dwa buildy, identyczna sitemapa
cd site && npm run build >/dev/null && cp dist/sitemap.xml /tmp/s1.xml && npm run build >/dev/null && diff /tmp/s1.xml dist/sitemap.xml && echo "OK deterministic"
# lastmod ≤ data ostatniego commitu repo
```

Severity: MEDIUM (raport); `Date.now` w buildzie = HIGH w `--fail-on`.

## Wyjątki

Pole `ran_at` w JSONL raportów audytu (metadane, nie artefakt strony) może mieć bieżący czas.
