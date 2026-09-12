---
id: code-build-target-policy
title: Polityka build.target/cssTarget: es2019 + safari13 w fazie 1; CSS bez color-mix/oklch; komentarze zgodne z prawdą
impact: HIGH
tags: [vite, build-target, css, safari, compat, code]
source: vite.config.ts:24-25 / CLAUDE.md sesja 2026-07-24 (esbuild minifikuje CSS, @property/@layer/color-mix ZOSTAJĄ) / site-audit.md §1.1 (komentarz o Lightning CSS mylący) / synthesis D-19, §2.7.1 / vercel.md §14 p.10
added: 2026-09-12
---

## Zasada

1. `vite.config.ts`: `build.target: ["es2019", "safari13"]` i `cssTarget: ["safari13"]` zostają w fazie 1 (D-19). Podniesienie = wpis w `docs/DECISIONS.md` z datą, po publikacji i po potwierdzeniu na realnym iPhonie.
2. Z tego wynika dla CSS pisanego ręcznie (`tokens.css`, `globals.css`, kit): kolory jako hex/`rgba()`/zmienne; zero `color-mix()`, `oklch()`, `@property`, `inset` bez longhandów, `:has()` jako jedyny selektor funkcji krytycznej, `dvh` tylko z fallbackiem `vh`. Utility Tailwinda z przezroczystością `bg-x/12` generują `color-mix()` w v4, więc na kolorach tokenowych używamy tokenów alfa (`--accent-a12`) zamiast `/12`.
3. Vite minifikuje CSS esbuildem (NIE Lightning CSS): `cssTarget` nie transpiluje `oklch`/`color-mix`/`@property`. Komentarz `vite.config.ts:16-23`, który twierdzi inaczej, jest nieprawdziwy i ma zostać poprawiony (nieaktualny komentarz = błąd audytu).
4. JS: patrz `code-tosorted-safari13`.

## Mechanizm awarii (dlaczego)

Sesja 2026-07-24 udowodniła, że `@property` (57×), `@layer`, `color-mix`, `backdrop-filter` zostają w zbudowanym CSS mimo `cssTarget: safari13`; na iOS 26 to nieszkodliwe, ale to nie jest transpilacja pod stare Safari i nie wolno na niej polegać. Agent czytający fałszywy komentarz w `vite.config.ts` uzna, że może pisać `oklch()` „bo Lightning to przerobi", i wprowadzi regresję, której nie wykryje ani `tsc`, ani `vite build`. Utrzymanie starego targetu ma sens, dopóki nie ma danych z Cloudflare Web Analytics o wersjach WebKit odwiedzających (D-16); do tego czasu decyzja jest ostrożna, nie „modernizacyjna".

## Niepoprawnie

```ts
// vite.config.ts:16-23 (komentarz niezgodny z prawdą)
/* cssTarget: Lightning CSS transpiluje nowoczesny CSS (oklch, color-mix, skróty typu `inset`) … */
```
```css
.chip-accent { background: color-mix(in oklch, var(--accent) 12%, transparent); }
.hero { inset: 0; }                       /* bez longhandów */
```
```tsx
<div className="bg-accent/12 min-h-dvh" />   {/* color-mix + dvh bez fallbacku */}
```

## Poprawnie

```ts
/* build.target/cssTarget = kompatybilność składni JS z es2019/safari13 (esbuild).
   CSS minifikuje esbuild: NIE transpiluje oklch/color-mix/@property; pisz hex/rgba + tokeny.
   Decyzja o podniesieniu targetu: docs/DECISIONS.md D-19. */
target: ["es2019", "safari13"], cssTarget: ["safari13"],
```
```css
:root { --accent: #a8b4c2; --accent-a12: rgba(168, 180, 194, .12); }
.chip-accent { background: var(--accent-a12); }
.hero { top: 0; right: 0; bottom: 0; left: 0; }
.content-layer { min-height: 100vh; min-height: 100dvh; }   /* fallback + dvh */
```

## Test

```bash
grep -nE "target: \[\"es2019\", \"safari13\"\]|cssTarget: \[\"safari13\"\]" site/vite.config.ts   # 2 trafienia
grep -nE "Lightning" site/vite.config.ts                                                            # 0 po poprawce komentarza
grep -rnE "color-mix\(|oklch\(|@property" site/src/styles/tokens.css site/src/styles/globals.css     # 0 (kit: baseline, do przycięcia)
grep -rnoE "\b(bg|text|border)-[a-z]+/[0-9]{1,3}\b" site/src --include=*.tsx                        # 0 (utility alfa generuje color-mix)
grep -rnE "^\s*inset:" site/src/styles/*.css                                                        # 0
# w dist po buildzie: liczba wystąpień w CSS (raport, nie fail; kit w baseline)
grep -oE "color-mix\(|oklch\(" site/dist/assets/*.css | wc -l
```

Severity: HIGH. Zmiana `target`/`cssTarget` bez wpisu w `DECISIONS.md` = do cofnięcia.

## Wyjątki

Zbudowany CSS kitu (`company-ui.css`) zawiera `@property`/`@layer` z Tailwinda v4 i jest w `--baseline`; przycięcie kitu (−40 %) w fazie 0 zmniejsza tę liczbę, ale zerowanie nie jest wymagane, bo iOS 26 to obsługuje.
