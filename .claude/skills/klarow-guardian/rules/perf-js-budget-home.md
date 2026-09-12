---
id: perf-js-budget-home
title: JS krytyczny na / ≤ 140 KB gz (react-dom ~58 + router ~15 + motion ~34 + app ~25); podstrona narzędzia ≤ +60 KB gz lazy
impact: HIGH
tags: [perf, bundle, budget, home]
source: synthesis §2.4.9 · feasibility-perf §5.2 p.2/§9 p.5 · site-audit §1.9 (dziś 157 KB gz index.js z 12 dashboardami) · showreel §5.9
added: 2026-09-12
---

## Zasada

Po `npm run build` suma gzip chunków JS ładowanych STATYCZNIE z `dist/index.html` (`<script type="module" src>` + `<link rel="modulepreload">`) wynosi ≤ **143 360 B (140 KB)**. Składowe orientacyjne: `react-dom` ~58, `react-router` ~15, `motion` ~34 (`motion-bundle-budget-motion`), kod aplikacji + dane ~25, `lucide` (tylko używane ikony, tree-shaken) ~5.

Podstrona narzędzia (`/narzedzia/<slug>`): chunki dociągane po nawigacji (`ToolPage` + jeden dashboard + `lib/*`) ≤ **61 440 B (60 KB)** gz ponad wspólne. `pdfmake` (~830 KB gz z fontem) tylko po kliknięciu „Pobierz PDF", nigdy w modulepreload.

Zakazane w chunku krytycznym: `three`, `@react-three/fiber`, `pdfmake`, 12 dashboardów, `ToolPage`, `BookingDialog` (lazy przy otwarciu), `toolsSeo.ts` w całości (dane per slug ładowane z podstroną albo hub importuje tylko `getTools()` bez FAQ), `radial-orbital-timeline`, `canvas-reveal-effect`.

Baseline w `site/scripts/verify-site.baseline.json` (`homeGz`, `toolGz`), aktualizowany tylko commitem `Perf: nowy baseline (powód)`. Plik tworzy `verify-site.mjs --write-baseline` po pierwszym zielonym buildzie v2; do tego czasu budżet to stałe 140 KB gz z `--budget`.

## Mechanizm awarii (dlaczego)

- Dziś `index-*.js` = 511 KB / 157 KB gz na KAŻDEJ trasie, bo `ToolPage.tsx:7-18` importuje 12 dashboardów statycznie, a `App.tsx:36` importuje `ToolPage` statycznie (site-audit §3.1 p.1). Strona `/oferta` płaci za Gantt, G703 i kalkulator transz, których nie pokazuje.
- Budżet 140 KB przy 4G to ~0,5 s pobierania + parsowanie na Moto G4 ~0,8 s; 157 KB + 118 KB three = INP i TBT poza zielenią Lighthouse.
- Sędzia wykonalności: budżet 130 KB (proof) był nierealny dla home z 6 mini-embedami; editorial ma mniej kodu w home i 140 się domyka TYLKO z lazy dashboardami i bez three w ścieżce krytycznej.
- Regresja bundla jest cicha (`tsc`/`build` zielone); tylko bramka liczbowa ją łapie.

## Niepoprawnie

```tsx
// App.tsx
import ToolPage from "@/pages/ToolPage";                       // statycznie, ciągnie 12 dashboardów
import { BookingModal } from "@/components/BookingModal";       // 2 KB auto-animate + kalendarz na każdej trasie
// pages/ToolPage.tsx
import ProductionDashboard from "@/components/dashboards/ProductionDashboard";  // ×12
```

## Poprawnie

```tsx
// App.tsx
const ToolPage = lazy(() => import("@/pages/ToolPage"));
const ToolsPage = lazy(() => import("@/pages/Tools"));
const OfferPage = lazy(() => import("@/pages/Offer"));
const BookingDialog = lazy(() => import("@/components/BookingDialog"));
// Home = import statyczny (LCP), reszta lazy z Suspense WEWNĄTRZ PageFade (skeleton kitu)

// components/DashboardMount.tsx: mapa literalnych ścieżek (bundle-analyzable)
// klucze = unia DashboardKey z src/data/tools.ts:99-111 (NIE „flow/cost/erp/labour" — takich kluczy nie ma)
const LOADERS: Record<DashboardKey, () => Promise<{ default: ComponentType }>> = {
  report: () => import("@/components/DemoReport"),
  production: () => import("@/components/dashboards/ProductionDashboard"),
  quality: () => import("@/components/dashboards/QualityGate"),
  timeline: () => import("@/components/dashboards/TaskTimeline"),
  payments: () => import("@/components/dashboards/PaymentCalculator"),
  reconciliation: () => import("@/components/dashboards/ImportReconciliation"),
  g703: () => import("@/components/dashboards/G703Billing"),
  paymentflow: () => import("@/components/dashboards/PaymentFlow"),
  costcontrol: () => import("@/components/dashboards/CostControl"),
  erpimports: () => import("@/components/dashboards/ErpImports"),
  protocols: () => import("@/components/dashboards/LabourProtocols"),
  contracts: () => import("@/components/dashboards/ContractRegister"),
};
```

```js
// scripts/verify-site.mjs (fragment)
const critical = [...html.matchAll(/(?:src|href)="\/assets\/([^"]+\.js)"/g)].map((m) => m[1]);
const homeGz = critical.reduce((s, f) => s + gzipSync(readFileSync(`dist/assets/${f}`)).length, 0);
if (homeGz > 140 * 1024) fail(`perf-js-budget-home: ${homeGz} B gz > 140 KB`);
```

## Test

```bash
cd site && npm run build >/dev/null
# suma chunków statycznych z index.html
for f in $(grep -oE '/assets/[^"]+\.js' dist/index.html | sort -u); do gzip -c "dist$f" | wc -c; done | awk '{s+=$1} END {print s " B gz (limit 143360)"}'
# zakazane biblioteki w chunkach krytycznych
for f in $(grep -oE '/assets/[^"]+\.js' dist/index.html | sort -u); do grep -lE 'pdfmake|THREE\.|WebGLRenderer|ProductionDashboard|G703|allocateGrosze' "dist$f"; done   # = 0
# lazy w kodzie
grep -nE 'lazy\(\(\) => import\("@/pages/ToolPage"\)' src/App.tsx | wc -l     # = 1
grep -nE '^import .* from "@/components/dashboards/' src/pages/ToolPage.tsx | wc -l   # = 0
# klucze LOADERS == unia DashboardKey (bramka „12 chunków" ich nie sprawdza): patrz test w perf-code-split-dashboards
# podstrona narzędzia: chunki dociągane (Playwright: performance.getEntriesByType("resource") po nawigacji do /narzedzia/raport-zarzadczy, suma transferSize .js ≤ 61440)
```

Docelowo `scripts/verify-site.mjs` krok `js-budget` (home + per slug z `dist/narzedzia/<slug>.html` modulepreload).

## Wyjątki

- Plan B (GLSL Hills): `three` wchodzi jako chunk lazy po idle po `load`, NIE liczy się do 140 KB, ale liczy się do transferu desktop ≤ 2,5 MB.
