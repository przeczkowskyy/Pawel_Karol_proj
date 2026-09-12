# site: landing klarow.com

Strona firmowa: Vite + React 19 + TypeScript, treść w modułach `src/data/*`, zero backendu.
Build daje czysty katalog statyczny (`dist/`), który Cloudflare Pages serwuje bez żadnej usługi
po stronie serwera. Dwujęzyczność PL + EN: każdy widoczny string to para `{ pl, en }`
konsumowana przez `pick()` z `src/i18n.tsx`; PL jest kanoniczne.

## Uruchomienie

```bash
cd site
npm install
npm run dev        # http://localhost:5173, HMR
npm run build      # klient + SSR-shell + prerender  ->  dist/
npm run preview    # podgląd zbudowanego dist/
```

`npm run build` to trzy kroki w jednym: build klienta, build SSR (`src/prerender/entry.tsx`)
i `node scripts/prerender.mjs`. Prerender jest częścią builda, nie osobnym krokiem przed
wdrożeniem: zapisuje statyczne HTML dla każdej trasy (pełna treść tekstowa i meta bez JS),
a z `src/data/tools.ts` generuje `sitemap.xml` i `llms.txt`. Ręcznie utrzymywanego
`public/sitemap.xml` nie ma i nie należy go odtwarzać. Szablon `index.html` musi zachować
PUSTY `<div id="root"></div>`: `prerender.mjs` przerywa build, gdy go nie znajdzie.

## Bramki jakości

```bash
npm run lint       # ESLint (react-hooks, jsx-a11y)
npm run test       # node --test, golden-testy silników z src/lib
npm run check      # lint + test + tsc --noEmit + build + verify-site.mjs
```

`npm run check` jest bramką przed pushem na `main`. Osobno, z korzenia repo:
`node ".claude/skills/klarow-guardian/scripts/audit-static.mjs" <ścieżki>`.

## Środowisko

`npx` w tym repo NIE działa: znak `&` w ścieżce katalogu łamie shimy cmd
(„'Pawe' is not recognized…"). Binarki wołamy wprost przez node, na przykład
`node node_modules/typescript/bin/tsc --noEmit` albo `node node_modules/vite/bin/vite.js build`.
Skrypty npm w `package.json` są napisane w ten sam sposób i działają lokalnie oraz na CI.
`npm install` i `npm run <skrypt>` działają normalnie.

## Gdzie jest reszta

| Co | Gdzie |
|---|---|
| Plan przebudowy v2 (fazy F0–F5, architektura, budżety) | `../docs/plan/strona-v2-plan.md` |
| Strażnik zasad: marka, design, motion, copy, SEO, sekrety | `../.claude/skills/klarow-guardian/` (`SKILL.md`, `rules/`, `scripts/`) |
| Decyzje i stan operacyjny projektu | `../CLAUDE.md` |
| Design system (kit `company-ui`) | `../ui-kit/skills/company-ui/` |

## Struktura

```
site/
├─ index.html          # szablon: meta fallback, samonaprawa cache, tryb ?debug=1
├─ public/             # _headers, _redirects, robots.txt, fonty, favicony, media
├─ scripts/            # prerender.mjs (statyczne HTML, sitemap, llms.txt)
└─ src/
   ├─ data/            # jedyne źródło treści i meta (tools, toolsSeo, pagesSeo, faq)
   ├─ components/      # sekcje strony, dashboardy dem
   ├─ lib/             # silniki liczące dem (deterministyczne: bez dat, losowości i sieci)
   ├─ pages/           # podstrony narzędzi
   └─ prerender/       # entry.tsx: shelle SSR dla prerenderu
```
