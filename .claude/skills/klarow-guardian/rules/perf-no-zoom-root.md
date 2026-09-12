---
id: perf-no-zoom-root
title: Zakaz zoom na :root; skalowanie dużych ekranów przez clamp() w tokenach typografii i kontenerze
impact: MEDIUM
tags: [perf, layout, zoom, measurement, tokens]
source: synthesis §1.5 R7/§2.7.2 („globals.css bez zoom") · motion-dev §8.7/§8.12 · site-audit §3.1 p.6 (globals.css:116-125, TaskTimeline.tsx:151 clientWidth) · feasibility-perf §6 p.5
added: 2026-09-12
---

## Zasada

`site/src/styles/globals.css` nie zawiera `zoom` na `:root`/`html`/`body` (dziś: `1.08` od 1500 px, `1.18` od 1900 px; do usunięcia w fazie 0 z retestem 12 dashboardów na 1920 i 2560 px). Skalowanie na dużych ekranach realizują tokeny:

```css
:root { --container: 72rem; --gutter: clamp(16px, 4vw, 40px); }
:root { --text-base: clamp(1rem, 0.95rem + 0.2vw, 1.125rem); --text-display: clamp(2.25rem, 5.2vw, 4.25rem); }
@media (min-width: 1900px) { :root { --container: 80rem; --text-base: 1.125rem; } }
```

Zakazane też: `zoom` na dowolnym elemencie w `site/src` (poza `print`), `transform: scale()` na wrapperach layoutu jako „powiększenie", `font-size` w px na `html` zmieniane per breakpoint powyżej 1 stopnia.

## Mechanizm awarii (dlaczego)

- `zoom` zmienia geometrię: `getBoundingClientRect`, `clientWidth` (`TaskTimeline.tsx:151` mierzy kontener Gantta), `IntersectionObserver` i pointer events zachowują się różnie między silnikami (Chrome ujednolicił „standardized zoom" dopiero w 128; Safari i Firefox liczą inaczej). `useInView`, `Counter`, `DashboardMount` (IO) i `WipeCompare` (pomiar szerokości) mierzą; pod `zoom` offsety na ≥ 1500 px mogą być przesunięte (reveal odpala za wcześnie/za późno).
- Lighthouse/CLS liczą w pikselach CSS po zoomie; pomiary z laptopa Karola (≥ 1500 px) nie odpowiadają pomiarom z CI (1350 px).
- `zoom` nie działa w Firefox < 126 jako standard i jest ignorowany przez część czytników powiększających.
- Dashboardy mają własne pomiary (`clientWidth`, `ResizeObserver` w Gantt); podwójne skalowanie (zoom + clamp) daje za duże elementy na 4K.

## Niepoprawnie

```css
/* globals.css:116-125 (stan obecny) */
@media (min-width: 1500px) { :root { zoom: 1.08; } }
@media (min-width: 1900px) { :root { zoom: 1.18; } }
```

## Poprawnie

```css
/* tokens.css */
:root {
  --container: 72rem;
  --gutter: clamp(16px, 4vw, 40px);
  --text-xs: .75rem; --text-sm: .875rem; --text-base: clamp(1rem, .95rem + .2vw, 1.125rem);
  --text-lg: 1.125rem; --text-xl: 1.5rem; --text-display: clamp(2.25rem, 5.2vw, 4.25rem);
  --section-py: clamp(64px, 9vw, 120px);
}
@media (min-width: 1900px) { :root { --container: 80rem; } }
.container { max-width: var(--container); margin-inline: auto; padding-inline: var(--gutter); }
```

## Test

```bash
grep -rnE '\bzoom\s*:' site/src --include=*.css --include=*.tsx | grep -v '@media print'    # = 0
grep -rnE 'transform:\s*scale\([0-9.]+\)' site/src/styles/globals.css site/src/styles/tokens.css 2>/dev/null   # = 0 na wrapperach layoutu
grep -cE 'clamp\(' site/src/styles/tokens.css 2>/dev/null   # ≥ 3
# retest po zdjęciu zoomu: Playwright Chromium 1920×1080 i 2560×1440 → zrzuty 12 dashboardów; porównanie ręczne z zrzutami sprzed zmiany (czytelność KPI, szerokość Gantta = clientWidth kontenera)
# pomiary IO: na 2560 px reveal sekcji S2 odpala, gdy 25 % elementu jest w viewporcie (Playwright: boundingBox vs viewport w chwili zmiany opacity)
```

## Wyjątki

- `@media print` w `lib/pdf.ts` nie dotyczy (PDF generuje pdfmake, nie CSS print).
- Tymczasowo, do końca fazy 0, `zoom` może zostać w `globals.css` z komentarzem `/* perf-no-zoom-root: do usunięcia w fazie 0 (R7) */`; po fazie 0 = fail.
