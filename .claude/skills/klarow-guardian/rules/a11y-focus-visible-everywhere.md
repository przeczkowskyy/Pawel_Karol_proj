---
id: a11y-focus-visible-everywhere
title: Widoczny fokus na każdym elemencie interaktywnym; :focus-visible, nigdy outline-none bez zamiennika
impact: HIGH
tags: [a11y, focus, keyboard, css, kit]
source: WIG Focus States (5 reguł) + Anti-patterns (outline-none) / site-audit.md §3.2 p.4 (Navbar bez focus-visible), vercel.md §13 (badge.tsx focus: zamiast focus-visible:) / kit company-ui app.css:214 (.btn:focus-visible) / synthesis a11y-focus-visible (outline 2.5px solid var(--ring); offset 2px)
added: 2026-09-12
---

## Zasada

Każdy element interaktywny (`a`, `button`, `input`, `select`, `textarea`, `[tabindex]`, cała karta-link) ma widoczny stan fokusu klawiatury: globalnie w kicie `:focus-visible { outline: 2.5px solid var(--ring); outline-offset: 2px; }` z tokenem `--ring` o kontraście ≥ 3:1 wobec tła. Zakazane: `outline: none` / `outline-none` / `focus:outline-none` bez zamiennika w tej samej regule; `:focus` zamiast `:focus-visible` (ring po kliknięciu myszą); `focus:ring-*` Tailwinda z kolorami palety. Kompozyty (przełącznik PL/EN, pole z ikoną) używają `:focus-within`. Sticky navbar nie zasłania sfokusowanego elementu (`scroll-padding-top`, `scroll-margin-top` na kotwicach). Elementy z `.btn`, `.chip`, `.st` kitu dziedziczą fokus; własne klasy (np. karta hubu) muszą go dodać jawnie.

## Mechanizm awarii (dlaczego)

`Navbar.tsx:47-70`: CTA i przełącznik języka zbudowane na Tailwindzie bez klas kitu, więc nie dziedziczą `.btn:focus-visible` (`company-ui.css:214`); po Tab nie widać, gdzie jest fokus. `components/ui/badge.tsx:7` używa `focus:outline-none focus:ring-2` (`focus:` zamiast `focus-visible:`), co daje ring po kliknięciu myszą, a dla klawiatury ring w kolorze palety Tailwinda (zerowanej w `@theme`). Użytkownik klawiatury traci orientację; Lighthouse a11y i axe flagują brak wskaźnika fokusu; WCAG 2.4.7 (Focus Visible) i 2.4.11 (Focus Not Obscured) to poziom AA.

## Niepoprawnie

```tsx
<button className="px-2 py-1 rounded-full border border-[#3a3a3a] text-[#b4b4b9] hover:text-white">EN</button>   {/* brak fokusu */}
<span className="focus:outline-none focus:ring-2 focus:ring-ring">…</span>                                     {/* focus: nie focus-visible: */}
```
```css
a:focus { outline: none; }
```

## Poprawnie

```css
/* tokens.css / kit */
:root { --ring: #dfe5ec; }
:where(a, button, input, select, textarea, [tabindex]):focus-visible { outline: 2.5px solid var(--ring); outline-offset: 2px; }
.card-link:focus-visible { outline: 2px solid var(--accent); outline-offset: -2px; }   /* hairline w ramie */
.lang-switch:focus-within { outline: 2.5px solid var(--ring); }
html { scroll-padding-top: var(--nav-h); } [id] { scroll-margin-top: var(--nav-h); }
```
```tsx
<button type="button" className="btn btn-ghost lang-switch" aria-label={…}>EN</button>
```

## Test

```bash
grep -rnE "outline-none|outline: ?none|outline:0" site/src --include=*.tsx --include=*.css | grep -vE "focus-visible|:focus-visible"   # 0
grep -rnoE "\bfocus:(ring|outline|border)[a-z0-9-]*" site/src --include=*.tsx                                                            # 0 (focus-visible: dozwolone)
grep -nE ":focus-visible \{ outline: 2\.5px solid var\(--ring\)" site/src/styles/*.css                                                     # ≥ 1
# Playwright: Tab przez każdą trasę; dla każdego document.activeElement computed outline-style !== "none"
# DOCELOWO (skrypt planowany, jeszcze nie istnieje — dziś: NIE SPRAWDZANO): node .claude/skills/klarow-guardian/scripts/check-a11y.mjs --focus-visible
```

Severity: HIGH. Auto-fix dozwolony: `focus:` → `focus-visible:`.

## Wyjątki

`outline: none` jest dozwolone TYLKO w tej samej regule, która definiuje zamiennik (`box-shadow: 0 0 0 2.5px var(--ring)`), np. na elementach z `overflow: hidden` i `border-radius: 999px`, gdzie `outline` nie podąża za kształtem w starszym Safari.
