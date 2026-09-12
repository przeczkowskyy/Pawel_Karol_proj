---
id: design-sticky-opaque
title: Sticky = nieprzezroczyste tło z tokenu i udokumentowana skala z-index
impact: HIGH
tags: [design, sticky, tables, navbar, z-index, ios]
source: company-ui §10 STICKY RULE (app.css:317-320) / ui-kit-habits.md E6 / taste §6.F Z-Index Restraint / CLAUDE.md 2026-07-26 (content-layer bez z-index, bg-layer -1)
added: 2026-09-12
---

## Zasada

Każdy element `position: sticky` (nagłówek tabeli, stopka sum, zamrożona kolumna, navbar) ma tło
**nieprzezroczyste** z tokenu powierzchni (`--surface`, `--surface-overlay`, `--surface-muted`),
nigdy `rgba()`/`transparent`/`backdrop-filter`. Między `th` a wrapperem scrolla nie ma przodka
z `overflow`/`clip`/`transform` (unieważnia sticky). Skala z-index jest stała i udokumentowana
w `tokens.css`: `--z-nav: 10`, `--z-sticky-head: 3–4`, `--z-sticky-foot: 3`, `--z-sticky-col: 2`,
`--z-dialog: 50`; żadnych `z-50`/`z-[9999]` ad hoc. Szkielet strony: `.content-layer` **bez**
`z-index`, `.bg-layer { z-index: -1 }`, wrapper `App` bez nieprzezroczystego tła; żaden nowy
`position: fixed` wewnątrz `.content-layer`.

## Mechanizm awarii (dlaczego)

Półprzezroczyste sticky przepuszcza przewijaną treść pod nagłówkiem (kit: „rgba przepuszcza
scrollowaną treść"), a na iOS dodatkowo miga przy kompozycji. Kontekst stackingu na `.content-layer`
(`z-index: 10`) uwięził elementy `fixed` pod `overflow: hidden` i przez tydzień dawał „samo tło na
telefonie" (CLAUDE.md 2026-07-24/26); to była prawdziwa przyczyna, nie WebGL. Arbitralne
`z-50` w komponentach po miesiącu tworzą wyścig, w którym dialog ląduje pod navem.

## Niepoprawnie

```css
table.matrix thead th { position: sticky; top: 0; background: rgba(15,15,15,.6); z-index: 9999; }
.content-layer { position: relative; z-index: 10; overflow: hidden; }
.nav { position: fixed; backdrop-filter: blur(8px); }
```

```tsx
<div className="overflow-hidden">       {/* przodek z clip między th a wrapperem */}
  <table><thead><tr><th className="sticky top-0">…</th></tr></thead></table>
</div>
```

## Poprawnie

```css
.table-wrapper { overflow: auto; max-height: 70vh; }
.table-wrapper thead th { position: sticky; top: 0; z-index: var(--z-sticky-head); background: var(--surface-muted); }
.table-wrapper tfoot td { position: sticky; bottom: 0; z-index: var(--z-sticky-foot); background: var(--surface); }
.table-wrapper td.frozen { position: sticky; left: 0; z-index: var(--z-sticky-col); background: var(--surface); }
.nav { position: sticky; top: 0; z-index: var(--z-nav); background: var(--surface-overlay); border-bottom: 1px solid var(--border); }
.bg-layer { position: fixed; inset: 0; z-index: -1; }
.content-layer { position: relative; }   /* celowo bez z-index */
```

## Test

```bash
# sticky z rgba/transparent (przegląd każdego trafienia)
grep -rnE -A3 "position:\s*sticky" site/src ui-kit/skills/company-ui/assets --include=*.css | grep -E "rgba|transparent|backdrop"
# z-index ad hoc: 0 trafień
grep -rnE "z-index:\s*[0-9]+|\bz-\[?[0-9]+\]?" site/src --include=*.tsx --include=*.css | grep -vE "var\(--z-|styles/tokens.css|z-index:\s*-1"
# szkielet warstw
grep -nE "\.content-layer\s*\{[^}]*z-index" site/src/styles/globals.css   # 0 trafień
grep -nE "\.bg-layer\s*\{[^}]*z-index:\s*-1" site/src/styles/globals.css  # 1 trafienie
# nowy fixed w treści: 0 trafień poza .bg-layer i <dialog>
grep -rnE "position:\s*fixed|\bfixed\b" site/src --include=*.tsx --include=*.css | grep -vE "bg-layer|dialog|BgBoundary"
```

## Wyjątki

Natywny `<dialog>` (top layer, bez z-index) i `.bg-layer`. Sticky z gradientem jest dopuszczalne tylko
jako gradient dwóch nieprzezroczystych tokenów (bez alfy).
