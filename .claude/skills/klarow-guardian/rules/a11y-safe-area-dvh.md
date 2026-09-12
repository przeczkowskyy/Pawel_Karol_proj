---
id: a11y-safe-area-dvh
title: Bez przewijania poziomego na 390 px, min-height 100dvh z fallbackiem vh, env(safe-area-inset-*) na full-bleed, gutter ≥ 16 px
impact: HIGH
tags: [a11y, layout, mobile, safe-area, dvh, overflow]
source: WIG Safe Areas & Layout (3 reguły) + Anti-patterns (user-scalable=no) / kit company-ui O1–O7 (overflow) / site-audit.md §3.3 / synthesis a11y-no-scroll-x, a11y-safe-area, §2.3 (gutter clamp(16px, 4vw, 40px)), T13 (strona działa na 390 px)
added: 2026-09-12
---

## Zasada

1. Strona nigdy nie przewija się poziomo na 390 px (iPhone) ani 360 px (Android): każde dziecko gridu/flex ma `min-width: 0`, długie ciągi (`kontakt@klarow.com`, slugi, kwoty) mają `overflow-wrap: anywhere` lub `nowrap` w scrollboxie; tylko tabele dem, diagramy SVG i bloki kodu mogą być szersze, każdy w kontenerze `overflow-x: auto` z `overscroll-behavior: contain`. Gutter boczny ≥ 16 px na każdej szerokości (`padding-inline: clamp(16px, 4vw, 40px)` na jednym wrapperze).
2. Wysokość pełnoekranowa = `min-height: 100vh; min-height: 100dvh;` (fallback + dvh), nigdy `h-screen`/`height: 100vh` na treści (pasek adresu iOS zasłania dół).
3. Full-bleed (hero-media, navbar fixed, stopka, dialog) uwzględnia `env(safe-area-inset-top/bottom/left/right)` w paddingu; `viewport-fit=cover` w meta tylko razem z tymi paddingami.
4. `<meta name="viewport" content="width=device-width, initial-scale=1">` bez `user-scalable=no` i bez `maximum-scale=1`.
5. `.content-layer` bez `z-index`, `.bg-layer` `z-index: -1` (fix iOS 2026-07-26) zostaje; nowe elementy `position: fixed` nie trafiają do `.content-layer`.

## Mechanizm awarii (dlaczego)

Przewijanie poziome na telefonie to najczęstsza regresja przy wideo hero (`min-width` klipu) i pasku liczb (4 kolumny `tabular-nums` bez zawijania); użytkownik dostaje „ruchomą" stronę i przypadkowe gesty wstecz. `height: 100vh` na iOS liczy pasek adresu jako widoczny, więc CTA hero ląduje pod krawędzią; `dvh` jest w Safari 15.4+, a `safari13` w targecie wymaga fallbacku (esbuild nie usuwa nieznanych jednostek, ale stary WebKit ignoruje linię z `dvh`, zostaje `vh`). Brak `safe-area-inset-bottom` na sticky stopce/dialogu chowa przycisk pod home-indicatorem iPhone'a. `user-scalable=no` blokuje zoom (WCAG 1.4.4) i jest w liście anty-wzorców WIG.

## Niepoprawnie

```css
.hero { height: 100vh; }
.metrics { display: grid; grid-template-columns: repeat(4, 1fr); }   /* bez min-width: 0, liczby 4.5rem nie zawijają */
```
```html
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
```

## Poprawnie

```css
.hero { min-height: min(72vh, 640px); min-height: min(72dvh, 640px); }
.container { padding-inline: clamp(16px, 4vw, 40px); }
.metrics { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); } @media (min-width: 1024px) { .metrics { grid-template-columns: repeat(4, minmax(0, 1fr)); } }
.metrics > * { min-width: 0; } .metrics b { font-size: clamp(2.5rem, 6vw, 4.5rem); font-variant-numeric: tabular-nums; }
.nav { padding-top: env(safe-area-inset-top); } .dialog { padding-bottom: calc(16px + env(safe-area-inset-bottom)); }
.data-table-wrap { overflow-x: auto; overscroll-behavior-x: contain; }
h1 { overflow-wrap: anywhere; }
```

## Test

```bash
grep -nE "user-scalable=no|maximum-scale=1" site/index.html                          # 0
grep -rnE "h-screen|height: ?100vh" site/src --include=*.tsx --include=*.css | grep -v "company-ui.css"   # 0
grep -rnE "100dvh" site/src/styles/*.css | wc -l; grep -rnB1 "100dvh" site/src/styles/*.css | grep -c "100vh"   # każda dvh ma vh obok
grep -nE "safe-area-inset" site/src/styles/*.css                                     # ≥ 2
# Playwright WebKit 390×844 i 360×800 na każdej trasie: document.documentElement.scrollWidth <= innerWidth
# PLANOWANE (F3, verify-site.mjs nie zna tego trybu): node .claude/skills/klarow-guardian/scripts/verify-site.mjs --no-scroll-x 390 360
```

Severity: HIGH (przewijanie poziome, `user-scalable=no`); safe-area i dvh-fallback: MEDIUM w raporcie.

## Wyjątki

Tabele dem w scrollboxie (kit R1: „tabele data-dense na mobile scrollowalne poziomo = akceptowany wzorzec"); schemat `CollaborationFlow` (`minWidth: 1000` w `overflow-x: auto`).
