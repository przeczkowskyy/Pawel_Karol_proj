---
id: perf-lcp-poster-preload
title: LCP = poster hero: preload z fetchpriority high w każdym z 19 HTML, H1 w shellu, wideo dopiero po load; bramki CWV: LCP mobile < 2,5 s / desktop < 1,8 s, CLS < 0,05 na / i < 0,1 na podstronach, INP < 200 ms
impact: HIGH
tags: [perf, lcp, hero, preload, prerender]
source: synthesis §2.3 S1/§2.4.9/§5 (perf-cls, perf-inp) · docs/plan/strona-v2-plan.md:410-412 i :647 (LCP < 2,5 s, CLS < 0,1, INP < 200 ms) · higgsfield §4.5 p.6 · taste §7.6 (6.D) · vercel.md WIG · feasibility-perf §9 p.5
added: 2026-09-12
---

## Zasada

1. Kandydat LCP na `/` to poster hero (`<img>` 1920×820 WebP ≤ 60 KB). Na pozostałych trasach LCP to H1/tekst z shellu (bez obrazów nad foldem poza miniaturami ≤ 40 KB).
2. `index.html` (a przez `prerender.mjs` każdy z 19 HTML) zawiera w `<head>`: `<link rel="preload" as="image" href="<HERO_POSTER>" fetchpriority="high">` PRZED skryptami; na trasach bez hero preload postera jest USUWANY przez prerender (nie marnować pasma).
3. `<img>` postera ma `fetchPriority="high"`, `decoding="async"`, `width`/`height`, bez `loading="lazy"`; wszystkie inne obrazy nad foldem: bez `loading="lazy"`; poniżej folda: `loading="lazy"`.
4. Wideo nie startuje ładowania przed `window.load` (`media-video-gating`); `preload="metadata"`.
5. Font latin (`NunitoSans-var-latin.woff2`) ma `<link rel="preload" as="font" type="font/woff2" crossorigin>`; `font-display: swap` + `size-adjust` w fallbacku (CLS).
6. Krytyczny CSS = jeden plik ≤ 20 KB gz (`perf-chunk-size-gate`); zero `@import` z CDN; zero skryptów zewnętrznych przed LCP (CF Web Analytics po `load`/idle).
7. **Bramki Core Web Vitals (wszystkie trzy, nie tylko LCP)** — mierzone na `dist` przez `vite preview` w fazie 4 (Lighthouse ze scratchpadu, bez `npx`) i po każdym wdrożeniu (PageSpeed Insights, pole CrUX z CF Web Analytics):

   | Metryka | Próg | Gdzie |
   |---|---|---|
   | LCP | mobile < 2 500 ms, desktop < 1 800 ms | `/` (poster) i 2 podstrony narzędzia (H1) |
   | CLS | < 0,05 na `/`; < 0,1 na podstronach (dashboard + skeleton) | wszystkie mierzone trasy |
   | INP | < 200 ms | `/` (menu, CTA, przełącznik PL/EN) i podstrona narzędzia (suwak/tolerancja w dashboardzie) |

   Progi CLS i INP są takie same jak w planie (`docs/plan/strona-v2-plan.md:410-412`, `:647`); tu są jedynym miejscem, w którym mają POSTAĆ BRAMKI — reszta reguł powołuje się na nie jako uzasadnienie (fonty, obrazy, skeleton, lazy). Przekroczenie = HIGH, wpis do raportu F4 z liczbą przed/po.

## Mechanizm awarii (dlaczego)

