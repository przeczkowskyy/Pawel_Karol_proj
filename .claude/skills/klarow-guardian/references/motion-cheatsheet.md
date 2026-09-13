# Motion cheat-sheet dla klarow.com (Vite 7 + React 19 + react-router 7 + motion 13.2.0)

> Referencja implementacyjna dla reguł `rules/motion-*`, `rules/media-*`, `rules/perf-*`. Kod jest kompletny i gotowy do wklejenia; nazwy plików odpowiadają strukturze docelowej `site/src/` (synthesis §2.7.2). Wersje: `motion` **13.2.0** (pin), React **19.2.x** w fazie 1, **19.3.0** w fazie 2 (`<ViewTransition>`), `react-router-dom` **7.18.x** (`BrowserRouter` deklaratywny). Instalacja: `cd site && npm install motion@13.2.0` (npm działa; `npx` nie: znak `&` w ścieżce repo).
>
> Precedencja: ten dokument i `rules/motion-*` mają pierwszeństwo nad skillem `/motion` (Motion AI Kit). Gdy `/motion` proponuje `import { motion } from "motion/react"`: użyj `m` z `motion/react-m`. Gdy proponuje `layout`/`layoutId`/`drag`: to wymaga `domMax`, zakazane bez decyzji. Gdy proponuje spring z overshootem: archetyp Klarow to Corporate-precise (0 % overshoot). Zgodne z AI Kit (i egzekwowane): `motionValue.on("change", cb)` zamiast `onChange`, `useTransform(() => …)` lub `useTransform(value, input, output)` (nigdy deprecated `useTransform(value, fn)`), zero odczytu `motionValue.get()` w renderze, `transform` jako string tam, gdzie chcemy WAAPI.

## 0. Zamrożone fakty o architekturze (dlaczego wzorce wyglądają tak, a nie inaczej)

| Fakt | Konsekwencja |
|---|---|
| Prerender = osobny shell (`renderToStaticMarkup` w `src/prerender/entry.tsx`), klient robi `createRoot().render()` (PODMIANA, nie hydratacja) | Treść obecna w shellu dostaje `initial={false}`; Motion nigdy nie wchodzi do `entry.tsx`; komponenty współdzielone są SSR-safe, Motion w wrapperach |
| `main.tsx` renderuje w `<StrictMode>` | każdy `useEffect` z `animate()`/rAF/IO/timeout ma symetryczny cleanup (dev montuje 2×) |
| `BrowserRouter` owija `setState` nawigacji w `React.startTransition` (chunk `react-router` 7.18.1) | `<ViewTransition>` (19.3) zadziała bez zmiany routera; `document.startViewTransition(() => flushSync(navigate))` NIE zadziała |
| `ScrollToTop` scrolluje na górę przy zmianie `pathname` | przejścia tras bez `exit` (`PageFade`), żeby stara strona nie „skakała" w trakcie wyjścia |
| Mobile (`pointer: coarse`) bez WebGL od 2026-07-24; `.content-layer` bez z-index, `.bg-layer z-index:-1` od 2026-07-26 | wideo tylko w kontenerze hero (`absolute` + `overflow:hidden`), nigdy `fixed`; na coarse poster |
| `build.target ["es2019","safari13"]` | `requestIdleCallback` z fallbackiem; `[...a].sort()` zamiast `toSorted`; `matchMedia().addEventListener` OK (bez fallbacku `addListener`, decyzja udokumentowana) |
| `zoom` roota 1.08/1.18 do zdjęcia w fazie 0 | do tego czasu pomiary IO/`useInView` na ≥ 1500 px mogą być przesunięte; nie debugować reveali na dużym ekranie przed R7 |

## 1. `src/motion/tokens.ts` (jedyne źródło stałych ruchu)

```ts
// src/motion/tokens.ts
export const EASE_OUT  = [0.22, 1, 0.36, 1] as const;   // = --ease-out (kit): wejścia, hover
export const EASE_SOFT = [0.3, 0.7, 0.3, 1] as const;   // = --ease-soft: clip-reveal danych
export const EASE_STD  = [0.4, 0, 0.2, 1] as const;     // = --ease-std: przejścia tras, crossfade

/** sekundy; 0.6 = maksimum (wyjątek udokumentowany: Counter 1.2 s) */
export const DUR = { quick: 0.16, base: 0.24, reveal: 0.42, media: 0.6 } as const;

export const STAGGER = 0.05;   // 50 ms między dziećmi; kaskada ≤ 12 dzieci
export const SHIFT = 12;       // px; jedyne przesunięcie wejścia; duże powierzchnie: 0 (tylko opacity)
export const VIEWPORT_ONCE = { once: true, amount: 0.25, margin: "0px 0px -10% 0px" } as const;

/** kill-switch: "calm" = MotionConfig reducedMotion="always" + media opcjonalne wyłączone; NIE druga ścieżka renderu */
export const MOTION_TIER: "full" | "calm" = "full";
export const MEDIA_ENABLED = MOTION_TIER === "full";
```

```css
/* src/styles/tokens.css (fragment ruchu; te same wartości co tokens.ts) */
:root {
  --duration-fast: 160ms; --duration-base: 240ms; --duration-slow: 420ms; --duration-media: 600ms;
  --ease-out: cubic-bezier(.22, 1, .36, 1);
  --ease-soft: cubic-bezier(.3, .7, .3, 1);
  --ease-std: cubic-bezier(.4, 0, .2, 1);
  --stagger: 50ms; --reveal-shift: 12px;
}
```

