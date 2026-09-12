---
id: motion-charts-static
title: Wykresy statyczne: reveal raz ≤ 420 ms (DUR.reveal / --duration-slow) na poziomie panelu, potem statyka; zero „rysowania"
impact: BLOCKER
tags: [motion, charts, dashboards, determinism]
source: CLAUDE.md #2 · ui-kit-habits F2 (M2) · synthesis §2.4.3 ChartReveal/§2.4.7 · showreel M8 · proof M1–M2 (via feasibility-perf §7) · bklit-ui §4.2/§10.9
added: 2026-09-12
---

## Zasada

Wykres (SVG w dashboardach, mini-wykres S2, `DemoReport`) renderuje się od razu w stanie końcowym.

Jedna liczba na całe zjawisko: **reveal wykresu ≤ `DUR.reveal` = 420 ms = `--duration-slow`** (`motion-tokens-only`). Bez wariantów „400", „450", „0,45 s". Jedyny dozwolony ruch:

1. **wejście panelu**: fade `opacity` ≤ 420 ms (`.chart-reveal`/`fade` na kontenerze, `animation: chartFade var(--duration-slow) …`), LUB
2. **`ChartReveal`**: clip-reveal L→R `clipPath: inset(0 100% 0 0) → inset(0 0 0 0)`, `EASE_SOFT`, `duration: DUR.reveal` (420 ms), DOKŁADNIE RAZ po montażu; replay wyłącznie przez jawne `key` z przycisku „Odtwórz", nigdy z danych,
3. **licznik KPI** ≤ 200 ms przy zmianie wejścia (opcjonalnie), reszta wyniku w tej samej klatce.

Zakazane: animacja słupków/linii per element (`stroke-dashoffset`, `pathLength`, `animate={{ height }}` na `<rect>`, `isAnimationActive` w Recharts), stagger słupków, „dojeżdżanie" osi, `key` zależne od danych (remount przy każdej zmianie wejścia), spring na wartościach danych, kropki dekoracyjne na każdym punkcie (kropki tylko informacyjne: ostatni punkt, markery, hover), pętle (`repeat: Infinity`) na czymkolwiek w dashboardzie, `ChartReveal` w hero lub na treści obecnej w shellu (`motion-no-initial-hidden-above-fold`).

Zmiana wejścia (suwak, tolerancja, filtr) = nowy wynik w tej samej klatce (bez remountu) + opcjonalny cross-fade panelu 250–300 ms (`.nc-swap`/`.nc-tab-swap` kitu), nie „rysowanie" od zera.

## Mechanizm awarii (dlaczego)

