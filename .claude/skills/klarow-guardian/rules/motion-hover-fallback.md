---
id: motion-hover-fallback
title: Hover bez layout shift i z fallbackiem dla pointer: coarse i fokusu; hover animuje kolor/border/opacity, transform tylko na obrazie w overflow:hidden
impact: MEDIUM
tags: [motion, hover, a11y, touch, kit]
source: ui-kit-habits P2/B2 · bklit-ui §10.7 (showActions) · synthesis §2.3 S3/§2.4.8 tabela degradacji · motion-dev §4.9 · WIG (hover ≠ jedyny nośnik)
added: 2026-09-12
---

## Zasada

1. Hover animuje wyłącznie `color`, `background-color`, `border-color`, `opacity` (CSS, `--duration-fast`, `--ease-out`). `transform` w hover dozwolony tylko na `<img>`/`<video>` wewnątrz kontenera `overflow: hidden` (rama S3: `scale(1.02)`, 240 ms) i na kartach w gridzie (`translateY(-2px)`), nigdy na elementach inline w tekście, nigdy `box-shadow`, `filter`, `backdrop-filter`, `mask`.
2. Żadna informacja ani akcja nie jest dostępna WYŁĄCZNIE przez hover: przyciski akcji karty (np. „Otwórz", „Pobierz PDF"), klipy hover ściany S3 (v1, cztery kafle pierwszego rzędu; na dotyku NIE powstają, a tap otwiera podstronę z żywym dashboardem), tooltipy mają odpowiednik dla `(pointer: coarse)` i `:focus-visible`. Wzorzec: `showActions = reducedMotion || coarsePointer || hoverFine || focused`.
3. `whileHover`/`whileTap` z Motion tylko na natywnie fokusowalnych elementach (`button`, `a`); Motion dodaje `tabindex` do `whileTap`, ale semantykę daje HTML. `whileTap={{ scale: 0.98 }}` jest zbędne, bo kit ma `.btn:active { transform: scale(.98) }`.
4. Hover-klipy (faza 2): start na `mouseenter`/`focus`, pauza na `mouseleave`/`blur`, max 1 aktywny klip, tylko `pointer: fine`, reduced-motion → poster; na `pointer: coarse` element pokazuje poster i link „Odtwórz podgląd" (nie autoplay).

## Mechanizm awarii (dlaczego)

- Kit: „przycisk unosi się bez transformu i bez kolorowej poświaty: zero layout shift" (SKILL.md:161-167); `backdrop-filter`/`mask` w hover powodowały migotanie na części GPU (`app.css:1-4`).
- ~60 % ruchu na `/` z LinkedIn na telefonie: hover nie istnieje. Akcja tylko na hover = akcja niewidoczna dla głównego kanału (bklit rozwiązuje to `showActions` z `matchMedia("(hover: hover) and (pointer: fine)")`).
- Klawiatura/czytnik: `:focus-visible` musi pokazywać to samo, co hover, inaczej WCAG 2.1.1/1.4.13.
- `transform` na elemencie inline zmienia linię tekstu (layout shift); `box-shadow` w hover to paint co klatkę.

## Niepoprawnie

```tsx
<m.a whileHover={{ y: -4, boxShadow: "0 12px 40px rgba(0,0,0,.5)" }} />          // paint + transform na linku
<div className="card group"><button className="hidden group-hover:block">Otwórz</button></div>   // akcja tylko na hover
<span className="hover:scale-105 transition-transform">KSeF</span>                  // inline w tekście
```

## Poprawnie

```tsx
// rama S3: obraz skaluje się w overflow:hidden, akcja = cały <a>, fokus widoczny
<a className="case-frame" href={`/narzedzia/${tool.slug}`}>
  <img src={tool.media.wide} alt="" width={1280} height={800} loading="lazy" decoding="async" />
  <span className="case-meta">…</span>
</a>
/* CSS */
.case-frame { overflow: hidden; border: 1px solid var(--border); transition: border-color var(--duration-fast) var(--ease-out); }
.case-frame img { transition: transform var(--duration-base) var(--ease-out); }
.case-frame:hover img, .case-frame:focus-visible img { transform: scale(1.02); }
.case-frame:hover, .case-frame:focus-visible { border-color: var(--accent); }
@media (prefers-reduced-motion: reduce) { .case-frame img { transition: none; } .case-frame:hover img { transform: none; } }

// akcje widoczne zawsze na coarse/fokusie (wzorzec bklit)
const coarse = useMediaQuery("(hover: none), (pointer: coarse)");
const showActions = reduce || coarse || hovered || focused;
<div className="card-actions" style={{ opacity: showActions ? 1 : 0 }} aria-hidden={!showActions}>…</div>
```

## Test

```bash
# hover z zakazanymi właściwościami (oczekiwane: 0)
grep -rnE 'whileHover=\{[^}]*(boxShadow|filter|width|height|y:\s*-?[5-9]|y:\s*-?[1-9][0-9])' site/src
grep -rnE ':hover[^{]*\{[^}]*(box-shadow|filter|backdrop-filter|mask)' site/src --include=*.css | grep -v company-ui.css
grep -rnE 'group-hover:(block|flex|opacity-100)|hover:scale' site/src --include=*.tsx     # akcja/transform tylko na hover (ocena LLM: czy jest fallback)
# każdy :hover ma :focus-visible obok (oczekiwane: liczby równe w plikach CSS strony)
for f in site/src/styles/globals.css site/src/styles/tokens.css; do [ -f "$f" ] && printf '%s hover=%s focus=%s\n' "$f" "$(grep -c ':hover' "$f")" "$(grep -c ':focus-visible' "$f")"; done
# ręcznie: Playwright WebKit 390×844 (pointer: coarse) → karty S3/hub: wszystkie akcje widoczne bez hover; Tab po stronie: ten sam stan co hover.
```

## Wyjątki

- `.tools-col:hover { background: rgba(168,180,194,.07) }` (pas działów) to kolor: zgodne.
- `whileTap` na przyciskach kitu jest zbędne, nie zakazane; jeśli użyte, tylko `scale` i tylko z `.btn` bez CSS `transition: transform`.
