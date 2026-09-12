import { useEffect, useRef } from "react";
import * as m from "motion/react-m";
import { animate, useInView, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { EASE_OUT } from "./tokens";

/* Czas liczenia: jedyny udokumentowany wyjątek od maksimum 0,6 s z tokens.ts
   (reguły motion-counters-pattern i motion-tokens-only). Krzywa nadal z tokenów. */
const COUNT_DURATION = 1.2;

type CounterProps = {
  /** wartość końcowa; pochodzi z danych albo z silnika, nigdy z literału w JSX */
  to: number;
  /** formatowanie liczby (separator tysięcy, waluta, jednostka); domyślnie sama liczba */
  format?: (n: number) => string;
  /** pełna etykieta dla czytnika ekranu, np. „12 wdrożonych narzędzi"; para PL/EN po stronie wywołania */
  label: string;
  className?: string;
};

const identity = (n: number) => String(n);

/* Licznik liczb dowodowych.
   - useMotionValue(to): PIERWSZY render Reacta drukuje tę samą liczbę co shell prerendera,
     więc po podmianie shellu nic nie mignie zerem, a strona bez JS pokazuje wartość końcową,
   - tekst jest DZIECKIEM m.span przez useTransform: zero renderów Reacta na klatkę,
   - useInView(once) startuje liczenie tylko wtedy, gdy element wjechał w ekran PÓŹNIEJ;
     jeśli był widoczny już w pierwszej klatce (wysoki ekran, wejście z kotwicy), zostaje wartość końcowa,
   - ograniczony ruch: wartość końcowa natychmiast, bez animacji,
   - controls.stop() w sprzątaniu (StrictMode montuje efekty dwa razy),
   - tabular-nums i szerokość minimalna w „ch": liczba nie przesuwa layoutu w trakcie liczenia. */
export function Counter({ to, format = identity, label, className }: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const count = useMotionValue(to);
  const visibleAtStart = useRef<boolean | null>(null);
  const text = useTransform(() => format(Math.round(count.get())));
  const minWidth = `${format(to).length}ch`;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (visibleAtStart.current === null) {
      visibleAtStart.current = el.getBoundingClientRect().top < window.innerHeight;
    }
    if (visibleAtStart.current || reduce) {
      count.jump(to);
      return;
    }
    if (!inView) return;
    count.jump(0);
    const controls = animate(count, to, { duration: COUNT_DURATION, ease: EASE_OUT });
    return () => controls.stop();
  }, [count, inView, reduce, to]);

  return (
    <span
      className={className}
      aria-label={label}
      style={{ display: "inline-block", fontVariantNumeric: "tabular-nums", minWidth }}
    >
      <m.span ref={ref} aria-hidden="true">
        {text}
      </m.span>
    </span>
  );
}