## 2. `src/motion/provider.tsx` (LazyMotion + MotionConfig)

```tsx
// src/motion/provider.tsx
import { LazyMotion, domAnimation, MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { DUR, EASE_OUT, MOTION_TIER } from "./tokens";

/**
 * - LazyMotion SYNC (domAnimation w bundlu głównym): async trzymałby hero w `initial` do dociągnięcia chunku.
 * - strict: `motion.*` rzuca błąd → wymusza `m.*` z "motion/react-m" (33,8 KB gz zamiast 47,5 KB).
 * - reducedMotion="user": wyłącza transform/layout w m.*, zostawia opacity. Wideo/canvas/motion values gate'ujemy osobno.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig
        reducedMotion={MOTION_TIER === "calm" ? "always" : "user"}
        transition={{ duration: DUR.base, ease: EASE_OUT }}
      >
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
```

```tsx
// src/main.tsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./styles/tokens.css";
import "./styles/globals.css";
import "./styles/company-ui.css";
import { LangProvider } from "./i18n";
import { MotionProvider } from "./motion/provider";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <LangProvider>
        <MotionProvider>
          <App />
        </MotionProvider>
      </LangProvider>
    </BrowserRouter>
  </StrictMode>
);
```

## 3. `src/motion/presets.ts`

```ts
// src/motion/presets.ts
import { stagger, type Variants } from "motion/react";
import { DUR, EASE_OUT, SHIFT, STAGGER } from "./tokens";

/** wejście elementu ≤ 1/3 viewportu: opacity + y 12 px */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: SHIFT },
  show: { opacity: 1, y: 0, transition: { duration: DUR.reveal, ease: EASE_OUT } },
};

/** wejście dużej powierzchni (rama z obrazem, portret, still): tylko opacity */
export const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: DUR.media, ease: EASE_OUT } },
};

/** kontener kaskady: dzieci co 50 ms, start po 80 ms; ≤ 12 dzieci */
export const group: Variants = {
  hidden: {},
  show: { transition: { delayChildren: stagger(STAGGER, { startDelay: 0.08 }) } },
};
export const groupSlow: Variants = { hidden: {}, show: { transition: { delayChildren: stagger(0.06, { startDelay: 0.08 }) } } }; // S3 ramy
export const groupFast: Variants = { hidden: {}, show: { transition: { delayChildren: stagger(0.04) } } };                      // S7 wiersze

/** linia procesu (S6): scaleX 0 → 1 od lewej */
export const growX: Variants = {
  hidden: { scaleX: 0 },
  show: { scaleX: 1, transition: { duration: DUR.reveal, ease: EASE_OUT } },
};
```

Uwaga API 13.x: `staggerChildren` w wariantach zastąpiono `delayChildren: stagger(...)`; `stagger(duration, { startDelay, from: "first" | "center" | "last" | index, ease })`.

## 4. `Reveal` / `RevealGroup`

```tsx
// src/motion/Reveal.tsx
import * as m from "motion/react-m";
import type { ReactNode } from "react";
import { fade, fadeUp, group, groupFast, groupSlow } from "./presets";
import { VIEWPORT_ONCE } from "./tokens";

type Variant = "fadeUp" | "fade";
const VARIANTS = { fadeUp, fade } as const;

/** Pojedynczy element poniżej folda. NIGDY na treści obecnej w shellu prerenderu (hero, liczby SSR). */
export function Reveal({ variant = "fadeUp", as = "div", className, children }: { variant?: Variant; as?: "div" | "section" | "article" | "figure"; className?: string; children: ReactNode }) {
  const Tag = m[as];
  return (
    <Tag variants={VARIANTS[variant]} initial="hidden" whileInView="show" viewport={VIEWPORT_ONCE} className={className}>
      {children}
    </Tag>
  );
}

type Pace = "base" | "slow" | "fast";
const GROUPS = { base: group, slow: groupSlow, fast: groupFast } as const;

/** Kaskada ≤ 12 dzieci; dzieci = `m.li variants={fadeUp}` (warianty propagują w dół drzewa m.*). */
export function RevealGroup({ pace = "base", as = "ul", className, children }: { pace?: Pace; as?: "ul" | "ol" | "div"; className?: string; children: ReactNode }) {
  const Tag = m[as];
  return (
    <Tag variants={GROUPS[pace]} initial="hidden" whileInView="show" viewport={VIEWPORT_ONCE} className={className}>
      {children}
    </Tag>
  );
}

// użycie (S2 bento):
// <RevealGroup className="bento">{cells.map((c) => <m.li key={c.key} variants={fadeUp} className="cell">…</m.li>)}</RevealGroup>
```

Dlaczego w `Reveal`/`RevealGroup` `whileInView`, nie `useScroll`: reveal jednorazowy przez pooled `IntersectionObserver` (Motion), 0 KB dodatkowo. Ruch scroll-linked jest dozwolony WYŁĄCZNIE w warstwie narracyjnej `site/src/motion/scroll/**` (sceny sticky i budowane wykresy, decyzja Karola 2026-09-13: `motion-charts-static` §B, `motion-no-pinning-no-scroll-hijack` §B); zwykłe wejścia sekcji zostają na `whileInView`.

## 5. `Counter`