- Bez preloadu przeglądarka odkrywa poster dopiero po sparsowaniu HTML i CSS (a w SPA po starcie Reacta, gdy shell go nie ma): +0,5–1,5 s do LCP na 4G.
- `fetchpriority="high"` na posterze przesuwa go przed fontem i chunkami JS w kolejce sieci; bez tego Chrome ładuje obraz jako „Low" do czasu layoutu.
- `loading="lazy"` na obrazie nad foldem (częsty błąd „lazy wszędzie") opóźnia LCP o pełny cykl layoutu.
- Wideo startujące przed `load` konkuruje z posterem i fontem o pasmo; Chrome liczy pierwszą klatkę autoplay-wideo jako kandydata LCP, co przy 1,5 MB daje LCP > 4 s.
- Preload na trasach bez hero = 60 KB zmarnowane na każdej podstronie narzędzia (13 tras).
- CLS i INP bez progu w regułach = metryki, których żaden audytor nie ma czym egzekwować: `verify-site.mjs` i audyt F4 sprawdzają to, co ma liczbę. Dwa najczęstsze źródła u nas to podmiana skeleton → dashboard bez `minHeight` (CLS) i montaż ciężkich komponentów w trakcie interakcji (INP), więc progi muszą stać obok LCP, a nie w prozie.

## Niepoprawnie

```html
<head>…<script type="module" src="/src/main.tsx"></script></head>            <!-- brak preloadu; poster odkryty po starcie Reacta -->
<img src="/media/hero-v1.poster.webp" loading="lazy" />                       <!-- lazy nad foldem -->
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=…">    <!-- CDN na ścieżce krytycznej -->
```

## Poprawnie

```html
<!-- site/index.html <head> (kolejność ma znaczenie) -->
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="preload" as="image" href="/media/hero-v1.poster.webp" fetchpriority="high">
<link rel="preload" as="font" type="font/woff2" href="/fonts/NunitoSans-var-latin.woff2" crossorigin>
<!-- CSS wstrzykiwany przez Vite; skrypty module na końcu -->
```

```js
// scripts/prerender.mjs (fragment): preload postera tylko na trasach z hero
const withHero = new Set(["/"]);
html = html.replace(/<link rel="preload" as="image"[^>]*hero-v\d+\.poster\.webp[^>]*>\n?/, (tag) => (withHero.has(route) ? tag : ""));
```

```tsx
<img src={HERO_POSTER} alt="" width={1920} height={820} fetchPriority="high" decoding="async" />
```

## Test

```bash
# po npm run build
grep -c 'rel="preload" as="image"' site/dist/index.html                         # = 1
grep -c 'fetchpriority="high"' site/dist/index.html                              # ≥ 1
grep -lE 'rel="preload" as="image"' site/dist/narzedzia/*.html site/dist/oferta.html site/dist/faq.html site/dist/rodo.html 2>/dev/null   # = 0 plików (bez hero)
grep -c 'rel="preload" as="font"' site/dist/index.html                           # = 1
grep -rnE 'loading="lazy"' site/src/components/Hero.tsx site/src/components/HeroMedia.tsx 2>/dev/null   # = 0
grep -rnE 'fonts\.googleapis|cdn\.|unpkg|jsdelivr' site/index.html site/src      # = 0
# Lighthouse (faza 4; z scratchpadu, bez npx): node <ścieżka>/lighthouse http://localhost:4173/ --preset=perf --form-factor=mobile --throttling-method=simulate
#   LCP < 2500 ms mobile, < 1800 ms desktop; „LCP element" = img poster (na /) lub h1 (pozostałe)
#   CLS < 0,05 na / i < 0,1 na /narzedzia/<slug> (audits["cumulative-layout-shift"].numericValue)
#   INP: Lighthouse podaje TBT jako proxy — twardy pomiar w Playwright:
#     PerformanceObserver({ type: "event", durationThreshold: 16, buffered: true }) → max(interactionId > 0) < 200 ms
#     scenariusz: klik CTA, otwarcie/zamknięcie dialogu, przełącznik PL/EN, suwak tygodnia w dashboardzie
```

Docelowo `scripts/verify-site.mjs` krok `preload` + Lighthouse w F4.

## Wyjątki

- Plan B (GLSL Hills zamiast wideo): preload postera zostaje (poster jest wtedy statycznym tłem hero na wszystkich urządzeniach).
