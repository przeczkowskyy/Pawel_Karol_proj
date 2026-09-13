import { useEffect, useRef } from "react";
import { useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";

/* ── ScrollCounter ──────────────────────────────────────────────────────────
   CO ROBI: liczba, która rośnie POSTĘPEM PRZEWIJANIA, a nie zegarem. To nie
   jest licznik startujący po wejściu w ekran i lecący własnym tempem przez
   1,2 s (ten wzorzec stoi w `src/motion/Counter.tsx` i zostaje na liczby nad
   pierwszym zgięciem). Tutaj widz steruje wartością: zatrzyma scroll, liczba
   staje; cofnie, liczba wraca. Dowód, że liczba jest wyliczana, nie odtwarzana.

   CZYM JEST STEROWANY: `useScroll({ target, offset: ["start 85%", "center 60%"] })`.
   Zakres przewijania między tymi progami to około jedna czwarta wysokości okna,
   więc liczba dolicza do końca mniej więcej wtedy, gdy wchodzi na środek ekranu.

   REDUCED MOTION: `useReducedMotion()` blokuje zapisy z wartości ruchu, więc
   w DOM zostaje to, co wyrenderował React, czyli WARTOŚĆ KOŃCOWA. Zero
   liczenia, zero stanu początkowego.

   PUŁAPKA, KTÓREJ UNIKA: naiwny licznik trzyma liczbę w `useState` i wywołuje
   render Reacta w każdej klatce (60 renderów na sekundę na każdy licznik na
   stronie). Tutaj wartość idzie przez `useMotionValueEvent` prosto do
   `textContent` węzła: zero renderów Reacta w trakcie ruchu.
   Druga pułapka: JSX renderuje od razu wartość KOŃCOWĄ, nie zero. Pierwsza
   klatka nigdy nie miga zerem, a gdy JS nie wstanie, w DOM zostaje liczba
   niosąca sens, nie „0". Dopasowanie do faktycznej pozycji przewijania robi
   dopiero efekt po montażu, kiedy licznik i tak jest jeszcze poza ekranem.
   Trzecia: `tabular-nums` i minimalna szerokość w „ch" trzymają szerokość pola,
   więc licząca się liczba nie przesuwa sąsiedniego tekstu. */

type ScrollCounterProps = {
  /** wartość końcowa; pochodzi z danych albo z silnika, nigdy z literału w JSX */
  to: number;
  /** wartość początkowa liczenia; domyślnie 0 */
  from?: number;
  /** formatowanie liczby (separator tysięcy, waluta, jednostka); domyślnie sama liczba */
  format?: (n: number) => string;
  /** pełna etykieta dla czytnika ekranu; para PL/EN rozstrzygana po stronie wywołania */
  label: string;
  className?: string;
};

const identity = (n: number) => String(n);

/** Liczba rosnąca wraz z postępem przewijania. */
export function ScrollCounter({ to, from = 0, format = identity, label, className }: ScrollCounterProps) {
  const wrapRef = useRef<HTMLSpanElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start 85%", "center 60%"] });
  const value = useTransform(scrollYProgress, [0, 1], [from, to]);

  /* Jedno dopasowanie po montażu: gdy element jest już częściowo przewinięty
     (wejście z kotwicy, odświeżenie w połowie strony), zdarzenie „change" mogło
     jeszcze nie paść, a DOM ma wartość końcową z JSX. */
  useEffect(() => {
    if (reduce) return;
    const node = textRef.current;
    if (node) node.textContent = format(Math.round(value.get()));
  }, [format, reduce, value]);

  useMotionValueEvent(value, "change", (v) => {
    if (reduce) return;
    const node = textRef.current;
    if (node) node.textContent = format(Math.round(v));
  });

  return (
    <span
      ref={wrapRef}
      className={className}
      aria-label={label}
      style={{
        display: "inline-block",
        fontVariantNumeric: "tabular-nums",
        minWidth: `${format(to).length}ch`,
      }}
    >
      <span ref={textRef} aria-hidden="true">
        {format(to)}
      </span>
    </span>
  );
}
