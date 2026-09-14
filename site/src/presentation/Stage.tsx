import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useScroll } from "motion/react";
import { StageContext, type StageApi } from "./context";
import { StageMedia } from "./StageMedia";
import { PresentationChrome } from "./PresentationChrome";
import { SCENES, type SceneId } from "@/data/presentation";
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
  /** otwarcie modala rezerwacji; podpięte pod stałą zakładkę kontaktową */
  onBook?: () => void;
};

/** Rama prezentacji: globalny postęp, wskaźnik i kontekst dla scen. */
export function Stage({ children, className, onBook }: StageProps) {

  /* Chroma montuje się portalem na `document.body`, więc musi poczekać na
     klienta: w prerenderze `document` nie istnieje, a bez tej bramki build SSR
     pada na „document is not defined". */
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

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

  const activeScene = SCENES.find((x) => x.id === activeId);

  return (
    <StageContext value={api}>
      {/* RAMA DZIELONA (2026-09-14). Lewa kolumna to czytanie w zwykłym
          przepływie, prawa to jedyny przyklejony element na stronie.
          Rama NADAL bez `overflow`, `transform`, `filter` i `will-change`:
          pierwsza własność zabiłaby sticky kolumny medialnej po cichu, każda
          z pozostałych zrobiłaby z ramy blok zawierający dla `position: fixed`
          i chroma przestałaby trzymać się krawędzi okna. */}
      <div className={className ? `pr-stage ${className}` : "pr-stage"}>
        <div className="pr-flow">{children}</div>
        <StageMedia activeId={(activeId as SceneId | null) ?? null} />
      </div>

      {mounted
        ? createPortal(
            <PresentationChrome
              progress={scrollYProgress}
              index={index}
              total={total}
              label={activeScene?.label}
              onBook={onBook}
            />,
            document.body,
          )
        : null}
    </StageContext>
  );
}
