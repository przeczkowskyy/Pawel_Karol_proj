---
id: motion-stagger-caps
title: Kaskada ≤ 12 dzieci, odstęp 40–60 ms, przesunięcie wejścia ≤ 12 px; duże powierzchnie tylko opacity
impact: LOW
tags: [motion, stagger, reveal, a11y]
source: synthesis §2.4.1 (STAGGER 0.05, SHIFT 12)/§2.4.7 · motion-dev §5.1 p.7 · showreel M-stagger · ui-kit-habits F1 · motion-design (Disney: staging)
added: 2026-09-12
---

## Zasada

- `delayChildren: stagger(STAGGER, ...)` z `STAGGER = 0.05` (50 ms); dopuszczalny zakres 40–60 ms (S3 ramy: 60 ms, S7 wiersze ✕/✓: 40 ms). Poza tym zakresem: fail.
- Kaskada obejmuje maksymalnie 12 dzieci. Listy dłuższe (hub 13 kart, tabele, FAQ 8 pytań w akordeonie) wchodzą bez staggera (jeden `fade` panelu) albo w paczkach po ≤ 12 z `viewport` per paczka.
- Przesunięcie wejścia `y` = `SHIFT` (12 px). Nigdy > 24 px (choroba lokomocyjna, motion-dev §5.1 p.7). Duże powierzchnie (hero, całe sekcje, ramy S3 z obrazem, portrety) = `fade` bez `y`.
- `startDelay` ≤ 100 ms; łączny czas kaskady (startDelay + n × stagger + DUR.reveal) ≤ 1,2 s.
- `stagger(..., { from: "center" | "last" })` tylko z motywacją (kierunek czytania L→R jest domyślny).

## Mechanizm awarii (dlaczego)

- 13 kart × 60 ms + 420 ms = ostatnia karta pojawia się po 1,2 s: użytkownik już przewinął, a ostatnie karty „wjeżdżają" poza viewportem, potem stoją na `opacity: 0` do czasu kolejnego `whileInView` (jeśli `once`). Efekt „pustej siatki" w zrzutach GSC.
- Przesunięcia 24–64 px na dużych elementach wywołują dyskomfort u części użytkowników nawet bez włączonego reduced-motion; docs Motion (accessibility) każą zamieniać transformy dużych elementów na opacity.
- Karol dwa razy cofał efektowność: długa kaskada to „teatr", nie hierarchia.

## Niepoprawnie

```tsx
export const group: Variants = { hidden: {}, show: { transition: { delayChildren: stagger(0.12, { startDelay: 0.3 }) } } };
<m.ul variants={group}>{tools.map((t) => <m.li key={t.slug} variants={fadeUp} />)}</m.ul>   // 13 kart, 120 ms
<m.section variants={{ hidden: { opacity: 0, y: 64 }, show: { opacity: 1, y: 0 } }} />          // 64 px na całej sekcji
```

## Poprawnie

```tsx
// src/motion/presets.ts
export const group: Variants = { hidden: {}, show: { transition: { delayChildren: stagger(STAGGER, { startDelay: 0.08 }) } } };
export const groupSlow: Variants = { hidden: {}, show: { transition: { delayChildren: stagger(0.06, { startDelay: 0.08 }) } } };  // S3 ramy
export const groupFast: Variants = { hidden: {}, show: { transition: { delayChildren: stagger(0.04) } } };                      // S7 wiersze

// hub: 13 kart bez staggera (fade panelu), karty bez m.*
<Reveal variant="fade"><ul className="tools-grid">{tools.map((t) => <li key={t.slug}><ToolCard tool={t} /></li>)}</ul></Reveal>

// duże powierzchnie: fade
<Reveal variant="fade"><FounderCard … /></Reveal>
```

## Test

```bash
# stagger poza 0.04–0.06 (oczekiwane: 0)
grep -rnE 'stagger\(\s*(0\.0[0-3]|0\.0[7-9]|0\.[1-9])' site/src
grep -rnE 'staggerChildren' site/src                      # stare API, = 0
# przesunięcia > 12 px w wariantach (oczekiwane: 0)
grep -rnE '\by:\s*-?(1[3-9]|[2-9][0-9])\b' site/src/motion site/src/components --include=*.ts --include=*.tsx
# listy > 12 dzieci z variants=group: ocena LLM (motion-auditor) na plikach z .map( wewnątrz m.ul/m.ol variants=
grep -rnE '<m\.(ul|ol|div)[^>]*variants=\{group' site/src -A 3 | grep -E '\.map\('
```

## Wyjątki

- `KsefFlow` (mini-diagram S2): 3 węzły × 120 ms `opacity` to sekwencja znaczeniowa (kierunek danych), nie stagger wejścia; dozwolone jako udokumentowany wyjątek.
