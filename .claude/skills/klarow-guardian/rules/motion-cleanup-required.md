---
id: motion-cleanup-required
title: Każda animacja imperatywna, subskrypcja, timer, rAF i observer ma cleanup w useEffect
impact: HIGH
tags: [motion, react, strictmode, leaks, cleanup]
source: bklit-ui §4.3/§10.5/§10.8 · motion-dev §4.7/§8.3 · showreel M9 · ui-kit-habits F1 (fill-mode) · glsl-hills.tsx:256-267 (wzorzec repo) · Motion AI Kit best-practices/index.md (motionValue.on)
added: 2026-09-12
---

## Zasada

W każdym `useEffect`/`useLayoutEffect`, który uruchamia coś asynchronicznego, funkcja sprzątająca jest OBOWIĄZKOWA i symetryczna:

| Uruchomienie | Cleanup |
|---|---|
| `const controls = animate(...)` | `return () => controls.stop()` |
| `motionValue.on("change", cb)` | `return unsubscribe` (wartość zwracana z `.on`) |
| `requestAnimationFrame(loop)` | `cancelAnimationFrame(raf)` |
| `setTimeout`/`setInterval` | `clearTimeout`/`clearInterval` (wszystkie id, np. w tablicy) |
| `new IntersectionObserver(...)` / `ResizeObserver` | `observer.disconnect()` |
| `addEventListener(...)` (`visibilitychange`, `resize`, `canplay`) | `removeEventListener` z tą samą referencją |
| `video.play()` | `video.pause()` + zdjęcie `src` przy odmontowaniu (zwolnienie dekodera) |
| `requestIdleCallback(cb)` | `cancelIdleCallback(id)` (fallback `clearTimeout`) |
| three.js: geometria/materiał/renderer | `.dispose()` + `cancelAnimationFrame` |

Sekwencje wieloetapowe (kilka `animate` + timeouty) dostają jeden sygnał `cancelled` sprawdzany w każdym kroku (wzorzec bklit `animated-brand.tsx`). Nigdy `motionValue.onChange(cb)` (usunięte API), zawsze `motionValue.on("change", cb)`.

CSS: animacje wejścia `animation-fill-mode: backwards` (nigdy `both`/`forwards`), a po zakończeniu animacji Motion element nie może zostać z `transform` (Motion sprząta sam; nie ustawiać `style.transform` ręcznie w `onAnimationComplete`).

## Mechanizm awarii (dlaczego)

- `main.tsx` renderuje w `<StrictMode>`: w dev każdy efekt odpala się 2× (mount → unmount → mount). Bez `controls.stop()` dwie animacje walczą o jedną motion value; bez `cancelAnimationFrame` dwie pętle rAF mielą tło; bez `disconnect()` observer trzyma odmontowany węzeł.
- Nawigacja SPA (react-router) odmontowuje strony bez przeładowania: wyciek per odwiedzona trasa; wideo bez `pause()` gra w tle i zżera dekoder/baterię.
- `animation-fill-mode: forwards/both` zostawia `transform` na elemencie po animacji → element staje się containing block dla `position: fixed` → modal/`BookingDialog` w środku `.main` ląduje poza viewportem (Chromium; kit `app.css:150-161`).
- Zasada #2 CLAUDE.md: „tła animowane tylko na GPU, z pauzą przy `document.hidden` i sprzątaniem rAF". Wzorzec wzorcowy w repo: `glsl-hills.tsx:256-267` (cancel rAF, `removeEventListener`, `dispose`).

## Niepoprawnie

```tsx
useEffect(() => {
  animate(count, to, { duration: 1.2 });                       // brak stop
  count.onChange((v) => setText(v.toFixed(0)));                // API usunięte; brak unsubscribe; setState per klatka
  const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
  io.observe(ref.current!);                                    // brak disconnect
  document.addEventListener("visibilitychange", () => videoRef.current?.pause());   // anonimowa funkcja: nie da się zdjąć
  setTimeout(() => setReady(true), 400);                       // brak clearTimeout
}, []);
```

```css
.reveal { animation: fadeUp .42s var(--ease-out) both; }   /* zostawia transform → psuje fixed */
```

## Poprawnie

```tsx
useEffect(() => {
  if (!inView) return;
  if (reduce) { count.jump(to); return; }
  const controls = animate(count, to, { duration: 1.2, ease: EASE_OUT });
  const unsub = count.on("change", (v) => { if (v >= to) onDone?.(); });
  return () => { unsub(); controls.stop(); };
}, [inView, reduce, to, count, onDone]);

useEffect(() => {
  const el = videoRef.current; if (!el) return;
  const io = new IntersectionObserver(([e]) => { e.isIntersecting ? el.play().catch(() => setFailed(true)) : el.pause(); }, { threshold: 0.25 });
  const onVis = () => { if (document.hidden) el.pause(); };
  io.observe(el);
  document.addEventListener("visibilitychange", onVis);
  return () => { io.disconnect(); document.removeEventListener("visibilitychange", onVis); el.pause(); el.removeAttribute("src"); el.load(); };
}, []);

useEffect(() => {
  const id = window.setTimeout(() => setReady(true), 400);
  return () => window.clearTimeout(id);
}, []);
```

```css
.reveal { animation: fadeUp var(--duration-slow) var(--ease-out) backwards; }
```

## Test

```bash
# 1) pliki z animate(/rAF/IO/timeout/listener: każdy useEffect w nich musi mieć `return () =>` lub `return unsub`
for f in $(grep -rlE 'animate\(|requestAnimationFrame|IntersectionObserver|ResizeObserver|setTimeout|setInterval|addEventListener|requestIdleCallback|\.play\(\)' site/src --include=*.tsx --include=*.ts); do
  effects=$(grep -cE 'use(Layout)?Effect\(' "$f"); returns=$(grep -cE 'return \(\) =>|return unsub|return cancel|return () =>' "$f")
  [ "$effects" -gt "$returns" ] && echo "useEffect bez cleanup ($effects vs $returns): $f"
done
# 2) usunięte API i anonimowe listenery (oczekiwane: 0)
grep -rnE '\.onChange\(' site/src --include=*.tsx --include=*.ts
grep -rnE 'addEventListener\([^,]+,\s*\(\)\s*=>' site/src --include=*.tsx
# 3) fill-mode (oczekiwane: 0)
grep -rnE 'animation(-fill-mode)?:[^;]*\b(both|forwards)\b' site/src --include=*.css
# 4) StrictMode dev: otworzyć / → /narzedzia/raport-zarzadczy → / 5×; DevTools Performance monitor: liczba listenerów DOM i węzłów stabilna (nie rośnie).
```

Docelowo `node scripts/check-motion.mjs` sekcja `cleanup` (AST: `useEffect` bez `return` w plikach z listą wywołań).

## Wyjątki

- `useEffect` bez cleanupu jest OK, gdy nie uruchamia niczego trwałego (np. `document.title = ...`, jednorazowy `setState`).
- `count.jump(to)` nie wymaga cleanupu.
