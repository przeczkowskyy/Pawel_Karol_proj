---
id: a11y-headings-order-one-h1
title: Dokładnie jeden H1 na trasę, hierarchia h1→h2→h3 bez przeskoków, scroll-margin-top na kotwicach
impact: HIGH
tags: [a11y, headings, seo, structure, prerender]
source: WIG Accessibility (headings hierarchical; scroll-margin-top on heading anchors) / site-audit.md §3.2 p.7 (h1 per strona OK) / synthesis §2.8 p.1 (verify-site: 1 H1 i <main> per plik), §2.3 (nagłówek ≤ 6 słów)
added: 2026-09-12
---

## Zasada

Każda trasa (także `/rodo` i `404`) ma dokładnie jeden `<h1>` w `<main>`; sekcje home i podstron mają `<h2>` (nagłówek ≤ 6 słów), karty i pod-bloki `<h3>`; nie ma przeskoku o więcej niż jeden poziom w dół (h2 → h4) ani nagłówków używanych „dla rozmiaru pisma" (rozmiar to klasa `.fs-*`, nie tag). Nagłówki z `id` (kotwice `#sciezka`, `#faq-cena`) mają `scroll-margin-top: var(--nav-h)`. Shell prerendera i DOM po JS mają identyczny zbiór H1/H2 (bramka shell-vs-DOM). Wordmark `KLAROW` w navbarze i stopce nie jest nagłówkiem (to `<a>`/`<span className="brand-word">`).

## Mechanizm awarii (dlaczego)

Czytniki ekranu nawigują po nagłówkach (klawisz H); dwa H1 albo przeskok h2 → h4 gubią użytkownika i psują „outline" strony, który Google używa do fragmentów i sitelinks. Dziś jest poprawnie (`App.tsx:137`, `ToolPage.tsx:134`), ale przebudowa dodaje 9 sekcji home z `Section` i łatwo o drugi H1 w hero-media lub o `<h4>` w kartach bento. Sticky navbar bez `scroll-margin-top` zasłania nagłówek po kliknięciu w kotwicę (WCAG 2.4.11).

## Niepoprawnie

```tsx
<h1 className="brand-word">KLAROW</h1>            {/* wordmark jako H1 */}
<section><h2>Co budujemy</h2><div className="cell"><h4>Raporty i kontroling</h4></div></section>   {/* przeskok */}
<h3 className="text-[26px]">Pokaż nam proces, który boli.</h3>   {/* tag dla rozmiaru */}
```

## Poprawnie

```tsx
<a href="/" className="brand-word" translate="no">KLAROW</a>
<main id="main"><h1>{pick(lang, HOME.hero.h1)}</h1>
  <section aria-labelledby="s2"><h2 id="s2">Co budujemy</h2><div className="cell"><h3>Raporty i kontroling</h3></div></section>
  <section aria-labelledby="s9"><h2 id="s9" className="fs-2xl">Pokaż nam proces, który boli.</h2></section>
</main>
```
```css
[id] { scroll-margin-top: var(--nav-h); }
```

## Test

```bash
# dist: 1 H1 per plik; brak przeskoków poziomów (skrypt buduje outline)
for f in $(find site/dist -name "*.html"); do n=$(grep -o "<h1" "$f" | wc -l); [ "$n" = 1 ] || echo "FAIL $f h1=$n"; done
node .claude/skills/klarow-guardian/scripts/verify-site.mjs                                    # findings [seo-prerender-must-keep]: „N × <h1> (ma być dokładnie 1)" per plik
# PLANOWANE (F3, verify-site.mjs nie zna tego trybu): node .claude/skills/klarow-guardian/scripts/verify-site.mjs --headings
grep -rnE "<h[1-6][^>]*className=\"[^\"]*(brand-word|text-\[)" site/src --include=*.tsx   # 0
grep -nE "scroll-margin-top" site/src/styles/*.css                                          # ≥ 1
```

Severity: HIGH.

## Wyjątki

Dashboardy w trybie `tool` osadzone na podstronie używają `<h2>`/`<h3>` (są pod H1 podstrony); osadzony dashboard nie może mieć własnego `<h1>`.