```tsx
// src/motion/Counter.tsx
import { useEffect, useRef } from "react";
import * as m from "motion/react-m";
import { animate, useInView, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { EASE_OUT } from "./tokens";

type Props = { to: number; format: (n: number) => string; label: string; className?: string };

/**
 * - motion value jako DZIECKO m.span: zero re-renderów Reacta per klatka
 * - useMotionValue(to): pierwszy render Reacta drukuje TĘ SAMĄ liczbę co shell prerenderu (zero mignięcia 12 → 0)
 * - useInView once .6 uruchamia liczenie, ALE tylko gdy element wjechał w viewport PÓŹNIEJ;
 *   jeśli był widoczny już w pierwszej klatce (ekran 2560 px, wejście z kotwicy, zmiana układu) → wartość końcowa bez animacji
 * - reduced → jump(to); controls.stop() w cleanup (StrictMode)
 * - minWidth w ch = liczba znaków wartości końcowej → brak CLS podczas liczenia
 * - aria-label = wartość końcowa; wnętrze aria-hidden (czytnik nie czyta pośrednich liczb)
 */
export function Counter({ to, format, label, className }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const count = useMotionValue(to);
  const immediate = useRef<boolean | null>(null);   // widoczny już w pierwszej klatce?
  const text = useTransform(() => format(Math.round(count.get())));
  const minWidth = `${format(to).length}ch`;

  useEffect(() => {
    const el = ref.current; if (!el) return;
    if (immediate.current === null) immediate.current = el.getBoundingClientRect().top < window.innerHeight;
    if (immediate.current || reduce) { count.jump(to); return; }
    if (!inView) return;
    count.jump(0);
    const controls = animate(count, to, { duration: 1.2, ease: EASE_OUT }); // motion-tokens-only: wyjątek udokumentowany
    return () => controls.stop();
  }, [inView, reduce, to, count]);

  return (
    <span className={className} aria-label={label} style={{ fontVariantNumeric: "tabular-nums", display: "inline-block", minWidth }}>
      <m.span ref={ref} aria-hidden="true">{text}</m.span>
    </span>
  );
}
```

W shellu prerenderu (`MetricsShell`) liczba jest wpisana na stałe (`<strong>12</strong>`), bez `Counter`. Po podmianie shellu React renderuje tę samą wartość (`useMotionValue(to)`), więc nawet licznik widoczny od pierwszej klatki nie mignie zerem (`rules/motion-counters-pattern`, `motion-no-initial-hidden-above-fold`).

## 6. `PageFade` (faza 1) i wariant `<ViewTransition>` (faza 2)

```tsx
// src/motion/PageFade.tsx (FAZA 1)
import { useState, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import * as m from "motion/react-m";
import { DUR, EASE_STD } from "./tokens";

/**
 * Wejście nowej trasy: fade + y 6 px, 240 ms, BEZ exit (zero konfliktu ze ScrollToTop, zero AnimatePresence na trasach).
 * Pierwszy montaż = podmiana shellu prerenderu → initial={false} (bez mignięcia).
 * Bez mutacji ref w renderze (StrictMode renderuje 2×): useState(() => pathname) + porównanie.
 * Navbar i Footer POZA PageFade; <main id="main"> w środku; Suspense lazy tras WEWNĄTRZ strony.
 */
export function PageFade({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const [firstPath] = useState(() => pathname);
  const initial = pathname === firstPath ? false : { opacity: 0, y: 6 };
  return (
    <m.div key={pathname} initial={initial} animate={{ opacity: 1, y: 0 }} transition={{ duration: DUR.base, ease: EASE_STD }}>
      {children}
    </m.div>
  );
}

// App.tsx (faza 1)
// <Navbar />
// <PageFade><main id="main"><Routes>…</Routes></main></PageFade>
// <Footer />
```

```tsx
// App.tsx (FAZA 2, po upgrade react/react-dom → 19.3.0 i decyzji D-18; PageFade usunięty)
import { ViewTransition } from "react";          // stabilne od 19.3.0; skill react-view-transitions „react@canary" = nieaktualne
// <Navbar />                                   CSS: header, footer { view-transition-name: chrome }
// <ViewTransition default="page">
//   <main id="main"><Routes>…</Routes></main>
// </ViewTransition>
// <Footer />
```

```css
/* globals.css (faza 2) */
::view-transition-old(root), ::view-transition-new(root) { animation-duration: var(--duration-base); animation-timing-function: var(--ease-std); }
::view-transition-group(chrome) { animation: none; }
@media (prefers-reduced-motion: reduce) { ::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*) { animation: none !important; } }
```

Kierunek nawigacji (opcjonalnie, faza 2):

```tsx
import { addTransitionType, startTransition } from "react";
import { useNavigate } from "react-router-dom";
const navigate = useNavigate();
const go = (to: string, dir: "nav-forward" | "nav-back") => startTransition(() => { addTransitionType(dir); navigate(to); });
// <ViewTransition enter={{ "nav-forward": "page-from-right", "nav-back": "page-from-left", default: "page" }} exit={{ "nav-forward": "page-to-left", "nav-back": "page-to-right", default: "page" }}>
```

Zasady: nigdy VT i `m.*`/`AnimatePresence` na tym samym elemencie; `document.startViewTransition` ręcznie pod `BrowserRouter` tylko z `useTransitions={false}` albo z callbackiem czekającym na commit (nigdy `flushSync(navigate)`); `Suspense` lazy tras wewnątrz strony; `ScrollToTop` bez zmian.

## 7. `HeroMedia` z `wantsVideo()` i `MediaBoundary`

