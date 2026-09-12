---
id: design-overflow-rules
title: Overflow: min-width 0 w gridach, kwoty nowrap, ellipsis na bloku, KPI clamp, zero scrolla poziomego
impact: HIGH
tags: [design, overflow, layout, mobile, tables, numbers]
source: company-ui §13 (6 reguł overflow), §10 (tabele) / ui-kit-habits.md E1–E7, O1–O7 / WIG Safe Areas & Layout / CLAUDE.md „Responsive" (gutter ≥ 16 px, brak scrolla poziomego)
added: 2026-09-12
---

## Zasada

1. Każde dziecko `grid`/`flex` z tekstem ma `min-width: 0` (`min-w-0`; kit: `.card > *`), inaczej
   długa kwota rozsadza kolumnę (grid blowout).
2. Kwoty, daty, numery telefonów i identyfikatory: `white-space: nowrap` (`.nowrap`) +
   `font-variant-numeric: tabular-nums` (`.tnum`); przy braku miejsca cały element idzie do nowej
   linii (`flex-wrap` na rodzicu), nigdy łamanie w środku liczby.
3. Ellipsis działa tylko na elemencie blokowym: `display: block | inline-block` +
   `overflow: hidden` + `white-space: nowrap` + `text-overflow: ellipsis`; na `inline-flex` nie działa.
4. Duże KPI skalują pismo (`font-size: clamp(1.25rem, 1.1vw + .8rem, 1.75rem)`) zamiast się zawijać.
5. `h1, h2 { overflow-wrap: anywhere }`; nagłówki z `text-wrap: balance`.
6. Tabele szersze niż kontener siedzą w wrapperze `overflow-x: auto` z `overscroll-behavior: contain`
   i `max-height`; na mobile `display: block`. Obrazy, wideo i aspect-boxy: `max-width: 100%`.
7. Strona **nigdy** nie przewija się poziomo: gutter ≥ 16 px na każdej szerokości
   (`--gutter clamp(16px, 4vw, 40px)`), żaden `min-width` szerszy niż ekran, `100vw` tylko z `overflow-x: clip`
   na rodzicu; layout mobilny zadeklarowany per sekcja (< 768 px = 1 kolumna).

## Mechanizm awarii (dlaczego)

To najbardziej „bolesne" reguły kitu, każda z realnym incydentem: kwota `1 234 567,89 zł` łamana
w środku w komórce tabeli, karta KPI rozsadzająca grid na 1250 px, ellipsis, który „nie działa",
bo tytuł był `inline-flex`, macierz rozciągająca stronę poziomo na telefonie (kit §10, §13).
Obietnica produktu to „co do grosza"; kwota złamana w połowie to zaprzeczenie obietnicy
w warstwie UI. Scroll poziomy na 390 px oznacza ucięte CTA i jest pierwszym, co zobaczy Karol
na iPhonie.

## Niepoprawnie

```tsx
<div className="grid grid-cols-3">
  <div><span className="text-2xl">1 234 567,89 zł</span></div>            {/* brak min-w-0, brak nowrap */}
</div>
<span className="inline-flex truncate">{longTitle}</span>                 {/* ellipsis nie zadziała */}
<table className="data-table">…</table>                                   {/* bez wrappera */}
<section style={{ width: "100vw" }}>…</section>                            {/* scroll poziomy przez scrollbar */}
```

## Poprawnie

```tsx
<div className="grid grid-cols-3 [&>*]:min-w-0">
  <div className="stat"><span className="val tnum nowrap">1 234 567,89 zł</span></div>   {/* .val = clamp */}
</div>
<span className="block truncate">{longTitle}</span>
<div className="table-wrapper"><table className="data-table">…</table></div>
<section className="section">…</section>                                  {/* szerokość z kontenera + --gutter */}
```

```css
.table-wrapper { overflow: auto; max-height: 70vh; overscroll-behavior: contain; }
h1, h2 { overflow-wrap: anywhere; text-wrap: balance; }
```

## Test

```bash
# kwoty bez nowrap (przegląd trafień): elementy z .tnum bez .nowrap
grep -rnE "className=\"[^\"]*\btnum\b[^\"]*\"" site/src --include=*.tsx | grep -v "nowrap"
# truncate na elemencie nieblokowym
grep -rnE "inline-flex[^\"]*truncate|truncate[^\"]*inline-flex" site/src --include=*.tsx
# tabela bez wrappera (przegląd)
grep -rnB2 "<table" site/src --include=*.tsx | grep -vE "table-wrapper|overflow"
# 100vw / min-width szersze niż ekran: 0 trafień
grep -rnE "100vw|min-width:\s*[4-9][0-9]{2,}px|min-w-\[[4-9][0-9]{2,}" site/src --include=*.tsx --include=*.css
```

Playwright 390×844 na każdej z 19 tras: `document.documentElement.scrollWidth <= window.innerWidth`.

## Wyjątki

Tabele data-dense w dashboardach mogą przewijać się poziomo **wewnątrz własnego wrappera**
(akceptowany wzorzec kitu §14); strona jako całość nie. Kod i diagramy SVG w `overflow-x: auto`
własnego kontenera.
