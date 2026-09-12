---
id: design-no-three-equal-cards
title: Zero trzech równych kart w rzędzie; rodziny layoutu się nie powtarzają
impact: MEDIUM
tags: [design, layout, cards, bento, slop]
source: taste §0.D, §9.C („NO 3-column equal feature cards"), §14 Section-Layout-Repetition, Bento Background Diversity / imagegen §8 Layout slop / synthesis §2.3 (9 rodzin layoutu)
added: 2026-09-12
---

## Zasada

Na trasach marketingowych: **żaden rząd trzech identycznych kart** (ta sama ikona + tytuł + zdanie
× 3 w `grid-cols-3`). Sekcje różnią się rodziną layoutu: **≥ ceil(liczba sekcji / 2) rodzin na trasę**
(taste §9 mówi „≥ 4 rodziny na 8 sekcji"; trasa `/` w v2 ma **9 sekcji S1–S9**, czyli próg = 5, a projekt
daje 9 rodzin); żadne dwie sąsiednie sekcje nie dzielą layoutu; maksymalnie 2 kolejne sekcje z tym samym splitem
obraz/tekst. Siatki: gapless bento z hairline (N elementów = N komórek, bez pustych, ≥ 2 komórki
z realnym wizualem), 2×2 z hairline, ramy 2×2 z offsetem, pas metryk, rząd kroków, side-image 60/40.
Grupowanie przez linie (`border-top`, `border-left`, `divide-y`) i przestrzeń, karta z tłem tylko
tam, gdzie elewacja niesie hierarchię (dashboard, dialog). Zero „split-header" (duży nagłówek po
lewej + mały akapit po prawej).

## Mechanizm awarii (dlaczego)

taste §0.D nazywa trzy równe karty jednym z pięciu domyślnych Telli LLM; imagegen §8: „identical card
rows repeated section after section". Kolumna trzech kart czyta się jako szablon, nie jako firma
z charakterem, i zabiera miejsce wizualom („mniej tekstu, więcej pokazywania"). Decyzja Karola
z cz. 6: hairlines zamiast boxów (pas działów jako kolumny rozdzielone liniami 1 px). Dziś strona
ma sekcję 6 kafli ikonowych i 4 statystyki w jednym rytmie; v2 rozbija to na 9 rodzin.

## Niepoprawnie

```tsx
<div className="grid grid-cols-3 gap-6">
  {features.map(f => (
    <div className="card p-6" key={f.title}><f.Icon /><h3>{f.title}</h3><p>{f.text}</p></div>
  ))}
</div>
```

## Poprawnie

```tsx
{/* gapless bento 3×2: kontener border-top+left, komórka border-right+bottom; 3 z 6 komórek z żywym wizualem */}
<div className="bento" role="list">
  {cells.map((c, i) => (
    <article className="bento-cell" role="listitem" key={c.key}>
      <c.Icon size={24} strokeWidth={1.5} aria-hidden />
      <h3>{pick(c.name, lang)}</h3>
      <p>{pick(c.line, lang)}</p>
      {c.live ? <c.live /> : null}
    </article>
  ))}
</div>
```

```css
.bento { border-top: 1px solid var(--border); border-left: 1px solid var(--border); display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); }
.bento-cell { border-right: 1px solid var(--border); border-bottom: 1px solid var(--border); padding: 28px 24px; }
```

## Test

```bash
# grid 3-kolumnowy z kartą: przegląd każdego trafienia
grep -rnE "grid-cols-3|repeat\(3," site/src --include=*.tsx --include=*.css | grep -vE "components/dashboards/|bento"
# cienie/karty na marketingu: 0 trafień (karty tylko w tool)
grep -rnE "className=\"[^\"]*\bcard\b" site/src/pages site/src/App.tsx site/src/components --include=*.tsx | grep -vE "components/dashboards/|DemoReport"
```

Przegląd LLM (ui-auditor): lista sekcji trasy → rodzina layoutu każdej; fail, gdy rodzin jest mniej niż
ceil(liczba sekcji / 2) (trasa `/`: 9 sekcji → próg 5) albo gdy dwie sąsiednie sekcje mają tę samą rodzinę.

## Wyjątki

Siatka 13 kart na hubie `/narzedzia` (katalog, nie „feature row"): karty są linkami z realnym zrzutem,
różnią się treścią i mają filtr; dopuszczalna jako jedyna powtarzalna siatka strony. Trzy KPI
w dashboardach (`tool`) to dane, nie marketing.
