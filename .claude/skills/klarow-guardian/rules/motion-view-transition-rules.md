---
id: motion-view-transition-rules
title: View Transitions: React 19.3 <ViewTransition> tylko wokół <Routes> i tylko w fazie 2; nigdy VT + Motion na jednym elemencie; nigdy flushSync(navigate) pod BrowserRouter
impact: HIGH
tags: [motion, view-transitions, react-router, react-19-3, routing]
source: feasibility-perf §5.2 p.1/§9 p.2 · motion-dev §4.6/§8.4 · synthesis §2.4.6 · showreel §5.5 · rozstrzygnięcie nadrzędne (3): React 19.3.0 stable eksportuje ViewTransition/addTransitionType/Activity; upgrade = faza 2
added: 2026-09-12
---

## Zasada

Faza 1 (React 19.2.x, `react-router-dom` 7.18.x `BrowserRouter` deklaratywny): przejścia tras robi `PageFade` (fade + `y` 6 px, 240 ms, `EASE_STD`, bez `exit`, `initial={false}` na pierwszym montażu). Żadnego `document.startViewTransition`, żadnego `<ViewTransition>`.

**Wersja Reacta jest PRZYPIĘTA co do patcha** (faza 0): `"react": "19.2.7"`, `"react-dom": "19.2.7"` w `site/package.json` — dokładnie, bez caretu, tak samo jak `motion@13.2.0` (`motion-one-library-lazymotion`). Dziś stoi tam `"^19.1.0"` (zainstalowane 19.2.7), więc zwykłe `npm install` może wciągnąć 19.3.x i UDOSTĘPNIĆ `ViewTransition` przed decyzją D-18 — a ta reguła ma temu zapobiegać. Bramka sprawdza wersję ZAINSTALOWANĄ (`node_modules/react/package.json`), nie zakres z `dependencies`: zakres z caretem nie mówi, co realnie leży w drzewie.

Faza 2 (po upgrade do `react@19.3.0`/`react-dom@19.3.0` w osobnym commicie, po ≥ 2 tygodniach od publikacji v1; decyzja D-18):

