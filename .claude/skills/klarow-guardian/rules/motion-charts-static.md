---
id: motion-charts-static
title: Wykres w narzędziu statyczny (reveal raz ≤ 420 ms, zero „rysowania"); wykres w sekcji marketingowej wolno budować postępem scrolla
impact: BLOCKER
tags: [motion, charts, dashboards, marketing, scroll, determinism]
source: CLAUDE.md #2 · decyzja Karola 2026-09-13 (odwrócenie zasady #2 dla warstwy marketingowej) · ui-kit-habits F2 (M2) · synthesis §2.4.3 ChartReveal/§2.4.7 · showreel M8 · proof M1–M2 (via feasibility-perf §7) · bklit-ui §4.2/§10.9
added: 2026-09-12
---

## Zasada

Wykres pełni na stronie dwie różne funkcje, więc reguła rozróżnia DWA konteksty. Kryterium jest jedno:
**czy z tego wykresu ktoś odczytuje liczbę, na podstawie której podejmuje decyzję.**

### A. Narzędzie (dashboard, tabela, macierz, dokument): wykres pokazuje wynik, więc zostaje statyczny

Zakres: `site/src/components/dashboards/**`, `site/src/components/DemoReport.tsx`, mini-embedy liczące na
żywo (`MiniReport.tsx`, `MiniAudit.tsx`), `site/src/lib/**`, `demo/**`, każdy element z `data-surface="tool"`.

Wykres renderuje się od razu w stanie końcowym. Jedna liczba na całe zjawisko: **reveal wykresu ≤ `DUR.reveal`
= 420 ms = `--duration-slow`** (`motion-tokens-only`). Bez wariantów „400", „450", „0,45 s". Jedyny dozwolony ruch:

1. **wejście panelu**: fade `opacity` ≤ 420 ms (`.chart-reveal`/`fade` na kontenerze, `animation: chartFade var(--duration-slow) …`), LUB
2. **`ChartReveal`**: clip-reveal L→R `clipPath: inset(0 100% 0 0) → inset(0 0 0 0)`, `EASE_SOFT`, `duration: DUR.reveal` (420 ms), DOKŁADNIE RAZ po montażu; replay wyłącznie przez jawne `key` z przycisku „Odtwórz", nigdy z danych,
3. **licznik KPI** ≤ 200 ms przy zmianie wejścia (opcjonalnie), reszta wyniku w tej samej klatce.

Zakazane w narzędziu: animacja słupków i linii per element (`animate={{ height }}` albo `scaleY` na `<rect>`,
`stroke-dashoffset`, `pathLength`, `isAnimationActive` w Recharts), ruch sterowany scrollem (`useScroll`,
`scrollYProgress`, `animation-timeline`), stagger słupków, „dojeżdżanie" osi, `key` zależne od danych (remount
przy każdej zmianie wejścia), spring na wartościach danych, kropki dekoracyjne na każdym punkcie (kropki tylko
informacyjne: ostatni punkt, markery, hover), pętle (`repeat: Infinity`), `ChartReveal` w hero albo na treści
obecnej w shellu (`motion-no-initial-hidden-above-fold`).

Zmiana wejścia (suwak, tolerancja, filtr) = nowy wynik w tej samej klatce (bez remountu) + opcjonalny
cross-fade panelu 250–300 ms (`.nc-swap`/`.nc-tab-swap` kitu), nie „rysowanie" od zera.

### B. Strona marketingowa (`/`, sekcje narracyjne): wykres opowiada, więc MOŻE budować się postępem scrolla

Zakres: trasy marketingowe poza trybem `tool`; implementacja ruchu mieszka w `site/src/motion/scroll/**`,
a sekcje strony ją konsumują. Tam wykres nie jest źródłem decyzji, tylko opowieścią o tym, co narzędzie robi,
więc budowanie się słupka albo linii jest DOZWOLONE. Cztery warunki, wszystkie obowiązkowe:

1. **Ruch sterowany postępem scrolla, nie zegarem.** Tempo należy do użytkownika: `useScroll({ target, offset })`
   + `useTransform` (Motion, pasywny odczyt) wyłącznie w `site/src/motion/scroll/**`, albo CSS
   `animation-timeline: view()` w `globals.css`. Zero `setTimeout`, zero `repeat: Infinity`, zero
   autoodtwarzania. Scroll w tył cofa budowanie: postęp jest funkcją pozycji, nie stanem, który raz „poszedł".
