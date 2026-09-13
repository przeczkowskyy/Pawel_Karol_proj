import { useRef, type CSSProperties, type ReactNode } from "react";
import { useMotionValue, useReducedMotion, useScroll, type MotionValue } from "motion/react";

/* ── StickyScene ────────────────────────────────────────────────────────────
   CO ROBI: daje scenie zapas drogi. Kontener dostaje jawną wysokość (domyślnie
   250vh), a w środku `position: sticky; top: 0; height: 100vh` przykleja
   zawartość na jeden ekran. Widz przewija stronę normalnie, a scena pod jego
   palcem zmienia się od początku do końca. Dziecko jest FUNKCJĄ dostającą
   `progress` (MotionValue 0–1), więc scena sama decyduje, co z tym postępem
   zrobi: przełączy klatki, przesunie kamerę, dołoży warstwę.

   CZYM JEST STEROWANY: `useScroll({ target, offset: ["start start", "end end"] })`,
   czyli 0 w chwili, gdy góra kontenera dotyka góry okna, i 1, gdy jego dół
   dotyka dołu okna.

   TO NIE JEST SCROLL-HIJACK. Nie ma `preventDefault`, nie ma przechwytywania
   `wheel`, `touchmove` ani klawiatury, nie ma blokady `overflow` na `body`,
   nie ma przeskakiwania do następnej sekcji. Pasek przewijania zachowuje się
   dokładnie tak, jak wszędzie indziej, a scena jest tylko dłuższa. Różnica
   między „efektem wow" a stroną, z której się ucieka, leży dokładnie tutaj.

   REDUCED MOTION: `useReducedMotion()` zdejmuje wysokość (`auto`) i klejenie,
   a dziecko dostaje `progress` na sztywno ustawiony na 1, czyli STAN KOŃCOWY
   sceny w normalnym przepływie dokumentu. Scenę trzeba więc pisać tak, żeby
   `progress === 1` był sensowną, kompletną klatką, a nie pustym ekranem po
   wyjściu ostatniego elementu.

   PUŁAPKA, KTÓREJ UNIKA: `position: sticky` przestaje działać po cichu, gdy
   KTÓRYKOLWIEK przodek ma `overflow` inny niż `visible` (typowo `overflow-x:
   hidden` dopisane gdzieś w layoucie dla bezpieczeństwa na telefonie).
   Element wtedy po prostu jedzie z treścią i nikt nie widzi błędu. Dlatego ta
   scena nie ma własnego `overflow` na kontenerze, a klipuje wyłącznie element
   przyklejony, czyli warstwę POD sticky, nie nad nim.
   Druga: wysokość kontenera jest w `vh` i ustawiana raz w stylu, nigdy
   animowana. Animowanie wysokości to layout całej strony w każdej klatce. */

type StickySceneProps = {
  /** wysokość drogi przewijania sceny; domyślnie 250vh (dwa i pół ekranu) */
  height?: string;
  /** klasa kontenera wyznaczającego drogę */
  className?: string;
  /** klasa elementu przyklejonego (tam trafia tło i kadrowanie sceny) */
  stickyClassName?: string;
  /** scena jako funkcja postępu 0–1 */
  children: (progress: MotionValue<number>) => ReactNode;
};

const STICKY_STYLE: CSSProperties = {
  position: "sticky",
  top: 0,
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  overflow: "hidden",
};

const STATIC_STYLE: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

/** Scena na przyklejonym ekranie, sterowana postępem przewijania kontenera. */
export function StickyScene({ height = "250vh", className, stickyClassName, children }: StickySceneProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  /* Stała wartość na gałąź ograniczonego ruchu. Hook stoi bezwarunkowo
     (kolejność hooków musi być ta sama w obu gałęziach), a sama wartość nigdy
     nie jest zapisywana, więc nie ma subskrypcji do posprzątania. */
  const settled = useMotionValue(1);

  return (
    <div
      ref={ref}
      className={className}
      style={{ position: "relative", height: reduce ? "auto" : height }}
    >
      <div className={stickyClassName} style={reduce ? STATIC_STYLE : STICKY_STYLE}>
        {children(reduce ? settled : scrollYProgress)}
      </div>
    </div>
  );
}
