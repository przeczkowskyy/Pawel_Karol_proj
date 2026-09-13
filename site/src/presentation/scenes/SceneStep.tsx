import type { ReactNode } from "react";
import * as m from "motion/react-m";
import { useReducedMotion, useTransform, type MotionValue } from "motion/react";
import { SHIFT } from "@/motion/tokens";

/* ── SceneStep ──────────────────────────────────────────────────────────────
   Kaskada WEWNĄTRZ sceny: liczba wchodzi, chwilę później zdanie, na końcu
   źródło. To jest jedyny ruch, jaki warstwa treści dokłada od siebie.

   DLACZEGO NIE CAŁA TREŚĆ NARAZ: silnik (`presentation/Scene.tsx`) sam wprowadza
   i wyprowadza cały blok treści (okno `CONTENT = [0.16, 0.34, 0.66, 0.84]`,
   `opacity` plus `y`). Drugie takie samo przenikanie na tym samym elemencie
   dałoby podwójne wygaszanie i treść znikającą w połowie sceny. Dlatego kroki
   siedzą CIASNO W ŚRODKU okna silnika, między 0,30 a 0,56: zaczynają się tuż
   przed pełną widocznością sceny, a kończą długo przed jej wyjściem.

   REDUCED MOTION: silnik podaje wtedy `progress = 1`, więc każdy krok stoi na
   wartości końcowej. Gałąź `useReducedMotion()` i tak jest jawna, bo
   `MotionConfig reducedMotion="user"` dotyczy animacji i wariantów, a nie
   wartości ruchu wpiętych prosto w `style`.

   Ruszają się wyłącznie `opacity` i `transform`. Kroków w jednej scenie jest
   najwyżej cztery: przy większej liczbie ostatni element wchodziłby już po tym,
   jak scena zaczyna ustępować następnej. */

/** początek pierwszego kroku: tuż przed pełną widocznością treści (silnik: 0,34) */
const FIRST = 0.3;
/** odstęp między krokami; rytm kaskady z tokenów ruchu, przełożony na postęp */
const GAP = 0.06;
/** długość wejścia jednego kroku */
const SPAN = 0.08;
/** limit kroków: ostatni kończy się na 0,56, czyli długo przed wyjściem treści */
const MAX_STEP = 3;

type SceneStepProps = {
  progress: MotionValue<number>;
  /** numer w kaskadzie sceny; 0 to pierwszy element, maksimum 3 */
  step?: number;
  className?: string;
  children: ReactNode;
};

export function SceneStep({ progress, step = 0, className, children }: SceneStepProps) {
  const reduce = useReducedMotion();
  const start = FIRST + Math.min(step, MAX_STEP) * GAP;
  const opacity = useTransform(progress, [start, start + SPAN], [0, 1]);
  const y = useTransform(progress, [start, start + SPAN], [SHIFT, 0]);

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <m.div className={className} style={{ opacity, y }}>
      {children}
    </m.div>
  );
}
