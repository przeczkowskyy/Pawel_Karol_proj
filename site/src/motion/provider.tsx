import { LazyMotion, domAnimation, MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { DUR, EASE_OUT, MOTION_TIER } from "./tokens";

/* Jedyny provider ruchu w aplikacji (reguła motion-one-library-lazymotion).
   - LazyMotion z funkcjami SYNCHRONICZNYMI (domAnimation w głównym bundlu): wersja `() => import(...)`
     trzymałaby treść w stanie początkowym do czasu dociągnięcia chunku na wolnym łączu.
   - strict: użycie `motion.*` rzuca błąd, więc komponenty muszą brać `m.*` z "motion/react-m"
     (mniejszy bundel; pełny zestaw funkcji nie wjeżdża do wspólnego chunku po cichu).
   - reducedMotion="user": warstwa 1 z reguły motion-reduced-motion-three-layers. Wyłącza transformy
     w każdym m.*, zostawia nieprzezroczystość. Wideo, canvas i wartości ruchu bramkujemy osobno
     przez useReducedMotion(), bo MotionConfig ich nie widzi.
   - transition: domyślny czas i krzywa dla animacji bez własnego `transition`.
   Montowany w main.tsx; nigdy w src/prerender/entry.tsx (reguła motion-no-motion-in-prerender). */
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

/* Kill-switch mediów opcjonalnych. Definicja stoi w tokens.ts (jedno źródło, reguła motion-tier-flag),
   tutaj jest wyłącznie przepust, żeby konsument warstwy ruchu miał jedno wejście importu. */
export { MEDIA_ENABLED } from "./tokens";