2. **Tylko właściwości akcelerowane** (`motion-gpu-props-only`): słupek rośnie przez `scaleY` z
   `transform-origin: bottom` (nigdy `height`), linia odsłania się przez `clipPath` albo `scaleX` na grupie
   (nigdy `pathLength`, nigdy `stroke-dashoffset`), reszta przez `opacity`.
3. **Gałąź reduced-motion pokazuje stan KOŃCOWY**, nie początkowy: `useReducedMotion()` → `initial={false}`
   i wartości docelowe (`scaleY: 1`, `clipPath: inset(0)`), w CSS `@media (prefers-reduced-motion: reduce)`
   → `animation-timeline: none` + `transform: scaleY(1)`. Zero elementów utkniętych w `scaleY: 0`
   (`motion-reduced-motion-three-layers`).
4. **Zero przechwytywania zdarzeń scrolla**: bez listenerów `wheel`/`touchmove`/`scroll`, bez blokady
   `overflow` na `body`, bez skryptowego przewijania, bez slajdów przełączanych gestem
   (`motion-no-pinning-no-scroll-hijack`: scena sticky do 300vh jest dozwolona, hijack nie).

Dodatkowo: scena scroll-narracyjna nie startuje nad foldem i nie ukrywa treści z shella prerenderu
(`motion-no-initial-hidden-above-fold`), ma wiersz w rejestrze animacji (`motion-motivated`, kategoria
„demonstracja produktu") i ładuje się leniwie (`perf-js-budget-home`). Liczby na takim wykresie są
ilustracyjne, mieszkają w `data/*.ts` i podlegają `brand-allowed-numbers-only` jak każda liczba publiczna.

## Mechanizm awarii (dlaczego)

- **W narzędziu**: obietnica produktowa „kalkulator, nie wróżka" znaczy, że wynik jest natychmiastowy
  i powtarzalny. Wykres, który „rośnie" 1,1 s (domyślne bklit), opóźnia odczyt liczby i sugeruje obliczenie
  w toku; użytkownik przestaje ufać liczbie, którą przed chwilą oglądał w ruchu. Animacja w miejscu decyzji
  podważa zaufanie do danych.
- Remount przez `key` od danych → `ResizeObserver` → pusta klatka → błysk (kit SKILL.md:246-248);
  `ResponsiveContainer` mierzy po paincie.
- bklit-ui: clip-reveal i stagger słupków grają zawsze, także przy reduced motion (bklit-ui §4.6); nasz
  `ChartReveal` ma gałąź `useReducedMotion` → `initial={false}`.
- Per-path `stroke-dash` i `pathLength` = repaint całego viewportu co klatkę (kit `app.css:78-82`,
  „Background Paths retired") — dlatego pozostają zakazane także w warstwie marketingowej.
- **Na stronie marketingowej działa odwrotny mechanizm awarii i to on wymusił tę zmianę**: strona bez ruchu
  czyta się jak dokument tekstowy, a odwiedzający nie widzi, że narzędzie cokolwiek liczy. Karol 2026-09-13:
  „Strona dalej wygląda minimalistycznie, nawet gorzej niż wcześniej. Za dużo tekstu. Bardzo liczyłem na
  motion grafiki, typu że podczas scrollowania buduje się jakiś wykres". Zasada #2 CLAUDE.md powstała pod
  kontekst narzędzia i była błędnie rozciągana na landing; rozciąganie skończyło się stroną, której founder
  nie chce pokazywać klientom.
- Ruch sterowany scrollem (a nie zegarem) nie zabiera kontroli: użytkownik decyduje, czy i jak szybko wykres
  się zbuduje, zatrzymany scroll zatrzymuje ruch, a scroll w tył go cofa. To jest różnica między narracją
  a teatrem, którą stary zapis reguły gubił, bo mieszał oba konteksty w jedno zdanie.

## Niepoprawnie

```tsx
// A. narzędzie: słupki dojeżdżają, linia się rysuje, remount od danych
{bars.map((b, i) => (
  <m.rect key={b.id} initial={{ height: 0, y: H }} animate={{ height: b.h, y: H - b.h }}
          transition={{ delay: i * 0.05, duration: 1.1, ease: [0.85, 0, 0.15, 1] }} />
))}
<m.path d={line} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5 }} />
<svg key={JSON.stringify(data)}>…</svg>                       // remount przy każdej zmianie danych
<LineChart isAnimationActive />                                // Recharts animacja per punkt
```

```tsx
// B. strona marketingowa: ruch na zegarze i na layoucie zamiast na postępie scrolla, bez gałęzi reduced
<m.rect animate={{ height: [0, 120] }} transition={{ duration: 1.8, repeat: Infinity }} />   // pętla + height
useEffect(() => { const id = setTimeout(() => setBuilt(true), 800); return () => clearTimeout(id); }, []);
<m.path initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} />                        // repaint co klatkę
```

## Poprawnie

```tsx
// A. narzędzie: src/motion/ChartReveal.tsx
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

// A. dashboard: statyczny SVG, wynik w tej samej klatce, replay tylko z przycisku
const [replay, setReplay] = useState(0);
const rows = useMemo(() => aggregate(parsed.rows), [parsed]);
<button className="btn btn-secondary btn-sm" type="button" onClick={() => setReplay((n) => n + 1)}>{t.replay}</button>
<ChartReveal replayKey={replay}><Bars rows={rows} /></ChartReveal>
```

```tsx
// B. strona marketingowa: src/motion/scroll/ScrollBars.tsx (lazy, poniżej folda)
// motion: demonstracja produktu — słupki budują się w tempie czytelnika, bo tak wygląda praca narzędzia
import { useRef } from "react";
import * as m from "motion/react-m";
import { useScroll, useTransform, useReducedMotion, type MotionValue } from "motion/react";

export function ScrollBars({ bars }: { bars: { id: string; v: number }[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 60%"] });
  return (
    <div ref={ref} className="scroll-bars">
      <svg role="img" aria-label="Udział etapów w budżecie: projekt 32, produkcja 41, montaż 27">
        {bars.map((b, i) => (
          <ScrollBar key={b.id} v={b.v} progress={scrollYProgress} index={i} reduce={reduce} />
        ))}
      </svg>
    </div>
  );
}

function ScrollBar({ v, progress, index, reduce }: { v: number; progress: MotionValue<number>; index: number; reduce: boolean | null }) {
  const scaleY = useTransform(progress, [index * 0.08, index * 0.08 + 0.4], [0, 1]);
  // reduced motion: stan KOŃCOWY od razu, postęp w ogóle nieczytany
  return <m.rect height={v} width={24} style={{ transformOrigin: "bottom", scaleY: reduce ? 1 : scaleY }} />;
}
```

```css
/* A. alternatywa CSS w narzędziu (kit): fade panelu, bez rysowania */
.chart-reveal { animation: chartFade var(--duration-slow) var(--ease-out) backwards; }
@keyframes chartFade { from { opacity: 0 } }
@media (prefers-reduced-motion: reduce) { .chart-reveal { animation: none } }

/* B. alternatywa CSS na stronie marketingowej: postęp scrolla zamiast zegara */
.scroll-bars rect { transform-origin: bottom; animation: barGrow linear both; animation-timeline: view(); animation-range: entry 20% cover 60%; }
@keyframes barGrow { from { transform: scaleY(0) } to { transform: scaleY(1) } }
@media (prefers-reduced-motion: reduce) {
  .scroll-bars rect { animation: none; animation-timeline: none; transform: scaleY(1); }   /* stan końcowy */
}
```

## Test

```bash
# ── A. narzędzie: wykres statyczny (wszystkie oczekiwane: 0) ──
D="site/src/components/dashboards site/src/components/DemoReport.tsx site/src/components/MiniReport.tsx site/src/components/MiniAudit.tsx"
grep -rnE 'pathLength|stroke-dashoffset|strokeDashoffset|isAnimationActive|repeat:\s*Infinity|animationBegin|animationDuration' $D
grep -rnE '<m\.(rect|path|circle|line|g)\b' $D                             # per-element Motion w wykresach
grep -rnE 'scaleY|scaleX|useScroll|scrollYProgress|animation-timeline' $D  # budowanie i scroll-progress: wyłącznie marketing
grep -rnE 'key=\{(JSON\.stringify|data|rows|result)' $D                    # remount od danych
grep -rnE 'duration:\s*(0\.[5-9]|[1-9])' $D                                # > 420 ms w dashboardach (literały i tak łamią motion-tokens-only)
grep -rnE '(400|450)ms|duration:\s*0\.4[05]' $D site/src/styles/globals.css   # = 0 (jedyny próg to var(--duration-slow) / DUR.reveal)
# ChartReveal tylko poniżej folda: nie w Hero/Bento/MetricsStrip
grep -rnE 'ChartReveal' site/src/components/Hero.tsx site/src/components/Bento.tsx site/src/components/MetricsStrip.tsx 2>/dev/null   # = 0

# ── B. rozróżnienie kontekstów: budowanie tylko w warstwie narracyjnej ──
# animacja skalująca słupki i odczyt postępu scrolla: dozwolone w site/src/motion/scroll/**, zakazane wszędzie indziej
grep -rlE 'useScroll\(|scrollYProgress|animation-timeline' site/src --include=*.tsx --include=*.ts | grep -v '^site/src/motion/scroll/'   # = 0
grep -rlE 'scaleY' site/src --include=*.tsx | grep -v '^site/src/motion/scroll/'                                                          # = 0
grep -rnE 'animation-timeline' site/src/styles/*.css | grep -v globals.css                                                                # = 0
# każdy plik warstwy scroll ma gałąź reduced-motion (brak katalogu = NIE SPRAWDZANO, nie PASS)
for f in site/src/motion/scroll/*.tsx; do grep -qE 'useReducedMotion|prefers-reduced-motion' "$f" || echo "BRAK gałęzi reduced: $f"; done
# CSS scroll-driven zawsze z blokiem reduced, który daje stan KOŃCOWY
grep -nE 'animation-timeline:\s*none' site/src/styles/globals.css                                                                          # ≥ 1, gdy jest animation-timeline
# zakaz rysowania per-path obowiązuje też w marketingu
grep -rnE 'pathLength|stroke-dashoffset|strokeDashoffset' site/src --include=*.tsx --include=*.css                                          # = 0

# przegląd ręczny (agent motion-auditor):
#   narzędzie — otworzyć 12 dashboardów, zmienić wejście (suwak/tolerancja) → wynik bez błysku i bez „rysowania";
#     DevTools Performance: po pierwszych 500 ms od montażu zero animacji w panelu (Animations tab pusty);
#   marketing — scroll w dół i w GÓRĘ: wykres buduje się i cofa razem z pozycją, zatrzymany scroll = zatrzymany ruch;
#     DevTools „Emulate prefers-reduced-motion: reduce" → wykres od razu kompletny (stan końcowy), zero scaleY(0).
```

Docelowo `node scripts/check-motion.mjs` sekcja `charts` + ocena LLM.

## Wyjątki

- Klasa kitu `.nc-chart-build` (CSS clip-reveal **450 ms**, `backwards`, z blokiem reduced) jest równoważna `ChartReveal` i dozwolona w dashboardach — to TOLEROWANY DŁUG kitu do przepisania na `var(--duration-slow)` (420 ms) przy najbliższej aktualizacji `company-ui.css`; nie łączyć obu na jednym wykresie. Poza tą jedną klasą 450 ms nie występuje.
- Mini-diagram `KsefFlow` (S2): węzły `opacity` sekwencyjnie 3 × 120 ms raz; to nie wykres danych, a schemat kierunku (motywacja: „sekwencja = kierunek danych").
- Gantt (`TaskTimeline`) w trybie compare: „dryf" jest liczbą i barwą, nie animacją; zmiana snapshotu = cross-fade panelu.
- Mini-embed na stronie marketingowej, który LICZY na żywo (`MiniReport`, `MiniAudit`), jest narzędziem mimo marketingowej trasy: obowiązuje go wariant A. Wykres narracyjny obok niego rysuje liczby ilustracyjne z `data/*.ts` i podlega wariantowi B; nie łączyć obu w jednym komponencie.
