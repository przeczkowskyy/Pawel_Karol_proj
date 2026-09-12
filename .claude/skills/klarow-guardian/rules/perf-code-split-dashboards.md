---
id: perf-code-split-dashboards
title: Dashboardy przez React.lazy per klucz + DashboardMount (IntersectionObserver, requestIdleCallback, kolejka) + skeleton z minHeight
impact: HIGH
tags: [perf, code-split, dashboards, cls, lazy]
source: synthesis §2.4.5/§1.5 R6 · site-audit §1.9/§3.1 p.1 · bklit-ui §10.5/§10.6 (usePauseWhenOffscreen, home-mount-queue) · showreel §5.10 · vercel RBP bundle-analyzable-paths
added: 2026-09-12
---

## Zasada

Jeden komponent `src/components/DashboardMount.tsx` osadza każdy z **12 dashboardów** — 11 komponentów w `src/components/dashboards/**` (`PdfButton.tsx` dashboardem nie jest) + `DemoReport.tsx`; tyle samo kluczy ma unia `DashboardKey` (`src/data/tools.ts:99-111`). **13 to liczba NARZĘDZI w `tools.ts`** (12 dem + KSeF `kind: "case"` bez dashboardu), nie liczba dashboardów. Kontrakt:

1. **`React.lazy`** z mapą `LOADERS: Record<DashboardKey, () => import("…literalna ścieżka…")>` (żadnych dynamicznych stringów w `import()`; Rollup musi widzieć każdy chunk).
2. **Montaż warunkowy widocznością**: natywny `IntersectionObserver` (`rootMargin: "0px 0px 20% 0px"`, `once`), bez zależności od Motion (`useInView` z Motion NIE jest używany tu: chunk narzędzia nie może zależeć od rdzenia Motion).
3. **Po bezczynności**: `requestIdleCallback(cb, { timeout: 1500 })` z fallbackiem `setTimeout(cb, 16)`; na stronach z > 1 dashboardem (mini-komponenty S2 + ewentualne embedy) kolejka szeregowa z odstępem 150 ms między ciężkimi montażami (wzorzec bklit `home-mount-queue`), z `cancel` w cleanupie.
4. **Skeleton**: `Suspense fallback={<div className="skel" style={{ minHeight }} aria-busy="true" />}`; `minHeight` per klucz z tabeli `DASHBOARD_MIN_HEIGHT` (zmierzone wysokości na 1280 px, np. `report: 720`, `timeline: 640`) → CLS ≈ 0 przy podmianie skeleton → dashboard.
5. **Boundary**: error boundary z komunikatem kitu „Demo nie wczytało się. Odśwież stronę." (PL/EN z `{ pl, en }`), bez stack trace.
6. **`data-ready`**: flagę ustawia komponent zamontowany **WEWNĄTRZ `Suspense`** (czyli po dociągnięciu chunku i podmianie skeletonu), NIGDY wrapper na podstawie stanu `mounted`. Wzorzec: `<Suspense fallback={skeleton}><Dash /><ReadyFlag host={ref} /></Suspense>`, gdzie `ReadyFlag` w `useEffect` ustawia `host.current.dataset.ready = "true"` i usuwa atrybut w cleanupie. `mounted === true` znaczy tylko „zaczynamy pobierać chunk"; `data-ready="true"` znaczy „dashboard jest w DOM". Te dwa momenty dzieli czas pobrania chunku, a `shoot-tools.mjs` czeka dokładnie na `[data-ready='true']` (`perf-images-policy` p.5).
7. `ToolPage` sam jest `lazy` w `App.tsx`; `Suspense` dla trasy siedzi WEWNĄTRZ `PageFade` (nie między routerem a stroną).

Zakazane: statyczne importy dashboardów w `ToolPage`/`App`, `import(\`@/components/dashboards/${key}\`)`, montaż wszystkich 12 na hubie, `Suspense` bez `minHeight`.

## Mechanizm awarii (dlaczego)

