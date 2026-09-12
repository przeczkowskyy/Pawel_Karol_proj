---
id: design-contrast-aa
title: Kontrast AA: tekst ≥ 4,5:1, elementy UI i obrysy ≥ 3:1, placeholder ≥ 4,5:1, tekst na wideo na najjaśniejszej klatce
impact: HIGH
tags: [design, a11y, contrast, tokens, wcag]
source: WCAG 2.2 1.4.3 / 1.4.11 / taste §8.B (AA body, AAA hero) / ui-kit-habits.md §4.1 (placeholder 3,29:1, ikona empty 2,24:1, --input 1,5:1) / company-ui scrim rule / synthesis §2.5.2 (--foreground-faint ≥ 4,5:1)
added: 2026-09-12
---

## Zasada

Każda para kolor tekstu / tło z tokenów spełnia **≥ 4,5:1** (tekst, w tym placeholder, etykiety
osi ≥ 12 px, tekst chipów na tincie), a **≥ 3:1** dla elementów UI: obrysy kontrolek
(`--border-strong` na `--surface`), ikony informacyjne, fokus-ring, linie wykresu niosące dane.
Nagłówki hero celują w AAA (≥ 7:1). Tekst nad wideo/obrazem: overlay-gradient lub scrim
`--scrim` i pomiar kontrastu na **najjaśniejszej klatce** posteru/pętli. Placeholder = `--foreground-faint`
(nie `--border`). Kontrast liczymy z wartości tokenów (formuła WCAG relative luminance), a wynik
dla wszystkich par jest tabelą w `references/`; nowa para = nowy wiersz z wynikiem.

## Mechanizm awarii (dlaczego)

Kit nie przechodzi AA w kilku miejscach: placeholder `#6F6F73` na `#1F1F1F` = 3,29:1, ikona empty
state 2,24:1, obrys `--input` ≈ 1,5:1 wobec karty (WCAG 1.4.11 wymaga 3:1), `st-brick` na tincie
4,84:1 (najniżej, ledwo AA). Stal `#A8B4C2` ma 8,9:1 na `#121212`, ale 2,11:1 na bieli; to dlatego
motyw light ma inny akcent tekstu. Tekst na wideo mierzony na średniej klatce przechodzi, na
jasnej klatce pętli znika; stąd pomiar na najjaśniejszej. Lighthouse a11y ≥ 95 (DoD) nie zaliczy
strony z jednym placeholderem poniżej AA.

## Niepoprawnie

```css
::placeholder { color: var(--border); }                       /* ~1,3:1 */
.input { border: 1px solid #404040; }                          /* 1,5:1 wobec --surface */
.hero-lead { color: var(--foreground-muted); }                 /* na jasnej klatce wideo < 3:1 */
.axis text { fill: #5B5B60; font-size: 9.5px; }
```

## Poprawnie

```css
::placeholder { color: var(--foreground-faint); }              /* --gray-500 #8B8B90 ≥ 4,5:1 na --surface */
.input { border: 1px solid var(--border-strong); }             /* --gray-700 ≥ 3:1 */
.hero-media::after { background: linear-gradient(180deg, rgb(18 18 18 / .15), rgb(18 18 18 / .85)); }
.hero-lead { color: var(--foreground); }                       /* na overlayu ≥ 4,5:1 na najjaśniejszej klatce */
.axis text { fill: var(--chart-label); font-size: var(--text-xs); }
```

## Test

```bash
# formuła WCAG dla par z tokens.css (przykład: stal na tle, placeholder na surface)
node -e '
const L=h=>{const c=h.replace("#","").match(/../g).map(x=>parseInt(x,16)/255).map(v=>v<=.03928?v/12.92:((v+.055)/1.055)**2.4);return .2126*c[0]+.7152*c[1]+.0722*c[2]};
const cr=(a,b)=>{const x=L(a),y=L(b);return ((Math.max(x,y)+.05)/(Math.min(x,y)+.05)).toFixed(2)};
for(const [n,f,b] of [["accent/bg","#A8B4C2","#121212"],["on-cta/cta","#121212","#FAFAFA"],["faint/surface","#8B8B90","#262626"],["border-strong/surface","#404040","#262626"],["muted/bg","#B4B4B9","#121212"]]) console.log(n,cr(f,b));'
# placeholder z tokenu faint
grep -rnE "::placeholder\s*\{[^}]*var\(--foreground-faint\)" site/src/styles/*.css
```

DevTools → Rendering → „Emulate vision deficiencies" i Lighthouse a11y ≥ 95 na `/`, `/narzedzia`,
jednej podstronie narzędzia i `/rodo`. Dla wideo: zrzut najjaśniejszej klatki (ffmpeg `thumbnail`)
i pomiar pary tekst/klatka narzędziem kontrastu.

## Wyjątki

Linie siatki wykresu, hairline `--border` (1,33:1) i separatory strukturalne są dekoracją, nie
elementem UI niosącym informację (WCAG 1.4.11 ich nie obejmuje). Tekst `disabled` (`opacity: .5`)
jest zwolniony z AA (1.4.3 wyjątek), ale musi mieć `cursor: not-allowed` i `aria-disabled`.
