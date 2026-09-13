import { useCallback, useMemo, useRef, useState, type ReactNode } from "react";
import * as m from "motion/react-m";
import { useReducedMotion, useScroll } from "motion/react";
import { StageContext, type StageApi } from "./context";
import "./presentation.css";

/* ── Stage ──────────────────────────────────────────────────────────────────
   CO ROBI: rama całej prezentacji. Liczy postęp przewijania CAŁEGO dokumentu,
   podaje go scenom przez kontekst i rysuje jedyny element nawigacyjny tej
   wersji strony: cienką linię na lewej krawędzi okna, rosnącą wraz
   z przewijaniem, plus numer sceny („3 / 8") małym drukiem w rogu.

   CZEGO NIE ROBI, i to jest cecha, nie brak: nie ma zakładek, nie ma menu, nie
   ma skoków do sekcji. Decyzja Karola z 2026-09-13 brzmiała „bez zakładek, bez
   niczego", a każdy skrót nawigacyjny dokleja z powrotem architekturę serwisu,
   od której ta strona odchodzi.

   ZERO PRZECHWYTYWANIA GESTU: postęp czyta `useScroll()` z `motion/react`
   (pasywnie, bez renderu Reacta na klatkę). Ani jednego listenera `wheel`,
   `touchmove` czy `scroll`, ani jednego `scrollTo`, ani jednej blokady
   `overflow` na `body`. Użytkownik przewija dokładnie tak, jak wszędzie indziej
   (reguła `motion-no-pinning-no-scroll-hijack` §A).

   REDUCED MOTION: linia postępu znika (gałąź w JS i drugi raz w CSS), zostaje
   sam numer sceny. Sceny same wracają do zwykłego przepływu dokumentu, więc
   prezentacja czyta się wtedy jak broszura: osiem sekcji jedna pod drugą,
   każda w stanie KOŃCOWYM.

   PUŁAPKA, KTÓREJ UNIKA: rama nie ustawia `overflow`, `transform`, `filter`
   ani `will-change`. Pierwsza własność zabiłaby `position: sticky` we
   wszystkich scenach naraz (po cichu, bez błędu w konsoli), a każda z trzech
   pozostałych zrobiłaby z ramy blok zawierający dla `position: fixed`, przez
   co wskaźnik postępu przestałby się trzymać krawędzi okna. */

type StageProps = {
  /** sceny w kolejności przewijania */
  children: ReactNode;
  className?: string;
};

/** Rama prezentacji: globalny postęp, wskaźnik i kontekst dla scen. */
export function Stage({ children, className }: StageProps) {
  const reduce = useReducedMotion();

  /* Postęp całego dokumentu. `useScroll()` bez celu = od góry strony do dołu. */
  const { scrollYProgress } = useScroll();

  const [ids, setIds] = useState<string[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  /* Rejestr scen. Numeracja („3 / 8") musi iść za KOLEJNOŚCIĄ W DOKUMENCIE,
     a nie za kolejnością montowania efektów, bo ta druga potrafi się rozjechać
     przy opakowaniach, fragmentach i renderowaniu warunkowym. Dlatego rejestr
     trzyma węzły i sortuje je `compareDocumentPosition`: jedyne źródło prawdy
     o tym, co jest sceną numer trzy, to miejsce w drzewie. */
  const nodes = useRef(new Map<string, HTMLElement>());

  const sync = useCallback(() => {
    const entries = Array.from(nodes.current.entries());
    entries.sort(([, a], [, b]) =>
      a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
    );
    const next = entries.map(([id]) => id);
    /* porównanie strzeże przed pętlą renderów: identyczna lista zwraca TĘ SAMĄ
       referencję i React przerywa aktualizację */
    setIds((previous) =>
      previous.length === next.length && previous.every((v, i) => v === next[i])
        ? previous
        : next
    );
  }, []);

  const register = useCallback(
    (id: string, node: HTMLElement) => {
      nodes.current.set(id, node);
      sync();
      return () => {
        nodes.current.delete(id);
        sync();
      };
    },
    [sync]
  );

  /* Meldunek od sceny, która właśnie zakryła środek ekranu. Zmiana stanu leci
     najwyżej raz na scenę (osiem razy na całe przewinięcie strony), nie co
     klatkę: to jest różnica między numerem sceny a licznikiem FPS. */
  const setActive = useCallback((id: string) => {
    setActiveId((current) => (current === id ? current : id));
  }, []);

  const api = useMemo<StageApi>(
    () => ({ progress: scrollYProgress, register, setActive }),
    [scrollYProgress, register, setActive]
  );

  const total = ids.length;
  const index = activeId === null ? 0 : ids.indexOf(activeId) + 1;

  return (
    <StageContext value={api}>
      <div className={className ? `pr-stage ${className}` : "pr-stage"}>
        {children}

        {/* Linia postępu. `scaleY` na gotowej wysokości, nigdy `height`:
            wysokość przeliczana w klatce to layout całej strony, skala to sam
            kompozytor (reguła `motion-gpu-props-only`). */}
        {reduce ? null : (
          <div className="pr-rail" aria-hidden="true">
            <m.div className="pr-rail-fill" style={{ scaleY: scrollYProgress }} />
          </div>
        )}

        {/* Numer sceny. `aria-hidden`, bo to powtórzenie struktury, którą
            czytnik ekranu i tak ma w nagłówkach sekcji; ogłaszanie „scena 3
            z 8" przy każdym przewinięciu byłoby hałasem, nie informacją
            (reguła `a11y-images-alt-svg-role`: dekoracja nie wchodzi do drzewa
            dostępności). Sam znak dzielenia nie wymaga tłumaczenia, więc nie
            ma tu tekstu do pary PL/EN. */}
        {total > 0 && index > 0 ? (
          <p className="pr-count" aria-hidden="true">
            {index} / {total}
          </p>
        ) : null}
      </div>
    </StageContext>
  );
}
