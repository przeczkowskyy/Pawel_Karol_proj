---
id: design-page-theme-lock
title: "Page Theme Lock: strona jest CIEMNA na całej długości, motyw przez tokeny, zero dark: i zero inwersji sekcji"
impact: MEDIUM
tags: [design, theme, dark, tokens, color-scheme]
source: decyzja Karola 2026-09-17 („Motyw wraca na ciemną stal") / taste §4.11 Page Theme Lock / WIG „Dark Mode & Theming"
added: 2026-09-12
updated: 2026-09-17
---

> **ZMIANA KIERUNKU 2026-09-17: powrót na ciemny.** Trzeci datowany zapis w tym pliku;
> wszystkie trzy to decyzje tego samego człowieka, nie obejścia.
>
> - do 2026-09-13: ciemny,
> - 2026-09-13: jasny — „Wychodzimy ze stylu ciemnego. Wchodzimy w cartoon jasny",
> - **2026-09-17: z powrotem ciemny — „Motyw wraca na ciemną stal."**
>
> **Dlaczego wróciliśmy.** Jasny papier był wybrany pod kreskówkę, a kreskówka została
> odrzucona razem z całym materiałem generatywnym („te gify zupełnie nam nie wyszły").
> Nowy kierunek — strona URUCHAMIA prawdziwe narzędzia — działa lepiej na ciemnym: pulpity,
> liczby i wykresy czytają się wtedy jak sprzęt pomiarowy, a nie jak dokument. Dwanaście
> osadzonych dashboardów jest ciemnych z urodzenia, więc znika też koszt ich retestu.
>
> **Ta wersja pliku usuwa jego wewnętrzną sprzeczność.** Przy odwróceniu 13 września
> przepisano nagłówek i „Zasadę", ale sekcje „Poprawnie" i „Test" zostały ciemne — reguła
> mówiła jedno, a testowała drugie. Teraz cały plik mówi to samo.
>
> Mechanika bez zmian w obu kierunkach: jeden motyw na całej długości, tokeny zamiast `dark:`,
> zero inwersji sekcji. Koszt powrotu okazał się minimalny, bo **ciemny jest wartością domyślną
> `:root`** w `tokens.css`, a jasny był nadpisaniem `[data-theme="light"]`: wystarczyło zdjąć
> jeden atrybut z `<html>`, zmienić `theme-color` i uogólnić jedno nadpisanie `.btn-primary`.

## Zasada

Strona ma **jeden motyw: ciemny**, zamknięty na poziomie dokumentu:
`<html lang="pl">` bez atrybutu motywu, `:root { color-scheme: dark }`,
`<meta name="theme-color" content="#121212">`. Żadna sekcja nie odwraca motywu (brak „jasnej
kartki" między ciemnymi sekcjami, brak jasnej stopki, brak jasnego embedu bez ramy).
Strategia tokenów = **CSS variables**; wariant Tailwinda `dark:` jest zakazany (mieszanie
strategii). Tinty w obrębie rodziny (`--surface` obok `--surface-raised`) są dozwolone.

**Warstwy nad materiałem składa się z tokenów motywu, nigdy z prymitywów.**
`rgba(var(--gray-975-rgb), .72)` wpisane w komponent jest błędem nawet wtedy, gdy akurat
wygląda dobrze: prymityw nie zna motywu, więc po zmianie kierunku zostaje czarną zasłoną na
jasnej stronie. Do tego służą `--veil-rgb`, `--veil-1..3` i `--media-tint-rgb`.

**Krycie zasłony zależy od kierunku motywu i dlatego jest OSOBNYM tokenem** (`--veil-1..3`),
a nie jedną wartością w arkuszu. Zasłona ciemna musi być gęsta (jasny tekst musi wygrać
z dowolnym kadrem); zasłona jasna musi być rzadka, bo gęsta biel na jasnej stronie daje po
prostu biel i zjada kolor papieru (zmierzone zrzutem 2026-09-13: krycie 0,55–0,88 zamieniało
każdą scenę w biały prostokąt). Kto zmienia kierunek motywu, przelicza oba komplety.

**Materiał pod tekstem musi mieć kierunek przeciwny do tekstu.** W motywie ciemnym tekst
jest jasny, więc kadr pod nim ma być ciemny albo przykryty gęstą zasłoną; w jasnym odwrotnie.
To materiał, a nie zasłona, gwarantuje kontrast — klip idący pod prąd motywu łamie
`design-contrast-aa` i żadna zasłona tego nie naprawi, jeśli ma zostawić widoczne tło.

## Mechanizm awarii (dlaczego)

taste §4.11: „The user must not feel they walked into a different website mid-scroll." 12 osadzonych
dashboardów jest ciemnych; jasny landing wymagałby przełączenia wszystkich na `[data-theme=light]`
i retestu wykresów (+2–3 dni, ryzyko regresji; synthesis §2.5.1). Stal `#A8B4C2` ma 8,9:1 na czerni
i 2,11:1 na bieli, więc jasna sekcja zmusza do drugiego akcentu (`--steel-700`) w środku strony,
czyli złamania Color Lock. `dark:` utility obok tokenów CSS = dwa mechanizmy motywu, których
nikt nie testuje razem. `color-scheme: dark` bez deklaracji daje jasne natywne `<select>`, scrollbary
i autofill formularzy (WIG „Dark Mode & Theming").

## Niepoprawnie

```tsx
<section className="bg-white text-zinc-900 dark:bg-zinc-950">   {/* jasna sekcja w ciemnej stronie */}
<footer className="bg-[#F4F5F7]">…</footer>
```

```css
/* brak color-scheme, brak theme-color, motyw przełączany klasą .dark na body */
```

## Poprawnie

```css
/* tokens.css */
:root { color-scheme: dark; --background: var(--gray-975); --surface: var(--gray-900); /* … */ }
[data-theme="light"] { color-scheme: light; --background: #F4F5F7; --surface: #FFFFFF; --accent: var(--steel-700); /* komplet, patrz design-light-ready-tokens */ }
```

```html
<meta name="theme-color" content="#121212" />
```

```tsx
<section className="bg-surface">…</section>          {/* tint w rodzinie, nie inwersja */}
<footer className="border-t border-border">…</footer>
```

## Test

```bash
grep -n "color-scheme:\s*dark" site/src/styles/tokens.css
grep -n 'name="theme-color" content="#121212"' site/index.html
# dark: i jasne tła w komponentach: 0 trafień
grep -rnE "\bdark:|bg-white\b|bg-\[#[fF]|data-theme=\"light\"" site/src --include=*.tsx
# w buildzie każda trasa ma ten sam kolor tła dokumentu
grep -c 'theme-color' site/dist/index.html site/dist/narzedzia.html site/dist/oferta.html site/dist/faq.html site/dist/rodo.html
```

DevTools: Rendering → „Emulate CSS prefers-color-scheme: light" nie może zmienić strony (brak
media query na `prefers-color-scheme` w `site/src`).

## Wyjątki

Osadzony dashboard w podglądzie PDF (jasny dokument w ramie) i strona `/rodo` drukowana
(`@media print` białe tło) nie łamią locku: to artefakty, nie sekcje. Narzędzia on-prem (poza
`site/`) mogą mieć przełącznik motywu z kitu.
