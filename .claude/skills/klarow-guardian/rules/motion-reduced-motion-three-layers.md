---
id: motion-reduced-motion-three-layers
title: Reduced motion w trzech warstwach: MotionConfig user + useReducedMotion + CSS globalne
impact: BLOCKER
tags: [motion, a11y, reduced-motion, video, canvas]
source: CLAUDE.md #2 · motion-dev §5.1/§8.11 · synthesis §2.4.8 · showreel M4 · bklit-ui §4.6 · taste §7.6 (6.B)
added: 2026-09-12
---

## Zasada

`prefers-reduced-motion: reduce` jest honorowane w trzech warstwach i każda z nich jest obowiązkowa, bo każda łapie inną klasę ruchu:

1. **`<MotionConfig reducedMotion="user">`** na korzeniu (`src/motion/provider.tsx`): wyłącza animacje `transform` i `layout` w każdym `m.*`, zostawia `opacity`/kolory. Nigdy `"never"` w produkcji; `"always"` tylko do debugowania lokalnie.
2. **`useReducedMotion()`** w każdym miejscu, którego `MotionConfig` NIE widzi: `<video autoPlay>` (`HeroMedia` → poster `<img>`), canvas/WebGL (`GLSLHills` → jedna klatka), motion values (`useMotionValue`/`animate()` w `Counter` → `jump(to)`), `ChartReveal` (→ `initial={false}`), `useAnimationFrame`, hover-klipy (faza 2 → poster), mini-diagram `KsefFlow` (→ węzły od razu widoczne).
3. **CSS globalne**: blok kitu `company-ui.css:89-91` (`*{transition-duration:.01ms !important;animation-duration:.01ms !important}`) + lokalne bloki dla każdego nowego `@keyframes` + pas bezpieczeństwa `@media (prefers-reduced-motion: reduce) { .hero-media video { display: none } }`.

Kryterium zaliczenia: przy włączonym ograniczeniu ruchu strona jest w pełni użyteczna, ZERO elementów utkniętych w stanie `initial` (`opacity: 0`, `clipPath: inset(0 100% 0 0)`), zero autoplay wideo, zero pętli canvas, liczby od razu w wartości końcowej, przełączniki zamiast suwaków.

## Mechanizm awarii (dlaczego)

- `reducedMotion="user"` nie dotyka motion values, `useScroll`, `useAnimationFrame`, elementów `<video>`, canvasu ani CSS keyframes (motion-dev §8.11). Bez warstwy 2 licznik dalej liczy, wideo dalej gra, a użytkownik z chorobą lokomocyjną zgłasza stronę.
- CSS `@media (prefers-reduced-motion)` nie łapie animacji JS. bklit-ui (uznana biblioteka wykresów) ma dokładnie ten błąd: clip-reveal i stagger słupków grają zawsze, bo brak `MotionConfig` (bklit-ui §4.6). Nie kopiować.
- `initial={{ opacity: 0 }}` bez gałęzi reduced daje w warstwie 1 fade (opacity zostaje animowane), co jest OK; ale `initial={{ scale: 0 }}` bez `opacity` daje natychmiastowy „pop", a `initial={{ clipPath: ... }}` na SVG może zostać w stanie początkowym, jeśli komponent podmienia wartość przez `key`.
- Zasada #2 CLAUDE.md: „Wszystkie animacje szanują `prefers-reduced-motion`". To reguła twarda, więc BLOCKER.

## Niepoprawnie

```tsx
// brak MotionConfig w main.tsx albo:
<MotionConfig reducedMotion="never">                       // ignoruje ustawienie systemowe
// wideo bez gałęzi reduced:
<video autoPlay muted playsInline loop poster={POSTER} />
// licznik bez jump:
useEffect(() => { const c = animate(count, to, { duration: 1.2 }); return () => c.stop(); }, [to]);
// nowy keyframe bez bloku reduced:
@keyframes sweep { to { transform: translateX(100%) } }
.wordmark::after { animation: sweep 12s linear infinite; }
```

## Poprawnie

```tsx
// warstwa 1: src/motion/provider.tsx
<MotionConfig reducedMotion="user" transition={{ duration: DUR.base, ease: EASE_OUT }}>

// warstwa 2: HeroMedia.tsx
function wantsVideo(): boolean {
  if (typeof window === "undefined" || !MEDIA_ENABLED) return false;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (!matchMedia("(pointer: fine)").matches) return false;
  const c = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (c?.saveData || /^(slow-2g|2g|3g)$/.test(c?.effectiveType ?? "")) return false;
  return true;
}

// warstwa 2: Counter.tsx
const reduce = useReducedMotion();
useEffect(() => {
  if (!inView) return;
  if (reduce) { count.jump(to); return; }
  const controls = animate(count, to, { duration: 1.2, ease: EASE_OUT });
  return () => controls.stop();
}, [inView, reduce, to, count]);

// warstwa 2: ChartReveal.tsx
const reduce = useReducedMotion();
<m.div key={replayKey} initial={reduce ? false : { clipPath: "inset(0 100% 0 0)" }} animate={{ clipPath: "inset(0 0 0 0)" }} />
```

```css
/* warstwa 3: globals.css */
@media (prefers-reduced-motion: reduce) {
  .hero-media video { display: none; }
  .wordmark::after { animation: none; }
}
```

## Test

```bash
# 1) MotionConfig user obecny dokładnie raz, nigdy never/always
grep -rnE 'reducedMotion="user"' site/src | wc -l                 # = 1
grep -rnE 'reducedMotion="(never|always)"' site/src               # = 0
# 2) każdy plik z <video, animate(, useAnimationFrame, useMotionValue, <canvas, requestAnimationFrame ma useReducedMotion lub matchMedia reduced
for f in $(grep -rlE '<video|animate\(|useAnimationFrame|useMotionValue|<canvas|requestAnimationFrame' site/src --include=*.tsx); do
  grep -qE 'useReducedMotion|prefers-reduced-motion' "$f" || echo "BRAK gałęzi reduced: $f"
done
# 3) każdy @keyframes ma odpowiadający blok reduced w tym samym pliku
for f in $(grep -rlE '@keyframes' site/src --include=*.css); do
  grep -qE 'prefers-reduced-motion' "$f" || echo "BRAK reduced dla keyframes: $f"
done
# 4) DevTools: Rendering → „Emulate CSS media feature prefers-reduced-motion: reduce" → scroll całej strony:
#    zero ruchu poza opacity, zero elementów z computed opacity 0 po 2 s od wejścia w viewport.
# 5) Playwright WebKit 390×844 z reducedMotion:"reduce": zrzut po 3 s scrolla = brak elementów opacity:0; brak <video> w DOM.
# 6) Systemowo: Windows „Efekty animacji" OFF + iPhone Karola „Ogranicz ruch" przed publikacją.
```

Docelowo `node scripts/check-motion.mjs` sekcja `reduced` (kroki 1–3) + `scripts/verify-site.mjs` krok 5 w fazie 3.

## Wyjątki

- Fade `opacity` w wejściach zostaje także przy reduced (nie wywołuje choroby lokomocyjnej; `MotionConfig` celowo go zostawia).
- `PageFade` przy reduced: `MotionConfig` zeruje `y`, zostaje fade 240 ms; dopuszczalne.
