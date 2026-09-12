---
id: motion-one-library-lazymotion
title: Jedna biblioteka ruchu w DOM: m.* + LazyMotion domAnimation strict
impact: HIGH
tags: [motion, bundle, react, imports]
source: motion-dev §3.1/§3.2/§3.4 · synthesis §2.4.2 · showreel M1/M10 · Motion AI Kit best-practices/react.md
added: 2026-09-12
---

## Zasada

Na stronie `site/` jest DOKŁADNIE jedna biblioteka animacji DOM: `motion@13.2.0` (pin, minimum 13.1.1). Sposób użycia jest jeden:

1. komponenty animowane to `m.*` z `import * as m from "motion/react-m"` (nigdy `motion.*`),
2. funkcje pomocnicze (`LazyMotion`, `domAnimation`, `MotionConfig`, `AnimatePresence`, `useInView`, `useReducedMotion`, `useMotionValue`, `useTransform`, `animate`, `stagger`) z `motion/react`,
3. cały `<App/>` siedzi pod `<LazyMotion features={domAnimation} strict>` z `src/motion/provider.tsx` (features SYNCHRONICZNE, nie `() => import(...)`),
4. `domMax` (a więc `layout`, `layoutId`, `drag`, `Reorder`, `LayoutGroup`) jest ZAKAZANE do czasu odrębnej decyzji founderów zapisanej w `docs/plan/`; przełączenie to zmiana jednej linii w `provider.tsx`, nie w komponentach.

Zakazane w `site/src`: `import { motion }`, `import { motion as`, `framer-motion` (pakiet i import), `motion/react-client`, `gsap`, `@react-spring`, `animejs`, `lottie-web`, `@formkit/auto-animate` (usuwany w fazie 0; jedna biblioteka = jeden silnik).

## Mechanizm awarii (dlaczego)

- `motion.div` ładuje pełny zestaw funkcji (47,5 KB gz w Vite/Rollup na 13.2.0); `m.*` + `domAnimation` sync = 33,8 KB gz. Jedno `import { motion }` w dowolnym pliku wciąga pełną wersję do wspólnego chunku i zysk znika po cichu. `LazyMotion strict` zamienia tę cichą regresję w błąd runtime, więc ktoś ją zobaczy.
- `domMax` waży tyle co pełny `motion` (42,7 vs 42,6 KB gz w esbuild). `layout`/`drag` na `domAnimation` nie rzucają błędu: propsy są ignorowane, karta „skacze" zamiast płynąć, a autor szuka błędu w CSS.
- Async `features={() => import(...)}` trzyma elementy w stanie `initial` do czasu dociągnięcia chunku (Motion ≥ 12.28.2): na wolnym łączu hero stoi w `opacity: 0`.
- Dwie biblioteki na jednym elemencie (np. `auto-animate` na liście, w której dzieci są `m.li`) walczą o `transform` w tej samej klatce: podwójny easing, jank.
- Skill `/motion` (Motion AI Kit) doradza `import { motion } from "motion/react"`: jest to poprawne dla ogólnego projektu, ale NIE dla tego repo. Strażnik ma pierwszeństwo nad `/motion`.

## Niepoprawnie

```tsx
// site/src/components/Bento.tsx
import { motion } from "motion/react";               // pełny bundle, strict rzuci błąd
export function Bento() {
  return <motion.ul layout>{/* layout bez domMax: cicho ignorowane */}</motion.ul>;
}
```

```tsx
// site/src/motion/provider.tsx
<LazyMotion features={() => import("./features").then((r) => r.default)}>  // async: hero w initial na wolnym łączu
```

```tsx
import { useAutoAnimate } from "@formkit/auto-animate/react";   // druga biblioteka na stronie
```

## Poprawnie

```tsx
// site/src/motion/provider.tsx
import { LazyMotion, domAnimation, MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { DUR, EASE_OUT } from "./tokens";

export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user" transition={{ duration: DUR.base, ease: EASE_OUT }}>
        {children}
      </MotionConfig>
    </LazyMotion>
  );
}
```

```tsx
// site/src/components/Bento.tsx
import * as m from "motion/react-m";
import { fadeUp, group } from "@/motion/presets";
import { VIEWPORT_ONCE } from "@/motion/tokens";

export function Bento({ cells }: { cells: Cell[] }) {
  return (
    <m.ul variants={group} initial="hidden" whileInView="show" viewport={VIEWPORT_ONCE}>
      {cells.map((c) => (
        <m.li key={c.key} variants={fadeUp}>{c.title}</m.li>
      ))}
    </m.ul>
  );
}
```

Montaż: `main.tsx` → `<StrictMode><BrowserRouter><LangProvider><MotionProvider><App/></MotionProvider></LangProvider></BrowserRouter></StrictMode>`.

## Test

```bash
# z katalogu repo; oczekiwany wynik każdej komendy: 0 trafień
grep -rnE 'from "motion/react"' site/src | grep -E '\bmotion\b[^/]' | grep -vE 'motion/react-m'      # import { motion }
grep -rnE 'import \{[^}]*\bmotion\b[^}]*\} from "motion/react"' site/src
grep -rnE 'framer-motion|motion/react-client|from "gsap"|@react-spring|animejs|lottie-web|@formkit/auto-animate' site/src site/package.json
grep -rnE '\b(layout|layoutId|drag|dragConstraints)=' site/src                                   # domMax API bez decyzji
grep -rnE '<(Reorder|LayoutGroup)[ .>]' site/src
grep -rnE 'features=\{\s*\(\)\s*=>' site/src/motion                                               # async features
# musi istnieć dokładnie jeden LazyMotion i ma strict:
grep -rnE '<LazyMotion' site/src | wc -l          # = 1
grep -rnE '<LazyMotion[^>]*strict' site/src | wc -l   # = 1
# wersja przypięta:
node -e 'const p=require("./site/package.json");if(p.dependencies.motion!=="13.2.0")process.exit(1)'
```

Docelowo: `node scripts/check-motion.mjs` (sekcja `imports`) wykonuje te same sprawdzenia i zwraca findings `motion-one-library-lazymotion`.

## Wyjątki

- `src/prerender/entry.tsx` nie importuje niczego z `motion/*` (patrz `motion-no-motion-in-prerender`), więc reguła dotyczy `site/src` bez `prerender/`.
- Przełączenie na `domMax` jest dozwolone wyłącznie razem z wpisem decyzji w `docs/plan/nastepne-kroki.md` (data, powód, pomiar chunku przed/po) i aktualizacją `motion-bundle-budget-motion`.
