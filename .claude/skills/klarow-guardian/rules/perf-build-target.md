---
id: perf-build-target
title: Kod zgodny z build.target es2019/safari13: bez toSorted/at/structuredClone/Array.findLast/Object.hasOwn/oklch/color-mix bez fallbacku; komentarz w vite.config prawdziwy
impact: HIGH
tags: [perf, compat, safari, build, vite]
source: synthesis §2.7.1 (D-19: target zostaje) · CLAUDE.md 2026-07-22 cz. 6 i 2026-07-24 (uwaga: cssTarget NIE transpiluje @property/oklch) · site-audit §3.5 (nieaktualny komentarz vite.config.ts:16-23) · vite.config.ts
added: 2026-09-12
---

## Zasada

`site/vite.config.ts` ma `build.target: ["es2019", "safari13"]` i `cssTarget: ["safari13"]` i tak zostaje w fazie 1 (D-19). Konsekwencje dla kodu:

1. **JS**: esbuild transpiluje SKŁADNIĘ (optional chaining, `??`, klasy prywatne), ale NIE dodaje polyfilli API. Zakazane bez własnego fallbacku: `Array.prototype.toSorted/toReversed/with/at/findLast/findLastIndex`, `Object.hasOwn`, `structuredClone`, `Array.prototype.flat` jest OK (ES2019), `String.prototype.replaceAll` (ES2021: zakaz), `Promise.any`/`AggregateError` (ES2021), `WeakRef`, `Intl.Segmenter`, `Array.fromAsync`, `URL.canParse`, `requestIdleCallback` bez fallbacku (`setTimeout`), `ResizeObserver` bez guardu (Safari dopiero **13.1**, marzec 2020: na iOS 13.0–13.3 `ReferenceError`); `IntersectionObserver` jest OK (Safari 12.1), WAAPI wymaga Safari 13.1+, `matchMedia().addEventListener("change")` wymaga fallbacku `addListener` dla Safari < 14 (albo akceptujemy brak reakcji na zmianę w locie na Safari 13: dopuszczalne, decyzja w kodzie z komentarzem).
2. **CSS**: minifikacja idzie przez esbuild (NIE Lightning CSS mimo komentarza `vite.config.ts:16-23`; ten komentarz jest nieprawdziwy i ma zostać poprawiony), więc `@property`, `@layer`, `color-mix()`, `oklch()`, `backdrop-filter`, `inset`, `:has()`, `dvh` ZOSTAJĄ w zbudowanym CSS. Reguła: każda z tych konstrukcji w `globals.css`/`tokens.css` ma fallback deklarowany PRZED nią (np. `min-height: 100vh; min-height: 100dvh;`, `top/right/bottom/left` zamiast samego `inset`, `rgba()` obok `color-mix()`), a szkielet strony (`.bg-layer`, `.content-layer`, kontener, siatka) nie używa żadnej z nich. Tailwind v4 (`@theme inline`) tylko do layoutu; `bg-x/12` (color-mix w Tailwind v4) zakazane w klasach: kolory z tokenów `rgba`.
3. **Podłoga nominalna vs realna**: `build.target` mówi `safari13`, ale dwie rzeczy z listy (WAAPI = silnik Motion, `ResizeObserver`) wchodzą dopiero w Safari **13.1**. Dopóki nie podnosimy targetu, każda z nich wymaga własnego guardu/fallbacku:
   - `ResizeObserver`: `typeof ResizeObserver === "function"` → obserwator; inaczej `window.addEventListener("resize", …)` + `clientWidth` (dotyczy m.in. Gantta `TaskTimeline`, jeśli wróci pomiar szerokości; dziś `site/src` nie używa RO — jest tylko wzmianka w komentarzu `company-ui.css:927`),
   - WAAPI/Motion: animacje degradują się same (Motion ma fallback JS), ale nie polegać na `element.animate` bez sprawdzenia.
   Alternatywa (decyzja): podnieść i OPISAĆ podłogę jako `safari13.1` — wtedy oba punkty znikają, a `target` w `vite.config.ts` i ten akapit zmieniają się w jednym commicie.
4. **`build.target` nie może być podnoszony „bo coś nie działa"**; podniesienie = decyzja w `docs/plan/` z analizą udziału Safari < 16.4 w CF Web Analytics (po ≥ 4 tygodniach danych).
5. Komentarze o toolchainie w `vite.config.ts` opisują stan faktyczny (esbuild minifier; Lightning CSS tylko przy `css.transformer: "lightningcss"`, którego NIE włączamy w fazie 1).

## Mechanizm awarii (dlaczego)

- Lipiec 2026: „samo tło na telefonie" miał kilka warstw; jedna z hipotez (stary WebKit + `inset`/`oklch`) doprowadziła do `safari13`, a szkielet strony przepisano na czysty CSS z longhandami. Nawet jeśli iOS Karola (26) wspiera wszystko, persona ma telefony służbowe 3–5-letnie (iOS 15–16): `toSorted` (Safari 16) czy `structuredClone` (15.4) rzucają `TypeError` i React zdejmuje całe drzewo.
- Sesja 2026-07-24 potwierdziła: `cssTarget: ["safari13"]` NIE transpiluje `@property` (57×), `@layer`, `color-mix`; założenie z sesji cz. 6, że „Lightning CSS to załatwia", było błędne. Komentarz w configu wprowadza w błąd następne okno.
- Bez polyfilli `requestIdleCallback` (Safari nie ma do dziś) `DashboardMount` bez fallbacku nigdy nie montuje dashboardu na iPhonie.
- `ResizeObserver` bez guardu na iOS 13.0–13.3 rzuca `ReferenceError` w trakcie renderu komponentu → React zdejmuje całe drzewo → dokładnie scenariusz „samo tło", przed którym broni reszta reguł. To ten sam mechanizm co awaria tła z 2026-07-23 (brak error boundary = pusty `#root`).