```tsx
// src/data/media.ts
export const HERO_VERSION = 1;
export const HERO_POSTER = `/media/hero-v${HERO_VERSION}.poster.webp`;   // ≤ 60 KB, 1920×820, PIERWSZA klatka pętli
export const HERO_SOURCES = [
  { src: `/media/hero-v${HERO_VERSION}.webm`, type: 'video/webm; codecs="vp9"' },
  { src: `/media/hero-v${HERO_VERSION}.mp4`,  type: 'video/mp4; codecs="avc1.640028"' },
] as const;
```

```tsx
// src/components/HeroMedia.tsx
import { useEffect, useRef, useState } from "react";
import { HERO_POSTER, HERO_SOURCES } from "@/data/media";
import { MEDIA_ENABLED } from "@/motion/tokens";
import { useLang, pick } from "@/i18n";

type Conn = { saveData?: boolean; effectiveType?: string };

/** bramki w kolejności: kill-switch → reduced-motion → pointer fine → saveData → 2g/3g */
export function wantsVideo(): boolean {
  if (typeof window === "undefined" || !MEDIA_ENABLED) return false;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return false;
  if (!matchMedia("(pointer: fine)").matches) return false;
  const c = (navigator as Navigator & { connection?: Conn }).connection;
  if (c?.saveData === true) return false;
  if (/^(slow-2g|2g|3g)$/.test(c?.effectiveType ?? "")) return false;
  return true;
}

const PAUSE_KEY = "klarow:media:paused";                       // WCAG 2.2.2 + plan §6.4 (sessionStorage)
const readPaused = () => { try { return sessionStorage.getItem(PAUSE_KEY) === "1"; } catch { return false; } };

const TOGGLE = {
  pause: { pl: "Zatrzymaj tło", en: "Pause background" },
  play:  { pl: "Odtwórz tło",   en: "Play background" },
} as const;

export function HeroMedia({ videoAllowed = true }: { videoAllowed?: boolean }) {
  const { lang } = useLang();
  const ref = useRef<HTMLVideoElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [ready, setReady] = useState(false);
  const [paused, setPaused] = useState(readPaused);            // wybór użytkownika trwa przez sesję
  const inView = useRef(false);                                 // widoczność też poza efektem (onSuspend)
  const tried = useRef(false);                                  // czy była próba play()
  const pausedRef = useRef(paused);
  const suspendTimer = useRef<number | null>(null);
  pausedRef.current = paused;

  // 1) wideo dopiero po window.load (poster = LCP)
  useEffect(() => {
    if (!videoAllowed) return;
    const arm = () => setEnabled(wantsVideo());
    if (document.readyState === "complete") { arm(); return; }
    window.addEventListener("load", arm, { once: true });
    return () => window.removeEventListener("load", arm);
  }, [videoAllowed]);

  // 2) zmiana reduced-motion w locie → poster
  useEffect(() => {
    const mq = matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => { if (mq.matches) setEnabled(false); };
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  // 3) play/pause: IO ≥ 25 % + visibilitychange; LPM/NotAllowedError → poster; cleanup
  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;
    const tryPlay = () => { if (pausedRef.current) return; tried.current = true; el.play().catch(() => setEnabled(false)); };
    const io = new IntersectionObserver(([e]) => { inView.current = e.isIntersecting; inView.current && !document.hidden ? tryPlay() : el.pause(); }, { threshold: 0.25 });
    const onVis = () => { document.hidden ? el.pause() : inView.current && tryPlay(); };
    io.observe(el);
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
      if (suspendTimer.current !== null) { window.clearTimeout(suspendTimer.current); suspendTimer.current = null; }
      el.pause();
    };
  }, [enabled]);

  // 4) przycisk pauzy (WCAG 2.2.2): pauza nie odmontowuje elementu
  useEffect(() => {
    const el = ref.current;
    if (!enabled || !el) return;
    if (paused) el.pause();
    else if (inView.current && !document.hidden) { tried.current = true; el.play().catch(() => setEnabled(false)); }
  }, [paused, enabled]);

  const togglePaused = () => setPaused((v) => {
    const next = !v;
    try { sessionStorage.setItem(PAUSE_KEY, next ? "1" : "0"); } catch { /* Safari private mode */ }
    return next;
  });

  /* `suspend` NIE jest sygnałem awarii (koniec preload, pełny bufor), a play() jest async:
     detektor pomocniczy działa tylko PO próbie odtworzenia i po 1 s ponownego sprawdzenia stanu. */
  const onSuspend = () => {
    if (!tried.current || suspendTimer.current !== null) return;
    suspendTimer.current = window.setTimeout(() => {
      suspendTimer.current = null;
      const el = ref.current;
      if (el && el.paused && !el.ended && inView.current && !document.hidden && !pausedRef.current) setEnabled(false);
    }, 1000);
  };

  return (
    <>
      <div className="hero-media" aria-hidden="true">
        <img src={HERO_POSTER} alt="" width={1920} height={820} fetchPriority="high" decoding="async" />
        {enabled ? (
          <video
            ref={ref} muted playsInline loop preload="metadata" poster={HERO_POSTER}
            disablePictureInPicture disableRemotePlayback tabIndex={-1} width={1920} height={820}
            onCanPlay={() => setReady(true)} onSuspend={onSuspend} onError={() => setEnabled(false)}
            style={{ opacity: ready ? 1 : 0, transition: "opacity var(--duration-media) var(--ease-out)" }}
          >
            {HERO_SOURCES.map((s) => <source key={s.src} src={s.src} type={s.type} />)}
          </video>
        ) : null}
      </div>

      {/* WCAG 2.2.2 (Pause, Stop, Hide): POZA aria-hidden, stale widoczny, aria-pressed */}
      {enabled ? (
        <button type="button" className="btn btn-secondary btn-sm hero-media-toggle"
                aria-pressed={paused} onClick={togglePaused}>
          {pick(lang, paused ? TOGGLE.play : TOGGLE.pause)}
        </button>
      ) : null}
    </>
  );
}
```

