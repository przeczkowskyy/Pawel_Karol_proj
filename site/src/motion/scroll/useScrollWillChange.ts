import { useRef } from "react";
import { useMotionValueEvent, type MotionValue } from "motion/react";

/* ── useScrollWillChange (wewnętrzne, nie eksportowane z index.ts) ───────────
   CO ROBI: włącza podpowiedź `will-change: transform` WYŁĄCZNIE na czas, w
   którym postęp przewijania faktycznie zmienia stan sceny, i zdejmuje ją, gdy
   scena stoi na początku albo na końcu.

   DLACZEGO TAK, A NIE `will-change` W STYLU ELEMENTU: `will-change` na stałe to
   warstwa kompozytora trzymana w pamięci przez całe życie strony. Przy jednym
   elemencie to drobiazg, przy stu dwudziestu to jest dokładnie ta „optymalizacja",
   która zabija telefon. Reguła strażnika (`design-animation-fill-backwards`) mówi
   o tym wprost: ustawiać tylko na czas animacji, zdejmować po niej.

   JAK: zwrócony ref idzie na RODZICA animowanych elementów. Hook przestawia na
   nim jedną własność custom, a dzieci czytają ją przez `var()`. Własności custom
   dziedziczą, więc jeden zapis stylu obsługuje dowolną liczbę dzieci: zero
   renderów Reacta, zero pętli po węzłach, zero pracy w klatce (zapis leci tylko
   przy PRZEJŚCIU przez granicę zakresu, nie przy każdej zmianie postępu).

   SPRZĄTANIE: `useMotionValueEvent` odpina subskrypcję sam, w cleanupie efektu. */

/** nazwa dziedziczonej własności custom trzymającej stan podpowiedzi */
const WILL_CHANGE_VAR = "--scroll-wc";
/** wartość do wstawienia w `style.willChange` animowanego DZIECKA */
export const WILL_CHANGE_INHERITED = `var(${WILL_CHANGE_VAR}, auto)`;

/* progi z marginesem: przy dokładnym 0 i 1 scena stoi, więc warstwa nie jest potrzebna */
const EPS = 0.002;

export function useScrollWillChange<T extends HTMLElement>(
  progress: MotionValue<number>,
  enabled: boolean
) {
  const hostRef = useRef<T>(null);
  const activeRef = useRef(false);

  useMotionValueEvent(progress, "change", (p) => {
    if (!enabled) return;
    const active = p > EPS && p < 1 - EPS;
    if (active === activeRef.current) return;
    activeRef.current = active;
    hostRef.current?.style.setProperty(WILL_CHANGE_VAR, active ? "transform" : "auto");
  });

  return hostRef;
}
