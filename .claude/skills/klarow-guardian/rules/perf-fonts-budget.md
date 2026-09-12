---
id: perf-fonts-budget
title: Fonty self-hosted w public/fonts, zero CDN, ≤ 100 KB w fazie 1 (Nunito Sans solo) / ≤ 150 KB po ewentualnym drugim kroju, preload latin, font-display swap + size-adjust
impact: HIGH
tags: [perf, fonts, privacy, cls, lcp]
source: synthesis §1.5 R4/§2.4.9/§2.5 (Nunito solo) · feasibility-perf §3.2/§9 p.5 · ui-kit-habits C3 (N3) · site-audit §1.8 (brak preload) · rozstrzygnięcie (2): PDF zostaje na Roboto
added: 2026-09-12
---

## Zasada

1. Wszystkie kroje w `site/public/fonts/*.woff2` (dziś: `NunitoSans-var-latin.woff2` 49,6 KB + `NunitoSans-var-latin-ext.woff2` 43,7 KB = 93,3 KB). Zero `fonts.googleapis.com`, `fonts.gstatic.com`, `rsms.me`, `cdn.jsdelivr.net`, `@fontsource` ładowanych z sieci.
2. Budżet `dist/fonts`: **≤ 102 400 B (100 KB)** w fazie 1 (Nunito Sans solo, `--font-display` = alias `--font-sans`). Drugi krój (Geist) TYLKO po (a) teście 2 mockupów zaakceptowanym przez founderów i (b) osadzeniu w PDF w tej samej fazie (statyczne TTF 400/600; decyzja o foncie v2); wtedy budżet **≤ 153 600 B (150 KB)** i transfer mobile `/` ≤ 350 KB musi się nadal domykać.
3. `@font-face` z `unicode-range` (latin, latin-ext osobno), `font-display: swap`, fallback systemowy z `size-adjust`/`ascent-override` dopasowanym do Nunito (CLS przy swapie ≈ 0): `@font-face { font-family: "Nunito Sans Fallback"; src: local("Segoe UI"), local("Arial"); size-adjust: 104%; ascent-override: 100%; descent-override: 35%; line-gap-override: 0% }`.
4. `<link rel="preload" as="font" type="font/woff2" crossorigin>` TYLKO dla pliku latin (nie latin-ext, nie dla wagi nieużywanej nad foldem).
5. Wagi: variable font (jeden plik na subset); żadnych dodatkowych statycznych plików wag; UI używa 400/600/700 (nagłówki 600–700, nie 800).
6. PDF (`lib/pdf.ts`): Roboto wbudowane w pdfmake (decyzja B, okno c1); API `pdfDoc({ font })` przyjmuje parametr, ale osadzenie kroju UI w vfs dopiero po decyzji founderów o foncie v2. Nie kopiować woff2 do vfs (pdfmake potrzebuje TTF).

## Mechanizm awarii (dlaczego)

- CDN fontów = zewnętrzne żądanie na ścieżce krytycznej (DNS + TLS ~300 ms), dane o użytkowniku u dostawcy (persona „dane zostają u Ciebie"; narzędzia chodzą w LAN bez internetu), ryzyko blokera treści → brak fontu.
- Budżet transferu mobile `/` bez wideo ≤ 350 KB: 60 (poster) + 135 (JS) + 20 (CSS) + 93 (font) + 10 (HTML) ≈ 320 przy Nunito solo; Geist (+70 KB) wysadza go (feasibility-perf §3.2).
- Bez preloadu latin przeglądarka odkrywa font po CSS → FOUT na pierwszym wejściu (site-audit §3.1 p.7); bez `size-adjust` swap fallback → Nunito przesuwa H1 o 1–2 linie (CLS 0,1+).
- Dwa kroje = dwa pliki na ścieżce krytycznej i niespójność z PDF (dziś PDF na Roboto, UI na Nunito: świadomy dług).

## Niepoprawnie

```html
<link href="https://fonts.googleapis.com/css2?family=Geist:wght@400;600&display=swap" rel="stylesheet">
```

```css
@font-face { font-family: "Nunito Sans"; src: url("/fonts/NunitoSans-var-latin.woff2"); }   /* brak unicode-range, brak display */
```

## Poprawnie

```css
/* tokens.css / company-ui.css */
@font-face { font-family: "Nunito Sans"; font-style: normal; font-weight: 200 1000; font-display: swap;
  src: url("/fonts/NunitoSans-var-latin.woff2") format("woff2"); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; }
@font-face { font-family: "Nunito Sans"; font-style: normal; font-weight: 200 1000; font-display: swap;
  src: url("/fonts/NunitoSans-var-latin-ext.woff2") format("woff2"); unicode-range: U+0100-02AF, U+0304, U+0308, U+0329, U+1E00-1E9F, U+1EF2-1EFF, U+2020, U+20A0-20AB, U+20AD-20CF, U+2113, U+2C60-2C7F, U+A720-A7FF; }
@font-face { font-family: "Nunito Sans Fallback"; src: local("Segoe UI"), local("Arial"); size-adjust: 104%; ascent-override: 100%; descent-override: 35%; line-gap-override: 0%; }
:root { --font-sans: "Nunito Sans", "Nunito Sans Fallback", system-ui, sans-serif; --font-display: var(--font-sans); }
```

```html
<link rel="preload" as="font" type="font/woff2" href="/fonts/NunitoSans-var-latin.woff2" crossorigin>
```

## Test

```bash
# budżet (Git Bash)
du -cb site/public/fonts/*.woff2 | tail -1        # ≤ 102400 (faza 1) / ≤ 153600 (po decyzji Geist)
ls site/public/fonts | wc -l                       # = 2 w fazie 1
# zero CDN
grep -rnE 'fonts\.googleapis|fonts\.gstatic|rsms\.me|@fontsource|cdn\.jsdelivr|unpkg' site/src site/index.html site/package.json   # = 0
# preload latin dokładnie raz, latin-ext nigdy
grep -c 'rel="preload" as="font"' site/index.html                  # = 1
grep -nE 'preload[^>]*latin-ext' site/index.html                    # = 0
# font-face kompletne
grep -cE 'font-display:\s*swap' site/src/styles/*.css               # ≥ 2
grep -cE 'unicode-range' site/src/styles/*.css                       # ≥ 2
grep -cE 'size-adjust' site/src/styles/*.css                         # ≥ 1
# runtime: Lighthouse CLS < 0,05 na /; DevTools Network: 1 żądanie fontu przed LCP (latin), latin-ext dopiero przy polskich znakach
```

## Wyjątki

- `pdfmake` `vfs_fonts` (Roboto ~470 KB gz) ładuje się lazy po kliknięciu „Pobierz PDF" i nie liczy się do budżetu `dist/fonts`.
- `google<token>.html` (GSC) w `public/` nie jest fontem.