```tsx
// src/components/MediaBoundary.tsx (uogólnienie BgBoundary: awaria mediów = poster, treść żyje)
import { Component, type ReactNode } from "react";
export class MediaBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(err: unknown) { if (import.meta.env.DEV) console.warn("MediaBoundary:", err); }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}
// App.tsx: <MediaBoundary fallback={<img src={HERO_POSTER} alt="" width={1920} height={820} />}><HeroMedia /></MediaBoundary>
```

```css
/* globals.css */
.hero { position: relative; overflow: hidden; min-height: min(86dvh, 820px); }
.hero-media { position: absolute; top: 0; right: 0; bottom: 0; left: 0; overflow: hidden; }
.hero-media img, .hero-media video { position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; }
.hero-media::after { content: ""; position: absolute; top: 0; right: 0; bottom: 0; left: 0; background: linear-gradient(180deg, rgba(18,18,18,.15), rgba(18,18,18,.85)); }
.hero-media-toggle { position: absolute; right: 16px; bottom: 16px; min-height: 44px; }   /* bez z-index: po .hero-media w DOM */
.hero-media-toggle::before { content: ""; position: absolute; top: -6px; right: -6px; bottom: -6px; left: -6px; }   /* pole klikalne ≥ 44×44 */
@media (prefers-reduced-motion: reduce) { .hero-media video { display: none; } .hero-media-toggle { display: none; } }
@media (max-width: 639.98px) { .hero { min-height: min(72dvh, 640px); } }
```

Shell prerenderu renderuje TYLKO `<img>` postera (bez `<video>` i bez przycisku pauzy — nie ma czego pauzować); `index.html` ma `<link rel="preload" as="image" href="/media/hero-v1.poster.webp" fetchpriority="high">` (prerender usuwa go na trasach bez hero).

## 8. `DashboardMount` (IntersectionObserver + requestIdleCallback + lazy + skeleton)

```tsx
// src/components/DashboardMount.tsx
import { Component, Suspense, lazy, useEffect, useRef, useState, type ComponentType, type ReactNode, type RefObject } from "react";
import type { DashboardKey } from "@/data/tools";
import { useLang, pick } from "@/i18n";

/** literalne ścieżki: Rollup tworzy 12 osobnych chunków (11 z dashboards/* + DemoReport).
    Klucze DOKŁADNIE jak unia DashboardKey w src/data/tools.ts:99-111 — „flow/cost/erp/labour" NIE ISTNIEJĄ.
    13 to liczba NARZĘDZI w tools.ts (12 dem + KSeF kind: "case"), nie liczba dashboardów. */
const LOADERS: Record<DashboardKey, () => Promise<{ default: ComponentType }>> = {
  report: () => import("@/components/DemoReport"),
  production: () => import("@/components/dashboards/ProductionDashboard"),
  quality: () => import("@/components/dashboards/QualityGate"),
  timeline: () => import("@/components/dashboards/TaskTimeline"),
  payments: () => import("@/components/dashboards/PaymentCalculator"),
  reconciliation: () => import("@/components/dashboards/ImportReconciliation"),
  g703: () => import("@/components/dashboards/G703Billing"),
  paymentflow: () => import("@/components/dashboards/PaymentFlow"),
  costcontrol: () => import("@/components/dashboards/CostControl"),
  erpimports: () => import("@/components/dashboards/ErpImports"),
  protocols: () => import("@/components/dashboards/LabourProtocols"),
  contracts: () => import("@/components/dashboards/ContractRegister"),
};

/** zmierzone na 1280 px; aktualizować przy zmianie układu dashboardu (CLS ≈ 0) */
const MIN_HEIGHT: Record<DashboardKey, number> = {
  report: 720, production: 640, quality: 600, timeline: 640, payments: 560, reconciliation: 620,
  g703: 560, paymentflow: 640, costcontrol: 600, erpimports: 620, protocols: 680, contracts: 640,
};

const LAZY = Object.fromEntries(Object.entries(LOADERS).map(([k, load]) => [k, lazy(load)])) as Record<DashboardKey, ComponentType>;

/** requestIdleCallback z fallbackiem (Safari nie ma rIC); zwraca cancel */
function idle(cb: () => void, timeout = 1500): () => void {
  if (typeof requestIdleCallback === "function") { const id = requestIdleCallback(cb, { timeout }); return () => cancelIdleCallback(id); }
  const id = window.setTimeout(cb, 16);
  return () => window.clearTimeout(id);
}

/** kolejka szeregowa ciężkich montaży (150 ms odstępu), gdy na stronie jest > 1 dashboard */
const queue: Array<() => void> = [];
let draining = false;
function enqueue(cb: () => void): () => void {
  queue.push(cb);
  if (!draining) drain();
  return () => { const i = queue.indexOf(cb); if (i >= 0) queue.splice(i, 1); };
}
function drain() {
  const next = queue.shift();
  if (!next) { draining = false; return; }
  draining = true;
  idle(() => { next(); window.setTimeout(drain, 150); });
}

const MSG = { pl: "Demo nie wczytało się. Odśwież stronę.", en: "The demo did not load. Refresh the page." };
class Boundary extends Component<{ message: string; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  render() { return this.state.failed ? <p className="empty" role="alert">{this.props.message}</p> : this.props.children; }
}

export function DashboardMount({ dashboard }: { dashboard: DashboardKey }) {
  const { lang } = useLang();
  const ref = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || mounted) return;
    let cancel: (() => void) | null = null;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      cancel = enqueue(() => setMounted(true));
    }, { rootMargin: "0px 0px 20% 0px" });
    io.observe(el);
    return () => { io.disconnect(); cancel?.(); };
  }, [mounted]);

  const Dash = LAZY[dashboard];
  const minHeight = MIN_HEIGHT[dashboard];
  const skeleton = <div className="skel" style={{ minHeight }} aria-busy="true" />;
  return (
    <div ref={ref} data-dashboard={dashboard} style={{ minHeight }}>
      {mounted ? <Boundary message={pick(lang, MSG)}><Suspense fallback={skeleton}><Dash /><ReadyFlag host={ref} /></Suspense></Boundary> : skeleton}
    </div>
  );
}

/** data-ready NIE na wrapperze od `mounted` (to tylko „zaczynamy pobierać chunk"), tylko WEWNĄTRZ Suspense:
    efekt wykona się w tym samym commicie co montaż <Dash />, więc zrzuty shoot-tools.mjs są deterministyczne. */
function ReadyFlag({ host }: { host: RefObject<HTMLDivElement | null> }) {
  useEffect(() => {
    const el = host.current; if (!el) return;
    el.dataset.ready = "true";
    return () => { delete el.dataset.ready; };
  }, [host]);
  return null;
}
```

