---
id: design-typography-scale
title: Skala pisma w rem, maksymalnie 7 stopni, minimum 12 px w UI, jeden krój, zero serif i mono
impact: MEDIUM
tags: [design, typography, tokens, fonts, rem]
source: ui-kit-habits.md C2 (N2), C3 (N3), R8, R16 / synthesis §2.5.3 (tabela typografii), R4 (Nunito solo) / taste §4.1, §9.B / decyzja D-06
added: 2026-09-12
---

## Zasada

Rozmiary pisma wyłącznie z tokenów w **rem** (`--text-xs .75 / sm .875 / base 1 / lg 1.125 /
xl 1.25 / 2xl clamp / 3xl clamp / display clamp(2.25rem, 5.2vw, 4.25rem)`): maksymalnie 7 stopni
+ display. **Minimum w UI = `.75rem` (12 px)**; 10 px tylko dla osi wykresów w dashboardach.
Zakazane: `px` z ułamkami (12.5 / 13.5 / 14.5), `text-[Npx]`, rozmiary „na oko" w klasach kitu,
więcej niż jedna waga display (nagłówki 600–700, nigdy 800+ poza wordmarkiem), `letter-spacing`
inne niż `-.02em` w nagłówkach i `.14em` w wordmarku. Krój: **Nunito Sans solo** (self-hosted
`woff2`, `unicode-range` latin + latin-ext, `font-display: swap`, preload pliku latin);
`--font-display` = alias `--font-sans` do decyzji D-06. Zero serif (w tym Instrument Serif /
Fraunces), zero mono w UI, zero Google Fonts CDN, zero Inter / Roboto / Arial jako kroju UI.
Nagłówki: `text-wrap: balance`, `overflow-wrap: anywhere`. Tekst akapitu `max-width: 60ch`.

## Mechanizm awarii (dlaczego)

Kit ma 9 stopni px z ułamkami plus ~12 wartości ad hoc (9.5 / 10.5 / 11.5 / 16.5 / 22 / 23 px):
brak skali, brak skalowania ustawień użytkownika (px ignoruje preferencje), 9,5–10 px nie przechodzi
czytelności mobile. Strona ma 140 `text-[Npx]`. Serif to „the single most-tested AI tell" (taste §4.1),
a mono w UI to rejestr dev-tool, nie CFO. Drugi krój (Geist) rozsadza budżet fontów (Nunito 93 KB
+ Geist ~70 KB > 150 KB; feasibility-perf §3.2) i wymaga osadzenia w PDF w tej samej fazie.

## Niepoprawnie

```css
.lbl { font-size: 10.5px; letter-spacing: .07em; font-weight: 800; }
.small { font-size: 13px; }
h1 { font-family: "Instrument Serif", serif; font-size: 72px; }
@import url("https://fonts.googleapis.com/css2?family=Inter");
```

```tsx
<p className="text-[13px] font-mono">…</p>
```

## Poprawnie

```css
@font-face { font-family: "Nunito Sans"; src: url("/fonts/nunito-sans-latin.woff2") format("woff2"); unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02BB-02BC, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2122, U+2191, U+2193, U+2212, U+2215, U+FEFF, U+FFFD; font-display: swap; font-weight: 200 1000; }
:root { --font-sans: "Nunito Sans", "Segoe UI", system-ui, -apple-system, sans-serif; --font-display: var(--font-sans); --text-xs: .75rem; --text-sm: .875rem; --text-base: 1rem; --text-lg: 1.125rem; --text-xl: 1.25rem; }
h1 { font: 700 var(--text-display)/1.05 var(--font-display); letter-spacing: -.02em; text-wrap: balance; overflow-wrap: anywhere; }
.lbl { font-size: var(--text-xs); font-weight: 600; letter-spacing: .06em; text-transform: uppercase; }
```

```html
<link rel="preload" as="font" type="font/woff2" href="/fonts/nunito-sans-latin.woff2" crossorigin />
```

## Test

```bash
# px w font-size poza tokens.css i osiami wykresów: 0 trafień
grep -rnE "font-size:\s*[0-9.]+px" site/src --include=*.css | grep -vE "styles/tokens.css|axis|chart"
grep -rnoE "text-\[[0-9.]+px\]" site/src --include=*.tsx
# serif / mono / CDN: 0 trafień
grep -rniE "serif\b|font-mono|font-family:\s*\"?(Inter|Roboto|Arial|Geist Mono|JetBrains)|fonts\.googleapis|fonts\.gstatic" site/src site/index.html | grep -v "sans-serif"
# fonty self-hosted i preload
ls site/public/fonts/*.woff2; grep -n 'rel="preload" as="font"' site/index.html
# budżet fontów ≤ 100 KB (Nunito solo)
du -k site/public/fonts/*.woff2
```

## Wyjątki

Osie i etykiety wykresów w dashboardach: `--text-2xs` (10 px) dozwolone. Wordmark: waga 800 i tracking
`.14em`. PDF (pdfmake) używa Roboto z wbudowanego vfs (decyzja B, patrz `design-pdf-document-pattern`);
to nie jest krój UI.
