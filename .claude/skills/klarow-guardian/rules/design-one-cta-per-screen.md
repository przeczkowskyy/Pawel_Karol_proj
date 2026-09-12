---
id: design-one-cta-per-screen
title: Jeden primary CTA na ekran (biały, płaski); jedna etykieta per intencja
impact: HIGH
tags: [design, cta, conversion, buttons, copy]
source: company-ui §4 (1 primary na ekran) / taste §14 „No Duplicate CTA Intent", „CTA Button Wrap" / synthesis S3 (płaski biały CTA), §2.1 cta / ui-kit-habits.md §4.5 (słaba salience stali)
added: 2026-09-12
---

## Zasada

Na każdym ekranie (viewport / sekcja) jest **co najwyżej jeden** `.btn-primary`. Primary = płaska
biel na czerni: `background: var(--cta)` (`#FAFAFA`), `color: var(--on-cta)`, obrys 1 px,
hover = `--cta-hover` + obrys `--accent`, zero gradientu, zero glow, `:active { transform: scale(.98) }`.
Drugi przycisk w tej samej grupie to `.btn-secondary` (ghost). Etykiety są **jedno źródło per
intencja** (`MESSAGING.cta`): „Umów 30 minut" (rozmowa), „Zobacz realizacje" (dowód), „Przyślij
najgorszy Excel" (plik; tylko `/oferta` i podstrony narzędzi). Dwie etykiety o tej samej intencji
na jednej stronie („Umów rozmowę" + „Porozmawiajmy") = fail. Etykieta CTA nie zawija się na desktopie
(≤ 3 słowa PL / EN). Akcje destrukcyjne nigdy jako primary.

## Mechanizm awarii (dlaczego)

Stal jest nisko-chromatyczna; stalowy CTA obok stalowych chipów i linków ginie (salience), więc
primary musi być jedynym jasnym prostokątem na ekranie, a nie jednym z trzech. Dwa primary na
ekranie dzielą uwagę; dwie etykiety tej samej intencji sugerują dwa różne kroki i obniżają
konwersję (taste §14). KPI strony to umówione rozmowy, nie kliknięcia w losowe przyciski
(`strategy.md` §7.2).

## Niepoprawnie

```tsx
// hero: dwa primary + trzeci w sekcji poniżej z inną etykietą tej samej intencji
<button className="btn btn-primary">Umów rozmowę</button>
<button className="btn btn-primary">Zobacz demo</button>
…
<a className="btn btn-primary" href="mailto:…">Porozmawiajmy</a>
```

```css
.btn-primary { background: linear-gradient(180deg, #b9c4d1, #a8b4c2, #96a3b3); box-shadow: 0 0 24px rgba(168,180,194,.45); }
```

## Poprawnie

```tsx
<button className="btn btn-primary" onClick={openBooking}>{pick(MESSAGING.cta.primary, lang)}</button>
<Link className="btn btn-secondary" to="/narzedzia">{pick(MESSAGING.cta.secondary, lang)}</Link>
```

```css
.btn-primary { background: var(--cta); color: var(--on-cta); border: 1px solid var(--cta); }
.btn-primary:hover { background: var(--cta-hover); border-color: var(--accent); }
.btn-primary:active { transform: scale(.98); }
```

## Test

```bash
# liczba btn-primary per komponent sekcji (oczekiwane ≤ 1 na plik sekcji; Navbar = wyjątek)
grep -rc "btn-primary" site/src/components site/src/pages site/src/App.tsx | grep -vE ":0$|Navbar"
# etykiety CTA poza messaging.ts: 0 trafień
grep -rnE "Umów|Zobacz realizacje|Przyślij najgorszy|Book 30|See our work" site/src --include=*.tsx | grep -v "MESSAGING.cta"
# gradient/glow na przycisku: 0 trafień
grep -rnE "\.btn-primary[^{]*\{[^}]*(linear-gradient|box-shadow:\s*0 0)" site/src/styles/*.css
```

Playwright/DevTools 1440 px: przewiń stronę; na żadnej pozycji scrolla nie widać dwóch białych
przycisków poza parą (navbar + hero).

## Wyjątki

Sticky navbar niesie ten sam primary („Umów 30 minut") co hero; w viewport hero widać wtedy dwa
identyczne przyciski tej samej etykiety i intencji. To jedyny dopuszczony duplikat (ta sama etykieta,
ten sam handler). W dashboardach (`tool`) primary = akcja główna panelu (np. „Przelicz"),
też jedna na panel.
