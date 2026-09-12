# F2 zadanie 3/3: diagram KSeF i obrazki społecznościowe

## Cel

1. `site/src/components/KsefFlow.tsx`: diagram SVG czterech węzłów na tokenach (`mini` i `full`),
   z przekreśloną strzałką zwrotną i pełnym `aria-label` PL/EN.
2. `site/scripts/og.mjs`: deterministyczny generator kart 1200x630 dla 6 tras z `pagesSeo.ts`
   i 13 narzędzi z `tools.ts`.
3. Wynik: `site/public/og/<slug>.png` (19 plików, każdy ≤ 200 KB wg `perf-images-policy`).

## Zakres zamrożony

`site/src/lib/pdf.ts`, `PdfButton.tsx`, `App.tsx`, `src/components/dashboards/**`,
`.claude/settings.json`, `CLAUDE.md`, wszystkie `.env`. Build uruchamia agent fazy 3.
Zero kredytów: żadnego narzędzia generatywnego.

## Reguły, które dotykam

`design-tokens-only`, `a11y-images-alt-svg-role`, `perf-images-policy`, `design-shape-lock`,
`motion-tokens-only`, `motion-stagger-caps`, `motion-cleanup-required`, `motion-motivated`,
`motion-reduced-motion-three-layers`, `motion-no-motion-in-prerender`, `i18n-pl-en-pair-required`,
`i18n-pl-typography`, `code-file-size-cap`, `seo-pageseo-single-source`, `seo-canonical-og-twitter`.

## Kroki

- [x] Lektura: SKILL.md, `warstwa-wrazenia.md`, plan §3 S3, §4.3, reguły `media-*`, `motion-*`, `perf-*`.
- [x] Rozpoznanie: brak `sharp`, brak `playwright` w `site/`; jest Chromium z cache Playwrighta.
- [x] `KsefFlow.tsx` (pure `KsefFlowView` + wrapper z opcjonalną animacją bez biblioteki ruchu).
- [x] `og.mjs` (import TS przez hook aliasu `@/`, szablon SVG na tokenach z `tokens.css`,
      rasteryzacja headless Chromium, zero dat i losowości).
- [x] Generacja 19 kart + dwa przebiegi z porównaniem `sha256` (determinizm).
- [x] Wpisy w `site/media/SOURCES.md`.
- [x] Bramki: `tsc --noEmit`, `audit-static.mjs` na moich plikach.

## Otwarte (decyzja foundera albo późniejsza faza)

1. `KsefFlow` importuje stałe z `@/motion/tokens` (czasy i krzywa ruchu z jednego źródła).
   To moduł bez efektów ubocznych i bez biblioteki ruchu, ale formalnie leży w `src/motion/*`,
   którego `motion-no-motion-in-prerender` nie chce w grafie SSR. Jeśli shell prerendera
   ma renderować `KsefFlowView`, agent fazy 2 potwierdza, że `dist-ssr` zawiera wyłącznie
   te stałe (zero `motion/react`).
2. Etykieta dowodu na karcie OG narzędzia („Demo na danych przykładowych" / „Własny produkt")
   żyje dziś w `og.mjs`. Gdy powstanie komponent chipa dowodu, przenieść do jednego źródła.

## Porażki

- Gradient ukośny (160deg) w rasteryzacji Chromium: 169 KB PNG (dithering).
  FIX: gradient pionowy (180deg), ten sam kadr waży 29 KB. PASS.

## Wynik

19 kart OG w `site/public/og/`, diagram `KsefFlow` gotowy do podpięcia (kafel ściany i podstrona
KSeF). Podłączenie `og:image` per trasa i osadzenie diagramu: agent fazy 2 (patrz handoff).