- CLAUDE.md #2: „Wykresy statyczne: bez teatralnego „rysowania"; krótki fade, kropki tylko informacyjne". Twarda reguła projektu = BLOCKER.
- Obietnica produktowa „kalkulator, nie wróżka": wynik ma być natychmiastowy i powtarzalny; wykres, który „rośnie" 1,1 s (domyślne bklit), sugeruje obliczenie w toku i teatr.
- Remount przez `key` od danych → `ResizeObserver` → pusta klatka → błysk (kit SKILL.md:246-248); `ResponsiveContainer` mierzy po paincie.
- bklit-ui: clip-reveal i stagger słupków grają zawsze, także przy reduced motion (bklit-ui §4.6); nasz `ChartReveal` ma gałąź `useReducedMotion` → `initial={false}`.
- Per-path `stroke-dash` = repaint całego viewportu co klatkę (kit `app.css:78-82`, „Background Paths retired").

## Niepoprawnie

```tsx
{bars.map((b, i) => (
  <m.rect key={b.id} initial={{ height: 0, y: H }} animate={{ height: b.h, y: H - b.h }}
          transition={{ delay: i * 0.05, duration: 1.1, ease: [0.85, 0, 0.15, 1] }} />
))}
<m.path d={line} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5 }} />
<svg key={JSON.stringify(data)}>…</svg>                       // remount przy każdej zmianie danych
<LineChart isAnimationActive />                                // Recharts animacja per punkt
```

## Poprawnie

```tsx
// src/motion/ChartReveal.tsx
import * as m from "motion/react-m";
import { useReducedMotion } from "motion/react";
import { DUR, EASE_SOFT } from "./tokens";
export function ChartReveal({ replayKey = 0, children }: { replayKey?: number; children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <m.div key={replayKey} initial={reduce ? false : { clipPath: "inset(0 100% 0 0)" }}
           animate={{ clipPath: "inset(0 0 0 0)" }} transition={{ duration: DUR.reveal, ease: EASE_SOFT }}
           style={{ willChange: reduce ? undefined : "clip-path" }}>
      {children}
    </m.div>
  );
}

// dashboard: statyczny SVG, wynik w tej samej klatce, replay tylko z przycisku
const [replay, setReplay] = useState(0);
const rows = useMemo(() => aggregate(parsed.rows), [parsed]);
<button className="btn btn-secondary btn-sm" type="button" onClick={() => setReplay((n) => n + 1)}>{t.replay}</button>
<ChartReveal replayKey={replay}><Bars rows={rows} /></ChartReveal>
```

```css
/* alternatywa CSS (kit): fade panelu, bez rysowania */
.chart-reveal { animation: chartFade var(--duration-slow) var(--ease-out) backwards; }
@keyframes chartFade { from { opacity: 0 } }
@media (prefers-reduced-motion: reduce) { .chart-reveal { animation: none } }
```

## Test

```bash
# w dashboardach, DemoReport i mini-komponentach (oczekiwane: 0)
D="site/src/components/dashboards site/src/components/DemoReport.tsx site/src/components/MiniReport.tsx site/src/components/MiniAudit.tsx"
grep -rnE 'pathLength|stroke-dashoffset|strokeDashoffset|isAnimationActive|repeat:\s*Infinity|animationBegin|animationDuration' $D
grep -rnE '<m\.(rect|path|circle|line|g)\b' $D                          # per-element Motion w wykresach
grep -rnE 'key=\{(JSON\.stringify|data|rows|result)' $D                  # remount od danych
grep -rnE 'duration:\s*(0\.[5-9]|[1-9])' $D                              # > 420 ms w dashboardach (literały i tak łamią motion-tokens-only)
grep -rnE '(400|450)ms|duration:\s*0\.4[05]' $D site/src/styles/globals.css   # = 0 (jedyny próg to var(--duration-slow) / DUR.reveal)
# ChartReveal tylko poniżej folda: nie w Hero/Bento/MetricsStrip
grep -rnE 'ChartReveal' site/src/components/Hero.tsx site/src/components/Bento.tsx site/src/components/MetricsStrip.tsx 2>/dev/null   # = 0
# przegląd ręczny (agent motion-auditor): otworzyć 12 dashboardów, zmienić wejście (suwak/tolerancja) → wynik bez błysku i bez „rysowania";
# DevTools Performance: po pierwszych 500 ms od montażu zero animacji w panelu (Animations tab pusty).
```

Docelowo `node scripts/check-motion.mjs` sekcja `charts` + ocena LLM.

## Wyjątki

- Klasa kitu `.nc-chart-build` (CSS clip-reveal **450 ms**, `backwards`, z blokiem reduced) jest równoważna `ChartReveal` i dozwolona w dashboardach — to TOLEROWANY DŁUG kitu do przepisania na `var(--duration-slow)` (420 ms) przy najbliższej aktualizacji `company-ui.css`; nie łączyć obu na jednym wykresie. Poza tą jedną klasą 450 ms nie występuje.
- Mini-diagram `KsefFlow` (S2): węzły `opacity` sekwencyjnie 3 × 120 ms raz; to nie wykres danych, a schemat kierunku (motywacja: „sekwencja = kierunek danych").
- Gantt (`TaskTimeline`) w trybie compare: „dryf" jest liczbą i barwą, nie animacją; zmiana snapshotu = cross-fade panelu.
