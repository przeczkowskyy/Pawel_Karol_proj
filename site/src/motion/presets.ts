import { stagger, type Variants } from "motion/react";
import { DUR, EASE_OUT, SHIFT, STAGGER } from "./tokens";

/* Warianty wejścia. Wyłącznie własności liczone na GPU (nieprzezroczystość i transform),
   zero wartości layoutowych (reguła motion-gpu-props-only). Czasy i krzywe tylko z tokens.ts. */

/** wejście elementu zajmującego najwyżej jedną trzecią ekranu: nieprzezroczystość + przesunięcie 12 px */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: SHIFT },
  show: { opacity: 1, y: 0, transition: { duration: DUR.reveal, ease: EASE_OUT } },
};

/** wejście dużej powierzchni (rama z obrazem, portret, kadr): sama nieprzezroczystość, bez przesunięcia */
export const fade: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: DUR.media, ease: EASE_OUT } },
};

/* Rodzic kaskady: dzieci startują co STAGGER (50 ms), start całości po 80 ms.
   Motion 13 przekazuje opóźnienie dzieci przez delayChildren + stagger(); starsze API nie działa.
   Limit z reguły motion-stagger-caps: najwyżej 12 dzieci, łączny czas kaskady do 1,2 s. */
export const staggerParent: Variants = {
  hidden: {},
  show: { transition: { delayChildren: stagger(STAGGER, { startDelay: 0.08 }) } },
};