Bez Motion w środku (chunk narzędzia nie zależy od rdzenia Motion). `data-ready` ustawia `ReadyFlag` zamontowany WEWNĄTRZ `Suspense` (po dociągnięciu chunku), nigdy wrapper od stanu `mounted`; `shoot-tools.mjs` czeka na `[data-dashboard][data-ready='true']`, a jako pas bezpieczeństwa na zniknięcie `.skel` z kontenera (`perf-code-split-dashboards` p.6, `perf-images-policy` p.5).

## 9. `ChartReveal` (clip-reveal L→R, raz, ≤ 420 ms = `DUR.reveal`)

```tsx
// src/motion/ChartReveal.tsx
import * as m from "motion/react-m";
import { useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { DUR, EASE_SOFT } from "./tokens";

/**
 * Jedyny dozwolony „reveal" wykresu: clipPath inset(0 100% 0 0) → inset(0 0 0 0), 420 ms, EASE_SOFT, RAZ po montażu.
 * Replay wyłącznie przez replayKey (przycisk „Odtwórz"), nigdy z danych (zmiana wejścia = wynik w tej samej klatce).
 * TYLKO poniżej folda i TYLKO na treści nieobecnej w shellu prerenderu (dashboardy lazy); nigdy w hero/S2/S5.
 * reduced → initial={false}.
 */
export function ChartReveal({ replayKey = 0, children }: { replayKey?: number; children: ReactNode }) {
  const reduce = useReducedMotion();
  return (
    <m.div
      key={replayKey}
      initial={reduce ? false : { clipPath: "inset(0 100% 0 0)" }}
      animate={{ clipPath: "inset(0 0 0 0)" }}
      transition={{ duration: DUR.reveal, ease: EASE_SOFT }}
      style={{ willChange: reduce ? undefined : "clip-path" }}
    >
      {children}
    </m.div>
  );
}

// dashboard:
// const [replay, setReplay] = useState(0);
// <button className="btn btn-secondary btn-sm" type="button" onClick={() => setReplay((n) => n + 1)}>{t.replay}</button>
// <ChartReveal replayKey={replay}><Bars rows={rows} /></ChartReveal>
```

Alternatywa CSS z kitu: `.nc-chart-build` (`ncChartBuild .45s var(--ease-soft) backwards` + blok reduced). Nie łączyć obu na jednym wykresie.

## 10. `WipeCompare` (faza 2; podstrony 2–3 flagowych dem)

