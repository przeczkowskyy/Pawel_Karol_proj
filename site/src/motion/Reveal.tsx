import * as m from "motion/react-m";
import { useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
import { fade, fadeUp, staggerParent } from "./presets";
import { VIEWPORT_ONCE } from "./tokens";

/* Wejście sekcji i grup. Zasady (reguły motion-no-initial-hidden-above-fold, motion-stagger-caps):
   - używać WYŁĄCZNIE poniżej pierwszego ekranu i wyłącznie na treści, której nie ma w shellu
     prerendera (shell nigdy nie może zostać z ukrytą treścią, gdy JS nie wstanie),
   - kaskada najwyżej 12 dzieci; dłuższe listy wchodzą jednym wspólnym wejściem,
   - przy ograniczonym ruchu element renderuje się od razu w stanie końcowym (initial={false}),
     więc nic nie może utknąć w stanie początkowym. */

const VARIANTS = { fadeUp, fade } as const;
type Variant = keyof typeof VARIANTS;
type Tag = "div" | "section" | "article" | "figure";
type GroupTag = "ul" | "ol" | "div";

type RevealProps = {
  variant?: Variant;
  as?: Tag;
  className?: string;
  children: ReactNode;
};

/** Pojedynczy element wchodzący przy przewinięciu. */
export function Reveal({ variant = "fadeUp", as = "div", className, children }: RevealProps) {
  const reduce = useReducedMotion();
  const Component = m[as];
  return (
    <Component
      className={className}
      variants={VARIANTS[variant]}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={VIEWPORT_ONCE}
    >
      {children}
    </Component>
  );
}

type RevealGroupProps = {
  as?: GroupTag;
  className?: string;
  children: ReactNode;
};

/** Kaskada dzieci. Dziecko to `m.li`/`m.div` z `variants={fadeUp}`: warianty schodzą w dół drzewa. */
export function RevealGroup({ as = "ul", className, children }: RevealGroupProps) {
  const reduce = useReducedMotion();
  const Component = m[as];
  return (
    <Component
      className={className}
      variants={staggerParent}
      initial={reduce ? false : "hidden"}
      whileInView="show"
      viewport={VIEWPORT_ONCE}
    >
      {children}
    </Component>
  );
}
