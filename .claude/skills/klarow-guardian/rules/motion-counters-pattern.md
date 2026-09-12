---
id: motion-counters-pattern
title: Liczniki: useMotionValue(to) + animate jako dziecko m.span, useInView once, brak animacji gdy element widoczny od pierwszej klatki, jump przy reduced, liczba w shellu na stałe
impact: MEDIUM
tags: [motion, counter, numbers, prerender, a11y]
source: motion-dev §4.7 · synthesis §2.4.3 Counter · showreel §5.6 · feasibility-perf §5.3 (CLS cyfr) · ui-kit-habits C1 (tabular-nums)
added: 2026-09-12
---

## Zasada

Jeden komponent `src/motion/Counter.tsx` dla wszystkich liczników (pasek S5 „W liczbach", KPI w dashboardach, jeśli kiedyś). Kontrakt:

- `useMotionValue(to)` (WARTOŚĆ KOŃCOWA jako stan początkowy — tyle samo, ile drukuje shell prerenderu) + `animate(count, to, …)` dopiero po `count.jump(0)` w chwili wejścia w viewport; `useInView(ref, { once: true, amount: 0.6 })`; `controls.stop()` w cleanupie,
- **rozróżnienie „widoczny od razu" vs „wjechał później"**: w pierwszym przebiegu efektu zapamiętujemy w refie `el.getBoundingClientRect().top < window.innerHeight`. Jeśli element był w viewporcie już w pierwszej klatce (wysoki ekran 2560 px, krótszy układ home po zmianie sekcji, wejście z kotwicy `#liczby`), licznik NIE animuje: zostaje wartość końcowa. Animujemy wyłącznie wtedy, gdy element wjechał w viewport PÓŹNIEJ,
- tekst renderowany przez `useTransform(() => format(count.get()))` przekazany jako DZIECKO `m.span` (zero re-renderów Reacta per klatka; nigdy `useState` + `onUpdate`),
- `useReducedMotion()` → `count.jump(to)` (wartość końcowa natychmiast),
- format przez jeden helper (`toLocaleString("pl-PL"/"en-US")` albo `fmtMoney` dla kwot), `font-variant-numeric: tabular-nums`, `min-width` w `ch` równy liczbie cyfr wartości końcowej (brak przesunięcia layoutu podczas liczenia),
- wartość końcowa `to` pochodzi z `MESSAGING.allowedNumbers` lub z silnika (`aggregate`), nigdy z literału w JSX,
- w shellu prerenderu liczba jest wpisana na stałe (crawler nie widzi animacji); dwa mechanizmy powyżej (`useMotionValue(to)` + test „widoczny od razu") gwarantują, że pierwszy render Reacta drukuje TĘ SAMĄ liczbę co shell — bez nich sekwencja to `12` (shell) → `0` (React) → liczenie, czyli mignięcie zakazane przez `motion-no-initial-hidden-above-fold` (BLOCKER),
- `duration: 1.2` jest udokumentowanym wyjątkiem od maksimum 0.6 (`motion-tokens-only`); żaden inny czas dla liczników,
- suffix/prefix (`%`, `zł`, `+`) poza `m.span` (nie animowany), `aria-label` z pełną wartością końcową na kontenerze (czytnik nie czyta pośrednich liczb).

Zakazane: Motion+ `AnimateNumber`, `@number-flow/react` (druga biblioteka), liczniki startujące przy montażu (bez `useInView`), liczniki w hero.

## Mechanizm awarii (dlaczego)

- `useState` aktualizowany w `onUpdate` re-renderuje komponent 60× na sekundę przez 1,2 s; przy 4 licznikach i 12 dashboardach w drzewie to zauważalny jank na laptopach. Motion value jako dziecko `m.*` pisze do DOM bez Reacta.
- Bez `jump` przy reduced licznik liczy mimo ustawienia systemowego (`MotionConfig` nie widzi motion values).
- Bez `tabular-nums` i `min-width` szerokość zmienia się z liczbą cyfr (0 → 12) i przesuwa sąsiadów: CLS w pasku (feasibility-perf §5.3).
- StrictMode: dwa `animate` bez `stop` = licznik skacze.
- `useInView(amount: 0.6)` zwraca `true` TAKŻE w pierwszej klatce, jeśli element już jest w viewporcie — a wtedy `useMotionValue(0)` + start animacji dają mignięcie `12 → 0 → 12` na treści, która w shellu ma wartość końcową. Sama uwaga „element paska S5 jest poniżej folda" (`motion-no-initial-hidden-above-fold`) nie wystarcza: to założenie o UKŁADZIE, którego żaden test nie pilnuje, a zmiana kolejności sekcji je łamie.
- Czytnik ekranu bez `aria-label` czyta losowe wartości pośrednie.

## Niepoprawnie

```tsx
const [n, setN] = useState(0);
useEffect(() => { animate(0, to, { duration: 2, onUpdate: (v) => setN(Math.round(v)) }); }, [to]);   // setState per klatka, brak stop, brak inView, brak reduced
return <span>{n}</span>;
```

```tsx
const count = useMotionValue(0);                       // shell drukuje 12, React renderuje 0 → mignięcie
useEffect(() => { if (inView) animate(count, to, { duration: 1.2 }); }, [inView]);   // inView === true już w pierwszej klatce na wysokim ekranie
```

## Poprawnie

```tsx
// src/motion/Counter.tsx
import { useEffect, useRef } from "react";
import * as m from "motion/react-m";
import { animate, useInView, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { EASE_OUT } from "./tokens";

type Props = { to: number; format: (n: number) => string; label: string; className?: string };

export function Counter({ to, format, label, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const count = useMotionValue(to);            // start = wartość końcowa: pierwszy render Reacta == shell prerenderu
  const immediate = useRef<boolean | null>(null);   // czy element był widoczny już w pierwszej klatce
  const text = useTransform(() => format(Math.round(count.get())));
  const width = `${format(to).length}ch`;

  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (immediate.current === null) immediate.current = el.getBoundingClientRect().top < window.innerHeight;
    if (immediate.current || reduce) { count.jump(to); return; }   // widoczny od razu / reduced → bez animacji
    if (!inView) return;                                           // wjedzie później
    count.jump(0);
    const controls = animate(count, to, { duration: 1.2, ease: EASE_OUT }); // motion-tokens-only: wyjątek udokumentowany
    return () => controls.stop();
  }, [inView, reduce, to, count]);

  return (
    <span className={className} aria-label={label} style={{ fontVariantNumeric: "tabular-nums", display: "inline-block", minWidth: width }}>
      <m.span ref={ref} aria-hidden="true">{text}</m.span>
    </span>
  );
}

// użycie (S5): wartość z allowedNumbers, suffix poza licznikiem
const n = MESSAGING.allowedNumbers.find((x) => x.value === "12");
<Counter to={12} format={(v) => v.toLocaleString(lang === "pl" ? "pl-PL" : "en-US")} label={`12 ${pick(lang, n)}`} /> <span>{pick(lang, n)}</span>
```

## Test

```bash
# jeden komponent licznika; zero konkurencji
grep -rlE 'useMotionValue\(|animate\(count' site/src | grep -v 'motion/Counter.tsx'          # = 0
grep -rnE 'AnimateNumber|number-flow' site/src site/package.json                            # = 0
# kontrakt Counter.tsx
grep -nE 'useInView\(ref, \{ once: true, amount: 0\.6' site/src/motion/Counter.tsx           # = 1
grep -nE 'count\.jump\(to\)' site/src/motion/Counter.tsx                                     # = 1
grep -nE 'useMotionValue\(to\)' site/src/motion/Counter.tsx                                  # = 1 (nie useMotionValue(0))
grep -nE 'getBoundingClientRect\(\)\.top < window\.innerHeight' site/src/motion/Counter.tsx  # = 1 (test „widoczny od razu")
grep -nE 'controls\.stop\(\)' site/src/motion/Counter.tsx                                    # = 1
grep -nE 'tabular-nums' site/src/motion/Counter.tsx                                          # ≥ 1
grep -nE 'onUpdate|useState' site/src/motion/Counter.tsx                                     # = 0
# liczba w shellu na stałe: dist/index.html zawiera wartości końcowe paska S5
grep -cE '>12<|>3 dni<' site/dist/index.html                                                 # ≥ 1 po buildzie
# licznik nie w hero
grep -nE 'Counter' site/src/components/Hero.tsx 2>/dev/null                                  # = 0
# brak mignięcia na wysokim ekranie (Playwright/WebKit ze scratchpadu):
#   viewport 2560×1440, page.goto("/"), odczyt 50 ms po DOMContentLoaded:
#   document.querySelector("[data-metrics] .tnum")?.textContent  → wartość końcowa (≠ "0")
#   ten sam odczyt po 2 s → ta sama wartość
```

## Wyjątki

- KPI w dashboardach (np. `CostControl` marża) mogą używać `Counter` z `duration` ≤ 0.2 przy zmianie wejścia (motion-charts-static p.3) tylko po jawnej decyzji; dziś są statyczne i to jest domyślne.