```tsx
// src/components/WipeCompare.tsx
import { useId, useState } from "react";
import { useReducedMotion } from "motion/react";
import { useLang, pick } from "@/i18n";

type Props = { before: React.ReactNode; after: React.ReactNode; labels?: { before: { pl: string; en: string }; after: { pl: string; en: string } } };
const DEFAULT_LABELS = { before: { pl: "Przed", en: "Before" }, after: { pl: "Po", en: "After" } };

/**
 * „Przed i po. Na żywo.": po lewej eksport (przed), po prawej wynik (po); clip-path inset sterowany <input type="range">.
 * Nie scroll-linked (dozwolone). reduced-motion / pointer: coarse bez precyzji → przełącznik segmentowy aria-pressed (Przed / Po).
 * Pomiar repaintu w DevTools Performance przed włączeniem na DemoReport (clip-path nad dużym SVG).
 */
export function WipeCompare({ before, after, labels = DEFAULT_LABELS }: Props) {
  const { lang } = useLang();
  const reduce = useReducedMotion();
  const [pos, setPos] = useState(55);           // % szerokości pokazujący „po"
  const [mode, setMode] = useState<"before" | "after">("after");
  const id = useId();

  if (reduce) {
    return (
      <div className="wipe wipe-static">
        <div className="wipe-toggle" role="group" aria-label={`${pick(lang, labels.before)} / ${pick(lang, labels.after)}`}>
          <button type="button" className="btn btn-secondary btn-sm" aria-pressed={mode === "before"} onClick={() => setMode("before")}>{pick(lang, labels.before)}</button>
          <button type="button" className="btn btn-secondary btn-sm" aria-pressed={mode === "after"} onClick={() => setMode("after")}>{pick(lang, labels.after)}</button>
        </div>
        <div className="wipe-pane">{mode === "before" ? before : after}</div>
      </div>
    );
  }

  return (
    <div className="wipe" style={{ ["--wipe" as string]: `${pos}%` }}>
      <div className="wipe-pane wipe-before" aria-label={pick(lang, labels.before)}>{before}</div>
      <div className="wipe-pane wipe-after" aria-label={pick(lang, labels.after)} style={{ clipPath: `inset(0 0 0 var(--wipe))` }}>{after}</div>
      <div className="wipe-handle" style={{ left: "var(--wipe)" }} aria-hidden="true" />
      <label htmlFor={id} className="sr-only">{pick(lang, labels.before)} / {pick(lang, labels.after)}</label>
      <input id={id} className="wipe-range" type="range" min={0} max={100} value={pos} onChange={(e) => setPos(Number(e.target.value))} />
    </div>
  );
}
```

```css
.wipe { position: relative; overflow: hidden; border: 1px solid var(--border); }
.wipe-pane { position: relative; }
.wipe-after { position: absolute; top: 0; right: 0; bottom: 0; left: 0; }
.wipe-handle { position: absolute; top: 0; bottom: 0; width: 1px; background: var(--accent); pointer-events: none; }
.wipe-range { position: absolute; top: 0; right: 0; bottom: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: ew-resize; margin: 0; }
.wipe-range:focus-visible + .wipe-handle, .wipe:has(.wipe-range:focus-visible) .wipe-handle { outline: 2px solid var(--accent); }
```

## 11. Menu mobilne i dialog (`AnimatePresence` tylko tu)

```tsx
// Navbar.tsx (menu mobilne)
import { AnimatePresence } from "motion/react";
import * as m from "motion/react-m";
import { DUR, EASE_OUT } from "@/motion/tokens";
<AnimatePresence initial={false}>
  {open ? (
    <m.nav key="menu" id="mobile-menu" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: DUR.quick } }}
           transition={{ duration: 0.2, ease: EASE_OUT }} aria-label={pick(lang, T.menu)}>
      …
    </m.nav>
  ) : null}
</AnimatePresence>
{/* zamknięte menu poza AnimatePresence: inert (a11y) */}
```

```tsx
// BookingDialog.tsx: natywny <dialog showModal> (focus-trap, Esc, top layer, bez overflow:hidden na body) + AnimatePresence na zawartości
<dialog ref={ref} className="dialog" onClose={onClose}>
  <AnimatePresence>
    {open ? (
      <m.div key="panel" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, transition: { duration: DUR.quick } }} transition={{ duration: DUR.base, ease: EASE_OUT }}>
        …
      </m.div>
    ) : null}
  </AnimatePresence>
</dialog>
```

Reguły `AnimatePresence`: bezpośrednie dzieci ze stabilnym `key` (nie indeks), `AnimatePresence` owija warunek (nie odwrotnie), `initial={false}` gdy stan początkowy może być „otwarte" po podmianie shellu, `mode="wait"` tylko dla jednego dziecka.

## 12. Tabela degradacji (co widzi kto)

| Element | Desktop `pointer: fine` | `pointer: coarse` (telefon/tablet) | `prefers-reduced-motion` | `saveData` / 2g-3g | Bez JS (bot, awaria) |
|---|---|---|---|---|---|
| Tło | wideo hero po posterze (plan A) LUB GLSL Hills po idle (plan B); nigdy oba | statyczny gradient `.bg-layer` + poster | poster / 1 klatka | poster | poster `<img>` w shellu + gradient CSS |
| Wideo hero | po `window.load`, IO ≥ 25 %, pauza hidden, crossfade 600 ms | nie istnieje w DOM | nie istnieje w DOM | nie istnieje w DOM | nie istnieje w shellu |
| H1 / lead / CTA | statyczne (`initial={false}`) | statyczne | statyczne | statyczne | w shellu, pełny tekst |
| Reveale sekcji | fadeUp 12 px, 420 ms, stagger 50 ms | fadeUp (tanie) | fade (opacity only; `MotionConfig`) | fadeUp | shell bez `opacity:0` |
| Liczniki S5 | 0 → wartość 1,2 s po `inView` .6 | tak | `jump(to)` | tak | liczby w HTML na stałe |
| Mini-komponenty S2 | fade 400 ms panelu; `KsefFlow` węzły 3 × 120 ms raz | tak | statyczne | tak | SVG/HTML z liczbami SSR |
| Ramy S3 | fadeUp stagger 60 ms; hover `scale(1.02)` obrazu | fadeUp; brak hover; cała rama = link | fade; bez hover | fadeUp | linki + obrazy z `width/height` |
| Hover-klipy (faza 2) | `preload="none"`, start na hover/focus, max 1 aktywny | poster + link „Odtwórz podgląd" | poster | poster | brak |
| `WipeCompare` (faza 2) | suwak `range`, clip-path | suwak dotykiem | przełącznik Przed / Po (`aria-pressed`) | suwak | brak (opis w shellu) |
| Dashboardy | lazy + IO + rIC + kolejka; `.chart-reveal`/`ChartReveal` raz | lazy + IO (bez rIC: fallback 16 ms) | bez reveal (`initial={false}`) | lazy | opis + FAQ w shellu, skeleton `minHeight` |
| Trasy | `PageFade` 240 ms (faza 1) / VT (faza 2) | tak | fade only / VT `animation: none` | tak | pełny HTML per trasa (19 plików) |
| Menu mobilne / dialog | `AnimatePresence` 200/240 ms | tak | fade only | tak | `<dialog>` natywny; menu = linki w shellu |
| Kit CSS (`.nc-*`, `.skel`) | animacje CSS | tak | `company-ui.css:89-91` zeruje | tak | statyczne |

