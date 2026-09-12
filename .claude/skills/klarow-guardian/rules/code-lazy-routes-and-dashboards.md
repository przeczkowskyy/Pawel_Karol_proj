---
id: code-lazy-routes-and-dashboards
title: Trasy, dashboardy, dialog i pdfmake przez React.lazy / import()
impact: HIGH
tags: [bundle, perf, lazy, routes, dashboards, code]
source: RBP:bundle-dynamic-imports + bundle-analyzable-paths + bundle-conditional / site-audit.md §1.9, §3.1 p.1 / synthesis §2.4.9 (JS na / ≤ 140 KB gz) / peer-legal.md uzgodnienie 2026-09-12
added: 2026-09-12
---

## Zasada

Ciężkie i nie-krytyczne moduły ładujemy leniwie z literalną ścieżką: `pages/Tool.tsx` (i każda strona poza `Home`), każdy z 12 dashboardów osobno (mapa `DASHBOARDS` z jawnymi funkcjami `() => import("…")` + `React.lazy` + `Suspense` ze skeletonem kitu), `BookingDialog`, `pdfmake` (`lib/pdf.ts` już lazy), `three` (tylko `pointer: fine`, po idle). Statyczny `import` modułu > 50 KB gz w pliku trasy lub w `App.tsx` = błąd. `import()` zawsze z literalną ścieżką; template literal w `import()` jest zakazany. Faza 1: w `ToolPage.tsx` zmieniamy WYŁĄCZNIE sposób importu dashboardów; wnętrza `lib/pdf.ts`, `dashboards/PdfButton.tsx` i `dashboards/*.tsx` należą do okna c1 (refaktor `pdfDoc.mjs`) i nie są dotykane.

## Mechanizm awarii (dlaczego)

Dziś `pages/ToolPage.tsx:7-18` importuje 12 dashboardów statycznie, a `App.tsx:36` importuje `ToolPage` statycznie. Skutek zmierzony w `dist` (2026-07-28): główny chunk 511 KB / 157 KB gz zawiera wszystkie dashboardy, `lib/report.ts` i `lib/qualityGate.ts`, więc strona główna, `/oferta` i `/faq` płacą za kod, którego nie renderują. Budżet z synthesis §2.4.9: JS krytyczny na `/` ≤ 140 KB gz, chunk podstrony narzędzia ≤ +60 KB gz. `import()` ze zmienną ścieżką każe Rollupowi spakować cały katalog w jeden chunk albo wygenerować dziesiątki mikro-chunków, a esbuild przestaje widzieć zależności (RBP 2.5).

## Niepoprawnie

```tsx
// site/src/pages/ToolPage.tsx:7-18
import DemoReport from "@/components/DemoReport";
import ProductionDashboard from "@/components/dashboards/ProductionDashboard";
// ... 10 kolejnych
const DASHBOARDS: Record<DashboardKey, React.ComponentType> = { report: DemoReport, production: ProductionDashboard /* … */ };

// App.tsx:36
import ToolPage from "@/pages/ToolPage";

// zmienna ścieżka: Rollup nie wie, co spakować
const Dash = lazy(() => import("@/components/dashboards/" + name));
```

## Poprawnie

```tsx
// site/src/pages/Tool.tsx: mapa jawnych funkcji import() (statycznie analizowalna)
import { lazy, Suspense } from "react";
const DASHBOARDS: Record<DashboardKey, React.LazyExoticComponent<React.ComponentType>> = {
  report: lazy(() => import("@/components/DemoReport")),
  production: lazy(() => import("@/components/dashboards/ProductionDashboard")),
  quality: lazy(() => import("@/components/dashboards/QualityGate")),
  // … każdy klucz = osobny chunk
};

// App.tsx: strony leniwe poza Home; Suspense ze skeletonem kitu (.skel), minHeight dla CLS
const ToolPage = lazy(() => import("@/pages/Tool"));
<Route
  path="/narzedzia/:slug"
  element={<Suspense fallback={<div className="skel" style={{ minHeight: 480 }} />}><ToolPage /></Suspense>}
/>
```

Preload na intencję (LOW, RBP 2.6): `onMouseEnter`/`onFocus` na karcie narzędzia → `void import("@/pages/Tool")`.

## Test

```bash
# 1. statyczne importy dashboardów poza mapą lazy
grep -rnE "^import .* from \"@/components/dashboards/" site/src --include=*.tsx | grep -v "lazy("   # oczekiwane: 0
grep -rnE "^import ToolPage|^import .*pages/Tool" site/src/App.tsx                                    # oczekiwane: 0
# 2. import() ze zmienną ścieżką (template literal albo konkatenacja)
grep -rnE "import\(\s*(\`|\"[^\"]*\"\s*\+)" site/src                                                   # oczekiwane: 0
# 3. budżet: po `npm run build` rozmiar chunków wołanych z dist/index.html
node .claude/skills/klarow-guardian/scripts/verify-site.mjs --budget 140                        # chunk wejściowy ≤ 140 KB gz, CSS ≤ 20 KB, chunk Motion ≤ 36 KB
# PLANOWANE (F3, verify-site.mjs nie zna tego trybu): node .claude/skills/klarow-guardian/scripts/verify-site.mjs --budgets
```

Severity: HIGH. Nowy plik łamiący regułę blokuje merge; dług w `ToolPage.tsx` = pozycja fazy 0.

## Wyjątki

`Home` i jego sekcje: statyczne (to jest LCP). `motion` (`LazyMotion domAnimation`) ładuje się jako część chunku strony, a features przez `import()`; to zgodne z regułą.
