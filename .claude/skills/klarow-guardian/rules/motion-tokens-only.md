---
id: motion-tokens-only
title: Czasy, krzywe, stagger i przesunięcia wyłącznie z src/motion/tokens.ts i zmiennych CSS
impact: MEDIUM
tags: [motion, tokens, css, consistency]
source: synthesis §2.4.1 · showreel M11 · ui-kit-habits F5 (M5) · company-ui app.css:49-50 · motion-design „Brand Motion Identity"
added: 2026-09-12
---

## Zasada

Jedno źródło stałych ruchu: `site/src/motion/tokens.ts` (dla Motion/TS) i lustrzane zmienne w `site/src/styles/tokens.css` (dla CSS kitu). Wartości są zamrożone:

```ts
// site/src/motion/tokens.ts
export const EASE_OUT  = [0.22, 1, 0.36, 1] as const;   // = --ease-out (kit); wejścia, hover
export const EASE_SOFT = [0.3, 0.7, 0.3, 1] as const;   // = --ease-soft; clip-reveal danych
export const EASE_STD  = [0.4, 0, 0.2, 1] as const;     // = --ease-std; przejścia tras, crossfade
export const DUR = { quick: 0.16, base: 0.24, reveal: 0.42, media: 0.6 } as const; // sekundy; 0.6 = maksimum
export const STAGGER = 0.05;   // 50 ms między dziećmi; kaskada ≤ 12 dzieci
export const SHIFT = 12;       // px; jedyne przesunięcie wejścia; duże powierzchnie: 0
export const VIEWPORT_ONCE = { once: true, amount: 0.25, margin: "0px 0px -10% 0px" } as const;
```

```css
/* site/src/styles/tokens.css (fragment ruchu) */
--duration-fast: 160ms; --duration-base: 240ms; --duration-slow: 420ms; --duration-media: 600ms;
--ease-out: cubic-bezier(.22, 1, .36, 1); --ease-soft: cubic-bezier(.3, .7, .3, 1); --ease-std: cubic-bezier(.4, 0, .2, 1);
```

W komponentach: `transition={{ duration: DUR.reveal, ease: EASE_OUT }}`, `y: SHIFT`, `delayChildren: stagger(STAGGER, ...)`; w CSS: `transition: background-color var(--duration-fast) var(--ease-out)`. Zakazane: literały `duration: 0.35`, `ease: [0.16, 1, 0.3, 1]`, `y: 24`, `transition: opacity 300ms ease`, `cubic-bezier(...)` poza `tokens.css` i `company-ui.css`.

Archetyp marki: Corporate-precise (`motion-design`: 200–400 ms, 0 % overshoot). Sprężyny (`type: "spring"`) są dozwolone tylko w `presets.ts` i tylko z `bounce: 0`; nie ma ich w fazie 1.

## Mechanizm awarii (dlaczego)

- Trzy różne czasy „wejścia" na jednej stronie (300/420/600) czytają się jako trzy różne strony. Karol dwukrotnie cofał efektowność (karuzela 2026-07-22, deck 2026-07-26); rozjazd czasów to pierwszy objaw „strony sklejanej z szablonów".
- Literał w komponencie nie zmienia się przy zmianie decyzji o archetypie; tokeny zmieniają cały serwis jedną edycją.
- Kit `company-ui` ma własne `--motion: 200ms cubic-bezier(.22,1,.36,1)` i `--ease-out`/`--ease-soft`; jeśli Motion użyje innej krzywej dla tego samego elementu (np. `.btn` z CSS transition + `whileHover`), powstaje podwójny easing (patrz `motion-no-transition-all-no-linear`).
- Krzywa `[0.16, 1, 0.3, 1]` z taste-skill jest praktycznie równoważna `--ease-out`; dopuszczamy TYLKO `EASE_OUT`, żeby audyt był grepowalny.

## Niepoprawnie

```tsx
<m.li initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: i * 0.06, ease: [0.16, 1, 0.3, 1] }} />
```

```css
.case-frame img { transition: transform 300ms ease-in-out; }
.cell:hover { transition: background .2s cubic-bezier(.4,0,.2,1); }
```

## Poprawnie

```tsx
import * as m from "motion/react-m";
import { fadeUp } from "@/motion/presets";
import { VIEWPORT_ONCE } from "@/motion/tokens";

<m.li variants={fadeUp} initial="hidden" whileInView="show" viewport={VIEWPORT_ONCE} />
```

```ts
// site/src/motion/presets.ts
import { stagger, type Variants } from "motion/react";
import { DUR, EASE_OUT, SHIFT, STAGGER } from "./tokens";
export const fadeUp: Variants = { hidden: { opacity: 0, y: SHIFT }, show: { opacity: 1, y: 0, transition: { duration: DUR.reveal, ease: EASE_OUT } } };
export const fade: Variants   = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: DUR.media, ease: EASE_OUT } } };
export const group: Variants  = { hidden: {}, show: { transition: { delayChildren: stagger(STAGGER, { startDelay: 0.08 }) } } };
```

```css
.case-frame img { transition: transform var(--duration-base) var(--ease-out); }
.cell:hover { transition: background-color var(--duration-fast) var(--ease-out); }
```

## Test

```bash
# literały czasu/krzywej w TSX poza katalogiem motion/ (oczekiwane: 0)
grep -rnE 'duration:\s*[0-9.]+' site/src --include=*.tsx | grep -v 'site/src/motion/'
grep -rnE 'ease:\s*\[' site/src --include=*.tsx | grep -v 'site/src/motion/'
grep -rnE '\b(y|x):\s*-?[0-9]{2,}' site/src --include=*.tsx | grep -E 'initial|animate|hidden|show' | grep -v 'site/src/motion/'
# cubic-bezier i ms poza plikami tokenów (oczekiwane: 0)
grep -rnE 'cubic-bezier\(' site/src --include=*.css --include=*.tsx | grep -vE 'tokens\.css|company-ui\.css'
grep -rnE 'transition:[^;]*[0-9]+m?s' site/src --include=*.css --include=*.tsx | grep -vE 'tokens\.css|company-ui\.css|var\(--duration'
# maksimum: żadna wartość DUR > 0.6 poza udokumentowanym wyjątkiem Counter (1.2)
grep -nE 'duration:\s*(0\.[7-9]|[1-9])' site/src/motion/tokens.ts site/src/motion/presets.ts
# Tailwind: klasy duration-*/ease-* na elementach m.* (oczekiwane: 0)
grep -rnE '<m\.[a-z]+[^>]*className="[^"]*(duration-|ease-)' site/src
```

Docelowo `node scripts/check-motion.mjs` sekcja `tokens`. Ocena LLM (agent `motion-auditor`) sprawdza dodatkowo, czy nowa animacja ma wpis w tabeli motywacji (`motion-motivated`).

## Wyjątki

- `Counter`: `duration: 1.2` w `src/motion/Counter.tsx` z komentarzem `// motion-tokens-only: wyjątek udokumentowany (synthesis §2.4.3)`.
- Klasy kitu `.nc-swap`, `.nc-tab-swap`, `.nc-chart-build` mają czasy w `company-ui.css` (0.28/0.34/0.45 s); przy przepisywaniu kitu na `tokens.css` przechodzą na `var(--duration-*)`, do tego czasu są tolerowane (nie dopisywać nowych).
- `.faq-answer` w `globals.css` (`0.3s cubic-bezier(0.05,0.7,0.1,1)`): dług do zamiany na `var(--duration-base) var(--ease-out)` w fazie 0.