## 13. Pułapki (z dowodami) i obejścia

1. **StrictMode podwójne efekty** (`main.tsx`): każdy `animate()` → `controls.stop()`; rAF → `cancelAnimationFrame`; IO → `disconnect()`; timeouty → `clearTimeout` (wszystkie id). Wersja `motion ≥ 13.1.1` ma fix `AnimatePresence` w StrictMode; nie schodzić niżej.
2. **`AnimatePresence` + router**: nie owijać `<Routes>` w `AnimatePresence mode="wait"` (skok `ScrollToTop` w trakcie `exit`; fallback `Suspense` lazy trasy miga między wyjściem a wejściem). `PageFade` bez `exit` albo VT (faza 2). Jeśli kiedyś droga B: `<Routes location={location} key={location.pathname}>` + scroll w `onExitComplete` + `Suspense` wewnątrz strony.
3. **Mignięcie hero po shellu** (`motion-dev` §8.1): `createRoot().render()` czyści `#root`; `initial={{opacity:0}}` na H1 = tekst → pusto → fade. `initial={false}` na wszystkim, co jest w shellu; `whileInView` tylko poniżej folda; `ChartReveal` nigdy na treści SSR.
4. **`whileInView` z `amount: "all"`** na elemencie wyższym niż viewport nigdy nie odpala; `VIEWPORT_ONCE` = `amount: 0.25`, margines `-10%` od dołu (start tuż przed wejściem).
5. **Obrazy bez wymiarów** → przesunięcia po wejściu (CLS + błędne offsety IO); zawsze `width/height`.
6. **`zoom` roota** (`globals.css:116-125`): `getBoundingClientRect`/IO liczą inaczej między silnikami na ≥ 1500 px; zdjąć w fazie 0 (R7) zanim ktokolwiek debuguje reveale na dużym ekranie.
7. **CSS transition vs Motion** na tej samej właściwości = podwójny easing; kit ma `transition` na kolorach `.btn/.chip/.st`; Motion nie animuje kolorów, a `.btn` nie ma `transition: transform`.
8. **`LazyMotion` async** trzyma `initial` do dociągnięcia chunku (≥ 12.28.2) → niewidoczny hero na wolnym łączu; zawsze sync.
9. **`domAnimation` ignoruje `layout`/`drag` po cichu** (brak błędu; karta „skacze"): to sygnał, że ktoś użył zakazanego API.
10. **`useReducedMotion` w SSR** nie zna ustawienia; w prerenderze i tak nie ma Motion, a `HeroMedia` decyduje w `useEffect` (SSR = poster).
11. **iOS Low Power Mode**: `play()` odrzuca `NotAllowedError` + Safari wstawia przycisk play; `.catch(() => setEnabled(false))` + `onSuspend` → poster.
12. **`requestIdleCallback`** nie istnieje w Safari: zawsze przez `idle()` z fallbackiem.
13. **Pomiar bundla**: po `npm run build` chunki Motion ≤ 35 KB gz (35 840 B); ≥ 40 KB (40 960 B) = ktoś wciągnął `domMax` (42,7 KB) / `import { motion }` (47,5 KB) / `useScroll`+`useSpring` — fail natychmiastowy (`rules/motion-bundle-budget-motion`).
14. **Skill `react-view-transitions`** każe instalować `react@canary`: nieaktualne od 19.3.0 (stable eksportuje `ViewTransition`, `addTransitionType`, `Activity`); resztę wzorców (typy przejść, shared element `name`) stosować.
15. **Reduced motion nie wyłącza** motion values, `useAnimationFrame`, `<video>`, canvasu, CSS keyframes (`motion-dev` §8.11): każde gate'ować osobno (`rules/motion-reduced-motion-three-layers`).

## 14. Weryfikacja po zmianach motion (kolejność)

1. `cd site && node node_modules/typescript/bin/tsc --noEmit`
2. `npm run build` (17 → 19 HTML + sitemap + llms) i `node scripts/verify-site.mjs` (budżety, `dist` bez `opacity:0`, 1 `<video>` per trasa, brak `<video>` w shellu)
3. DevTools → Rendering → „Emulate prefers-reduced-motion: reduce": scroll całej strony, zero elementów utkniętych; Performance: zero „Layout" w trakcie animacji; Paint flashing: brak błysków przy hover
4. Playwright WebKit ze scratchpadu: 390×844 (coarse) i 1440×900 (fine), z JS i bez JS
5. Realny iPhone Karola (iOS 26) po każdej zmianie w hero/tle/globals
6. Wpis w `docs/plan/motion-registry.md` (motywacja) + commit PL + push `main`