1. `<ViewTransition>` z `react` (stabilny od 19.3.0; skill `react-view-transitions` każe instalować `react@canary`: NIEAKTUALNE, ignorować tę sekcję) opakowuje `<Routes>` w `App.tsx`; `Navbar` i `Footer` są POZA nim (`view-transition-name: chrome` + `::view-transition-group(chrome) { animation: none }`).
2. Działa bez zmiany routera, bo `BrowserRouter` owija `setState` nawigacji w `React.startTransition` (`react-router/dist/development/chunk-KS7C4IRE.mjs:10406-10412`), a React animuje `<ViewTransition>` tylko dla aktualizacji oznaczonych jako Transition.
3. Gdy VT wchodzi, `PageFade` wychodzi: nigdy View Transition i Motion (`m.*`, `AnimatePresence`) na TYM SAMYM elemencie/poziomie drzewa. Motion zostaje dla stanów w obrębie strony (dialog, menu, reveale).
4. `document.startViewTransition(cb)` wywoływane ręcznie pod `BrowserRouter` wymaga ALBO `<BrowserRouter useTransitions={false}>` ALBO callbacku asynchronicznego, który rozwiązuje się po commicie nowej trasy (np. promise z `useLayoutEffect` nowej strony). `document.startViewTransition(() => flushSync(() => navigate(to)))` NIE DZIAŁA (patrz mechanizm) i jest zakazane.
5. `react-router` `<Link viewTransition>` nie istnieje w trybie deklaratywnym (docs: „Declarative Mode ❌"); nie migrować na `createBrowserRouter` tylko dla VT.
6. CSS: `::view-transition-old(root), ::view-transition-new(root) { animation-duration: var(--duration-base); animation-timing-function: var(--ease-std) }` + `@media (prefers-reduced-motion: reduce) { ::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*) { animation: none !important } }`.
7. `Suspense` lazy tras zostaje WEWNĄTRZ komponentu strony (fallback = skeleton), nie między `<ViewTransition>` a `<Routes>`.
8. `ScrollToTop` zostaje bez zmian (VT nie koliduje).

## Mechanizm awarii (dlaczego)

- `flushSync` wypłukuje tylko lane synchroniczny; update nawigacji jest w lane transition, więc callback VT kończy się ze STARYM DOM-em: przeglądarka robi crossfade „stare → stare", a nowa trasa wskakuje po nim bez animacji, z fallbackiem Suspense lazy trasy poza VT (CONFIRMED przez sędziego wykonalności na kodzie routera 7.18.1). To samo dotyczy `setSearchParams` (idzie przez `navigate`).
- `useTransitions={false}` naprawia VT, ale ma koszt: lazy trasy pokazują fallback zamiast trzymać stary widok. Decyzja musi być świadoma, stąd „tylko po decyzji".
- VT jest nieprzerywalne, overlay `fixed` blokuje scroll na czas animacji; interakcja z `BrowserRouter`/`Suspense`/`ScrollToTop` nie była testowana w tym repo; 19.3.0 wyszło 2026-09-09. Stąd faza 2 po stabilizacji.
- Bramka czytająca ZAKRES (`p.dependencies.react` = `"^19.1.0"`) robi dwie szkody naraz: zapala fałszywy alarm na zgodnym stanie (zainstalowane 19.2.7) i NIE łapie tego, przed czym ma chronić — caret przepuszcza 19.3.x przy pierwszym `npm install`, a wtedy `ViewTransition` staje się dostępny bez decyzji D-18. Dlatego: pin w `package.json` + pomiar w `node_modules`.
- VT + Motion na jednym elemencie: snapshot VT łapie element w połowie animacji Motion, crossfade „zamrożonej" klatki, a po VT Motion dokańcza ruch: podwójne przejście.
- Wsparcie: Chromium 125+ (React potrzebuje obiektowej formy `startViewTransition`), Firefox 144+, Safari 18.2+; bez wsparcia nawigacja działa bez animacji (degradacja OK).

## Niepoprawnie

```tsx
// useVtNavigate.ts (szkic z koncepcji proof: NIE DZIAŁA pod BrowserRouter)
const navigate = useNavigate();
return (to: string) => {
  if (!document.startViewTransition) return navigate(to);
  document.startViewTransition(() => flushSync(() => navigate(to)));   // stary DOM w snapshocie
};
```

```tsx
// VT i Motion na tym samym poziomie
<ViewTransition default="page">
  <AnimatePresence mode="wait"><Routes location={location} key={location.pathname}>…</Routes></AnimatePresence>
</ViewTransition>
```

## Poprawnie

```tsx
// FAZA 1: App.tsx
<Navbar />
<PageFade>
  <main id="main"><Routes>…</Routes></main>
</PageFade>
<Footer />

// FAZA 2 (po D-18): App.tsx, react 19.3.0
import { ViewTransition } from "react";
<Navbar />                                  {/* CSS: header, footer { view-transition-name: chrome } */}
<ViewTransition default="page">
  <main id="main"><Routes>…</Routes></main> {/* PageFade usunięty */}
</ViewTransition>
<Footer />

// FAZA 2, kierunek nawigacji (opcjonalnie): lista → detal
import { addTransitionType, startTransition } from "react";
onClick={(e) => { e.preventDefault(); startTransition(() => { addTransitionType("nav-forward"); navigate(to); }); }}
<ViewTransition enter={{ "nav-forward": "page-from-right", "nav-back": "page-from-left", default: "page" }}>
```

```css
::view-transition-old(root), ::view-transition-new(root) { animation-duration: var(--duration-base); animation-timing-function: var(--ease-std); }
::view-transition-group(chrome) { animation: none; }
@media (prefers-reduced-motion: reduce) { ::view-transition-group(*), ::view-transition-old(*), ::view-transition-new(*) { animation: none !important; } }
```

## Test

```bash
# faza 1 (oczekiwane: 0)
grep -rnE 'startViewTransition|ViewTransition|addTransitionType|viewTransition' site/src
# wersja ZAINSTALOWANA (nie zakres): 19.2.x do czasu decyzji D-18
node -e 'const v=require("./site/node_modules/react/package.json").version; if(!/^19\.2\./.test(v))console.log("react poza fazą 1:",v)'
node -e 'const v=require("./site/node_modules/react-dom/package.json").version; if(!/^19\.2\./.test(v))console.log("react-dom poza fazą 1:",v)'
# pin bez caretu w package.json (faza 0)
node -e 'const d=require("./site/package.json").dependencies; for (const k of ["react","react-dom"]) if(!/^19\.\d+\.\d+$/.test(d[k]))console.log(k+" nieprzypięty:",d[k])'
# faza 2 (po D-18):
grep -rnE 'flushSync\([^)]*navigate' site/src                         # = 0 (zawsze)
grep -rnE '<ViewTransition' site/src | wc -l                           # = 1 (wokół Routes) + ewentualne name= na shared elements
grep -rnE 'PageFade' site/src | grep -v 'motion/PageFade.tsx'          # = 0 po wejściu VT
grep -rnE 'react@canary|"react":\s*"canary"' site/package.json .claude/skills/react-view-transitions -r   # informacyjnie: sekcja canary skilla nieaktualna
# ręcznie: Chrome 125+ nawigacja / → /narzedzia → /narzedzia/raport-zarzadczy → wstecz: crossfade, brak podwójnego przejścia, brak fallbacku Suspense w VT;
# Safari 17 (bez VT): nawigacja działa bez animacji.
```

## Wyjątki

- Upgrade do `react@19.3.0`/`react-dom@19.3.0` jest osobnym commitem z decyzją D-18 w `docs/plan/nastepne-kroki.md` (data, powód, wynik spike'u `BrowserRouter`/`Suspense`/`ScrollToTop`); w tym samym commicie zmieniają się: pin w `package.json`, obie bramki wersji powyżej i zdanie „Faza 1" w tej regule.
- Shared element (`<ViewTransition name={`tool-${slug}`}>` na posterze karty i nagłówku podstrony) dozwolony w fazie 2 pod warunkiem, że ten element NIE jest `m.*`.
- Motion `animateView()` (wrapper VT z `motion/react`) nie jest używany: React-owy komponent `AnimateView` to Motion+ Early Access.
