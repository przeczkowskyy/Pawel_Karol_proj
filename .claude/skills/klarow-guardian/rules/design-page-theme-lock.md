---
id: design-page-theme-lock
title: Page Theme Lock: landing jest ciemny na całej stronie, motyw przez tokeny, zero dark: i inwersji sekcji
impact: MEDIUM
tags: [design, theme, dark, tokens, color-scheme]
source: taste §4.11 Page Theme Lock, §8 Dark Mode Protocol, §6.C / globals.css:5 („Landing jest dark-only") / synthesis §2.5.1 / taste.md §8 (Klarow: brand insists)
added: 2026-09-12
---

## Zasada

Strona ma **jeden motyw: ciemny** (`--background #121212`, stal jako akcent), zamknięty na poziomie
dokumentu: `:root { color-scheme: dark }`, `<meta name="theme-color" content="#121212">`,
`data-theme` nie ustawiane na stronie. Żadna sekcja nie odwraca motywu (brak „jasnej kartki"
między ciemnymi sekcjami, brak jasnego footera, brak jasnego embedu bez ramy). Strategia tokenów
= **CSS variables** (`:root` dark, `[data-theme="light"]` tylko jako komplet tokenów gotowy dla
narzędzi i PDF-preview); wariant Tailwinda `dark:` jest zakazany (mieszanie strategii). Tinty
w obrębie rodziny (`--surface` obok `--surface-raised`) są dozwolone. Dokumenty PDF są jasne, ale to
osobny artefakt, nie sekcja strony.

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
