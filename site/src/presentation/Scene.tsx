import { useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import * as m from "motion/react-m";
import { useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { SHIFT } from "@/motion/tokens";
import { SceneContext, useStage, type SceneApi } from "./context";

/* ── Scene ──────────────────────────────────────────────────────────────────
   CO ROBI: jedna scena prezentacji. Sekcja o JAWNEJ wysokości (domyślnie
   200vh), a w środku element `position: sticky; top: 0; height: 100vh`. Widz
   przewija normalnie, a scena pod jego palcem trwa przez jeden ekran drogi
   i dopiero potem ustępuje następnej.

   CZYM JEST STEROWANA: `useScroll({ target, offset: ["start end", "end start"] })`,
   czyli 0 w chwili, gdy GÓRA sekcji dotyka dołu okna, i 1, gdy DÓŁ sekcji
   dotyka góry okna. Przy sekcji 200vh i ekranie 100vh daje to prostą geometrię:

     p = 0        sekcja wchodzi od dołu ekranu
     p = 1/3      sekcja właśnie przykleiła się do góry (pełny ekran)
     p = 2/3      sekcja przestaje być przyklejona i zaczyna wychodzić górą
     p = 1        sekcja wyszła całkowicie

   Dlatego okna wejścia i wyjścia treści (`CONTENT`) siedzą wokół 1/3 i 2/3:
   treść jest w pełni widoczna przez cały czas, w którym scena zakrywa ekran,
   a wygasza się dokładnie w tym samym momencie, w którym następna scena się
   zapala. To jest właśnie PRZENIKANIE zamiast cięcia: w punkcie styku obie
   sceny mają około 4 % nieprzezroczystości, więc oko widzi rozpłynięcie przez
   tło sceny, a nie przeskok.

   Tło (`media`) ma okno SZERSZE od treści (`MEDIA`): faktury i nagrania mogą
   się na siebie nakładać, bo są abstrakcyjne, a dwa nakładające się bloki
   tekstu byłyby bałaganem.

   REDUCED MOTION: sekcja traci tor (CSS: `height: auto`), przestaje być
   przyklejona (`position: static`), a dziecko dostaje postęp ustawiony na
   sztywno na 1, czyli STAN KOŃCOWY. Scenę pisze się więc tak, żeby jedynka
   była kompletną klatką, a nie pustym ekranem po wyjściu ostatniego elementu.
   Sama `Scene` tego pilnuje: przy ograniczonym ruchu wstawia w `opacity`
   i `y` liczby końcowe (1 i 0), a nie wartości z krzywej.

   WYDAJNOŚĆ (osiem scen po 200vh to strona długa na szesnaście ekranów):
   scena poza zasięgiem NIE liczy nic. `IntersectionObserver` z marginesem
   jednego ekranu w każdą stronę przełącza `inView`, a subskrypcja postępu
   (`scrollYProgress.on("change", ...)`) istnieje WYŁĄCZNIE w gałęzi
   `inView === true`. Poza zasięgiem lokalna wartość zostaje zatrzaśnięta na 0
   (scena jeszcze przed nami) albo 1 (już za nami), więc łańcuch `useTransform`
   też stoi. Treść zostaje w DOM, więc „Znajdź na stronie", czytnik ekranu
   i prerender widzą całą prezentację niezależnie od pozycji przewijania.

   JAK TO SPRAWDZIŁEM (i jak sprawdzić po wpięciu w trasę): w trybie DEV scena
   podbija licznik `window.__klarowSceneSubs` przy zakładaniu subskrypcji
   i zdejmuje go w cleanupie. Na tej stronie przy ośmiu scenach licznik ma stać
   na 2, najwyżej 3 (scena na ekranie plus sąsiadki w marginesie obserwatora),
   a nie na 8; po przewinięciu na sam dół i z powrotem ma wracać do tej samej
   liczby, co jest zarazem dowodem, że nic nie wycieka. Bramka jest też
   sprawdzalna statycznie i tak ją sprawdziłem przy pisaniu: w kodzie tego pliku
   jest DOKŁADNIE JEDNA subskrypcja wartości ruchu (efekt 3, pozostałe trafienia
   grepa to ten komentarz) i leży pod warunkiem `inView`. Licznik nie istnieje
   w buildzie produkcyjnym (`import.meta.env.DEV` wycina go przy tree-shakingu).

   PUŁAPKA, KTÓREJ UNIKA: `position: sticky` przestaje działać po cichu, gdy
   KTÓRYKOLWIEK przodek ma `overflow` inny niż `visible`. Dlatego kadrowanie
   siedzi na samym elemencie przyklejonym (`.pr-scene-sticky`), a nie na sekcji
   ani na ramie. Druga: wysokość toru jest podawana jako zmienna CSS, nie jako
   `style={{ height }}`, dzięki czemu gałąź `prefers-reduced-motion` w arkuszu
   może ją nadpisać bez `!important`. */

/** domyślny tor sceny; limit reguły `motion-no-pinning-no-scroll-hijack` §B to 300vh */
const DEFAULT_LENGTH = "200vh";

/* Okna wejścia i wyjścia w przestrzeni postępu sceny (patrz geometria wyżej).
   Treść: ciasno wokół okresu przyklejenia. Tło: szerzej, żeby sąsiednie kadry
   przenikały się przez chwilę.

   KOREKTA 2026-09-13 po obejrzeniu nagrania przewijania: pierwsze okno treści
   [0,16 0,34 0,66 0,84] trzymało zdanie w pełnej widoczności tylko przez jedną
   trzecią toru sceny, więc przy ośmiu scenach po 200vh ekran bywał w połowie
   wygaszony przez kilkaset pikseli przewijania. W prezentacji to jest martwe
   powietrze: widz przewija i nie widzi nic. Teraz zdanie dochodzi do pełnej
   widoczności szybko (do 20 % toru), stoi przez 60 % i wychodzi na końcu.
   Przenikanie nadal jest, tylko krótsze niż pauza. */
const CONTENT = [0.04, 0.2, 0.8, 0.96];
const MEDIA = [0.0, 0.14, 0.86, 1.0];

/** wejście i wyjście treści; dwie jednostki przesunięcia z tokenów ruchu (2 x 12 px) */
const RISE = SHIFT * 2;

/* Zapas obserwatora: jeden ekran w górę i w dół. Scena zaczyna liczyć, zanim
   wejdzie w kadr, więc pierwsza klatka po wejściu jest już na właściwej
   wartości, a nie doganiana. */
const NEAR_MARGIN = "100% 0px 100% 0px";
/* Pasek o wysokości 10 % ekranu dokładnie na jego środku. Sekcje leżą w
   dokumencie jedna za drugą bez przerw, więc ten pasek zawsze przecina
   dokładnie jedną z nich i numer sceny nigdy nie miga. */
const CENTER_MARGIN = "-45% 0px -45% 0px";

type SceneChildren = ReactNode | ((scene: SceneApi) => ReactNode);

type SceneProps = {
  /** identyfikator sceny; trafia w `id` sekcji i w numerację ramy */
  id: string;
  /** długość toru przewijania sceny; domyślnie 200vh, maksimum 300vh */
  length?: string;
  /** tło sceny: `SceneVideo`, `SceneFallbackMedia` albo animacja w kodzie */
  media?: ReactNode;
  /** przyciemnienie między tłem a treścią; wyłącz tylko wtedy, gdy sceny nie ma tła */
  scrim?: boolean;
  /** treść sceny; funkcja dostaje lokalny postęp i stan bramki */
  children: SceneChildren;
  className?: string;
};

/* Licznik DEV: dowód, że sceny poza ekranem nic nie liczą (patrz komentarz
   wyżej). W produkcji ta funkcja nie jest nigdy wywoływana. */
function countSubscription(delta: number) {
  const w = window as Window & { __klarowSceneSubs?: number };
  w.__klarowSceneSubs = (w.__klarowSceneSubs ?? 0) + delta;
}

/** Jedna scena prezentacji: sekcja z torem, przyklejony ekran, lokalny postęp. */
export function Scene({
  id,
  length = DEFAULT_LENGTH,
  media,
  scrim = true,
  children,
  className,
}: SceneProps) {
  const stage = useStage();
  const reduce = Boolean(useReducedMotion());
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  /* Lokalny postęp sceny podawany dzieciom. To NIE jest `scrollYProgress`:
     to wartość bramkowana widocznością, więc poza zasięgiem stoi.

     WYGŁADZANIE (korekta 2026-09-13 po ocenie foundera: „animacje są tragiczne,
     w ogóle nie smooth"). Pierwsza wersja przypinała postęp JEDEN DO JEDNEGO do
     pozycji paska przewijania, więc każde kliknięcie kółka i każdy ruch palca
     przeskakiwał animację dokładnie o tyle, ile przesunął się scroll. Tak
     zachowuje się suwak, nie animacja: ruch był skokowy, bo scroll jest skokowy.
     Teraz surowy odczyt karmi sprężynę, a dzieci dostają jej wyjście: ruch
     dogania przewijanie z lekkim opóźnieniem i wytraca prędkość, zamiast
     teleportować się między pozycjami. `restDelta` jest mały, bo scena
     w spoczynku musi dojść do dokładnego 0 albo 1, inaczej treść zatrzymałaby
     się o włos od pełnej widoczności. */
  const raw = useMotionValue(0);
  const progress = useSpring(raw, { stiffness: 120, damping: 28, mass: 0.6, restDelta: 0.0005 });
  const [inView, setInView] = useState(false);

  /* 0) Meldunek do ramy: kim jestem i gdzie leżę w dokumencie. Rama układa
        z tego numerację „3 / 8". Efekt układu, nie zwykły: numer ma być
        poprawny już w pierwszej klatce po montażu, bez mignięcia. */
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !stage) return;
    return stage.register(id, el);
  }, [id, stage]);

  /* 1) Bramka pracy. */
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => setInView(entries[0]?.isIntersecting ?? false),
      { rootMargin: NEAR_MARGIN }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* 2) Numer sceny dla ramy: melduje się ta, która przecina środek ekranu. */
  useEffect(() => {
    const el = ref.current;
    if (!el || !stage) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) stage.setActive(id);
      },
      { rootMargin: CENTER_MARGIN }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [id, stage]);

  /* 3) Subskrypcja postępu: jedyne miejsce w tym pliku, w którym coś liczy się
        na klatkę, i leży pod bramką `inView`. */
  useEffect(() => {
    if (reduce) {
      raw.jump(1);
      progress.jump(1);
      return;
    }
    if (!inView) {
      /* Ostatni odczyt i koniec pracy. CELOWO bierzemy prawdziwą wartość, a nie
         zatrzask na 0 albo 1 „w zależności od strony ekranu": przy pierwszym
         malowaniu strony `IntersectionObserver` jeszcze nie zdążył zgłosić
         sceny, która JEST w kadrze, i zatrzask wygasiłby ją na jedną klatkę.
         Nad pierwszym zgięciem oznaczałoby to mignięcie pustym ekranem
         (reguła `motion-no-initial-hidden-above-fold`). Gdy scena naprawdę
         wyjeżdża z zasięgu, margines obserwatora wynosi cały ekran, więc
         odczyt i tak jest wtedy dokładnym 0 albo 1. */
      raw.jump(scrollYProgress.get());
      progress.jump(scrollYProgress.get());
      return;
    }
    raw.jump(scrollYProgress.get());
    progress.jump(scrollYProgress.get());
    if (import.meta.env.DEV) countSubscription(1);
    const stop = scrollYProgress.on("change", (v) => raw.set(v));
    return () => {
      stop();
      if (import.meta.env.DEV) countSubscription(-1);
    };
  }, [inView, reduce, raw, progress, scrollYProgress]);

  /* Ruszają się wyłącznie `opacity` i `transform` (reguła `motion-gpu-props-only`).
     Hooki stoją bezwarunkowo, a gałąź ograniczonego ruchu podmienia dopiero
     wartość wpiętą w `style`: kolejność hooków musi być ta sama w obu gałęziach. */
  const contentOpacity = useTransform(progress, CONTENT, [0, 1, 1, 0]);
  const contentY = useTransform(progress, CONTENT, [RISE, 0, 0, -RISE]);
  const mediaOpacity = useTransform(progress, MEDIA, [0, 1, 1, 0]);

  const api = useMemo<SceneApi>(
    () => ({ id, progress, inView, reduce }),
    [id, progress, inView, reduce]
  );

  return (
    <SceneContext value={api}>
      <section
        ref={ref}
        id={id}
        data-scene={id}
        className={className ? `pr-scene ${className}` : "pr-scene"}
        style={{ ["--_scene-length" as string]: length }}
      >
        <div className="pr-scene-sticky">
          {/* Warstwa tła CELOWO nie dostaje `aria-hidden`. Decyzję o tym, czy
              kadr jest dekoracją, czy treścią, podejmuje sam materiał: gradient
              i abstrakcyjna faktura mają `alt=""`, a zrzut prawdziwego pulpitu
              (scena „Zwrot") niesie opis i ma trafić do czytnika. Zbiorcze
              `aria-hidden` na kontenerze skasowałoby ten opis bez śladu. */}
          {media ? (
            <m.div className="pr-scene-media" style={{ opacity: reduce ? 1 : mediaOpacity }}>
              {media}
            </m.div>
          ) : null}

          {media && scrim ? <div className="pr-scene-scrim" aria-hidden="true" /> : null}

          <m.div
            className="pr-scene-content"
            style={{ opacity: reduce ? 1 : contentOpacity, y: reduce ? 0 : contentY }}
          >
            {typeof children === "function" ? children(api) : children}
          </m.div>
        </div>
      </section>
    </SceneContext>
  );
}
