---
id: design-eyebrow-cap
title: Eyebrow (kapitalik nad nagłówkiem) maksymalnie ceil(sekcje/3) na trasę; home = 0
impact: MEDIUM
tags: [design, typography, eyebrow, layout, slop]
source: taste §4.7 EYEBROW RESTRAINT, §14 „EYEBROW COUNT (mechanical)", §9.F (section-number eyebrows) / synthesis §2.3 („Eyebrow count = 0") / ui-kit-habits.md §1.3 (`.lbl-sm` ×30)
added: 2026-09-12
---

## Zasada

Etykieta-kapitalik nad nagłówkiem sekcji (`.eyebrow`, `.lbl-sm` poza dashboardami, każde
`text-transform: uppercase` + `letter-spacing` nad `h2/h3`) występuje **co najwyżej
ceil(liczba sekcji / 3)** razy na trasie; hero liczy się jako 1. Trasa `/` w v2 ma 9 sekcji i **0**
eyebrow (decyzja editorial). Eyebrow nigdy nie numeruje („01 · Narzędzia", „00 / INDEX"), nie jest
wersją („BETA"), nie jest mikro-zdaniem pod nagłówkiem ani zakresem lat. W dashboardach
(`tool`) `.lbl-sm` jest etykietą KPI/kolumny (uppercase 600, `--text-xs`), nie eyebrow, i nie
podlega limitowi.

## Mechanizm awarii (dlaczego)

taste §4.7: eyebrow nad każdą sekcją to jeden z najczęstszych Telli LLM-owego layoutu; zmienia
stronę w formularz „ETYKIETA / Nagłówek / Akapit" powtórzony 8 razy. Strona ma dziś 30 użyć
`.lbl-sm`, w większości jako eyebrow. `high-end-visual-design` każe eyebrow-pill nad każdym H2;
ten skill jest w precedencji niżej i jego reguła jest wyłączona. Brief Karola: „mniej tekstu, więcej
pokazywania"; eyebrow to tekst, który nic nie mówi.

## Niepoprawnie

```tsx
<section>
  <span className="lbl-sm">02 · Co budujemy</span>
  <h2>Co budujemy</h2>
  <p className="lbl-sm">Każda z tych rzeczy to funkcja, którą dowozimy dziś, nie obietnica roadmapy.</p>
</section>
```

## Poprawnie

```tsx
<section className="section">
  <h2>Co budujemy</h2>
  <p className="lead">Nie mamy zamkniętego katalogu. Sześć typów pracy, które powtarzają się w każdym dziale.</p>
</section>
```

## Test

```bash
# per plik strony/sekcji: liczba kapitalików (oczekiwane: home 0; inne trasy ≤ ceil(sekcje/3))
grep -rcE "lbl-sm|className=\"eyebrow|uppercase tracking" site/src/pages site/src/components site/src/App.tsx | grep -vE ":0$|components/dashboards/"
# numeracja/wersje w eyebrow: 0 trafień
grep -rnE "(lbl-sm|eyebrow)[^>]*>\s*(0[0-9]|[0-9]{2}\s*[·/]|BETA|v[0-9])" site/src --include=*.tsx
```

Playwright: `document.querySelectorAll('main .eyebrow, main .lbl-sm').length` na `/` = 0.

## Wyjątki

Etykiety KPI, nagłówki kolumn tabel i legendy w dashboardach (`data-surface="tool"`), etykiety
formularzy (`<label>`), meta pod ramą realizacji (chipy `.st`, nie kapitaliki).
