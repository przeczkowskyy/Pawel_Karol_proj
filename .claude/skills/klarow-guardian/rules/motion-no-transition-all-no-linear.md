---
id: motion-no-transition-all-no-linear
title: Zakaz transition: all / transition-all i krzywych linear / ease-in-out na interakcjach; CSS nie animuje tego, co animuje Motion
impact: HIGH
tags: [motion, css, tailwind, performance, easing]
source: synthesis §2.4.1 (Navbar.tsx:67,122) · showreel M11 · motion-dev §3.4 p.4/§8.7 · ui-kit-habits F5 · taste §7.7
added: 2026-09-12
---

## Zasada

1. `transition: all` (CSS) i `transition-all` (Tailwind) są zakazane. Każda `transition` wymienia konkretne właściwości: `transition: background-color var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out)`.
2. Na interakcjach (hover, focus, active, przełączniki, otwieranie menu) krzywe `linear`, `ease`, `ease-in`, `ease-in-out`, `ease-out` (słowa kluczowe) oraz Tailwind `ease-linear`/`ease-in-out`/`ease-in`/`ease-out` są zakazane; jedyne krzywe to `var(--ease-out)`, `var(--ease-soft)`, `var(--ease-std)` (i ich odpowiedniki `EASE_*` w TS). `linear` jest dozwolone WYŁĄCZNIE w `@keyframes` o stałej prędkości, których na stronie nie ma (marquee zakazane), więc praktycznie: 0.
3. Element animowany przez Motion (`m.*` z `whileHover`/`animate` na `transform`/`opacity`) NIE MA jednocześnie CSS `transition` na tej samej właściwości. Klasy kitu `.btn`/`.chip`/`.st` mają własne `transition` na kolorach; jeśli Motion dokłada `scale`, CSS nie może mieć `transition: transform`.
4. `.btn:active { transform: scale(.98) }` bez transition (natychmiastowe) jest jedynym transformem na przyciskach kitu.

## Mechanizm awarii (dlaczego)

- `transition: all` animuje także `width`, `height`, `padding`, `box-shadow` przy każdej zmianie klasy (layout/paint co klatkę), a przy zmianie motywu/`lang` odpala kaskadę animacji wszystkich właściwości naraz. `Navbar.tsx:67` i `:122` mają dziś `transition-all` (dług do usunięcia w fazie 0).
- Dwa silniki na tej samej właściwości (CSS transition + WAAPI/JS Motion) = podwójny easing: element „dojeżdża" dwa razy, hover „pływa" (motion-dev §3.4 p.4).
- `ease-in-out` na hover oznacza powolny start: interakcja czuje się opóźniona; archetyp Corporate-precise = szybki start, długi ogon (`--ease-out`).
- `linear` na ruchu UI czyta się mechanicznie („PowerPoint"); `motion-design` i taste §7.7 zakazują domyślnych krzywych.

## Niepoprawnie

```tsx
// Navbar.tsx:67 (stan obecny, do usunięcia)
<a className="… transition-all duration-200 …">
// Navbar.tsx:122
<div className={`… transition-all ease-in-out duration-300 overflow-hidden …`}>
// podwójny easing
<m.button className="btn btn-primary" whileHover={{ scale: 1.02 }} />   /* a w CSS: .btn{transition:transform .2s} */
```

```css
.cell { transition: all .3s ease-in-out; }
.link:hover { transition: color 200ms linear; }
```

## Poprawnie

```css
.cell { transition: background-color var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out); }
.btn { transition: background-color var(--duration-fast) var(--ease-out), color var(--duration-fast) var(--ease-out), border-color var(--duration-fast) var(--ease-out); }
.btn:active { transform: scale(.98); }
```

```tsx
// hover z kitu (CSS), Motion tylko tam, gdzie CSS nie sięga (wejścia, exit)
<button className="btn btn-primary" type="button">{pick(lang, MESSAGING.cta.primary)}</button>
// menu mobilne: AnimatePresence + m.nav bez klas transition-*
<AnimatePresence initial={false}>
  {open ? <m.nav key="menu" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.2, ease: EASE_OUT }} /> : null}
</AnimatePresence>
```

## Test

```bash
# oczekiwane: 0 (poza company-ui.css do czasu przycięcia kitu)
grep -rnE 'transition-all|transition:\s*all' site/src | grep -v company-ui.css
grep -rnE '\b(ease-linear|ease-in-out|ease-in|ease-out)\b' site/src --include=*.tsx        # klasy Tailwind
grep -rnE 'transition:[^;]*\b(linear|ease|ease-in|ease-out|ease-in-out)\b' site/src --include=*.css --include=*.tsx | grep -vE 'var\(--ease|cubic-bezier|company-ui.css'
grep -rnE 'ease:\s*"(linear|easeIn|easeOut|easeInOut|anticipate|backIn|backOut|circIn|circOut)"' site/src   # Motion string easings
# podwójny easing: element m.* z whileHover/animate na transform + klasa z transition-transform/transition-all
grep -rnE '<m\.[a-z]+[^>]*(whileHover|whileTap|animate)=\{[^}]*(scale|x:|y:|rotate)[^>]*className="[^"]*transition' site/src
# kit: .btn/.chip/.st nie mają transition na transform
grep -nE '\.(btn|chip|st)[^{]*\{[^}]*transition:[^;]*transform' site/src/styles/company-ui.css site/src/styles/tokens.css 2>/dev/null   # = 0
```

Docelowo `node scripts/check-motion.mjs` sekcja `css-easing`.

## Wyjątki

- Klasy kitu `.nc-swap`/`.nc-tab-swap`/`.nc-chart-build` używają `var(--ease-out)`/`var(--ease-soft)`: zgodne.
- `@keyframes` typu `skel` (shimmer skeletonu) może mieć `linear`, bo to stała prędkość przesuwu gradientu i nie jest interakcją; musi mieć blok reduced.