## Niepoprawnie

```ts
const sorted = rows.toSorted((a, b) => a.deviation - b.deviation);      // Safari < 16
const last = rows.at(-1);                                                // Safari < 15.4
const copy = structuredClone(state);                                     // Safari < 15.4
const id = requestIdleCallback(mount);                                   // Safari: ReferenceError
const ro = new ResizeObserver(onResize); ro.observe(el);                 // Safari < 13.1: ReferenceError → białe drzewo
```

```css
.hero-media { inset: 0; background: color-mix(in oklch, var(--accent) 12%, transparent); }   /* bez fallbacku */
```

## Poprawnie

```ts
const sorted = [...rows].sort((a, b) => a.deviation - b.deviation);
const last = rows[rows.length - 1];
const copy = JSON.parse(JSON.stringify(state)) as State;   // albo jawna kopia pól
const idle = (cb: () => void, timeout = 1500) => typeof requestIdleCallback === "function" ? requestIdleCallback(cb, { timeout }) : window.setTimeout(cb, 16);

// ResizeObserver (Safari 13.1+): guard + fallback na window.resize
function observeWidth(el: HTMLElement, cb: (w: number) => void): () => void {
  if (typeof ResizeObserver === "function") { const ro = new ResizeObserver(() => cb(el.clientWidth)); ro.observe(el); return () => ro.disconnect(); }
  const onResize = () => cb(el.clientWidth);
  window.addEventListener("resize", onResize);
  onResize();
  return () => window.removeEventListener("resize", onResize);
}
```

```css
.hero-media { position: absolute; top: 0; right: 0; bottom: 0; left: 0; background: rgba(168, 180, 194, .12); }
.content-layer { min-height: 100vh; min-height: 100dvh; }
```

```ts
// vite.config.ts (komentarz zgodny ze stanem faktycznym)
/* target es2019/safari13: esbuild transpiluje składnię JS, NIE dodaje polyfilli API (własne fallbacki w kodzie);
   CSS minifikuje esbuild (Lightning CSS NIE jest włączony), więc @property/@layer/color-mix/oklch zostają w dist:
   każda taka konstrukcja wymaga fallbacku w źródle; szkielet strony na czystym CSS z longhandami. */
```

## Test

```bash
# API spoza es2019/safari13 (oczekiwane: 0)
grep -rnE '\.(toSorted|toReversed|findLast|findLastIndex|at)\(|Object\.hasOwn\(|structuredClone\(|replaceAll\(|Promise\.any\(|WeakRef|Intl\.Segmenter|Array\.fromAsync|URL\.canParse' site/src --include=*.ts --include=*.tsx
grep -rnE 'requestIdleCallback\(' site/src | grep -vE 'typeof requestIdleCallback' # = 0 (każde użycie za guardem)
grep -rlE 'new ResizeObserver\(' site/src | while read -r f; do grep -q 'typeof ResizeObserver' "$f" || echo "ResizeObserver bez guardu: $f"; done   # = 0
# CSS bez fallbacku w plikach strony (oczekiwane: 0 poza company-ui.css do przycięcia)
grep -nE '^\s*inset:' site/src/styles/globals.css site/src/styles/tokens.css 2>/dev/null
grep -nE 'color-mix\(|oklch\(' site/src/styles/globals.css site/src/styles/tokens.css 2>/dev/null
grep -rnE 'className="[^"]*\b(bg|text|border)-[a-z]+(-[0-9]+)?/[0-9]+' site/src --include=*.tsx   # Tailwind alpha = color-mix
# dvh z fallbackiem vh bezpośrednio przed
grep -nB1 '100dvh' site/src/styles/globals.css | grep -c '100vh'   # ≥ 1
# config
grep -nE 'target: \["es2019", "safari13"\]' site/vite.config.ts | wc -l   # = 1
grep -nE 'Lightning CSS transpiluje' site/vite.config.ts                   # = 0 (komentarz poprawiony)
# build: dist/assets/*.js bez `?.` / `??` (esbuild je transpiluje) i bez zakazanych API
grep -lE '\.toSorted\(|structuredClone\(' site/dist/assets/*.js   # = 0
```

Docelowo ESLint `no-restricted-syntax`/`no-restricted-properties` z listą powyżej w `eslint.config.js` (faza 0) + `scripts/verify-site.mjs` krok `compat` (grep na `dist/assets`).

## Wyjątki

- `matchMedia(...).addEventListener("change")` bez `addListener`-fallbacku: dopuszczalne (na Safari 13 zmiana w locie nie działa, stan początkowy tak), z komentarzem `// perf-build-target: brak reakcji na zmianę w locie na Safari < 14 (akceptowane)`.
- `pdfmake` i `three` (chunki lazy) mają własne wymagania; nie audytujemy ich kodu, tylko to, że są lazy i pod boundary.