- Dziś `index.js` niesie 12 dashboardów + `lib/report` + `lib/qualityGate` (~60–90 KB gz) na każdej trasie (site-audit §1.9). Lazy per klucz zdejmuje to z `/`, `/oferta`, `/faq`.
- Bez IO dashboard montuje się i liczy (`aggregate`, `auditRows`) zanim użytkownik go zobaczy; bez `requestIdleCallback` konkuruje z LCP/INP na wejściu.
- Bez `minHeight` skeleton (np. 120 px) → dashboard (720 px) = CLS 0,3+ i skok scrolla na podstronie, w którą wchodzi persona z Google.
- `import()` z szablonem stringa: Rollup tworzy chunk z całego katalogu albo nic; „bundle-analyzable paths" (vercel RBP).
- `useInView` z Motion w `DashboardMount` wiązałby chunk narzędzia z rdzeniem Motion (33,8 KB) w kolejności ładowania; natywny IO = 0 KB (feasibility-perf §3.2 R6).
- `data-ready` na wrapperze (`data-ready={mounted ? "true" : undefined}`) zapala się w chwili, gdy IO + `requestIdleCallback` przestawiają `mounted` — czyli ZANIM `React.lazy` dociągnie chunk i zanim `Suspense` podmieni skeleton. `shoot-tools.mjs` czeka na ten selektor i robi zrzut: wyścig sieć-vs-zrzut daje raz dashboard, raz `.skel`, więc dwa przebiegi dają różne `sha256` (`perf-images-policy` p.5 i test „identyczne sumy"), cache `immutable` na `-v1-1280.webp` zostaje zatruty, a dowód „te same dane, ten sam wynik" sypie się na własnym pipelinie.

## Niepoprawnie

```tsx
import ProductionDashboard from "@/components/dashboards/ProductionDashboard";   // ×12 statycznie (ToolPage.tsx:7-18 dziś)
const Dash = lazy(() => import(`@/components/dashboards/${key}`));                // nieanalizowalna ścieżka
<Suspense fallback={<div className="skel" />}>…</Suspense>                       // brak minHeight → CLS
<div data-dashboard={key} data-ready={mounted ? "true" : undefined}>…</div>      // flaga PRZED dociągnięciem chunku → niedeterministyczne zrzuty
```

## Poprawnie

```tsx
// src/components/DashboardMount.tsx
import { Component, Suspense, lazy, useEffect, useRef, useState, type ComponentType, type ReactNode, type RefObject } from "react";
import type { DashboardKey } from "@/data/tools";
import { useLang, pick } from "@/i18n";

/* 12 wpisów = 12 dashboardów; klucze DOKŁADNIE jak w unii DashboardKey (tools.ts:99-111):
   report, production, quality, timeline, payments, reconciliation, g703,
   paymentflow, costcontrol, erpimports, protocols, contracts */
const LOADERS: Record<DashboardKey, () => Promise<{ default: ComponentType }>> = {
  report: () => import("@/components/DemoReport"),
  production: () => import("@/components/dashboards/ProductionDashboard"),
  /* … pozostałe 10 z literalnymi ścieżkami (pełna mapa w references/motion-cheatsheet.md §8) … */
};
const DASHBOARD_MIN_HEIGHT: Record<DashboardKey, number> = { report: 720, production: 640, /* … */ };
const LAZY = Object.fromEntries(Object.entries(LOADERS).map(([k, l]) => [k, lazy(l)])) as Record<DashboardKey, ComponentType>;

const idle = (cb: () => void, timeout = 1500): (() => void) => {
  if (typeof requestIdleCallback === "function") { const id = requestIdleCallback(cb, { timeout }); return () => cancelIdleCallback(id); }
  const id = window.setTimeout(cb, 16); return () => window.clearTimeout(id);
};

const MSG = { pl: "Demo nie wczytało się. Odśwież stronę.", en: "The demo did not load. Refresh the page." };
class Boundary extends Component<{ children: ReactNode; message: string }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <p className="empty">{this.props.message}</p> : this.props.children; }
}

export function DashboardMount({ dashboard }: { dashboard: DashboardKey }) {
  const { lang } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el || mounted) return;
    let cancelIdle: (() => void) | null = null;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      cancelIdle = idle(() => setMounted(true));
    }, { rootMargin: "0px 0px 20% 0px" });
    io.observe(el);
    return () => { io.disconnect(); cancelIdle?.(); };
  }, [mounted]);
  const Dash = LAZY[dashboard];
  const minHeight = DASHBOARD_MIN_HEIGHT[dashboard];
  const skeleton = <div className="skel" style={{ minHeight }} aria-busy="true" />;
  return (
    <div ref={ref} data-dashboard={dashboard} style={{ minHeight }}>
      {mounted ? (
        <Boundary message={pick(lang, MSG)}>
          <Suspense fallback={skeleton}><Dash /><ReadyFlag host={ref} /></Suspense>
        </Boundary>
      ) : skeleton}
    </div>
  );
}

/** data-ready dopiero PO dociągnięciu chunku: efekt wykona się w tym samym commicie co montaż <Dash /> */
function ReadyFlag({ host }: { host: RefObject<HTMLDivElement | null> }) {
  useEffect(() => {
    const el = host.current; if (!el) return;
    el.dataset.ready = "true";
    return () => { delete el.dataset.ready; };
  }, [host]);
  return null;
}
```

## Test

```bash
# brak statycznych importów dashboardów poza DashboardMount
grep -rnE 'from "@/components/dashboards/|from "@/components/DemoReport"' site/src --include=*.tsx | grep -vE 'DashboardMount\.tsx|import\(' # = 0
# LOADERS z literalnymi ścieżkami, 12 wpisów (11 dashboards/* + DemoReport; 13 = narzędzia w tools.ts, nie dashboardy)
grep -cE 'import\("@/components/(dashboards/[A-Za-z0-9]+|DemoReport)"\)' site/src/components/DashboardMount.tsx   # = 12
# klucze LOADERS/MIN_HEIGHT == unia DashboardKey (bez „flow/cost/erp/labour")
node -e '
const fs = require("node:fs");
const src = fs.readFileSync("site/src/data/tools.ts", "utf8");
const keys = [...src.split("export type DashboardKey =")[1].split(";")[0].matchAll(/"([a-z0-9]+)"/g)].map((m) => m[1]);
const mnt = fs.readFileSync("site/src/components/DashboardMount.tsx", "utf8");
const miss = keys.filter((k) => !new RegExp("\\b" + k + ":\\s*\\(\\)").test(mnt));
const extra = [...mnt.matchAll(/^\s*([a-z0-9]+):\s*\(\)\s*=>\s*import\(/gm)].map((m) => m[1]).filter((k) => !keys.includes(k));
console.log(miss.length === 0 && extra.length === 0 ? "klucze OK (" + keys.length + ")" : "BRAK: " + miss.join(",") + " NADMIAROWE: " + extra.join(","));'

grep -nE 'import\(`' site/src                                                     # = 0
# kontrakt
for k in IntersectionObserver requestIdleCallback minHeight 'data-ready' 'ReadyFlag' Suspense 'rootMargin: "0px 0px 20% 0px"'; do grep -q "$k" site/src/components/DashboardMount.tsx || echo "BRAK $k"; done
# data-ready NIE może zależeć od stanu mounted (wyścig ze zrzutami) — oczekiwane: 0
grep -nE 'data-ready=\{' site/src/components/DashboardMount.tsx
grep -nE 'useInView|from "motion' site/src/components/DashboardMount.tsx           # = 0
# build: 12 osobnych chunków dashboardów w dist/assets (DemoReport jest już w regexie)
ls site/dist/assets | grep -cE '^(DemoReport|ProductionDashboard|QualityGate|TaskTimeline|PaymentCalculator|ImportReconciliation|G703Billing|PaymentFlow|CostControl|ErpImports|LabourProtocols|ContractRegister)-' # = 12
# determinizm flagi: Playwright — w chwili [data-ready="true"] w kontenerze nie ma .skel
#   await page.waitForSelector("[data-dashboard][data-ready='true']");
#   await page.waitForSelector("[data-dashboard] .skel", { state: "detached" });   # pas bezpieczeństwa
# Lighthouse podstrony: CLS < 0,05; Playwright: layoutShift entries po montażu dashboardu = 0 (PerformanceObserver "layout-shift")
```

## Wyjątki

- `MiniReport`/`MiniAudit`/`KsefFlow` (S2) nie są dashboardami: importowane statycznie z home, bo są w shellu i muszą być natychmiastowe (SSR-safe, bez Motion w środku).
- `DemoReport` na home (jeśli kiedyś) idzie przez `DashboardMount`, nigdy statycznie.
