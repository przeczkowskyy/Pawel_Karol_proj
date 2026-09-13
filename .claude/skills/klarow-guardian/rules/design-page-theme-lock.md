---
id: design-page-theme-lock
title: "Page Theme Lock: strona jest JASNA na całej długości, motyw przez tokeny, zero dark: i zero inwersji sekcji"
impact: MEDIUM
tags: [design, theme, light, tokens, color-scheme]
source: decyzja Karola 2026-09-13 („Wychodzimy ze stylu ciemnego. Wchodzimy w cartoon jasny, przyjemny dla oka") / taste §4.11 Page Theme Lock / WIG „Dark Mode & Theming"
added: 2026-09-12
updated: 2026-09-13
---

> **ZMIANA KIERUNKU 2026-09-13.** Do 13 września ta reguła mówiła „strona jest ciemna".
> Karol odwrócił decyzję po czterech odrzuconych podejściach wizualnych: „Wychodzimy ze
> stylu ciemnego. Wchodzimy w cartoon jasny, przyjemny dla oka."
>
> Reguła NIE została złamana ani obejściem, ani wyjątkiem — została przepisana, bo zapisywała
> wcześniejszą decyzję tego samego człowieka. Sama mechanika (jeden motyw na całej długości,
> tokeny zamiast `dark:`, zero inwersji sekcji) zostaje bez zmian; odwraca się kierunek.
>
> Koszt, którego ta reguła się wcześniej obawiała („12 ciemnych dashboardów, +2–3 dni, ryzyko
> regresji"), okazał się znacznie niższy: `tokens.css` miał już KOMPLETNY zestaw
> `[data-theme="light"]` z policzonymi kontrastami, łącznie z tokenami wykresów. Przełączenie
> to `data-theme="light"` na `<html>` plus odczepienie czterech miejsc, które miały czerń
> wpisaną na stałe (`.bg-layer`, zasłona sceny, tło zastępcze, `theme-color`).

## Zasada

Strona ma **jeden motyw: jasny**, zamknięty na poziomie dokumentu:
`<html data-theme="light">`, `[data-theme="light"] { color-scheme: light }`,
`<meta name="theme-color" content="#f7f5f1">`. Żadna sekcja nie odwraca motywu (brak „ciemnej
kartki" między jasnymi sekcjami, brak ciemnej stopki, brak ciemnego embedu bez ramy).
Strategia tokenów = **CSS variables**; wariant Tailwinda `dark:` jest zakazany (mieszanie
strategii). Tinty w obrębie rodziny (`--surface` obok `--surface-raised`) są dozwolone.

**Warstwy nad materiałem składa się z tokenów motywu, nigdy z prymitywów.**
`rgba(var(--gray-975-rgb), .72)` wpisane w komponent jest błędem nawet wtedy, gdy akurat
wygląda dobrze: prymityw nie zna motywu, więc po zmianie kierunku zostaje czarną zasłoną na
jasnej stronie. Do tego służą `--veil-rgb`, `--veil-1..3` i `--media-tint-rgb`.

**Zasłona jasna musi być RZADKA.** Gęsta biel na jasnej stronie daje po prostu biel i zjada
kolor papieru (zmierzone zrzutem 2026-09-13: zasłona 0,55–0,88 zamieniała każdą scenę
w biały prostokąt). Stąd osobne krycie per motyw, a nie jedna wartość w arkuszu.

**Materiał wideo musi być jasny**, bo to on, a nie zasłona, gwarantuje kontrast ciemnemu
tekstowi sceny. Ciemny klip pod jasną sceną łamie `design-contrast-aa` i żadna zasłona tego
nie naprawi, jeśli ma zostawić widoczny papier.

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
