---
id: perf-chunk-size-gate
title: verify-site.mjs porównuje rozmiary chunków z baseline: wzrost > 5 % lub nowy chunk krytyczny = fail; baseline zmienia tylko świadomy commit
impact: HIGH
tags: [perf, bundle, gate, ci, regression]
source: synthesis §2.4.9 („bramki mechaniczne w verify-site.mjs")/§2.7.1 (`npm run check`) · motion-dev §5.3 (regresja bundla) · feasibility-perf §9 p.5/p.7 · vercel-optimize (bramki deterministyczne)
added: 2026-09-12
---

## Zasada

`site/scripts/verify-site.mjs` (uruchamiany przez `npm run check` = `tsc --noEmit` → `vite build` → prerender → verify → audit; bez `npx`) ma krok `chunks`:

1. Czyta `dist/index.html`, `dist/narzedzia.html`, `dist/oferta.html`, `dist/faq.html`, `dist/rodo.html`, `dist/404.html` i 13 × `dist/narzedzia/<slug>.html`; dla każdego zbiera chunki statyczne (`<script type="module" src>`, `<link rel="modulepreload">`) i CSS.
2. Liczy gzip każdego pliku w `dist/assets` (`zlib.gzipSync`) i grupuje: `homeGz` (krytyczne z `index.html`), `cssGz`, `motionGz` (chunki z sygnaturą Motion), `toolGz[slug]` (chunki dociągane per podstrona = `modulepreload` z `narzedzia/<slug>.html` minus wspólne), `lazy[nazwa]` (pdfmake, three, dashboardy, BookingDialog).
3. Porównuje z `site/scripts/verify-site.baseline.json` (plik powstaje przez `verify-site.mjs --write-baseline` po pierwszym zielonym buildzie v2; przed nim obowiązują budżety domyślne, a `verify-site.mjs` mówi o braku baseline'u na stderr):
   ```json
   { "homeGz": 138000, "cssGz": 19000, "motionGz": 33800, "toolGzMax": 58000, "lazy": { "pdfmake": 830000, "three": 118000 }, "updated": "2026-09-xx", "reason": "faza 0: lazy dashboardy" }
   ```
   Reguły: każda grupa ≤ twardy limit (`homeGz` 175 KB, `cssGz` 20 KB, `motionGz` 35 KB, `toolGzMax` 60 KB) ORAZ ≤ baseline × 1,05; nowy chunk w zbiorze krytycznym, którego nie było w baseline = fail; chunk lazy, który przeszedł do krytycznych = fail.
4. Wynik w formacie findings: `dist/index.html:0 - HIGH [perf-chunk-size-gate] homeGz 146 812 B > baseline 138 000 × 1,05 (chunk nowy: assets/ToolPage-xxxx.js)` + JSONL.
5. Baseline aktualizuje TYLKO commit z komunikatem zaczynającym się od `Perf: nowy baseline` z polem `reason`; agent audytu odrzuca PR, w którym `baseline.json` zmienia się w innym commicie.
6. Vite: `build.rollupOptions.output.manualChunks` tylko dla `react-dom`/`react-router` (stabilne cache) i `motion` (osobny chunk = mierzalny); zero `chunkSizeWarningLimit` podbijanego „żeby nie ostrzegało".

## Mechanizm awarii (dlaczego)

- Regresje bundla są ciche: `tsc` i `vite build` zielone, strona działa, a 14 KB (`domMax`) albo 118 KB (three w krytycznych) płaci każdy użytkownik. Bez liczbowej bramki nikt tego nie zobaczy do czasu spadku Lighthouse po tygodniach.
- Porównanie z baseline (nie tylko z limitem) łapie pełzanie: 5 × „+3 KB" mieści się w limicie, a po kwartale strona ma +15 KB bez decyzji.
- CF Pages buduje z innymi hashami niż lokalnie (pamięć projektu: „weryfikuj po treści, nie hashach"); dlatego bramka działa na treści chunków (sygnatury) i sumach gz, nie na nazwach plików.
- Bramka w `npm run check` przed pushem (CLAUDE.md #4 + rozszerzenie code-check-gate) = jedyne miejsce, gdzie regresja zatrzymuje się przed produkcją.

## Niepoprawnie

```js
// vite.config.ts
build: { chunkSizeWarningLimit: 2000 }          // wyciszenie ostrzeżeń zamiast bramki
// package.json
"check": "tsc --noEmit && vite build"           // brak verify; npx-owe binarki
// baseline podbity w commicie „drobne poprawki UI"
```

## Poprawnie

```js
// site/scripts/verify-site.mjs (fragment kroku chunks)
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { gzipSync } from "node:zlib";
const baseline = JSON.parse(readFileSync("scripts/verify-site.baseline.json", "utf8"));
const LIMITS = { homeGz: 175 * 1024, cssGz: 20 * 1024, motionGz: 35 * 1024, toolGzMax: 60 * 1024 };
const gz = (f) => gzipSync(readFileSync(`dist/${f}`)).length;
const statics = (html) => [...html.matchAll(/(?:src|href)="\/(assets\/[^"]+\.(?:js|css))"/g)].map((m) => m[1]);
const home = statics(readFileSync("dist/index.html", "utf8"));
const homeGz = home.filter((f) => f.endsWith(".js")).reduce((s, f) => s + gz(f), 0);
const cssGz = home.filter((f) => f.endsWith(".css")).reduce((s, f) => s + gz(f), 0);
const motionGz = home.filter((f) => f.endsWith(".js") && /LazyMotion|MotionConfigContext|framer-motion/.test(readFileSync(`dist/${f}`, "utf8"))).reduce((s, f) => s + gz(f), 0);
const findings = [];
const check = (key, val) => {
  if (val > LIMITS[key]) findings.push({ file: "dist/index.html", line: 0, severity: "HIGH", rule: "perf-chunk-size-gate", msg: `${key} ${val} B > limit ${LIMITS[key]}`, confidence: "CONFIRMED" });
  else if (val > baseline[key] * 1.05) findings.push({ file: "dist/index.html", line: 0, severity: "HIGH", rule: "perf-chunk-size-gate", msg: `${key} ${val} B > baseline ${baseline[key]} × 1,05`, confidence: "CONFIRMED" });
};
check("homeGz", homeGz); check("cssGz", cssGz); check("motionGz", motionGz);
for (const f of home) if (/pdfmake|WebGLRenderer|ProductionDashboard|G703Billing/.test(readFileSync(`dist/${f}`, "utf8"))) findings.push({ file: `dist/${f}`, line: 0, severity: "HIGH", rule: "perf-chunk-size-gate", msg: "lazy chunk w zbiorze krytycznym", confidence: "CONFIRMED" });
```

```json
// package.json (scripts)
"check": "node node_modules/typescript/bin/tsc --noEmit && npm run build && node ../.claude/skills/klarow-guardian/scripts/verify-site.mjs && node ../.claude/skills/klarow-guardian/scripts/audit-static.mjs --fail-on BLOCKER,HIGH --baseline ../.claude/skills/klarow-guardian/baseline/audit-static-2026-09-12.jsonl"
```

## Test

```bash
cd site && npm run check                                   # exit 0; sekcja chunks w raporcie: „Σ BLOCKER 0 · HIGH 0 …"
# symulacja regresji: dodaj `import { motion } from "motion/react"` w dowolnym komponencie → npm run check musi zakończyć się fail z [motion-bundle-budget-motion] i [perf-chunk-size-gate]
# baseline tylko świadomie
git log --format=%s -- site/scripts/verify-site.baseline.json | grep -vE '^Perf: nowy baseline' && echo "baseline zmieniony poza commitem Perf:"
# vite.config bez wyciszania
grep -nE 'chunkSizeWarningLimit' site/vite.config.ts     # = 0
```

## Wyjątki

- Pierwszy commit tworzący `baseline.json` (faza 0) używa komunikatu `Perf: nowy baseline (start v2)`.
- `dist-ssr` (prerender) nie podlega bramce rozmiaru, tylko `motion-no-motion-in-prerender`.
