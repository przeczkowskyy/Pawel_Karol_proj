/* Biblioteka ruchu sterowanego przewijaniem (scroll-linked motion).
   Wszystko tutaj dzieli cztery zasady, których nie wolno obejść:
   1. gałąź `prefers-reduced-motion` pokazuje stan KOŃCOWY, nigdy początkowy,
   2. ruszają się wyłącznie `transform`, `opacity`, `clip-path`, `filter`,
   3. postęp bierze `useScroll` z `motion/react`, nigdy `addEventListener("scroll")`,
   4. zero `Math.random` i `Date.now`: rozrzut liczy funkcja haszująca po indeksie.

   Te komponenty NIE mogą trafić do `src/prerender/entry.tsx`: shell statyczny
   ma pokazywać treść bez biblioteki ruchu (reguła motion-no-motion-in-prerender).
   Do strony wchodzą przez `React.lazy` albo zwykłym importem w komponencie trasy.

   Przykłady użycia: `DEMO.md` w tym katalogu. */

export { ScrollChart } from "./ScrollChart";
export { ChaosToOrder } from "./ChaosToOrder";
export { ScrollCounter } from "./ScrollCounter";
export { StickyScene } from "./StickyScene";
